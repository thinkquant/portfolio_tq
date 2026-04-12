import { randomUUID } from 'node:crypto';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';

import { Firestore, type DocumentData, type QuerySnapshot } from '@google-cloud/firestore';
import { portfolioAgents } from '@portfolio-tq/agents';
import { evaluationStatuses } from '@portfolio-tq/evals';
import { createDemoRun } from '@portfolio-tq/schemas';
import {
  firestoreCollections,
  projectIds,
  type CaseRecord,
  type EscalationRecord,
  type EvaluationRecord,
  type ProjectId,
  type ProjectRecord,
  type PromptVersionRecord,
  type RunRecord,
  type ToolInvocationRecord,
} from '@portfolio-tq/types';

type DemoRequestPayload = {
  caseId?: string;
  note?: string;
};

type LogValue =
  | string
  | number
  | boolean
  | null
  | LogValue[]
  | { [key: string]: LogValue };

const environment = process.env.APP_ENV ?? 'dev';
const port = Number(process.env.PORT ?? 8080);
const serviceName = 'portfolio-tq-api';
const vertexAiLocation = process.env.VERTEX_AI_LOCATION ?? process.env.FIRESTORE_LOCATION ?? 'us-central1';
const firestoreProjectId = process.env.GCP_PROJECT_ID;
const firestoreDatabaseId = process.env.FIRESTORE_DATABASE;

const firestore =
  firestoreProjectId && firestoreDatabaseId
    ? new Firestore({
        projectId: firestoreProjectId,
        databaseId: firestoreDatabaseId,
      })
    : null;

function logEvent(eventType: string, details: Record<string, LogValue>): void {
  console.log(
    JSON.stringify({
      severity: 'INFO',
      service: serviceName,
      environment,
      eventType,
      timestamp: new Date().toISOString(),
      ...details,
    }),
  );
}

