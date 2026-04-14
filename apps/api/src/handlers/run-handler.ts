import {
  parseRunCreateRequest,
  parseRunListQuery,
} from '@portfolio-tq/schemas';
import type {
  RunCreateResponseData,
  RunDetailResponseData,
  RunListQuery,
  RunListResponseData,
} from '@portfolio-tq/types';

import type { AppContext } from '../app/context.js';
import { NotFoundError, ValidationError } from '../errors/api-error.js';
import type { RequestContext } from '../lib/http.js';
import { readJsonBody, sendSuccess } from '../lib/http.js';
import { assertValid } from '../lib/validation.js';
import { createRun, getRunById, listRuns } from '../services/runs.js';

export async function handleCreateRun(
  context: RequestContext,
  app: AppContext,
): Promise<void> {
  const rawPayload = await readJsonBody<Record<string, unknown>>(
    context.request,
  );
  const payload = assertValid(parseRunCreateRequest(rawPayload), {
    code: 'invalid_request',
    message:
      'Run creation requires a supported projectId plus a non-empty inputRef.',
  });

  const run = await createRun(app.firestore, payload, app.config.environment);

  app.logger.runLifecycle(
    'run.created',
    {
      requestId: context.requestId,
      projectId: run.projectId,
      runId: run.id,
      promptVersionId: run.promptVersionId ?? null,
    },
    {
      status: run.status,
      inputRef: run.inputRef,
    },
  );

  sendSuccess(
    context.response,
    201,
    { run } satisfies RunCreateResponseData,
    context.requestId,
  );
}

export async function handleGetRun(
  context: RequestContext,
  app: AppContext,
  params: { runId?: string },
): Promise<void> {
  const runId = validateRunId(params.runId);
  const run = await getRunById(app.firestore, runId);

  if (!run) {
    throw new NotFoundError(
      'not_found',
      'No run was found for the requested ID.',
      {
        runId,
      },
    );
  }

  sendSuccess(
    context.response,
    200,
    { run } satisfies RunDetailResponseData,
    context.requestId,
  );
}

export async function handleListRuns(
  context: RequestContext,
  app: AppContext,
): Promise<void> {
  const query = validateRunListQuery(context);
  const runs = await listRuns(app.firestore, query);

  sendSuccess(
    context.response,
    200,
    {
      runs,
      count: runs.length,
    } satisfies RunListResponseData,
    context.requestId,
  );
}

function validateRunId(runId: string | undefined): string {
  const normalizedRunId = runId?.trim();

  if (!normalizedRunId) {
    throw new ValidationError(
      'invalid_request',
      'Run ID must be a non-empty path parameter.',
    );
  }

  return normalizedRunId;
}

function validateRunListQuery(context: RequestContext): RunListQuery {
  return assertValid(
    parseRunListQuery({
      projectId: context.url.searchParams.get('projectId') ?? undefined,
      status: context.url.searchParams.get('status') ?? undefined,
      limit: context.url.searchParams.get('limit') ?? undefined,
    }),
    {
      code: 'invalid_request',
      message:
        'Run list filters accept optional projectId, status, and positive numeric limit values.',
    },
  );
}
