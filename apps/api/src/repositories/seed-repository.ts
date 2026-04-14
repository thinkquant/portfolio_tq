import { readFile } from 'node:fs/promises';

import type {
  CaseRecord,
  DocumentRecord,
  ProjectId,
  SeedCasesQuery,
  SeedDocumentsQuery,
} from '@portfolio-tq/types';

type CaseSeedGroup = 'payment' | 'investing' | 'legacy';

const seedCaseFileUrls: Record<CaseSeedGroup, URL> = {
  payment: new URL(
    '../../../../data/seed/payment-cases/cases.json',
    import.meta.url,
  ),
  investing: new URL(
    '../../../../data/seed/investing-cases/cases.json',
    import.meta.url,
  ),
  legacy: new URL(
    '../../../../data/seed/legacy-cases/cases.json',
    import.meta.url,
  ),
};

const seedDocumentsFileUrl = new URL(
  '../../../../data/seed/policy-docs/documents.json',
  import.meta.url,
);

const caseCache = new Map<CaseSeedGroup, Promise<CaseRecord[]>>();
let documentCache: Promise<DocumentRecord[]> | null = null;

export async function listSeedCases(
  group: CaseSeedGroup,
  query: SeedCasesQuery = {},
): Promise<CaseRecord[]> {
  const cases = await loadSeedCases(group);

  return cases
    .filter((seedCase) => matchesProject(seedCase, query.projectId))
    .slice(0, query.limit ?? cases.length);
}

export async function listSeedDocuments(
  query: SeedDocumentsQuery = {},
): Promise<DocumentRecord[]> {
  const documents = await loadSeedDocuments();

  return documents
    .filter((document) => matchesProject(document, query.projectId))
    .filter((document) => matchesKind(document, query.kind))
    .slice(0, query.limit ?? documents.length);
}

async function loadSeedCases(group: CaseSeedGroup): Promise<CaseRecord[]> {
  let cachedCases = caseCache.get(group);

  if (!cachedCases) {
    cachedCases = readSeedRecords<CaseRecord>(seedCaseFileUrls[group]);
    caseCache.set(group, cachedCases);
  }

  return cachedCases;
}

async function loadSeedDocuments(): Promise<DocumentRecord[]> {
  if (!documentCache) {
    documentCache = readSeedRecords<DocumentRecord>(seedDocumentsFileUrl);
  }

  return documentCache;
}

async function readSeedRecords<T>(fileUrl: URL): Promise<T[]> {
  const content = await readFile(fileUrl, 'utf8');

  return JSON.parse(content) as T[];
}

function matchesProject(
  record: { projectId: ProjectId },
  projectId?: ProjectId,
): boolean {
  return !projectId || record.projectId === projectId;
}

function matchesKind(
  document: DocumentRecord,
  kind?: SeedDocumentsQuery['kind'],
): boolean {
  return !kind || document.kind === kind;
}
