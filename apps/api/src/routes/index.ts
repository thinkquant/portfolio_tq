import type { AppContext } from '../app/context.js';
import { demoRoutes } from './demo.js';
import { evalRoutes } from './evals.js';
import { healthRoutes } from './health.js';
import { observabilityRoutes } from './observability.js';
import { createRouter } from './router.js';
import { runRoutes } from './runs.js';
import { seedRoutes } from './seed.js';
import { toolRoutes } from './tools.js';

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
