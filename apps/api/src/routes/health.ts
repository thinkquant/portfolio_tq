import {
  handleHealth,
  handleReady,
  handleRoot,
} from '../handlers/system-handler.js';
import type { RouteDefinition } from './router.js';

export const healthRoutes: RouteDefinition[] = [
  {
    method: 'GET',
    path: '/',
    handler: handleRoot,
  },
  {
    method: 'GET',
    path: '/health',
    handler: handleHealth,
  },
  {
    method: 'GET',
    path: '/ready',
    handler: handleReady,
  },
];
