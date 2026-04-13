import type { AppContext } from '../app/context.js';
import type { RequestContext } from '../lib/http.js';
import { sendSuccess } from '../lib/http.js';

export function handleToolsNamespace(
  context: RequestContext,
  app: AppContext,
): void {
  sendSuccess(
    context.response,
    200,
    {
      namespace: 'tools',
      environment: app.config.environment,
      routes: [],
      status: 'reserved',
    },
    context.requestId,
  );
}

export function handleSeedNamespace(
  context: RequestContext,
  app: AppContext,
): void {
  sendSuccess(
    context.response,
    200,
    {
      namespace: 'seed',
      environment: app.config.environment,
      routes: [],
      status: 'reserved',
    },
    context.requestId,
  );
}
