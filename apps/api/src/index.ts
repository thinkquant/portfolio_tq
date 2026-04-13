import { randomUUID } from 'node:crypto';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';

import { portfolioAgents } from '@portfolio-tq/agents';
import { evaluationStatuses } from '@portfolio-tq/evals';
import { createDemoRun } from '@portfolio-tq/schemas';
import type {
  EscalationRecord,
  EvaluationRecord,
  JsonValue,
  RunRecord,
  ToolInvocationRecord,
} from '@portfolio-tq/types';
import { createLogger } from './services/logs.js';
import {
  createFirestoreClient,
  getObservabilityOverview,
  getProjectMetrics,
  isProjectId,
  listEvaluations,
  listProjects,
  listRuns,
  persistDemoRun,
} from './services/observability.js';

type DemoRequestPayload = {
  caseId?: string;
  note?: string;
};

const environment = process.env.APP_ENV === 'prod' ? 'prod' : 'dev';
const port = Number(process.env.PORT ?? 8080);
const serviceName = 'portfolio-tq-api';
const vertexAiLocation =
  process.env.VERTEX_AI_LOCATION ?? process.env.FIRESTORE_LOCATION ?? 'us-central1';
const firestoreProjectId = process.env.GCP_PROJECT_ID;
const firestoreDatabaseId = process.env.FIRESTORE_DATABASE;

const firestore = createFirestoreClient({
  projectId: firestoreProjectId,
  databaseId: firestoreDatabaseId,
});
const logger = createLogger({
  serviceName,
  environment,
});