function applyCors(response: ServerResponse): void {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sendJson(
  response: ServerResponse,
  statusCode: number,
  payload: unknown,
): void {
  applyCors(response);
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(`${JSON.stringify(payload)}\n`);
}

function sendError(
  response: ServerResponse,
  statusCode: number,
  requestId: string,
  error: string,
  details?: Record<string, unknown>,
): void {
  sendJson(response, statusCode, {
    error,
    requestId,
    ...details,
  });
}

async function readJsonBody(request: IncomingMessage): Promise<DemoRequestPayload> {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (chunks.length === 0) {
    return {};
  }

  const body = Buffer.concat(chunks).toString('utf8');

  if (!body.trim()) {
    return {};
  }

  const parsed = JSON.parse(body) as DemoRequestPayload;

  return typeof parsed === 'object' && parsed !== null ? parsed : {};
}

function isProjectId(value: string): value is ProjectId {
  return (projectIds as readonly string[]).includes(value);
}

function requireFirestore(): Firestore {
  if (!firestore) {
    throw new Error('Firestore is not configured for this runtime.');
  }

  return firestore;
}

async function readQuery<T>(queryPromise: Promise<QuerySnapshot<DocumentData>>): Promise<T[]> {
  const snapshot = await queryPromise;

  return snapshot.docs.map((document) => document.data() as T);
}

async function listProjects(): Promise<ProjectRecord[]> {
  return readQuery<ProjectRecord>(
    requireFirestore()
      .collection(firestoreCollections.projects)
      .orderBy('updatedAt', 'desc')
      .get(),
  );
}

async function listRuns(projectId?: ProjectId): Promise<RunRecord[]> {
  const collection = requireFirestore().collection(firestoreCollections.runs);

  const query = projectId
    ? collection.where('projectId', '==', projectId).orderBy('createdAt', 'desc').limit(20)
    : collection.orderBy('createdAt', 'desc').limit(20);

  return readQuery<RunRecord>(query.get());
}

async function listEvaluations(projectId?: ProjectId): Promise<EvaluationRecord[]> {
  const collection = requireFirestore().collection(firestoreCollections.evaluations);

  const query = projectId
    ? collection.where('projectId', '==', projectId).orderBy('createdAt', 'desc').limit(20)
    : collection.orderBy('createdAt', 'desc').limit(20);

  return readQuery<EvaluationRecord>(query.get());
}

async function getProjectMetrics(projectId: ProjectId): Promise<{
  project: ProjectRecord | null;
  latestRuns: RunRecord[];
  recentEvaluations: EvaluationRecord[];
  recentEscalations: EscalationRecord[];
  recentToolInvocations: ToolInvocationRecord[];
  promptVersions: PromptVersionRecord[];
  recentCases: CaseRecord[];
  summary: {
    totalRuns: number;
    completedRuns: number;
    failedRuns: number;
    escalatedRuns: number;
    openEscalations: number;
    averageLatencyMs: number;
    averageEvaluationScore: number;
    latestRunAt: string | null;
    promptVersionCount: number;
    caseCount: number;
  };
}> {
  const client = requireFirestore();
  const projectDocument = await client
    .collection(firestoreCollections.projects)
    .doc(projectId)
    .get();

  const [
    latestRuns,
    recentEvaluations,
    recentEscalations,
    recentToolInvocations,
    promptVersions,
    recentCases,
  ] = await Promise.all([
    readQuery<RunRecord>(
      client
        .collection(firestoreCollections.runs)
        .where('projectId', '==', projectId)
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get(),
    ),
    readQuery<EvaluationRecord>(
      client
        .collection(firestoreCollections.evaluations)
        .where('projectId', '==', projectId)
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get(),
    ),
    readQuery<EscalationRecord>(
      client
        .collection(firestoreCollections.escalations)
        .where('projectId', '==', projectId)
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get(),
    ),
    readQuery<ToolInvocationRecord>(
      client
        .collection(firestoreCollections.toolInvocations)
        .where('projectId', '==', projectId)
        .orderBy('startedAt', 'desc')
        .limit(10)
        .get(),
    ),
    readQuery<PromptVersionRecord>(
      client
        .collection(firestoreCollections.promptVersions)
        .where('projectId', '==', projectId)
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get(),
    ),
    readQuery<CaseRecord>(
      client
        .collection(firestoreCollections.cases)
        .where('projectId', '==', projectId)
        .orderBy('updatedAt', 'desc')
        .limit(10)
        .get(),
    ),
  ]);

  const totalDuration = latestRuns.reduce((sum, run) => sum + run.durationMs, 0);
  const totalScore = recentEvaluations.reduce((sum, evaluation) => sum + evaluation.score, 0);

  return {
    project: projectDocument.exists ? (projectDocument.data() as ProjectRecord) : null,
    latestRuns,
    recentEvaluations,
    recentEscalations,
    recentToolInvocations,
    promptVersions,
    recentCases,
    summary: {
      totalRuns: latestRuns.length,
      completedRuns: latestRuns.filter((run) => run.status === 'completed').length,
      failedRuns: latestRuns.filter((run) => run.status === 'failed').length,
      escalatedRuns: latestRuns.filter((run) => run.escalated || run.status === 'escalated').length,
      openEscalations: recentEscalations.filter((escalation) => escalation.status === 'open').length,
      averageLatencyMs: latestRuns.length ? Math.round(totalDuration / latestRuns.length) : 0,
      averageEvaluationScore: recentEvaluations.length
        ? Number((totalScore / recentEvaluations.length).toFixed(3))
        : 0,
      latestRunAt: latestRuns[0]?.createdAt ?? null,
      promptVersionCount: promptVersions.length,
      caseCount: recentCases.length,
    },
  };
}

const server = createServer(async (request, response) => {
  const requestId = randomUUID();
  const method = request.method ?? 'GET';
  const url = new URL(request.url ?? '/', 'http://localhost');
  const path = url.pathname;

  logEvent('request.received', {
    requestId,
    method,
    path,
  });

  try {
    if (method === 'OPTIONS') {
      applyCors(response);
      response.statusCode = 204;
      response.end();
      return;
    }

    if (method === 'GET' && path === '/health') {
      sendJson(response, 200, {
        status: 'ok',
        service: serviceName,
        environment,
        timestamp: new Date().toISOString(),
        vertexAiLocation,
        projectId: process.env.GCP_PROJECT_ID ?? 'unknown',
        firestoreDatabaseId: firestoreDatabaseId ?? 'unconfigured',
      });
      return;
    }

    if (method === 'GET' && path === '/') {
      sendJson(response, 200, {
        service: serviceName,
        environment,
        routes: [
          '/health',
          '/api/projects',
          '/api/runs',
          '/api/evaluations',
          '/api/projects/:projectId/metrics',
          '/api/demo/payment-exception-review/run',
        ],
        agentCount: portfolioAgents.length,
        evaluationStatuses,
      });
      return;
    }

    if (method === 'GET' && path === '/api/projects') {
      const projects = await listProjects();

      sendJson(response, 200, {
        projects,
        count: projects.length,
      });
      return;
    }

    if (method === 'GET' && path === '/api/runs') {
      const projectId = url.searchParams.get('projectId');

      if (projectId && !isProjectId(projectId)) {
        sendError(response, 400, requestId, 'invalid_project_id', { projectId });
        return;
      }

      const runs = await listRuns(
        projectId && isProjectId(projectId) ? projectId : undefined,
      );

      sendJson(response, 200, {
        runs,
        count: runs.length,
      });
      return;
    }

    if (method === 'GET' && path === '/api/evaluations') {
      const projectId = url.searchParams.get('projectId');

      if (projectId && !isProjectId(projectId)) {
        sendError(response, 400, requestId, 'invalid_project_id', { projectId });
        return;
      }

      const evaluations = await listEvaluations(
        projectId && isProjectId(projectId) ? projectId : undefined,
      );

      sendJson(response, 200, {
        evaluations,
        count: evaluations.length,
      });
      return;
    }

    const metricsMatch = path.match(/^\/api\/projects\/([^/]+)\/metrics$/);

    if (method === 'GET' && metricsMatch) {
      const projectId = decodeURIComponent(metricsMatch[1] ?? '');

      if (!isProjectId(projectId)) {
        sendError(response, 404, requestId, 'project_not_found', { projectId });
        return;
      }

      const metrics = await getProjectMetrics(projectId);

      sendJson(response, 200, {
        ...metrics,
      });
      return;
    }

    if (method === 'POST' && path === '/api/demo/payment-exception-review/run') {
      const payload = await readJsonBody(request);
      const run = createDemoRun('payment-exception-review', 'completed');

      logEvent('demo.run.completed', {
        requestId,
        runId: run.id,
        projectId: run.projectId,
        caseId: payload.caseId ?? null,
      });

      sendJson(response, 200, {
        run: {
          ...run,
          inputRef: payload.caseId ?? 'bootstrap-case',
          outputRef: 'bootstrap-output',
          confidence: 0.98,
          latencyMs: 1420,
          estimatedCostUsd: 0.0024,
        },
        result: {
          decision: 'approve-with-review-note',
          summary:
            'Bootstrap deployment path verified with a deterministic response suitable for Cloud Run smoke testing.',
          note: payload.note ?? 'No custom note supplied.',
        },
        agentCount: portfolioAgents.length,
      });
      return;
    }

    sendError(response, 404, requestId, 'not_found', {
      path,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown API failure';

    logEvent('request.failed', {
      requestId,
      method,
      path,
      error: message,
    });

    sendError(response, 500, requestId, 'internal_error', {
      message,
    });
  }
});

server.listen(port, '0.0.0.0', () => {
  logEvent('service.started', {
    port,
    agentCount: portfolioAgents.length,
    evaluationStatusCount: evaluationStatuses.length,
  });
});
