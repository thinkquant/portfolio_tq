import { portfolioAgents } from '@portfolio-tq/agents';
import { evaluationStatuses } from '@portfolio-tq/evals';
import type {
  HealthStatusData,
  ReadyStatusData,
  ServiceIndexData,
} from '@portfolio-tq/types';

import type { AppContext } from '../app/context.js';
import type { RequestContext } from '../lib/http.js';
import { sendSuccess } from '../lib/http.js';

function buildStatusPayload(app: AppContext) {
  return {
    service: app.config.serviceName,
    environment: app.config.environment,
    timestamp: new Date().toISOString(),
    version: app.config.serviceVersion,
    commitSha: app.config.buildCommitSha,
    buildId: app.config.buildId,
  };
}

export function handleHealth(context: RequestContext, app: AppContext): void {
  sendSuccess(
    context.response,
    200,
    {
      status: 'ok',
      ...buildStatusPayload(app),
      vertexAiLocation: app.config.vertexAiLocation,
      projectId: app.config.firestoreProjectId ?? 'unknown',
      firestoreDatabaseId: app.config.firestoreDatabaseId ?? 'unconfigured',
    } satisfies HealthStatusData,
    context.requestId,
  );
}

export function handleReady(context: RequestContext, app: AppContext): void {
  // TODO(shared-api-runtime-foundation): upgrade readiness to perform a real
  // Firestore read probe before this milestone is considered fully closed.
  const firestoreConfigured = Boolean(
    app.config.firestoreProjectId && app.config.firestoreDatabaseId,
  );
  const status = firestoreConfigured ? 'ready' : 'degraded';
  const statusCode = firestoreConfigured ? 200 : 503;

  sendSuccess(
    context.response,
    statusCode,
    {
      status,
      ...buildStatusPayload(app),
      dependencies: {
        firestore: {
          status: firestoreConfigured ? 'configured' : 'unconfigured',
          projectId: app.config.firestoreProjectId ?? null,
          databaseId: app.config.firestoreDatabaseId ?? null,
        },
      },
    } satisfies ReadyStatusData,
    context.requestId,
  );
}

export function handleRoot(context: RequestContext, app: AppContext): void {
  sendSuccess(
    context.response,
    200,
    {
      ...buildStatusPayload(app),
      routes: [
        '/health',
        '/ready',
        '/api/observability/overview',
        '/api/projects',
        '/api/runs',
        '/api/runs/:id',
        '/api/runs/:id/tools',
        '/api/runs/:id/evals',
        '/api/evals',
        '/api/evaluations',
        '/api/projects/:projectId/metrics',
        '/api/tools',
        '/api/tools/customer-profile',
        '/api/tools/payment-case',
        '/api/tools/account-profile',
        '/api/tools/policy-search',
        '/api/tools/event-timeline',
        '/api/tools/escalation',
        '/api/tools/invocations',
        '/api/seed',
        '/api/seed/payment-cases',
        '/api/seed/investing-cases',
        '/api/seed/legacy-intakes',
        '/api/seed/documents',
        '/api/demo/payment-exception-review/run',
        '/api/demo/legacy-ai-adapter/run',
        '/api/demo/legacy-ai-adapter/samples',
      ],
      agentCount: portfolioAgents.length,
      evaluationStatuses,
    } satisfies ServiceIndexData,
    context.requestId,
  );
}
