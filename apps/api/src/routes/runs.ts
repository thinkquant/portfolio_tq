import { handleListRuns } from '../handlers/observability-handler.js';
import type { RouteDefinition } from './router.js';

export const runRoutes: RouteDefinition[] = [
  {
    method: 'GET',
    path: '/api/runs',
    handler: handleListRuns,
  },
];
