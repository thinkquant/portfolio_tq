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

export function lookupPaymentCase(
  payload: PaymentCaseLookupRequest,
  seedData: PaymentCaseLookupSeedData,
): CaseRecord | null {
  return (
    seedData.paymentCases.find((seedCase) => seedCase.id === payload.caseId) ??
    null
  );
}

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

function comparePolicyMatches(
  left: PolicySearchMatch,
  right: PolicySearchMatch,
): number {
  if (right.score !== left.score) {
    return right.score - left.score;
  }

  return left.id.localeCompare(right.id);
}

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
