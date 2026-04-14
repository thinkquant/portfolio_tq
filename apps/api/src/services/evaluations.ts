import { randomUUID } from 'node:crypto';

import type { Firestore } from '@google-cloud/firestore';
import type {
  EvaluationCreateRequest,
  EvaluationListQuery,
  EvaluationRecord,
} from '@portfolio-tq/types';

import { NotFoundError, ValidationError } from '../errors/api-error.js';
import {
  createEvaluation as createRepositoryEvaluation,
  listEvaluations as listRepositoryEvaluations,
} from '../repositories/evaluation-repository.js';
import { saveRun } from '../repositories/run-repository.js';
import { getRunById } from './runs.js';

export async function createEvaluation(
  firestore: Firestore | null,
  payload: EvaluationCreateRequest,
): Promise<EvaluationRecord> {
  const run = await getRunById(firestore, payload.runId);

  if (!run) {
    throw new NotFoundError(
      'not_found',
      'No run was found for the requested evaluation target.',
      {
        runId: payload.runId,
      },
    );
  }

  if (run.projectId !== payload.projectId) {
    throw new ValidationError(
      'invalid_request',
      'Evaluation projectId must match the referenced run.',
      {
        runId: payload.runId,
        projectId: payload.projectId,
        expectedProjectId: run.projectId,
      },
    );
  }

  const evaluation = buildEvaluationRecord(payload);

  await Promise.all([
    createRepositoryEvaluation(firestore, evaluation),
    saveRun(firestore, {
      ...run,
      evaluationStatus: evaluation.status,
      fallbackTriggered: evaluation.fallbackTriggered,
      updatedAt:
        evaluation.createdAt > run.updatedAt
          ? evaluation.createdAt
          : run.updatedAt,
    }),
  ]);

  return evaluation;
}

export async function listEvaluations(
  firestore: Firestore | null,
  query: EvaluationListQuery = {},
): Promise<EvaluationRecord[]> {
  return listRepositoryEvaluations(firestore, query);
}

function buildEvaluationRecord(
  payload: EvaluationCreateRequest,
): EvaluationRecord {
  const createdAt = payload.createdAt ?? new Date().toISOString();
  const summary =
    payload.summary?.trim() || defaultSummary(payload.status, payload.score);
  const notes = payload.notes?.trim() || summary;

  return {
    id: `eval-${payload.projectId}-${randomUUID()}`,
    projectId: payload.projectId,
    runId: payload.runId,
    status: payload.status,
    createdAt,
    score: payload.score,
    schemaValid: payload.schemaValid,
    policyPass: payload.policyPass,
    fallbackTriggered: payload.fallbackTriggered,
    groundednessScore: payload.groundednessScore ?? null,
    notes,
    summary,
  };
}

function defaultSummary(
  status: EvaluationRecord['status'],
  score: number,
): string {
  return `Shared API evaluation recorded with status ${status} and score ${score.toFixed(2)}.`;
}
