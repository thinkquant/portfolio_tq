import { handleToolsNamespace } from '../handlers/namespace-handler.js';
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
