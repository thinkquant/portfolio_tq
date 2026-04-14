import type { ProjectId } from '@portfolio-tq/types';

import type { AppContext } from '../app/context.js';
import { ApiError } from '../errors/api-error.js';
import type { RequestContext } from '../lib/http.js';
import { sendError } from '../lib/http.js';

function failedRunProject(path: string): ProjectId | null {
  return path === '/api/demo/payment-exception-review/run'
    ? 'payment-exception-review'
    : null;
}

export function handleRouteError(
  error: unknown,
  context: RequestContext,
  app: AppContext,
): void {
  const statusCode = error instanceof ApiError ? error.statusCode : 500;

  app.logger.requestFailed(
    error,
    {
      requestId: context.requestId,
      latencyMs: Date.now() - context.startedAt,
      method: context.method,
      path: context.path,
      statusCode,
    },
    {
      errorCode: error instanceof ApiError ? error.code : 'internal_error',
    },
  );

  const projectId = failedRunProject(context.path);

  if (projectId) {
    app.logger.runLifecycle(
      'run.failed',
      {
        requestId: context.requestId,
        projectId,
        runId: `${context.requestId}-failed`,
      },
      {
        path: context.path,
      },
    );
  }

  if (error instanceof ApiError) {
    sendError(
      context.response,
      statusCode,
      context.requestId,
      error.code,
      error.message,
      error.details,
    );
    return;
  }

  sendError(
    context.response,
    statusCode,
    context.requestId,
    'internal_error',
    'An unexpected API error occurred.',
  );
}
