import { readFile } from 'node:fs/promises';

import { Firestore } from '@google-cloud/firestore';
import type {
  AccessCodeRecord,
  CaseRecord,
  DocumentRecord,
  EvaluationRecord,
  FirestoreCollectionName,
  ProjectRecord,
  PromptVersionRecord,
  RunRecord,
  ToolInvocationRecord,
  UserRecord,
  EscalationRecord,
} from '@portfolio-tq/types';
import { firestoreCollections } from '@portfolio-tq/types';

type SeedRecord = { id: string };
type SeedGroup<T extends SeedRecord> = {
  collection: FirestoreCollectionName;
  fileUrls: URL[];
  label: string;
};

const projectId = process.env.GCP_PROJECT_ID ?? 'portfolio-tq-dev';
const databaseId = process.env.FIRESTORE_DATABASE ?? projectId;

if (!projectId.endsWith('-dev') || !databaseId.endsWith('-dev')) {
  throw new Error(
    `Refusing to seed non-dev Firestore target ${projectId}/${databaseId}. This command is intentionally limited to dev.`,
  );
}

const firestore = new Firestore({
  projectId,
  databaseId,
});

async function readSeedRecords<T extends SeedRecord>(fileUrl: URL): Promise<T[]> {
  const content = await readFile(fileUrl, 'utf8');

  return JSON.parse(content) as T[];
}

async function loadSeedGroup<T extends SeedRecord>({
  collection,
  fileUrls,
}: SeedGroup<T>): Promise<{ collection: FirestoreCollectionName; records: T[] }> {
  const records = (await Promise.all(fileUrls.map((fileUrl) => readSeedRecords<T>(fileUrl)))).flat();

  return {
    collection,
    records,
  };
}

const seedGroups: [
  SeedGroup<ProjectRecord>,
  SeedGroup<RunRecord>,
  SeedGroup<ToolInvocationRecord>,
  SeedGroup<EvaluationRecord>,
  SeedGroup<EscalationRecord>,
  SeedGroup<PromptVersionRecord>,
  SeedGroup<DocumentRecord>,
  SeedGroup<CaseRecord>,
  SeedGroup<UserRecord>,
  SeedGroup<AccessCodeRecord>,
] = [
  {
    collection: firestoreCollections.projects,
    fileUrls: [new URL('../../../data/seed/projects/projects.json', import.meta.url)],
    label: 'projects',
  },
  {
    collection: firestoreCollections.runs,
    fileUrls: [new URL('../../../data/seed/runs/runs.json', import.meta.url)],
    label: 'runs',
  },
  {
    collection: firestoreCollections.toolInvocations,
    fileUrls: [new URL('../../../data/seed/tool-invocations/tool-invocations.json', import.meta.url)],
    label: 'tool invocations',
  },
  {
    collection: firestoreCollections.evaluations,
    fileUrls: [new URL('../../../data/seed/evaluations/evaluations.json', import.meta.url)],
    label: 'evaluations',
  },
  {
    collection: firestoreCollections.escalations,
    fileUrls: [new URL('../../../data/seed/escalations/escalations.json', import.meta.url)],
    label: 'escalations',
  },
  {
    collection: firestoreCollections.promptVersions,
    fileUrls: [new URL('../../../data/seed/prompt-versions/prompt-versions.json', import.meta.url)],
    label: 'prompt versions',
  },
  {
    collection: firestoreCollections.documents,
    fileUrls: [new URL('../../../data/seed/policy-docs/documents.json', import.meta.url)],
    label: 'documents',
  },
  {
    collection: firestoreCollections.cases,
    fileUrls: [
      new URL('../../../data/seed/payment-cases/cases.json', import.meta.url),
      new URL('../../../data/seed/investing-cases/cases.json', import.meta.url),
      new URL('../../../data/seed/legacy-cases/cases.json', import.meta.url),
    ],
    label: 'cases',
  },
  {
    collection: firestoreCollections.users,
    fileUrls: [new URL('../../../data/seed/users/users.json', import.meta.url)],
    label: 'users',
  },
  {
    collection: firestoreCollections.accessCodes,
    fileUrls: [new URL('../../../data/seed/access-codes/access-codes.json', import.meta.url)],
    label: 'access codes',
  },
];

const loadedGroups = await Promise.all(seedGroups.map((seedGroup) => loadSeedGroup(seedGroup)));
const batch = firestore.batch();
const seededAt = new Date().toISOString();

for (const { collection, records } of loadedGroups) {
  for (const record of records) {
    batch.set(
      firestore.collection(collection).doc(record.id),
      {
        ...record,
        seededAt,
        seedSource: 'section-7-bootstrap',
      },
      { merge: true },
    );
  }
}

await batch.commit();

for (const { collection, records } of loadedGroups) {
  console.log(`Seeded ${records.length} ${collection} document(s) into ${projectId}/${databaseId}.`);
}

const projectsSnapshot = await firestore.collection(firestoreCollections.projects).count().get();

console.log(
  `Seed complete for ${projectId}/${databaseId}. Projects collection now reports ${projectsSnapshot.data().count} document(s).`,
);
