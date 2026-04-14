/**
 * Defines deterministic mock tool contracts and lookup helpers.
 */

import { z } from 'zod';

import {
  accountProfileLookupRequestSchema,
  accountProfileRecordSchema,
  caseRecordSchema,
  customerProfileLookupRequestSchema,
  customerProfileRecordSchema,
  escalationCreatePlaceholderRequestSchema,
  escalationPreviewRecordSchema,
  eventTimelineRequestSchema,
  paymentCaseLookupRequestSchema,
  policySearchMatchSchema,
  policySearchRequestSchema,
  timelineEventRecordSchema,
} from '@portfolio-tq/schemas';
import type {
  AccountProfileLookupRequest,
  AccountProfileLookupResponseData,
  AccountProfileRecord,
  CaseRecord,
  CustomerProfileLookupRequest,
  CustomerProfileLookupResponseData,
  CustomerProfileRecord,
  DocumentRecord,
  EscalationCreatePlaceholderRequest,
  EscalationCreatePlaceholderResponseData,
  EscalationPreviewRecord,
  EventTimelineRequest,
  EventTimelineResponseData,
  PaymentCaseLookupRequest,
  PaymentCaseLookupResponseData,
  PolicySearchMatch,
  PolicySearchRequest,
  PolicySearchResponseData,
  ProjectId,
  TimelineEventRecord,
  UserRecord,
} from '@portfolio-tq/types';

export const mockToolIds = [
  'customer-profile',
  'payment-case',
  'account-profile',
  'policy-search',
  'event-timeline',
  'escalation',
] as const;

export type MockToolId = (typeof mockToolIds)[number];

export type ToolDeterminism = 'seeded-deterministic' | 'derived-deterministic';

export type ToolSideEffect = 'none' | 'preview-only';

export interface ToolImplementationContract {
  determinism: ToolDeterminism;
  repeatability: 'same-input-same-output';
  dataSource: 'seed-data' | 'derived-placeholder';
  sideEffect: ToolSideEffect;
  summary: string;
}

export interface ToolContract<Input = unknown, Output = unknown> {
  id: MockToolId;
  name: string;
  projectIds: readonly ProjectId[];
  inputSchema: z.ZodType<Input>;
  outputSchema: z.ZodType<Output>;
  summary: string;
  implementation: ToolImplementationContract;
}

export interface ToolDefinition {
  id: MockToolId;
  projectId: ProjectId;
  name: string;
  description: string;
  implementation: ToolImplementationContract;
}

export const customerProfileLookupResponseSchema = z
  .object({
    customerProfile: customerProfileRecordSchema,
  })
  .strict() satisfies z.ZodType<CustomerProfileLookupResponseData>;

export const paymentCaseLookupResponseSchema = z
  .object({
    paymentCase: caseRecordSchema,
  })
  .strict() satisfies z.ZodType<PaymentCaseLookupResponseData>;

export const accountProfileLookupResponseSchema = z
  .object({
    accountProfile: accountProfileRecordSchema,
  })
  .strict() satisfies z.ZodType<AccountProfileLookupResponseData>;

export const policySearchResponseSchema = z
  .object({
    matches: z.array(policySearchMatchSchema),
    count: z.number().int().nonnegative(),
  })
  .strict() satisfies z.ZodType<PolicySearchResponseData>;

export const eventTimelineResponseSchema = z
  .object({
    events: z.array(timelineEventRecordSchema),
    count: z.number().int().nonnegative(),
  })
  .strict() satisfies z.ZodType<EventTimelineResponseData>;

export const escalationCreatePlaceholderResponseSchema = z
  .object({
    escalation: escalationPreviewRecordSchema,
  })
  .strict() satisfies z.ZodType<EscalationCreatePlaceholderResponseData>;

const seededReadOnlyContract: ToolImplementationContract = {
  determinism: 'seeded-deterministic',
  repeatability: 'same-input-same-output',
  dataSource: 'seed-data',
  sideEffect: 'none',
  summary:
    'Reads from seeded mock data only and returns the same result for the same request while the seed set is unchanged.',
};

