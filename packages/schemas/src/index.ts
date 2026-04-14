/**
 * Defines shared Zod schemas and parser helpers for portfolio contracts.
 */

import { randomUUID } from 'node:crypto';
import { z } from 'zod';

import {
  accessCodeStatuses,
  casePriorities,
  caseStatuses,
  demoRunStatuses,
  environments,
  escalationStatuses,
  evaluationFlagTypes,
  evaluationStatuses,
  featureFlagKeys,
  investingOpsIssueCategories,
  legacyAdapterFieldNames,
  legacyAdapterSampleScenarios,
  legacyAdapterValidationIssueCodes,
  legacyReviewCodes,
  legacySubmissionStatuses,
  legacyWorkflowTypes,
  moduleVisibilityStates,
  paymentExceptionTypes,
  paymentReviewRecommendedActions,
  projectIds,
  projectStatuses,
  promptVersionStatuses,
  seedCaseGroups,
  seedDataGroupIds,
  toolInvocationStatuses,
  type ApiErrorEnvelope,
  type ApiErrorPayload,
  type AccountProfileRecord,
  type DemoRun,
  type DemoRunStatus,
  type DocumentRecord,
  type EscalationRecord,
  type EvaluationCreateRequest,
  type EvaluationFlag,
  type EvaluationListQuery,
  type EvaluationRecord,
  type EventTimelineRequest,
  type EscalationCreatePlaceholderRequest,
  type FeatureFlagConfig,
  type InvestingOpsOutput,
  type JsonObject,
  type JsonValue,
  type LegacyAdapterExtraction,
  type LegacyAdapterInput,
  type LegacyAdapterOutput,
  type LegacyAdapterPayload,
  type LegacyAdapterSampleCase,
  type LegacyAdapterValidationIssue,
  type LegacyAdapterValidationResult,
  type PaymentReviewOutput,
  type PaymentReviewDemoRequest,
  type PolicySearchRequest,
  type ProjectModuleSummary,
  type ProjectRecord,
  type ProjectId,
  type ProjectScopedListQuery,
  type PromptVersionRecord,
  type RunCreateRequest,
  type RunListQuery,
  type RunRecord,
  type SeedCase,
  type SeedCasesQuery,
  type SeedDataGroupDescriptor,
  type SeedDocument,
  type SeedDocumentsQuery,
  type AccountProfileLookupRequest,
  type CaseRecord,
  type CustomerProfileLookupRequest,
  type CustomerProfileRecord,
  type EscalationPreviewRecord,
  type PaymentCaseLookupRequest,
  type PolicySearchMatch,
  type TimelineEventRecord,
  type ToolInvocationCreateRequest,
  type ToolInvocationListQuery,
  type ToolInvocationRecord,
} from '@portfolio-tq/types';

/**
 * Creates a synthetic demo run for a project and status.
 *
 * The generated run uses a new UUID and current timestamp, so repeated calls
 * intentionally produce distinct demo records.
 *
 * @param projectId Project that owns the generated demo run.
 * @param status Initial demo run status.
 * @returns A populated demo run record with synthetic telemetry fields.
 */
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

const isoDateTimeSchema = z.string().datetime();
const idSchema = z.string().min(1);
const summarySchema = z.string().min(1);
const confidenceScoreSchema = z.number().finite().min(0).max(1);
const durationMsSchema = z.number().int().nonnegative();
const calendarDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD date');

export const jsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonValueSchema),
    z.record(z.string(), jsonValueSchema),
  ]),
);

export const jsonObjectSchema: z.ZodType<JsonObject> = z.record(
  z.string(),
  jsonValueSchema,
);

