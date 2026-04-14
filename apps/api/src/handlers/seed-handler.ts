import {
  parseSeedCasesQuery,
  parseSeedDocumentsQuery,
} from '@portfolio-tq/schemas';
import type {
  NamespacePlaceholderData,
  ProjectId,
  SeedCaseListResponseData,
  SeedCasesQuery,
  SeedDocumentListResponseData,
  SeedDocumentsQuery,
} from '@portfolio-tq/types';

import type { AppContext } from '../app/context.js';
import { ValidationError } from '../errors/api-error.js';
import type { RequestContext } from '../lib/http.js';
import { sendSuccess } from '../lib/http.js';
import { assertValid } from '../lib/validation.js';
import {
  listInvestingCases,
  listLegacyIntakes,
  listPaymentCases,
  listSeedDocuments,
} from '../services/seed-data.js';

export function handleSeedNamespace(
  context: RequestContext,
  app: AppContext,
): void {
  sendSuccess(
    context.response,
    200,
    {
      namespace: 'seed',
      environment: app.config.environment,
      routes: [
        '/api/seed/payment-cases',
        '/api/seed/investing-cases',
        '/api/seed/legacy-intakes',
        '/api/seed/documents',
      ],
      status: 'active',
    } satisfies NamespacePlaceholderData,
    context.requestId,
  );
}

export async function handleListPaymentCases(
  context: RequestContext,
): Promise<void> {
  const query = validateSeedCasesQuery(context, 'payment-exception-review');
  const cases = await listPaymentCases(query);

  sendSuccess(
    context.response,
    200,
    {
      cases,
      count: cases.length,
    } satisfies SeedCaseListResponseData,
    context.requestId,
  );
}

export async function handleListInvestingCases(
  context: RequestContext,
): Promise<void> {
  const query = validateSeedCasesQuery(context, 'investing-ops-copilot');
  const cases = await listInvestingCases(query);

  sendSuccess(
    context.response,
    200,
    {
      cases,
      count: cases.length,
    } satisfies SeedCaseListResponseData,
    context.requestId,
  );
}

export async function handleListLegacyIntakes(
  context: RequestContext,
): Promise<void> {
  const query = validateSeedCasesQuery(context, 'legacy-ai-adapter');
  const cases = await listLegacyIntakes(query);

  sendSuccess(
    context.response,
    200,
    {
      cases,
      count: cases.length,
    } satisfies SeedCaseListResponseData,
    context.requestId,
  );
}

export async function handleListDocuments(
  context: RequestContext,
): Promise<void> {
  const query = validateSeedDocumentsQuery(context);
  const documents = await listSeedDocuments(query);

  sendSuccess(
    context.response,
    200,
    {
      documents,
      count: documents.length,
    } satisfies SeedDocumentListResponseData,
    context.requestId,
  );
}

function validateSeedCasesQuery(
  context: RequestContext,
  expectedProjectId: ProjectId,
): SeedCasesQuery {
  const query = assertValid(
    parseSeedCasesQuery({
      projectId: context.url.searchParams.get('projectId') ?? undefined,
      limit: context.url.searchParams.get('limit') ?? undefined,
    }),
    {
      code: 'invalid_request',
      message:
        'Seed case queries accept an optional matching projectId and a positive numeric limit.',
    },
  );

  return withExpectedProject(query, expectedProjectId);
}

function validateSeedDocumentsQuery(
  context: RequestContext,
): SeedDocumentsQuery {
  return assertValid(
    parseSeedDocumentsQuery({
      projectId: context.url.searchParams.get('projectId') ?? undefined,
      kind: context.url.searchParams.get('kind') ?? undefined,
      limit: context.url.searchParams.get('limit') ?? undefined,
    }),
    {
      code: 'invalid_request',
      message:
        'Seed document queries accept optional projectId, kind, and positive numeric limit values.',
    },
  );
}

function withExpectedProject(
  query: SeedCasesQuery,
  expectedProjectId: ProjectId,
): SeedCasesQuery {
  if (query.projectId && query.projectId !== expectedProjectId) {
    throw new ValidationError(
      'invalid_request',
      'Route-specific seed case queries cannot target a different projectId.',
      {
        projectId: query.projectId,
        expectedProjectId,
      },
    );
  }

  return {
    ...query,
    projectId: expectedProjectId,
  };
}