const escalationPreviewContract: ToolImplementationContract = {
  determinism: 'derived-deterministic',
  repeatability: 'same-input-same-output',
  dataSource: 'derived-placeholder',
  sideEffect: 'preview-only',
  summary:
    'Derives an escalation preview from the request and seeded reviewer data without persisting a new escalation.',
};

export const toolContracts = [
  {
    id: 'customer-profile',
    name: 'Customer profile lookup',
    projectIds: ['payment-exception-review'],
    inputSchema:
      customerProfileLookupRequestSchema satisfies z.ZodType<CustomerProfileLookupRequest>,
    outputSchema:
      customerProfileLookupResponseSchema satisfies z.ZodType<CustomerProfileLookupResponseData>,
    summary: 'Looks up seeded customer risk and support profile metadata.',
    implementation: seededReadOnlyContract,
  },
  {
    id: 'payment-case',
    name: 'Payment case lookup',
    projectIds: ['payment-exception-review'],
    inputSchema:
      paymentCaseLookupRequestSchema satisfies z.ZodType<PaymentCaseLookupRequest>,
    outputSchema:
      paymentCaseLookupResponseSchema satisfies z.ZodType<PaymentCaseLookupResponseData>,
    summary: 'Looks up seeded payment exception case metadata.',
    implementation: seededReadOnlyContract,
  },
  {
    id: 'account-profile',
    name: 'Account profile lookup',
    projectIds: ['investing-ops-copilot'],
    inputSchema:
      accountProfileLookupRequestSchema satisfies z.ZodType<AccountProfileLookupRequest>,
    outputSchema:
      accountProfileLookupResponseSchema satisfies z.ZodType<AccountProfileLookupResponseData>,
    summary: 'Looks up seeded investing account profile metadata.',
    implementation: seededReadOnlyContract,
  },
  {
    id: 'policy-search',
    name: 'Policy search',
    projectIds: [
      'payment-exception-review',
      'investing-ops-copilot',
      'legacy-ai-adapter',
    ],
    inputSchema:
      policySearchRequestSchema satisfies z.ZodType<PolicySearchRequest>,
    outputSchema:
      policySearchResponseSchema satisfies z.ZodType<PolicySearchResponseData>,
    summary: 'Searches seeded project policy guidance deterministically.',
    implementation: seededReadOnlyContract,
  },
  {
    id: 'event-timeline',
    name: 'Event timeline lookup',
    projectIds: [
      'payment-exception-review',
      'investing-ops-copilot',
      'legacy-ai-adapter',
    ],
    inputSchema:
      eventTimelineRequestSchema satisfies z.ZodType<EventTimelineRequest>,
    outputSchema:
      eventTimelineResponseSchema satisfies z.ZodType<EventTimelineResponseData>,
    summary: 'Returns seeded entity timeline events for project workflows.',
    implementation: seededReadOnlyContract,
  },
  {
    id: 'escalation',
    name: 'Escalation creation placeholder',
    projectIds: ['payment-exception-review'],
    inputSchema:
      escalationCreatePlaceholderRequestSchema satisfies z.ZodType<EscalationCreatePlaceholderRequest>,
    outputSchema:
      escalationCreatePlaceholderResponseSchema satisfies z.ZodType<EscalationCreatePlaceholderResponseData>,
    summary: 'Builds a deterministic reviewer escalation placeholder.',
    implementation: escalationPreviewContract,
  },
] as const satisfies readonly ToolContract[];

export type ToolContractDefinition = (typeof toolContracts)[number];

export const toolCatalog: ToolDefinition[] = toolContracts.flatMap((contract) =>
  contract.projectIds.map((projectId) => ({
    id: contract.id,
    projectId,
    name: contract.name,
    description: contract.summary,
    implementation: contract.implementation,
  })),
);

export const toolContractsById = Object.fromEntries(
  toolContracts.map((contract) => [contract.id, contract]),
) as Record<MockToolId, ToolContractDefinition>;

export interface CustomerProfileLookupSeedData {
  customerProfiles: readonly CustomerProfileRecord[];
}

export interface PaymentCaseLookupSeedData {
  paymentCases: readonly CaseRecord[];
}

export interface AccountProfileLookupSeedData {
  accountProfiles: readonly AccountProfileRecord[];
}

