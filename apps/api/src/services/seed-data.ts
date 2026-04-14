import type {
  CaseRecord,
  DocumentRecord,
  SeedCasesQuery,
  SeedDocumentsQuery,
} from '@portfolio-tq/types';

import {
  listSeedCases as listRepositorySeedCases,
  listSeedDocuments as listRepositorySeedDocuments,
} from '../repositories/seed-repository.js';

export async function listPaymentCases(
  query: SeedCasesQuery = {},
): Promise<CaseRecord[]> {
  return listRepositorySeedCases('payment', query);
}

export async function listInvestingCases(
  query: SeedCasesQuery = {},
): Promise<CaseRecord[]> {
  return listRepositorySeedCases('investing', query);
}

export async function listLegacyIntakes(
  query: SeedCasesQuery = {},
): Promise<CaseRecord[]> {
  return listRepositorySeedCases('legacy', query);
}

export async function listSeedDocuments(
  query: SeedDocumentsQuery = {},
): Promise<DocumentRecord[]> {
  return listRepositorySeedDocuments(query);
}
