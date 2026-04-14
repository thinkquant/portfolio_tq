/**
 * Composes the API route registry used by the HTTP server.
 */

import type { AppContext } from '../app/context.js';
import { demoRoutes } from './demo.js';
import { evalRoutes } from './evals.js';
import { healthRoutes } from './health.js';
import { observabilityRoutes } from './observability.js';
import { createRouter } from './router.js';
import { runRoutes } from './runs.js';
import { seedRoutes } from './seed.js';
import { toolRoutes } from './tools.js';

/**
 * Creates the API router with every route group registered.
 *
 * @param app Application context shared with each route handler.
 * @returns A router containing health, observability, run, eval, tool, seed,
 * and demo routes.
 */
export function createApiRouter(app: AppContext) {
  return createRouter(app, [
    ...healthRoutes,
    ...observabilityRoutes,
    ...runRoutes,
    ...evalRoutes,
    ...toolRoutes,
    ...seedRoutes,
    ...demoRoutes,
  ]);
}
