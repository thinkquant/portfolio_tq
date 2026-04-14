import { randomUUID } from 'node:crypto';
import { z } from 'zod';

import {
  projectIds,
  type DemoRun,
  type DemoRunStatus,
  type EvaluationCreateRequest,
  type EvaluationListQuery,
  type EventTimelineRequest,
  type EscalationCreatePlaceholderRequest,
  type PaymentReviewDemoRequest,
  type PolicySearchRequest,
  type ProjectId,
  type ProjectScopedListQuery,
  type RunCreateRequest,
  type RunListQuery,
  type SeedCasesQuery,
  type SeedDocumentsQuery,
  type AccountProfileLookupRequest,
  type CustomerProfileLookupRequest,
  type PaymentCaseLookupRequest,
  type ToolInvocationCreateRequest,
  type ToolInvocationListQuery,
} from '@portfolio-tq/types';

export function createDemoRun(
  projectId: ProjectId,
  status: DemoRunStatus,
): DemoRun {
  const timestamp = new Date().toISOString();

  return {
    id: `${projectId}-${randomUUID()}`,
    projectId,
    status,
    inputRef: 'bootstrap-case',
    outputRef: 'bootstrap-output',
    confidence: 0.98,
    latencyMs: 1420,
    estimatedCostUsd: 0.0024,
    promptVersionId: 'prompt-payment-v1',
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export const projectIdSchema = z.enum(projectIds);

export const projectScopedListQuerySchema = z
  .object({
    projectId: projectIdSchema.optional(),
  })
  .strict() satisfies z.ZodType<ProjectScopedListQuery>;

export const paymentReviewDemoRequestSchema = z
  .object({
    caseId: z.string().min(1).optional(),
    note: z.string().min(1).optional(),
  })
  .strict() satisfies z.ZodType<PaymentReviewDemoRequest>;

export const runListQuerySchema = z
  .object({
    projectId: projectIdSchema.optional(),
    status: z
      .enum(['queued', 'running', 'completed', 'failed', 'escalated'])
      .optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  })
  .strict() satisfies z.ZodType<RunListQuery>;

export const runCreateRequestSchema = z
  .object({
    projectId: projectIdSchema,
    inputRef: z.string().min(1),
    status: z
      .enum(['queued', 'running', 'completed', 'failed', 'escalated'])
      .optional(),
    promptVersionId: z.string().min(1).nullable().optional(),
    summary: z.string().min(1).nullable().optional(),
  })
  .strict() satisfies z.ZodType<RunCreateRequest>;

export const evaluationCreateRequestSchema = z
  .object({
    runId: z.string().min(1),
    projectId: projectIdSchema,
    status: z.enum(['passed', 'warning', 'failed']),
    score: z.number().finite().min(0).max(1),
    schemaValid: z.boolean(),
    policyPass: z.boolean(),
    fallbackTriggered: z.boolean(),
    groundednessScore: z.number().finite().min(0).max(1).nullable().optional(),
    notes: z.string().min(1).nullable().optional(),
    summary: z.string().min(1).nullable().optional(),
    createdAt: z.string().datetime().nullable().optional(),
  })
  .strict() satisfies z.ZodType<EvaluationCreateRequest>;

export const evaluationListQuerySchema = z
  .object({
    projectId: projectIdSchema.optional(),
    runId: z.string().min(1).optional(),
    status: z.enum(['passed', 'warning', 'failed']).optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  })
  .strict() satisfies z.ZodType<EvaluationListQuery>;

export const toolInvocationListQuerySchema = z
  .object({
    projectId: projectIdSchema.optional(),
    runId: z.string().min(1).optional(),
    toolName: z.string().min(1).optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  })
  .strict() satisfies z.ZodType<ToolInvocationListQuery>;

export const toolInvocationCreateRequestSchema = z
  .object({
    runId: z.string().min(1),
    projectId: projectIdSchema,
    toolName: z.string().min(1),
    inputSummary: z.string().min(1),
    outputSummary: z.string().min(1),
    success: z.boolean(),
    durationMs: z.number().int().nonnegative(),
    createdAt: z.string().datetime().nullable().optional(),
  })
  .strict() satisfies z.ZodType<ToolInvocationCreateRequest>;

export const customerProfileLookupRequestSchema = z
  .object({
    customerId: z.string().min(1),
  })
  .strict() satisfies z.ZodType<CustomerProfileLookupRequest>;

export const paymentCaseLookupRequestSchema = z
  .object({
    caseId: z.string().min(1),
  })
  .strict() satisfies z.ZodType<PaymentCaseLookupRequest>;

export const accountProfileLookupRequestSchema = z
  .object({
    accountId: z.string().min(1),
  })
  .strict() satisfies z.ZodType<AccountProfileLookupRequest>;

export const policySearchRequestSchema = z
  .object({
    projectId: projectIdSchema,
    query: z.string().min(1),
    limit: z.coerce.number().int().positive().max(20).optional(),
  })
  .strict() satisfies z.ZodType<PolicySearchRequest>;

export const eventTimelineRequestSchema = z
  .object({
    projectId: projectIdSchema,
    entityId: z.string().min(1),
    limit: z.coerce.number().int().positive().max(50).optional(),
  })
  .strict() satisfies z.ZodType<EventTimelineRequest>;

export const escalationCreatePlaceholderRequestSchema = z
  .object({
    projectId: projectIdSchema,
    runId: z.string().min(1).nullable().optional(),
    ownerId: z.string().min(1).nullable().optional(),
    reason: z.string().min(1),
    title: z.string().min(1).nullable().optional(),
  })
  .strict() satisfies z.ZodType<EscalationCreatePlaceholderRequest>;

export const seedCasesQuerySchema = z
  .object({
    projectId: projectIdSchema.optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  })
  .strict() satisfies z.ZodType<SeedCasesQuery>;

export const seedDocumentsQuerySchema = z
  .object({
    projectId: projectIdSchema.optional(),
    kind: z.enum(['policy', 'reference', 'brief'] as const).optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  })
  .strict() satisfies z.ZodType<SeedDocumentsQuery>;

export type SchemaIssue = {
  path: string;
  message: string;
};

export function formatSchemaIssues(
  issues: ReadonlyArray<{ path: ReadonlyArray<PropertyKey>; message: string }>,
): SchemaIssue[] {
  return issues.map((issue) => ({
    path: issue.path.length
      ? issue.path.map((segment) => String(segment)).join('.')
      : 'root',
    message: issue.message,
  }));
}

export function parseProjectScopedListQuery(input: unknown) {
  return projectScopedListQuerySchema.safeParse(input);
}

export function parseProjectId(input: unknown) {
  return projectIdSchema.safeParse(input);
}

export function parsePaymentReviewDemoRequest(input: unknown) {
  return paymentReviewDemoRequestSchema.safeParse(input);
}

export function parseRunListQuery(input: unknown) {
  return runListQuerySchema.safeParse(input);
}

export function parseRunCreateRequest(input: unknown) {
  return runCreateRequestSchema.safeParse(input);
}

export function parseEvaluationCreateRequest(input: unknown) {
  return evaluationCreateRequestSchema.safeParse(input);
}

export function parseEvaluationListQuery(input: unknown) {
  return evaluationListQuerySchema.safeParse(input);
}

export function parseToolInvocationListQuery(input: unknown) {
  return toolInvocationListQuerySchema.safeParse(input);
}

export function parseToolInvocationCreateRequest(input: unknown) {
  return toolInvocationCreateRequestSchema.safeParse(input);
}

export function parseCustomerProfileLookupRequest(input: unknown) {
  return customerProfileLookupRequestSchema.safeParse(input);
}

export function parsePaymentCaseLookupRequest(input: unknown) {
  return paymentCaseLookupRequestSchema.safeParse(input);
}

export function parseAccountProfileLookupRequest(input: unknown) {
  return accountProfileLookupRequestSchema.safeParse(input);
}

export function parsePolicySearchRequest(input: unknown) {
  return policySearchRequestSchema.safeParse(input);
}

export function parseEventTimelineRequest(input: unknown) {
  return eventTimelineRequestSchema.safeParse(input);
}

export function parseEscalationCreatePlaceholderRequest(input: unknown) {
  return escalationCreatePlaceholderRequestSchema.safeParse(input);
}

export function parseSeedCasesQuery(input: unknown) {
  return seedCasesQuerySchema.safeParse(input);
}

export function parseSeedDocumentsQuery(input: unknown) {
  return seedDocumentsQuerySchema.safeParse(input);
}
