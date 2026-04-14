import {
  handleLegacyAdapterRun,
  handleLegacyAdapterSamples,
  handlePaymentReviewRun,
} from '../handlers/demo-handler.js';
import type { RouteDefinition } from './router.js';

export const demoRoutes: RouteDefinition[] = [
  {
    method: 'POST',
    path: '/api/demo/payment-exception-review/run',
    handler: handlePaymentReviewRun,
  },
  {
    method: 'POST',
    path: '/api/demo/legacy-ai-adapter/run',
    handler: handleLegacyAdapterRun,
  },
  {
    method: 'GET',
    path: '/api/demo/legacy-ai-adapter/samples',
    handler: handleLegacyAdapterSamples,
  },
];
