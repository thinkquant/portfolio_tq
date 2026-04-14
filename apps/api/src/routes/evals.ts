import {
  handleCreateEvaluation,
  handleListEvaluations,
  handleListRunEvaluations,
} from '../handlers/evaluation-handler.js';
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
  {
    method: 'POST',
    path: '/api/evals',
    handler: handleCreateEvaluation,
  },
  {
    method: 'POST',
    path: '/api/evaluations',
    handler: handleCreateEvaluation,
  },
  {
    method: 'GET',
    pattern: /^\/api\/runs\/([^/]+)\/evals$/,
    params: (match) => ({
      runId: match[1],
    }),
    handler: (context, app, match) =>
      handleListRunEvaluations(context, app, {
        runId: match.params.runId,
      }),
  },
];
