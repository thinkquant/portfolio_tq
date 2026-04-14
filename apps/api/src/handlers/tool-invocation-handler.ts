import {
  parseToolInvocationCreateRequest,
  parseToolInvocationListQuery,
} from '@portfolio-tq/schemas';
import type {
  ToolInvocationCreateResponseData,
  ToolInvocationListQuery,
  ToolInvocationListResponseData,
} from '@portfolio-tq/types';

import type { AppContext } from '../app/context.js';
import { NotFoundError, ValidationError } from '../errors/api-error.js';
import type { RequestContext } from '../lib/http.js';
import { readJsonBody, sendSuccess } from '../lib/http.js';
import { assertValid } from '../lib/validation.js';
import { getRunById } from '../services/runs.js';
import {
  createToolInvocation,
  listToolInvocations,
} from '../services/tool-invocations.js';

export async function handleCreateToolInvocation(
  context: RequestContext,
  app: AppContext,
): Promise<void> {
  const rawPayload = await readJsonBody<Record<string, unknown>>(
    context.request,
  );
  const payload = assertValid(parseToolInvocationCreateRequest(rawPayload), {
    code: 'invalid_request',
    message:
      'Tool invocation creation requires runId, projectId, toolName, inputSummary, outputSummary, success, and durationMs.',
  });

  const toolInvocation = await createToolInvocation(app.firestore, payload);

  app.logger.info(
    'tool.invocation.recorded',
    {
      requestId: context.requestId,
      projectId: toolInvocation.projectId,
      runId: toolInvocation.runId,
      latencyMs: toolInvocation.durationMs,
    },
    {
      toolInvocationId: toolInvocation.id,
      toolName: toolInvocation.toolName,
      success: toolInvocation.success,
      status: toolInvocation.status,
    },
  );

  sendSuccess(
    context.response,
    201,
    { toolInvocation } satisfies ToolInvocationCreateResponseData,
    context.requestId,
  );
}

export async function handleListToolInvocations(
  context: RequestContext,
  app: AppContext,
): Promise<void> {
  const query = validateToolInvocationListQuery(context);
  const toolInvocations = await listToolInvocations(app.firestore, query);

  sendSuccess(
    context.response,
    200,
    {
      toolInvocations,
      count: toolInvocations.length,
    } satisfies ToolInvocationListResponseData,
    context.requestId,
  );
}

export async function handleListRunToolInvocations(
  context: RequestContext,
  app: AppContext,
  params: { runId?: string },
): Promise<void> {
  const runId = validateRunId(params.runId);
  const run = await getRunById(app.firestore, runId);

  if (!run) {
    throw new NotFoundError(
      'not_found',
      'No run was found for the requested tool invocation list.',
      {
        runId,
      },
    );
  }

  const query = validateToolInvocationListQuery(context);
  const toolInvocations = await listToolInvocations(app.firestore, {
    ...query,
    runId,
  });

  sendSuccess(
    context.response,
    200,
    {
      toolInvocations,
      count: toolInvocations.length,
    } satisfies ToolInvocationListResponseData,
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

function validateToolInvocationListQuery(
  context: RequestContext,
): ToolInvocationListQuery {
  return assertValid(
    parseToolInvocationListQuery({
      projectId: context.url.searchParams.get('projectId') ?? undefined,
      runId: context.url.searchParams.get('runId') ?? undefined,
      toolName: context.url.searchParams.get('toolName') ?? undefined,
      limit: context.url.searchParams.get('limit') ?? undefined,
    }),
    {
      code: 'invalid_request',
      message:
        'Tool invocation list filters accept optional projectId, runId, toolName, and positive numeric limit values.',
    },
  );
}
