import type {
  CaseRecord,
  DocumentRecord,
  SeedCaseGroup,
  SeedCasesQuery,
  SeedDocumentsQuery,
} from '@portfolio-tq/types';

import { fileSeedDataLoader } from '../repositories/seed-repository.js';

export async function listPaymentCases(
  query: SeedCasesQuery = {},
): Promise<CaseRecord[]> {
  return listSeedCasesByGroup('payment', query);
}

export async function listInvestingCases(
  query: SeedCasesQuery = {},
): Promise<CaseRecord[]> {
  return listSeedCasesByGroup('investing', query);
}

export async function listLegacyIntakes(
  query: SeedCasesQuery = {},
): Promise<CaseRecord[]> {
  return listSeedCasesByGroup('legacy', query);
}

export async function listSeedDocuments(
  query: SeedDocumentsQuery = {},
): Promise<DocumentRecord[]> {
  return fileSeedDataLoader.listDocuments(query);
}

function listSeedCasesByGroup(
  group: SeedCaseGroup,
  query: SeedCasesQuery,
): Promise<CaseRecord[]> {
  return fileSeedDataLoader.listCases(group, query);
}
