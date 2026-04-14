import {
  parseEvaluationCreateRequest,
  parseEvaluationListQuery,
} from '@portfolio-tq/schemas';
import type {
  EvaluationCreateResponseData,
  EvaluationListQuery,
  EvaluationListResponseData,
} from '@portfolio-tq/types';

import type { AppContext } from '../app/context.js';
import { NotFoundError, ValidationError } from '../errors/api-error.js';
import type { RequestContext } from '../lib/http.js';
import { readJsonBody, sendSuccess } from '../lib/http.js';
import { assertValid } from '../lib/validation.js';
import { getRunById } from '../services/runs.js';
import { createEvaluation, listEvaluations } from '../services/evaluations.js';

export async function handleCreateEvaluation(
  context: RequestContext,
  app: AppContext,
): Promise<void> {
  const rawPayload = await readJsonBody<Record<string, unknown>>(
    context.request,
  );
  const payload = assertValid(parseEvaluationCreateRequest(rawPayload), {
    code: 'invalid_request',
    message:
      'Evaluation creation requires a supported projectId, runId, status, score, and boolean validation fields.',
  });

  const evaluation = await createEvaluation(app.firestore, payload);

  sendSuccess(
    context.response,
    201,
    { evaluation } satisfies EvaluationCreateResponseData,
    context.requestId,
  );
}

export async function handleListEvaluations(
  context: RequestContext,
  app: AppContext,
): Promise<void> {
  const query = validateEvaluationListQuery(context);
  const evaluations = await listEvaluations(app.firestore, query);

  sendSuccess(
    context.response,
    200,
    {
      evaluations,
      count: evaluations.length,
    } satisfies EvaluationListResponseData,
    context.requestId,
  );
}

export async function handleListRunEvaluations(
  context: RequestContext,
  app: AppContext,
  params: { runId?: string },
): Promise<void> {
  const runId = validateRunId(params.runId);
  const run = await getRunById(app.firestore, runId);

  if (!run) {
    throw new NotFoundError(
      'not_found',
      'No run was found for the requested evaluation list.',
      {
        runId,
      },
    );
  }

  const query = validateEvaluationListQuery(context);
  const evaluations = await listEvaluations(app.firestore, {
    ...query,
    runId,
  });

  sendSuccess(
    context.response,
    200,
    {
      evaluations,
      count: evaluations.length,
    } satisfies EvaluationListResponseData,
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

function validateEvaluationListQuery(
  context: RequestContext,
): EvaluationListQuery {
  return assertValid(
    parseEvaluationListQuery({
      projectId: context.url.searchParams.get('projectId') ?? undefined,
      runId: context.url.searchParams.get('runId') ?? undefined,
      status: context.url.searchParams.get('status') ?? undefined,
      limit: context.url.searchParams.get('limit') ?? undefined,
    }),
    {
      code: 'invalid_request',
      message:
        'Evaluation list filters accept optional projectId, runId, status, and positive numeric limit values.',
    },
  );
}
