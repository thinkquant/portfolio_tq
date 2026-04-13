import { handleSeedNamespace } from '../handlers/namespace-handler.js';
import type { RouteDefinition } from './router.js';

export const seedRoutes: RouteDefinition[] = [
  {
    method: 'GET',
    path: '/api/seed',
    handler: handleSeedNamespace,
  },
];
