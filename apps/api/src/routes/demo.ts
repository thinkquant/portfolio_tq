import { handlePaymentReviewRun } from '../handlers/demo-handler.js';
import type { RouteDefinition } from './router.js';

export const demoRoutes: RouteDefinition[] = [
  {
    method: 'POST',
    path: '/api/demo/payment-exception-review/run',
    handler: handlePaymentReviewRun,
  },
];
