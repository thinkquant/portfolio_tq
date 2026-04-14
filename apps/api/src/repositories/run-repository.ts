import {
  Firestore,
  type DocumentData,
  type QuerySnapshot,
} from '@google-cloud/firestore';
import {
  type ProjectId,
  type RunListQuery,
  type RunRecord,
} from '@portfolio-tq/types';
import { env } from '../config/env.js';

function requireFirestore(firestore: Firestore | null): Firestore {
  if (!firestore) {
    throw new Error('Firestore is not configured for this runtime.');
  }

  return firestore;
}

async function readQuery<T>(
  queryPromise: Promise<QuerySnapshot<DocumentData>>,
): Promise<T[]> {
  const snapshot = await queryPromise;

  return snapshot.docs.map((document) => document.data() as T);
}

export async function createRun(
  firestore: Firestore | null,
  run: RunRecord,
): Promise<RunRecord> {
  return saveRun(firestore, run);
}

export async function saveRun(
  firestore: Firestore | null,
  run: RunRecord,
): Promise<RunRecord> {
  await requireFirestore(firestore)
    .collection(env.firestore.collections.runs)
    .doc(run.id)
    .set(
      withoutUndefined({
        ...run,
        observedAt: new Date().toISOString(),
      }),
    );

  return run;
}

export async function getRunById(
  firestore: Firestore | null,
  runId: string,
): Promise<RunRecord | null> {
  const snapshot = await requireFirestore(firestore)
    .collection(env.firestore.collections.runs)
    .doc(runId)
    .get();

  return snapshot.exists ? (snapshot.data() as RunRecord) : null;
}

export async function listRuns(
  firestore: Firestore | null,
  query: RunListQuery = {},
): Promise<RunRecord[]> {
  const limit = query.limit ?? 20;
  const fetchSize = Math.max(limit, 100);
  const runs = await readQuery<RunRecord>(
    requireFirestore(firestore)
      .collection(env.firestore.collections.runs)
      .orderBy('createdAt', 'desc')
      .limit(fetchSize)
      .get(),
  );

  return runs
    .filter(
      (run) =>
        matchesProject(run, query.projectId) &&
        matchesStatus(run, query.status),
    )
    .slice(0, limit);
}

function matchesProject(run: RunRecord, projectId?: ProjectId): boolean {
  return !projectId || run.projectId === projectId;
}

function matchesStatus(
  run: RunRecord,
  status?: RunListQuery['status'],
): boolean {
  return !status || run.status === status;
}

function withoutUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, entryValue]) => entryValue !== undefined),
  ) as T;
}
