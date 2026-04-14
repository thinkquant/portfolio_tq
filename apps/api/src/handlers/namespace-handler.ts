import type { NamespacePlaceholderData } from '@portfolio-tq/types';

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
      routes: [
        '/api/tools/customer-profile',
        '/api/tools/payment-case',
        '/api/tools/account-profile',
        '/api/tools/policy-search',
        '/api/tools/event-timeline',
        '/api/tools/escalation',
        '/api/tools/invocations',
        '/api/runs/:runId/tools',
      ],
      status: 'active',
    } satisfies NamespacePlaceholderData,
    context.requestId,
  );
}
