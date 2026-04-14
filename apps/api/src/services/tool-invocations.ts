import { randomUUID } from 'node:crypto';
import type { Firestore } from '@google-cloud/firestore';
import type {
  ToolInvocationCreateRequest,
  ToolInvocationListQuery,
  ToolInvocationRecord,
} from '@portfolio-tq/types';

import { NotFoundError, ValidationError } from '../errors/api-error.js';
import {
  createToolInvocation as createRepositoryToolInvocation,
  listToolInvocations as listRepositoryToolInvocations,
} from '../repositories/tool-invocation-repository.js';
import { saveRun } from '../repositories/run-repository.js';
import { getRunById } from './runs.js';

export async function createToolInvocation(
  firestore: Firestore | null,
  payload: ToolInvocationCreateRequest,
): Promise<ToolInvocationRecord> {
  const run = await getRunById(firestore, payload.runId);

  if (!run) {
    throw new NotFoundError(
      'not_found',
      'No run was found for the requested tool invocation target.',
      {
        runId: payload.runId,
      },
    );
  }

  if (run.projectId !== payload.projectId) {
    throw new ValidationError(
      'invalid_request',
      'Tool invocation projectId must match the referenced run.',
      {
        runId: payload.runId,
        projectId: payload.projectId,
        expectedProjectId: run.projectId,
      },
    );
  }

  const toolInvocation = buildToolInvocationRecord(payload);
  await Promise.all([
    createRepositoryToolInvocation(firestore, toolInvocation),
    saveRun(firestore, {
      ...run,
      toolInvocationCount: run.toolInvocationCount + 1,
      updatedAt:
        toolInvocation.completedAt > run.updatedAt
          ? toolInvocation.completedAt
          : run.updatedAt,
    }),
  ]);

  return toolInvocation;
}

export async function listToolInvocations(
  firestore: Firestore | null,
  query: ToolInvocationListQuery = {},
): Promise<ToolInvocationRecord[]> {
  return listRepositoryToolInvocations(firestore, query);
}

function buildToolInvocationRecord(
  payload: ToolInvocationCreateRequest,
): ToolInvocationRecord {
  const createdAt = payload.createdAt ?? new Date().toISOString();
  const status = payload.success ? 'completed' : 'failed';
  const completedAt = new Date(
    new Date(createdAt).getTime() + payload.durationMs,
  ).toISOString();

  return {
    id: `tool-${payload.projectId}-${randomUUID()}`,
    projectId: payload.projectId,
    runId: payload.runId,
    toolName: payload.toolName,
    inputSummary: payload.inputSummary,
    outputSummary: payload.outputSummary,
    success: payload.success,
    durationMs: payload.durationMs,
    createdAt,
    status,
    startedAt: createdAt,
    completedAt,
    latencyMs: payload.durationMs,
    summary: payload.outputSummary,
  };
}