export interface PolicySearchSeedData {
  documents: readonly DocumentRecord[];
}

export interface EventTimelineSeedData {
  timelineEvents: readonly TimelineEventRecord[];
}

export interface EscalationPlaceholderSeedData {
  users: readonly UserRecord[];
  createdAt?: string;
}

/**
 * Looks up a seeded customer profile by customer id.
 *
 * @param payload Lookup request containing the customer id.
 * @param seedData Seeded customer profiles available to the tool.
 * @returns The matching customer profile, or null when none exists.
 */
export function lookupCustomerProfile(
  payload: CustomerProfileLookupRequest,
  seedData: CustomerProfileLookupSeedData,
): CustomerProfileRecord | null {
  return (
    seedData.customerProfiles.find(
      (profile) => profile.id === payload.customerId,
    ) ?? null
  );
}

/**
 * Looks up a seeded payment case by case id.
 *
 * @param payload Lookup request containing the case id.
 * @param seedData Seeded payment cases available to the tool.
 * @returns The matching payment case, or null when none exists.
 */
export function lookupPaymentCase(
  payload: PaymentCaseLookupRequest,
  seedData: PaymentCaseLookupSeedData,
): CaseRecord | null {
  return (
    seedData.paymentCases.find((seedCase) => seedCase.id === payload.caseId) ??
    null
  );
}

/**
 * Looks up a seeded account profile by account id.
 *
 * @param payload Lookup request containing the account id.
 * @param seedData Seeded account profiles available to the tool.
 * @returns The matching account profile, or null when none exists.
 */
export function lookupAccountProfile(
  payload: AccountProfileLookupRequest,
  seedData: AccountProfileLookupSeedData,
): AccountProfileRecord | null {
  return (
    seedData.accountProfiles.find(
      (profile) => profile.id === payload.accountId,
    ) ?? null
  );
}

/**
 * Searches seeded policy documents for a project.
 *
 * Search scores title and summary matches, prefers policy documents, sorts by
 * score then id, and applies the request limit or the default of five.
 *
 * @param payload Project, query, and optional result limit.
 * @param seedData Seeded documents available to the tool.
 * @returns Ranked policy search matches with positive scores.
 */
export function searchPolicyDocuments(
  payload: PolicySearchRequest,
  seedData: PolicySearchSeedData,
): PolicySearchMatch[] {
  const normalizedQuery = payload.query.trim().toLowerCase();

  return seedData.documents
    .filter((document) => document.projectId === payload.projectId)
    .map((document) => ({
      id: document.id,
      projectId: document.projectId,
      title: document.title,
      kind: document.kind,
      summary: document.summary,
      score: calculatePolicyScore(document, normalizedQuery),
    }))
    .filter((match) => match.score > 0)
    .sort(comparePolicyMatches)
    .slice(0, payload.limit ?? 5);
}

/**
 * Looks up seeded timeline events for a project entity.
 *
 * @param payload Project, entity id, and optional result limit.
 * @param seedData Seeded timeline events available to the tool.
 * @returns Matching events sorted by timestamp and limited for display.
 */
export function lookupEventTimeline(
  payload: EventTimelineRequest,
  seedData: EventTimelineSeedData,
): TimelineEventRecord[] {
  return seedData.timelineEvents
    .filter(
      (timelineEvent) =>
        timelineEvent.projectId === payload.projectId &&
        timelineEvent.entityId === payload.entityId,
    )
    .sort((left, right) => left.timestamp.localeCompare(right.timestamp))
    .slice(0, payload.limit ?? 10);
}

/**
 * Creates a deterministic escalation preview when the owner exists.
 *
 * No escalation is persisted; the helper only derives a preview record for the
 * requested owner or the seeded default reviewer.
 *
 * @param payload Escalation request fields used for the preview.
 * @param seedData Seeded users and optional created-at override.
 * @returns The preview escalation, or null when the owner is missing.
 */
