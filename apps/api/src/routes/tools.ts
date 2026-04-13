import { handleToolsNamespace } from '../handlers/namespace-handler.js';
import type { RouteDefinition } from './router.js';

export const toolRoutes: RouteDefinition[] = [
  {
    method: 'GET',
    path: '/api/tools',
    handler: handleToolsNamespace,
  },
];
