import {
  handleListProjects,
  handleObservabilityOverview,
  handleProjectMetrics,
} from '../handlers/observability-handler.js';
import type { RouteDefinition } from './router.js';

export const observabilityRoutes: RouteDefinition[] = [
  {
    method: 'GET',
    path: '/api/observability/overview',
    handler: handleObservabilityOverview,
  },
  {
    method: 'GET',
    path: '/api/projects',
    handler: handleListProjects,
  },
  {
    method: 'GET',
    pattern: /^\/api\/projects\/([^/]+)\/metrics$/,
    params: (match) => ({ projectId: decodeURIComponent(match[1] ?? '') }),
    handler: (context, app, match) =>
      handleProjectMetrics(context, app, match.params),
  },
];
