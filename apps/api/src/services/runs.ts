import { randomUUID } from 'node:crypto';
import type { Firestore } from '@google-cloud/firestore';
import type {
  Environment,
  RunCreateRequest,
  RunListQuery,
  RunRecord,
} from '@portfolio-tq/types';

import {
  createRun as createRepositoryRun,
  getRunById as getRepositoryRunById,
  listRuns as listRepositoryRuns,
} from '../repositories/run-repository.js';

export async function createRun(
  firestore: Firestore | null,
  payload: RunCreateRequest,
  environment: Environment,
): Promise<RunRecord> {
  const run = buildRunRecord(payload, environment);

  return createRepositoryRun(firestore, run);
}

export async function getRunById(
  firestore: Firestore | null,
  runId: string,
): Promise<RunRecord | null> {
  return getRepositoryRunById(firestore, runId);
}

export async function listRuns(
  firestore: Firestore | null,
  query: RunListQuery = {},
): Promise<RunRecord[]> {
  return listRepositoryRuns(firestore, query);
}

function buildRunRecord(
  payload: RunCreateRequest,
  environment: Environment,
): RunRecord {
  const timestamp = new Date().toISOString();
  const status = payload.status ?? 'queued';

  return {
    id: `run-${payload.projectId}-${randomUUID()}`,
    projectId: payload.projectId,
    status,
    inputRef: payload.inputRef,
    promptVersionId: payload.promptVersionId ?? undefined,
    createdAt: timestamp,
    updatedAt: timestamp,
    environment,
    summary:
      payload.summary?.trim() || defaultRunSummary(payload.projectId, status),
    evaluationStatus: 'warning',
    fallbackTriggered: false,
    escalated: status === 'escalated',
    toolInvocationCount: 0,
  };
}

function defaultRunSummary(
  projectId: RunCreateRequest['projectId'],
  status: RunRecord['status'],
): string {
  return `Shared API run created for ${projectId} with status ${status}.`;
}