function applyCors(response: ServerResponse): void {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sendJson(response: ServerResponse, statusCode: number, payload: unknown): void {
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

function projectTag(projectId: string | null): Record<string, JsonValue> {
  return {
    projectId,
  };
}

function maybeEscalate(payload: DemoRequestPayload): boolean {
  return (
    payload.caseId === 'case-payment-bootstrap-002' ||
    payload.note?.toLowerCase().includes('escalate') === true
  );
}

async function handlePaymentReviewDemo(
  requestId: string,
  payload: DemoRequestPayload,
): Promise<{
  run: RunRecord;
  evaluation: EvaluationRecord;
  toolInvocations: ToolInvocationRecord[];
  escalation?: EscalationRecord;
  result: {
    decision: string;
    summary: string;
    note: string;
  };
}> {
  const baseRun = createDemoRun('payment-exception-review', 'completed');
  const requiresEscalation = maybeEscalate(payload);
  const startedAt = new Date();
  const promptVersionId = 'prompt-payment-v1';
  const toolLatencyA = 184;
  const toolLatencyB = 267;
  const totalLatency = baseRun.latencyMs ?? toolLatencyA + toolLatencyB + 969;
  const finishedAt = new Date(startedAt.getTime() + totalLatency);
  const confidence = requiresEscalation ? 0.74 : baseRun.confidence ?? 0.98;
  const estimatedCostUsd = requiresEscalation ? 0.0031 : baseRun.estimatedCostUsd ?? 0.0024;
  const status = requiresEscalation ? 'escalated' : 'completed';
  const evaluationStatus = requiresEscalation ? 'warning' : 'passed';

  const run: RunRecord = {
    ...baseRun,
    status,
    inputRef: payload.caseId ?? 'case-payment-bootstrap-001',
    outputRef: `payment-output-${baseRun.id}`,
    confidence,
    latencyMs: totalLatency,
    estimatedCostUsd,
    promptVersionId,
    createdAt: startedAt.toISOString(),
    updatedAt: finishedAt.toISOString(),
    environment,
    summary: requiresEscalation
      ? 'Payment exception run completed with fallback handling and reviewer escalation.'
      : 'Payment exception run completed with deterministic approval guidance.',
    evaluationStatus,
    fallbackTriggered: requiresEscalation,
    escalated: requiresEscalation,
    toolInvocationCount: requiresEscalation ? 3 : 2,
  };

  const toolInvocations: ToolInvocationRecord[] = [
    {
      id: `${run.id}-tool-case-loader`,
      projectId: run.projectId,
      runId: run.id,
      toolName: 'case-loader',
      status: 'completed',
      startedAt: new Date(startedAt.getTime() + 40).toISOString(),
      completedAt: new Date(startedAt.getTime() + 40 + toolLatencyA).toISOString(),
      latencyMs: toolLatencyA,
      summary: 'Loaded payment case context for the exception review workflow.',
    },
    {
      id: `${run.id}-tool-policy-search`,
      projectId: run.projectId,
      runId: run.id,
      toolName: 'policy-search',
      status: 'completed',
      startedAt: new Date(startedAt.getTime() + 310).toISOString(),
      completedAt: new Date(startedAt.getTime() + 310 + toolLatencyB).toISOString(),
      latencyMs: toolLatencyB,
      summary: 'Retrieved synthetic payment review policy guidance.',
    },
  ];

  if (requiresEscalation) {
    toolInvocations.push({
      id: `${run.id}-tool-review-router`,
      projectId: run.projectId,
      runId: run.id,
      toolName: 'review-router',
      status: 'completed',
      startedAt: new Date(startedAt.getTime() + 650).toISOString(),
      completedAt: new Date(startedAt.getTime() + 770).toISOString(),
      latencyMs: 120,
      summary: 'Routed the run to reviewer follow-up because fallback handling was triggered.',
    });
  }

  const evaluation: EvaluationRecord = {
    id: `${run.id}-evaluation`,
    projectId: run.projectId,
    runId: run.id,
    status: evaluationStatus,
    createdAt: finishedAt.toISOString(),
    score: requiresEscalation ? 0.74 : 0.98,
    schemaValid: true,
    fallbackTriggered: requiresEscalation,
    summary: requiresEscalation
      ? 'Schema remained valid, but the run required a reviewer escalation.'
      : 'Schema validation passed and the run remained within the approval confidence band.',
  };

  const escalation = requiresEscalation
    ? ({
        id: `${run.id}-escalation`,
        projectId: run.projectId,
        runId: run.id,
        status: 'open',
        createdAt: finishedAt.toISOString(),
        reason: 'Conflicting payment notes triggered fallback and reviewer escalation.',
        owner: 'user-reviewer-dev',
      } satisfies EscalationRecord)
    : undefined;

  logger.runLifecycle('run.created', {
    requestId,
    projectId: run.projectId,
    runId: run.id,
    promptVersionId,
  });
  logger.runLifecycle('run.started', {
    requestId,
    projectId: run.projectId,
    runId: run.id,
    promptVersionId,
  });
  logger.runLifecycle('model.requested', {
    requestId,
    projectId: run.projectId,
    runId: run.id,
    promptVersionId,
  }, {
    caseId: run.inputRef,
  });

  for (const toolInvocation of toolInvocations) {
    logger.runLifecycle('tool.called', {
      requestId,
      projectId: run.projectId,
      runId: run.id,
      promptVersionId,
    }, {
      toolName: toolInvocation.toolName,
    });
    logger.runLifecycle('tool.completed', {
      requestId,
      projectId: run.projectId,
      runId: run.id,
      latencyMs: toolInvocation.latencyMs,
      promptVersionId,
    }, {
      toolName: toolInvocation.toolName,
      summary: toolInvocation.summary,
    });
  }

  logger.runLifecycle('model.completed', {
    requestId,
    projectId: run.projectId,
    runId: run.id,
    latencyMs: totalLatency,
    promptVersionId,
  }, {
    confidence,
    estimatedCostUsd,
  });
  logger.runLifecycle('schema.validated', {
    requestId,
    projectId: run.projectId,
    runId: run.id,
    promptVersionId,
  }, {
    schemaValid: true,
    evaluationStatus,
  });

  if (requiresEscalation) {
    logger.runLifecycle('fallback.triggered', {
      requestId,
      projectId: run.projectId,
      runId: run.id,
      promptVersionId,
    }, {
      fallbackReason: 'conflicting-payment-notes',
    });
    logger.runLifecycle('escalation.created', {
      requestId,
      projectId: run.projectId,
      runId: run.id,
      promptVersionId,
    }, {
      escalationId: escalation?.id ?? null,
      owner: escalation?.owner ?? null,
    });
  }

  if (firestore) {
    await persistDemoRun(firestore, {
      run,
      evaluation,
      toolInvocations,
      escalation,
    });
  }

  logger.runLifecycle('run.completed', {
    requestId,
    projectId: run.projectId,
    runId: run.id,
    latencyMs: totalLatency,
    promptVersionId,
  }, {
    evaluationStatus,
    fallbackTriggered: requiresEscalation,
    persistedToFirestore: Boolean(firestore),
  });

  return {
    run,
    evaluation,
    toolInvocations,
    escalation,
    result: {
      decision: requiresEscalation ? 'escalate-for-review' : 'approve-with-review-note',
      summary: requiresEscalation
        ? 'The run stayed schema-valid but triggered fallback handling and reviewer escalation.'
        : 'The run completed with deterministic approval guidance suitable for smoke verification.',
      note: payload.note ?? 'No custom note supplied.',
    },
  };
}

const server = createServer(async (request, response) => {
  const requestId = randomUUID();
  const method = request.method ?? 'GET';
  const requestStartedAt = Date.now();
  const url = new URL(request.url ?? '/', 'http://localhost');
  const path = url.pathname;

  logger.info('request.received', {
    requestId,
  }, {
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
          '/api/observability/overview',
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

    if (method === 'GET' && path === '/api/observability/overview') {
      const overview = await getObservabilityOverview(firestore);

      sendJson(response, 200, overview);
      return;
    }

    if (method === 'GET' && path === '/api/projects') {
      const projects = await listProjects(firestore);

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
        firestore,
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
        firestore,
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

      const metrics = await getProjectMetrics(firestore, projectId);

      sendJson(response, 200, metrics);
      return;
    }

    if (method === 'POST' && path === '/api/demo/payment-exception-review/run') {
      const payload = await readJsonBody(request);
      const demoResult = await handlePaymentReviewDemo(requestId, payload);

      sendJson(response, 200, {
        run: demoResult.run,
        evaluation: demoResult.evaluation,
        escalation: demoResult.escalation ?? null,
        result: demoResult.result,
        agentCount: portfolioAgents.length,
      });
      return;
    }

    sendError(response, 404, requestId, 'not_found', {
      path,
    });
  } catch (error) {
    logger.error('request.failed', error, {
      requestId,
      latencyMs: Date.now() - requestStartedAt,
    }, {
      method,
      path,
      ...projectTag(null),
    });

    if (path === '/api/demo/payment-exception-review/run') {
      logger.runLifecycle('run.failed', {
        requestId,
        projectId: 'payment-exception-review',
        runId: `${requestId}-failed`,
      }, {
        path,
      });
    }

    const message = error instanceof Error ? error.message : 'Unknown API failure';

    sendError(response, 500, requestId, 'internal_error', {
      message,
    });
  } finally {
    logger.info('request.completed', {
      requestId,
      latencyMs: Date.now() - requestStartedAt,
    }, {
      method,
      path,
      statusCode: response.statusCode || 200,
    });
  }
});

server.listen(port, '0.0.0.0', () => {
  logger.info('service.started', {
    latencyMs: 0,
  }, {
    port,
    agentCount: portfolioAgents.length,
    evaluationStatusCount: evaluationStatuses.length,
    firestoreEnabled: Boolean(firestore),
  });
});
