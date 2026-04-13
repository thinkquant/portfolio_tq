import { handleListEvaluations } from '../handlers/observability-handler.js';
import type { RouteDefinition } from './router.js';

export const evalRoutes: RouteDefinition[] = [
  {
    method: 'GET',
    path: '/api/evals',
    handler: handleListEvaluations,
  },
  {
    method: 'GET',
    path: '/api/evaluations',
    handler: handleListEvaluations,
  },
];
