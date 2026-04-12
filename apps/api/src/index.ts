import { randomUUID } from 'node:crypto';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';

import { portfolioAgents } from '@portfolio-tq/agents';
import { evaluationStatuses } from '@portfolio-tq/evals';
import { createDemoRun } from '@portfolio-tq/schemas';

type DemoRequestPayload = {
  caseId?: string;
  note?: string;
};

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

const environment = process.env.APP_ENV ?? 'dev';
const port = Number(process.env.PORT ?? 8080);
const serviceName = 'portfolio-tq-api';
const vertexAiLocation = process.env.VERTEX_AI_LOCATION ?? process.env.FIRESTORE_LOCATION ?? 'us-central1';

function logEvent(eventType: string, details: Record<string, JsonValue>): void {
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
  payload: Record<string, JsonValue>,
): void {
  applyCors(response);
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(`${JSON.stringify(payload)}\n`);
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

const server = createServer(async (request, response) => {
  const requestId = randomUUID();
  const method = request.method ?? 'GET';
  const path = request.url ?? '/';

  logEvent('request.received', {
    requestId,
    method,
    path,
  });

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
    });
    return;
  }

  if (method === 'GET' && path === '/') {
    sendJson(response, 200, {
      service: serviceName,
      environment,
      routes: ['/health', '/api/demo/payment-exception-review/run'],
      agentCount: portfolioAgents.length,
      evaluationStatuses,
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

  sendJson(response, 404, {
    error: 'not_found',
    path,
    requestId,
  });
});

server.listen(port, '0.0.0.0', () => {
  logEvent('service.started', {
    port,
    agentCount: portfolioAgents.length,
    evaluationStatusCount: evaluationStatuses.length,
  });
});
