import {
  Firestore,
  type DocumentData,
  type QuerySnapshot,
} from '@google-cloud/firestore';
import {
  projectIds,
  type EvaluationListQuery,
  type EvaluationRecord,
  type EvaluationStatus,
  type ProjectId,
} from '@portfolio-tq/types';

import { env } from '../config/env.js';

function requireFirestore(firestore: Firestore | null): Firestore {
  if (!firestore) {
    throw new Error('Firestore is not configured for this runtime.');
  }

  return firestore;
}

async function readQuery(
  queryPromise: Promise<QuerySnapshot<DocumentData>>,
): Promise<EvaluationRecord[]> {
  const snapshot = await queryPromise;

  return snapshot.docs.map((document) =>
    normalizeEvaluationRecord(document.data()),
  );
}

export async function createEvaluation(
  firestore: Firestore | null,
  evaluation: EvaluationRecord,
): Promise<EvaluationRecord> {
  await requireFirestore(firestore)
    .collection(env.firestore.collections.evaluations)
    .doc(evaluation.id)
    .set({
      ...evaluation,
      observedAt: new Date().toISOString(),
    });

  return evaluation;
}

export async function listEvaluations(
  firestore: Firestore | null,
  query: EvaluationListQuery = {},
): Promise<EvaluationRecord[]> {
  const limit = query.limit ?? 20;
  const fetchSize = Math.max(limit, 100);
  const evaluations = await readQuery(
    requireFirestore(firestore)
      .collection(env.firestore.collections.evaluations)
      .orderBy('createdAt', 'desc')
      .limit(fetchSize)
      .get(),
  );

  return evaluations
    .filter(
      (evaluation) =>
        matchesProject(evaluation, query.projectId) &&
        matchesRun(evaluation, query.runId) &&
        matchesStatus(evaluation, query.status),
    )
    .slice(0, limit);
}

export function normalizeEvaluationRecord(
  input: Record<string, unknown>,
): EvaluationRecord {
  const fallbackTriggered = asBoolean(input.fallbackTriggered) ?? false;
  const score = asNumber(input.score) ?? 0;
  const status = normalizeStatus(input.status, score, fallbackTriggered);
  const summary =
    asString(input.summary) ?? defaultSummary(status, fallbackTriggered);
  const notes = asString(input.notes) ?? summary;
  const groundednessScore =
    asNumber(input.groundednessScore) ?? asNumber(input.score) ?? null;

  return {
    id: asRequiredString(input.id, 'id'),
    projectId: asRequiredProjectId(input.projectId),
    runId: asRequiredString(input.runId, 'runId'),
    status,
    createdAt: asString(input.createdAt) ?? new Date().toISOString(),
    score,
    schemaValid: asBoolean(input.schemaValid) ?? true,
    policyPass: asBoolean(input.policyPass) ?? status === 'passed',
    fallbackTriggered,
    groundednessScore,
    notes,
    summary,
  };
}

function matchesProject(
  evaluation: EvaluationRecord,
  projectId?: ProjectId,
): boolean {
  return !projectId || evaluation.projectId === projectId;
}

function matchesRun(evaluation: EvaluationRecord, runId?: string): boolean {
  return !runId || evaluation.runId === runId;
}

function matchesStatus(
  evaluation: EvaluationRecord,
  status?: EvaluationStatus,
): boolean {
  return !status || evaluation.status === status;
}

function normalizeStatus(
  value: unknown,
  score: number,
  fallbackTriggered: boolean,
): EvaluationStatus {
  if (value === 'passed' || value === 'warning' || value === 'failed') {
    return value;
  }

  if (fallbackTriggered) {
    return 'warning';
  }

  if (score >= 0.9) {
    return 'passed';
  }

  if (score >= 0.6) {
    return 'warning';
  }

  return 'failed';
}

function defaultSummary(
  status: EvaluationStatus,
  fallbackTriggered: boolean,
): string {
  if (fallbackTriggered) {
    return 'Evaluation remained structurally valid but triggered fallback handling.';
  }

  if (status === 'passed') {
    return 'Evaluation passed the shared runtime validation checks.';
  }

  if (status === 'warning') {
    return 'Evaluation produced a warning signal for follow-up review.';
  }

  return 'Evaluation failed the shared runtime validation checks.';
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value)
    ? value
    : undefined;
}

function asBoolean(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined;
}

function asRequiredString(value: unknown, field: string): string {
  const normalizedValue = asString(value);

  if (!normalizedValue) {
    throw new Error(`Evaluation record is missing required field ${field}.`);
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

  throw new Error('Evaluation record is missing a supported projectId.');
}
