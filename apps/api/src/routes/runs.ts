import {
  handleCreateRun,
  handleGetRun,
  handleListRuns,
} from '../handlers/run-handler.js';
import type { RouteDefinition } from './router.js';

export const runRoutes: RouteDefinition[] = [
  {
    method: 'GET',
    path: '/api/runs',
    handler: handleListRuns,
  },
  {
    method: 'POST',
    path: '/api/runs',
    handler: handleCreateRun,
  },
  {
    method: 'GET',
    pattern: /^\/api\/runs\/([^/]+)$/,
    params: (match) => ({
      runId: match[1],
    }),
    handler: (context, app, match) =>
      handleGetRun(context, app, {
        runId: match.params.runId,
      }),
  },
];
