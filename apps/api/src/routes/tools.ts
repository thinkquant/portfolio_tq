import { handleToolsNamespace } from '../handlers/namespace-handler.js';
import {
  handleCreateEscalationPlaceholder,
  handleLookupAccountProfile,
  handleLookupCustomerProfile,
  handleLookupEventTimeline,
  handleLookupPaymentCase,
  handleSearchPolicy,
} from '../handlers/mock-tool-handler.js';
import {
  handleCreateToolInvocation,
  handleListRunToolInvocations,
  handleListToolInvocations,
} from '../handlers/tool-invocation-handler.js';
import type { RouteDefinition } from './router.js';

export const toolRoutes: RouteDefinition[] = [
  {
    method: 'GET',
    path: '/api/tools',
    handler: handleToolsNamespace,
  },
  {
    method: 'POST',
    path: '/api/tools/invocations',
    handler: handleCreateToolInvocation,
  },
  {
    method: 'POST',
    path: '/api/tools/customer-profile',
    handler: handleLookupCustomerProfile,
  },
  {
    method: 'POST',
    path: '/api/tools/payment-case',
    handler: handleLookupPaymentCase,
  },
  {
    method: 'POST',
    path: '/api/tools/account-profile',
    handler: handleLookupAccountProfile,
  },
  {
    method: 'POST',
    path: '/api/tools/policy-search',
    handler: handleSearchPolicy,
  },
  {
    method: 'POST',
    path: '/api/tools/event-timeline',
    handler: handleLookupEventTimeline,
  },
  {
    method: 'POST',
    path: '/api/tools/escalation',
    handler: handleCreateEscalationPlaceholder,
  },
  {
    method: 'GET',
    path: '/api/tools/invocations',
    handler: handleListToolInvocations,
  },
  {
    method: 'GET',
    pattern: /^\/api\/runs\/([^/]+)\/tools$/,
    params: (match) => ({
      runId: match[1],
    }),
    handler: (context, app, match) =>
      handleListRunToolInvocations(context, app, {
        runId: match.params.runId,
      }),
  },
];