export const environmentSchema = z.enum(environments);
export const projectIdSchema = z.enum(projectIds);
export const projectModuleIdSchema = projectIdSchema;
export const demoRunStatusSchema = z.enum(demoRunStatuses);
export const projectStatusSchema = z.enum(projectStatuses);
export const evaluationStatusSchema = z.enum(evaluationStatuses);
export const evaluationFlagTypeSchema = z.enum(evaluationFlagTypes);
export const evaluationFlagSeveritySchema = z.enum([
  'info',
  'warning',
  'critical',
]);
export const toolInvocationStatusSchema = z.enum(toolInvocationStatuses);
export const escalationStatusSchema = z.enum(escalationStatuses);
export const caseStatusSchema = z.enum(caseStatuses);
export const casePrioritySchema = z.enum(casePriorities);
export const promptVersionStatusSchema = z.enum(promptVersionStatuses);
export const accessCodeStatusSchema = z.enum(accessCodeStatuses);
export const seedCaseGroupSchema = z.enum(seedCaseGroups);
export const seedDataGroupIdSchema = z.enum(seedDataGroupIds);
export const paymentExceptionTypeSchema = z.enum(paymentExceptionTypes);
export const paymentReviewRecommendedActionSchema = z.enum(
  paymentReviewRecommendedActions,
);
export const investingOpsIssueCategorySchema = z.enum(
  investingOpsIssueCategories,
);
export const legacyWorkflowTypeSchema = z.enum(legacyWorkflowTypes);
export const legacyAdapterFieldNameSchema = z.enum(legacyAdapterFieldNames);
export const legacyAdapterValidationIssueCodeSchema = z.enum(
  legacyAdapterValidationIssueCodes,
);
export const legacyReviewCodeSchema = z.enum(legacyReviewCodes);
export const legacyAdapterSampleScenarioSchema = z.enum(
  legacyAdapterSampleScenarios,
);
export const legacySubmissionStatusSchema = z.enum(legacySubmissionStatuses);
export const moduleVisibilityStateSchema = z.enum(moduleVisibilityStates);

export const apiErrorPayloadSchema = z
  .object({
    code: idSchema,
    message: summarySchema,
    details: jsonObjectSchema.optional(),
  })
  .strict() satisfies z.ZodType<ApiErrorPayload>;

export const apiErrorEnvelopeSchema = z
  .object({
    ok: z.literal(false),
    error: apiErrorPayloadSchema,
    requestId: idSchema,
  })
  .strict() satisfies z.ZodType<ApiErrorEnvelope>;

/**
 * Creates a strict success envelope schema around a data schema.
 *
 * @param dataSchema Zod schema for the envelope data payload.
 * @returns A strict API success envelope schema for that payload.
 */
export function apiSuccessEnvelopeSchema<T extends z.ZodType>(dataSchema: T) {
  return z
    .object({
      ok: z.literal(true),
      data: dataSchema,
      requestId: idSchema.optional(),
    })
    .strict();
}

