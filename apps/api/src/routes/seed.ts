import {
  handleListDocuments,
  handleListInvestingCases,
  handleListLegacyIntakes,
  handleListPaymentCases,
  handleSeedNamespace,
} from '../handlers/seed-handler.js';
import type { RouteDefinition } from './router.js';

export const seedRoutes: RouteDefinition[] = [
  {
    method: 'GET',
    path: '/api/seed',
    handler: handleSeedNamespace,
  },
  {
    method: 'GET',
    path: '/api/seed/payment-cases',
    handler: handleListPaymentCases,
  },
  {
    method: 'GET',
    path: '/api/seed/investing-cases',
    handler: handleListInvestingCases,
  },
  {
    method: 'GET',
    path: '/api/seed/legacy-intakes',
    handler: handleListLegacyIntakes,
  },
  {
    method: 'GET',
    path: '/api/seed/documents',
    handler: handleListDocuments,
  },
];