export function createEscalationPlaceholder(
  payload: EscalationCreatePlaceholderRequest,
  seedData: EscalationPlaceholderSeedData,
): EscalationPreviewRecord | null {
  const ownerId = payload.ownerId ?? 'user-reviewer-dev';
  const owner = seedData.users.find((user) => user.id === ownerId);

  if (!owner) {
    return null;
  }

  return buildEscalationPreview(
    {
      ...payload,
      ownerId: owner.id,
    },
    seedData.createdAt,
  );
}

/**
 * Builds a deterministic escalation preview record.
 *
 * The id is derived from stable request fields so identical requests produce
 * the same preview identifier.
 *
 * @param payload Escalation request fields used to derive the preview.
 * @param createdAt Timestamp to assign to the preview record.
 * @returns A draft escalation preview record.
 */
export function buildEscalationPreview(
  payload: EscalationCreatePlaceholderRequest,
  createdAt = '2026-04-12T18:30:00.000Z',
): EscalationPreviewRecord {
  const ownerId = payload.ownerId ?? 'user-reviewer-dev';
  const hash = stableHash({
    projectId: payload.projectId,
    runId: payload.runId ?? null,
    ownerId,
    reason: payload.reason,
    title: payload.title ?? null,
  }).slice(0, 12);

  return {
    id: `escalation-preview-${hash}`,
    projectId: payload.projectId,
    runId: payload.runId ?? null,
    ownerId,
    status: 'draft',
    createdAt,
    reason: payload.reason,
    summary:
      payload.title?.trim() ||
      `Synthetic escalation placeholder queued for ${payload.projectId}.`,
  };
}

/**
 * Scores how well a policy document matches a normalized query.
 *
 * Title matches contribute more than summary matches, and policy documents get
 * a small boost before the score is clamped to one.
 *
 * @param document Document fields used for search scoring.
 * @param normalizedQuery Lowercase query text with outer whitespace removed.
 * @returns A score from zero to one with two decimal places.
 */
function calculatePolicyScore(
  document: Pick<DocumentRecord, 'title' | 'summary' | 'kind'>,
  normalizedQuery: string,
): number {
  const searchableTitle = document.title.toLowerCase();
  const searchableSummary = document.summary.toLowerCase();
  let score = 0;

  if (searchableTitle.includes(normalizedQuery)) {
    score += 1;
  }

  if (searchableSummary.includes(normalizedQuery)) {
    score += 0.75;
  }

  if (document.kind === 'policy') {
    score += 0.25;
  }

  return Number(Math.min(score, 1).toFixed(2));
}

/**
 * Orders policy matches by score and stable id tie-breaker.
 *
 * @param left First policy match to compare.
 * @param right Second policy match to compare.
 * @returns Sort comparator result for descending score then ascending id.
 */
function comparePolicyMatches(
  left: PolicySearchMatch,
  right: PolicySearchMatch,
): number {
  if (right.score !== left.score) {
    return right.score - left.score;
  }

  return left.id.localeCompare(right.id);
}

/**
 * Produces a stable hexadecimal hash for JSON-serializable input.
 *
 * @param input Value to serialize before hashing.
 * @returns Unsigned hexadecimal hash padded to at least eight characters.
 */
function stableHash(input: unknown): string {
  const serializedInput = JSON.stringify(input);
  let hash = 5381;

  for (let index = 0; index < serializedInput.length; index += 1) {
    hash = (hash * 33) ^ serializedInput.charCodeAt(index);
  }

  return (hash >>> 0).toString(16).padStart(8, '0');
}

export type CustomerProfileLookupToolContract = ToolContract<
  CustomerProfileLookupRequest,
  CustomerProfileLookupResponseData
>;

export type PaymentCaseLookupToolContract = ToolContract<
  PaymentCaseLookupRequest,
  PaymentCaseLookupResponseData
>;

export type AccountProfileLookupToolContract = ToolContract<
  AccountProfileLookupRequest,
  AccountProfileLookupResponseData
>;

export type PolicySearchToolContract = ToolContract<
  PolicySearchRequest,
  PolicySearchResponseData
>;

export type EventTimelineToolContract = ToolContract<
  EventTimelineRequest,
  EventTimelineResponseData
>;

export type EscalationCreatePlaceholderToolContract = ToolContract<
  EscalationCreatePlaceholderRequest,
  EscalationCreatePlaceholderResponseData
>;