const demoRunShape = {
  id: idSchema,
  projectId: projectIdSchema,
  status: demoRunStatusSchema,
  inputRef: idSchema,
  outputRef: idSchema.optional(),
  confidence: confidenceScoreSchema.optional(),
  latencyMs: durationMsSchema.optional(),
  estimatedCostUsd: z.number().finite().nonnegative().optional(),
  promptVersionId: idSchema.optional(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
} satisfies z.ZodRawShape;

export const demoRunSchema = z
  .object(demoRunShape)
  .strict() satisfies z.ZodType<DemoRun>;

export const projectRecordSchema = z
  .object({
    id: projectIdSchema,
    title: idSchema,
    slug: idSchema,
    tagline: summarySchema,
    summary: summarySchema,
    status: projectStatusSchema,
    surfacePath: idSchema,
    environment: z.literal('all'),
    updatedAt: isoDateTimeSchema,
  })
  .strict() satisfies z.ZodType<ProjectRecord>;

export const projectModuleSummarySchema = z
  .object({
    id: projectModuleIdSchema,
    slug: projectIdSchema,
    title: idSchema,
    shortSummary: summarySchema,
    proofTags: z.array(idSchema),
    demoRoute: idSchema,
    projectRoute: idSchema,
    status: projectStatusSchema,
    visibility: moduleVisibilityStateSchema,
  })
  .strict() satisfies z.ZodType<ProjectModuleSummary>;

export const runRecordSchema = z
  .object({
    ...demoRunShape,
    environment: environmentSchema,
    summary: summarySchema,
    evaluationStatus: evaluationStatusSchema,
    fallbackTriggered: z.boolean(),
    escalated: z.boolean(),
    toolInvocationCount: z.number().int().nonnegative(),
  })
  .strict() satisfies z.ZodType<RunRecord>;

export const toolInvocationRecordSchema = z
  .object({
    id: idSchema,
    projectId: projectIdSchema,
    runId: idSchema,
    toolName: idSchema,
    inputSummary: summarySchema,
    outputSummary: summarySchema,
    success: z.boolean(),
    durationMs: durationMsSchema,
    createdAt: isoDateTimeSchema,
    status: toolInvocationStatusSchema,
    startedAt: isoDateTimeSchema,
    completedAt: isoDateTimeSchema,
    latencyMs: durationMsSchema,
    summary: summarySchema,
  })
  .strict() satisfies z.ZodType<ToolInvocationRecord>;

export const evaluationFlagSchema = z
  .object({
    type: evaluationFlagTypeSchema,
    severity: evaluationFlagSeveritySchema,
    message: summarySchema.optional(),
  })
  .strict() satisfies z.ZodType<EvaluationFlag>;

export const evaluationRecordSchema = z
  .object({
    id: idSchema,
    projectId: projectIdSchema,
    runId: idSchema,
    status: evaluationStatusSchema,
    createdAt: isoDateTimeSchema,
    score: confidenceScoreSchema,
    schemaValid: z.boolean(),
    policyPass: z.boolean(),
    fallbackTriggered: z.boolean(),
    flags: z.array(evaluationFlagSchema).optional(),
    groundednessScore: confidenceScoreSchema.nullable(),
    notes: summarySchema,
    summary: summarySchema,
  })
  .strict() satisfies z.ZodType<EvaluationRecord>;

export const escalationRecordSchema = z
  .object({
    id: idSchema,
    projectId: projectIdSchema,
    runId: idSchema,
    status: escalationStatusSchema,
    createdAt: isoDateTimeSchema,
    reason: summarySchema,
    owner: idSchema.nullable(),
  })
  .strict() satisfies z.ZodType<EscalationRecord>;

export const promptVersionRecordSchema = z
  .object({
    id: idSchema,
    projectId: projectIdSchema,
    label: idSchema,
    createdAt: isoDateTimeSchema,
    status: promptVersionStatusSchema,
    model: idSchema,
    summary: summarySchema,
  })
  .strict() satisfies z.ZodType<PromptVersionRecord>;

export const documentRecordSchema = z
  .object({
    id: idSchema,
    projectId: projectIdSchema,
    title: idSchema,
    kind: z.enum(['policy', 'reference', 'brief'] as const),
    createdAt: isoDateTimeSchema,
    updatedAt: isoDateTimeSchema,
    status: z.literal('active'),
    summary: summarySchema,
  })
  .strict() satisfies z.ZodType<DocumentRecord>;

export const seedDocumentSchema =
  documentRecordSchema satisfies z.ZodType<SeedDocument>;

export const caseRecordSchema = z
  .object({
    id: idSchema,
    projectId: projectIdSchema,
    title: idSchema,
    queue: idSchema,
    priority: casePrioritySchema,
    status: caseStatusSchema,
    createdAt: isoDateTimeSchema,
    updatedAt: isoDateTimeSchema,
    summary: summarySchema,
  })
  .strict() satisfies z.ZodType<CaseRecord>;

export const seedCaseSchema = caseRecordSchema satisfies z.ZodType<SeedCase>;

export const seedDataGroupDescriptorSchema = z
  .object({
    id: seedDataGroupIdSchema,
    recordKind: z.enum(['case', 'document'] as const),
    source: z.literal('file_seed'),
    projectId: projectIdSchema.optional(),
    caseGroup: seedCaseGroupSchema.optional(),
  })
  .strict() satisfies z.ZodType<SeedDataGroupDescriptor>;

export const customerProfileRecordSchema = z
  .object({
    id: idSchema,
    projectId: z.literal('payment-exception-review'),
    displayName: idSchema,
    email: z.string().email(),
    region: idSchema,
    tier: z.enum(['standard', 'priority'] as const),
    riskBand: z.enum(['low', 'medium', 'high'] as const),
    priorDisputeCount: z.number().int().nonnegative(),
    linkedCaseIds: z.array(idSchema),
    summary: summarySchema,
  })
  .strict() satisfies z.ZodType<CustomerProfileRecord>;

export const accountProfileRecordSchema = z
  .object({
    id: idSchema,
    projectId: z.literal('investing-ops-copilot'),
    householdName: idSchema,
    accountType: z.enum(['individual', 'joint', 'trust'] as const),
    onboardingStatus: z.enum(['pending', 'active', 'restricted'] as const),
    suitabilityStatus: z.enum([
      'current',
      'review_required',
      'missing',
    ] as const),
    baseCurrency: idSchema,
    linkedCaseIds: z.array(idSchema),
    summary: summarySchema,
  })
  .strict() satisfies z.ZodType<AccountProfileRecord>;

export const timelineEventRecordSchema = z
  .object({
    id: idSchema,
    projectId: projectIdSchema,
    entityId: idSchema,
    timestamp: isoDateTimeSchema,
    category: z.enum([
      'created',
      'status',
      'note',
      'policy',
      'review',
      'escalation',
    ] as const),
    summary: summarySchema,
  })
  .strict() satisfies z.ZodType<TimelineEventRecord>;

export const policySearchMatchSchema = z
  .object({
    id: idSchema,
    projectId: projectIdSchema,
    title: idSchema,
    kind: documentRecordSchema.shape.kind,
    summary: summarySchema,
    score: confidenceScoreSchema,
  })
  .strict() satisfies z.ZodType<PolicySearchMatch>;

export const escalationPreviewRecordSchema = z
  .object({
    id: idSchema,
    projectId: projectIdSchema,
    runId: idSchema.nullable(),
    ownerId: idSchema.nullable(),
    status: z.literal('draft'),
    createdAt: isoDateTimeSchema,
    reason: summarySchema,
    summary: summarySchema,
  })
  .strict() satisfies z.ZodType<EscalationPreviewRecord>;

export const featureFlagConfigSchema = z
  .object({
    key: z.enum(featureFlagKeys),
    enabled: z.boolean(),
    description: summarySchema.optional(),
  })
  .strict() satisfies z.ZodType<FeatureFlagConfig>;

export const paymentReviewOutputSchema = z
  .object({
    caseSummary: summarySchema,
    exceptionType: paymentExceptionTypeSchema,
    recommendedAction: paymentReviewRecommendedActionSchema,
    rationale: z.array(summarySchema),
    confidence: confidenceScoreSchema,
    complianceFlags: z.array(idSchema),
    humanReviewRequired: z.boolean(),
  })
  .strict() satisfies z.ZodType<PaymentReviewOutput>;

export const investingOpsOutputSchema = z
  .object({
    accountSummary: summarySchema,
    issueCategory: investingOpsIssueCategorySchema,
    recommendedNextActions: z.array(summarySchema),
    citedSources: z.array(idSchema),
    confidence: confidenceScoreSchema,
    humanReviewRequired: z.boolean(),
    internalCaseNote: summarySchema,
  })
  .strict() satisfies z.ZodType<InvestingOpsOutput>;

export const legacyAdapterInputSchema = z
  .object({
    sourceText: summarySchema,
    metadata: jsonObjectSchema.optional(),
    workflowType: legacyWorkflowTypeSchema.nullable().optional(),
  })
  .strict() satisfies z.ZodType<LegacyAdapterInput>;

export const legacyAdapterExtractionSchema = z
  .object({
    workflowType: legacyWorkflowTypeSchema.nullable(),
    requesterName: summarySchema.nullable(),
    accountId: idSchema.nullable(),
    requestSummary: summarySchema.nullable(),
    effectiveDate: calendarDateSchema.nullable(),
    amountUsd: z.number().finite().nonnegative().nullable(),
    targetEntity: summarySchema.nullable(),
    sourceChannel: summarySchema.nullable(),
  })
  .strict() satisfies z.ZodType<LegacyAdapterExtraction>;

export const legacyAdapterValidationIssueSchema = z
  .object({
    code: legacyAdapterValidationIssueCodeSchema,
    message: summarySchema,
    field: legacyAdapterFieldNameSchema.optional(),
    severity: z.enum(['warning', 'error']),
  })
  .strict() satisfies z.ZodType<LegacyAdapterValidationIssue>;

export const legacyAdapterValidationResultSchema = z
  .object({
    isValid: z.boolean(),
    missingFields: z.array(legacyAdapterFieldNameSchema),
    issues: z.array(legacyAdapterValidationIssueSchema),
    humanReviewRequired: z.boolean(),
    canTransformPayload: z.boolean(),
  })
  .strict() satisfies z.ZodType<LegacyAdapterValidationResult>;

export const legacyAdapterPayloadSchema = z
  .object({
    legacyWorkflowCode: idSchema,
    legacyAccountId: idSchema,
    operatorDisplayName: summarySchema,
    normalizedSummary: summarySchema,
    effectiveDate: calendarDateSchema.nullable(),
    amountCents: z.number().int().nonnegative().nullable(),
    reviewCode: legacyReviewCodeSchema,
  })
  .strict() satisfies z.ZodType<LegacyAdapterPayload>;

export const legacyAdapterOutputSchema = z
  .object({
    normalizedInput: legacyAdapterExtractionSchema,
    legacyPayload: legacyAdapterPayloadSchema.nullable(),
    legacySubmissionStatus: legacySubmissionStatusSchema,
    validationIssues: z.array(summarySchema),
    suggestedNextStep: summarySchema,
    confidence: confidenceScoreSchema,
    humanReviewRequired: z.boolean(),
  })
  .strict() satisfies z.ZodType<LegacyAdapterOutput>;

export const legacyAdapterSampleCaseSchema = z
  .object({
    id: idSchema,
    projectId: z.literal('legacy-ai-adapter'),
    title: summarySchema,
    scenario: legacyAdapterSampleScenarioSchema,
    summary: summarySchema,
    input: legacyAdapterInputSchema,
    expectedExtraction: legacyAdapterExtractionSchema,
    expectedValidation: legacyAdapterValidationResultSchema,
    expectedPayload: legacyAdapterPayloadSchema.nullable(),
    expectedOutput: legacyAdapterOutputSchema,
  })
  .strict() satisfies z.ZodType<LegacyAdapterSampleCase>;

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

/**
 * Formats Zod issue paths for API-facing error payloads.
 *
 * @param issues Issues containing path segments and messages.
 * @returns Issues with dot-joined paths, using root for empty paths.
 */
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

/**
 * Safely parses a project-scoped list query.
 *
 * @param input Unknown value to validate.
 * @returns The Zod safe-parse result for the query schema.
 */
export function parseProjectScopedListQuery(input: unknown) {
  return projectScopedListQuerySchema.safeParse(input);
}

/**
 * Safely parses a portfolio project id.
 *
 * @param input Unknown value to validate.
 * @returns The Zod safe-parse result for the project id schema.
 */
export function parseProjectId(input: unknown) {
  return projectIdSchema.safeParse(input);
}

/**
 * Safely parses a legacy adapter intake request.
 *
 * @param input Unknown value to validate.
 * @returns The Zod safe-parse result for the intake schema.
 */
export function parseLegacyAdapterInput(input: unknown) {
  return legacyAdapterInputSchema.safeParse(input);
}

/**
 * Safely parses a legacy adapter sample case.
 *
 * @param input Unknown value to validate.
 * @returns The Zod safe-parse result for the sample case schema.
 */
export function parseLegacyAdapterSampleCase(input: unknown) {
  return legacyAdapterSampleCaseSchema.safeParse(input);
}

/**
 * Safely parses a payment review demo request.
 *
 * @param input Unknown value to validate.
 * @returns The Zod safe-parse result for the demo request schema.
 */
export function parsePaymentReviewDemoRequest(input: unknown) {
  return paymentReviewDemoRequestSchema.safeParse(input);
}

/**
 * Safely parses a run list query.
 *
 * @param input Unknown value to validate.
 * @returns The Zod safe-parse result for the run list query schema.
 */
export function parseRunListQuery(input: unknown) {
  return runListQuerySchema.safeParse(input);
}

/**
 * Safely parses a run creation request.
 *
 * @param input Unknown value to validate.
 * @returns The Zod safe-parse result for the run create schema.
 */
export function parseRunCreateRequest(input: unknown) {
  return runCreateRequestSchema.safeParse(input);
}

/**
 * Safely parses an evaluation creation request.
 *
 * @param input Unknown value to validate.
 * @returns The Zod safe-parse result for the evaluation create schema.
 */
export function parseEvaluationCreateRequest(input: unknown) {
  return evaluationCreateRequestSchema.safeParse(input);
}

/**
 * Safely parses an evaluation list query.
 *
 * @param input Unknown value to validate.
 * @returns The Zod safe-parse result for the evaluation list schema.
 */
export function parseEvaluationListQuery(input: unknown) {
  return evaluationListQuerySchema.safeParse(input);
}

/**
 * Safely parses a tool invocation list query.
 *
 * @param input Unknown value to validate.
 * @returns The Zod safe-parse result for the tool list schema.
 */
export function parseToolInvocationListQuery(input: unknown) {
  return toolInvocationListQuerySchema.safeParse(input);
}

/**
 * Safely parses a tool invocation creation request.
 *
 * @param input Unknown value to validate.
 * @returns The Zod safe-parse result for the tool create schema.
 */
export function parseToolInvocationCreateRequest(input: unknown) {
  return toolInvocationCreateRequestSchema.safeParse(input);
}

/**
 * Safely parses a customer profile lookup request.
 *
 * @param input Unknown value to validate.
 * @returns The Zod safe-parse result for the customer lookup schema.
 */
export function parseCustomerProfileLookupRequest(input: unknown) {
  return customerProfileLookupRequestSchema.safeParse(input);
}

/**
 * Safely parses a payment case lookup request.
 *
 * @param input Unknown value to validate.
 * @returns The Zod safe-parse result for the payment case schema.
 */
export function parsePaymentCaseLookupRequest(input: unknown) {
  return paymentCaseLookupRequestSchema.safeParse(input);
}

/**
 * Safely parses an account profile lookup request.
 *
 * @param input Unknown value to validate.
 * @returns The Zod safe-parse result for the account lookup schema.
 */
export function parseAccountProfileLookupRequest(input: unknown) {
  return accountProfileLookupRequestSchema.safeParse(input);
}

/**
 * Safely parses a policy search request.
 *
 * @param input Unknown value to validate.
 * @returns The Zod safe-parse result for the policy search schema.
 */
export function parsePolicySearchRequest(input: unknown) {
  return policySearchRequestSchema.safeParse(input);
}

/**
 * Safely parses an event timeline request.
 *
 * @param input Unknown value to validate.
 * @returns The Zod safe-parse result for the event timeline schema.
 */
export function parseEventTimelineRequest(input: unknown) {
  return eventTimelineRequestSchema.safeParse(input);
}

/**
 * Safely parses an escalation placeholder request.
 *
 * @param input Unknown value to validate.
 * @returns The Zod safe-parse result for the escalation schema.
 */
export function parseEscalationCreatePlaceholderRequest(input: unknown) {
  return escalationCreatePlaceholderRequestSchema.safeParse(input);
}

/**
 * Safely parses a seed cases query.
 *
 * @param input Unknown value to validate.
 * @returns The Zod safe-parse result for the seed cases schema.
 */
export function parseSeedCasesQuery(input: unknown) {
  return seedCasesQuerySchema.safeParse(input);
}

/**
 * Safely parses a seed documents query.
 *
 * @param input Unknown value to validate.
 * @returns The Zod safe-parse result for the seed documents schema.
 */
export function parseSeedDocumentsQuery(input: unknown) {
  return seedDocumentsQuerySchema.safeParse(input);
}
