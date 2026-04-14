import {
  Firestore,
  type DocumentData,
  type QuerySnapshot,
} from '@google-cloud/firestore';
import {
  projectIds,
  type ProjectId,
  type ToolInvocationListQuery,
  type ToolInvocationRecord,
} from '@portfolio-tq/types';
import { firestoreCollections } from '@portfolio-tq/types';
import { env } from '../config/env.js';

function requireFirestore(firestore: Firestore | null): Firestore {
  if (!firestore) {
    throw new Error('Firestore is not configured for this runtime.');
  }

  return firestore;
}

async function readQuery(
  queryPromise: Promise<QuerySnapshot<DocumentData>>,
): Promise<ToolInvocationRecord[]> {
  const snapshot = await queryPromise;

  return snapshot.docs.map((document) =>
    normalizeToolInvocationRecord(document.data()),
  );
}

export async function createToolInvocation(
  firestore: Firestore | null,
  toolInvocation: ToolInvocationRecord,
): Promise<ToolInvocationRecord> {
  await requireFirestore(firestore)
    .collection(env.firestore.collections.toolInvocations)
    .doc(toolInvocation.id)
    .set({
      ...toolInvocation,
      observedAt: new Date().toISOString(),
    });

  return toolInvocation;
}

export async function listToolInvocations(
  firestore: Firestore | null,
  query: ToolInvocationListQuery = {},
): Promise<ToolInvocationRecord[]> {
  const limit = query.limit ?? 20;
  const fetchSize = Math.max(limit, 100);
  const collectionNames = getToolInvocationCollectionNames();
  const toolInvocations = (
    await Promise.all(
      collectionNames.map((collectionName) =>
        readQuery(
          requireFirestore(firestore)
            .collection(collectionName)
            .orderBy('startedAt', 'desc')
            .limit(fetchSize)
            .get(),
        ),
      ),
    )
  )
    .flat()
    .sort((left, right) => right.startedAt.localeCompare(left.startedAt));

  return toolInvocations
    .filter(
      (toolInvocation) =>
        matchesProject(toolInvocation, query.projectId) &&
        matchesRun(toolInvocation, query.runId) &&
        matchesTool(toolInvocation, query.toolName),
    )
    .filter(
      (toolInvocation, index, allToolInvocations) =>
        allToolInvocations.findIndex(
          (candidate) => candidate.id === toolInvocation.id,
        ) === index,
    )
    .slice(0, limit);
}

function getToolInvocationCollectionNames(): string[] {
  const collectionNames = [
    env.firestore.collections.toolInvocations,
    firestoreCollections.toolInvocations,
  ];

  return collectionNames.filter(
    (collectionName, index) =>
      collectionNames.indexOf(collectionName) === index,
  );
}

export function normalizeToolInvocationRecord(
  input: Record<string, unknown>,
): ToolInvocationRecord {
  const status =
    input.status === 'failed' || input.success === false
      ? 'failed'
      : 'completed';
  const createdAt =
    asString(input.createdAt) ??
    asString(input.startedAt) ??
    new Date().toISOString();
  const durationMs =
    asNumber(input.durationMs) ?? asNumber(input.latencyMs) ?? 0;
  const startedAt = asString(input.startedAt) ?? createdAt;
  const completedAt =
    asString(input.completedAt) ??
    new Date(new Date(startedAt).getTime() + durationMs).toISOString();
  const inputSummary =
    asString(input.inputSummary) ?? 'No input summary recorded.';
  const outputSummary =
    asString(input.outputSummary) ??
    asString(input.summary) ??
    'No output summary recorded.';

  return {
    id: asRequiredString(input.id, 'id'),
    projectId: asRequiredProjectId(input.projectId),
    runId: asRequiredString(input.runId, 'runId'),
    toolName: asRequiredString(input.toolName, 'toolName'),
    inputSummary,
    outputSummary,
    success:
      typeof input.success === 'boolean'
        ? input.success
        : status === 'completed',
    durationMs,
    createdAt,
    status,
    startedAt,
    completedAt,
    latencyMs: asNumber(input.latencyMs) ?? durationMs,
    summary: asString(input.summary) ?? outputSummary,
  };
}

function matchesProject(
  toolInvocation: ToolInvocationRecord,
  projectId?: ProjectId,
): boolean {
  return !projectId || toolInvocation.projectId === projectId;
}

function matchesRun(
  toolInvocation: ToolInvocationRecord,
  runId?: string,
): boolean {
  return !runId || toolInvocation.runId === runId;
}

function matchesTool(
  toolInvocation: ToolInvocationRecord,
  toolName?: string,
): boolean {
  return !toolName || toolInvocation.toolName === toolName;
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value)
    ? value
    : undefined;
}

function asRequiredString(value: unknown, field: string): string {
  const normalizedValue = asString(value);

  if (!normalizedValue) {
    throw new Error(
      `Tool invocation record is missing required field ${field}.`,
    );
  }

  return normalizedValue;
}

function asRequiredProjectId(value: unknown): ProjectId {
  const normalizedValue = asString(value);

  if (
    normalizedValue &&
    (projectIds as readonly string[]).includes(normalizedValue)
  ) {
    return normalizedValue as ProjectId;
  }

  throw new Error('Tool invocation record is missing a supported projectId.');
}
