import { readFile } from 'node:fs/promises';
import type { Firestore } from '@google-cloud/firestore';
import {
  aggregateEvaluationFlags,
  deriveEvaluationStatus,
  evaluateConfidenceThreshold,
  evaluateFallbackTriggered,
} from '@portfolio-tq/evals';

import {
  createDemoRun,
  legacyAdapterExtractionSchema,
  legacyAdapterOutputSchema,
  legacyAdapterPayloadSchema,
  parseLegacyAdapterSampleCase,
  legacyAdapterValidationResultSchema,
} from '@portfolio-tq/schemas';
import {
  legacyAdapterExtractionStrategies,
  legacyAdapterFieldNames,
  type LegacyAdapterExtraction,
  type LegacyAdapterExtractionStrategy,
  type LegacyAdapterFieldName,
  type LegacyAdapterInput,
  type LegacyAdapterOutput,
  type LegacyAdapterPayload,
  type LegacyAdapterSampleCase,
  type LegacyAdapterSampleListResponseData,
  type LegacyAdapterTraceData,
  type LegacyAdapterValidationIssue,
  type LegacyAdapterValidationOutcome,
  type LegacyAdapterValidationResult,
  type LegacySubmissionStatus,
  type LegacyWorkflowType,
  type Environment,
  type EscalationRecord,
  type EvaluationFlag,
  type EvaluationRecord,
  type RunRecord,
  type ToolInvocationRecord,
} from '@portfolio-tq/types';

import type { Logger } from '../logs.js';
import { persistDemoRun } from '../observability.js';

export const legacyAdapterExtractionStrategy: LegacyAdapterExtractionStrategy =
  legacyAdapterExtractionStrategies[0];

export interface LegacyAdapterExtractionTrace {
  strategy: LegacyAdapterExtractionStrategy;
  normalizedText: string;
  recoveredFields: LegacyAdapterFieldName[];
  workflowHints: LegacyWorkflowType[];
  accountCandidates: string[];
  extractionFailed: boolean;
  failureReason: string | null;
  conflictSignals: string[];
}

export interface LegacyAdapterExtractionStageResult {
  extraction: LegacyAdapterExtraction;
  trace: LegacyAdapterExtractionTrace;
}

export interface LegacyAdapterValidationTrace {
  requiredFieldsChecked: LegacyAdapterFieldName[];
  missingFields: LegacyAdapterFieldName[];
  blockingIssueCodes: LegacyAdapterValidationIssue['code'][];
  warningIssueCodes: LegacyAdapterValidationIssue['code'][];
  outcome: LegacyAdapterValidationOutcome;
}

export interface LegacyAdapterValidationStageResult {
  validation: LegacyAdapterValidationResult;
  outcome: LegacyAdapterValidationOutcome;
  trace: LegacyAdapterValidationTrace;
}

export interface LegacyAdapterTransformationTrace {
  legacyWorkflowCode: string | null;
  reviewCode: 'auto_accept' | 'auto_reject' | 'manual_review';
  transformSkipped: boolean;
  skipReason: string | null;
}

export interface LegacyAdapterTransformationStageResult {
  payload: LegacyAdapterPayload | null;
  legacySubmissionStatus: LegacySubmissionStatus;
  trace: LegacyAdapterTransformationTrace;
}

export interface LegacyAdapterOutputTrace {
  validationIssueCount: number;
  confidence: number;
  nextStepReason: string;
}

export interface LegacyAdapterOutputStageResult {
  output: LegacyAdapterOutput;
  trace: LegacyAdapterOutputTrace;
}

type StageLogContext = {
  logger?: Logger;
  requestId?: string;
  runId?: string;
  promptVersionId?: string;
};

const legacyProjectId = 'legacy-ai-adapter' as const;
const legacyAdapterSamplesFileUrl = new URL(
  '../../../../../data/seed/legacy-cases/intake-examples.json',
  import.meta.url,
);
const stageDurationsMs = {
  extraction: 132,
  validation: 84,
  transformation: 76,
  finalStatus: 58,
  escalation: 72,
} as const;
let sampleCache: Promise<LegacyAdapterSampleCase[]> | null = null;

const requiredFieldsByWorkflow: Record<
  LegacyWorkflowType,
  LegacyAdapterFieldName[]
> = {
  beneficiary_change: [
    'workflowType',
    'requesterName',
    'accountId',
    'requestSummary',
    'effectiveDate',
    'targetEntity',
  ],
  distribution_change: [
    'workflowType',
    'requesterName',
    'accountId',
    'requestSummary',
    'effectiveDate',
  ],
  document_reissue: [
    'workflowType',
    'requesterName',
    'accountId',
    'requestSummary',
    'targetEntity',
  ],
  profile_update: ['workflowType', 'requesterName', 'accountId', 'requestSummary'],
};

const legacyWorkflowCodes: Record<LegacyWorkflowType, string> = {
  beneficiary_change: 'BENE_CHG',
  distribution_change: 'DIST_CHG',
  document_reissue: 'DOC_REISSUE',
  profile_update: 'PROF_UPD',
};

export function runLegacyAdapterExtractionStage(
  input: LegacyAdapterInput,
  logContext: StageLogContext = {},
): LegacyAdapterExtractionStageResult {
  const normalizedText = normalizeInputText(input.sourceText);
  const workflowHints = detectWorkflowHints(normalizedText);
  const accountCandidates = detectAccountCandidates(normalizedText);
  const conflictSignals = detectConflictSignals(
    input.workflowType ?? null,
    workflowHints,
    accountCandidates,
  );
  const workflowType = resolveWorkflowType(input.workflowType ?? null, workflowHints);
  const requesterName = extractRequesterName(normalizedText);
  const effectiveDate = extractEffectiveDate(normalizedText);
  const amountUsd = extractAmountUsd(normalizedText);
  const targetEntity = extractTargetEntity({
    normalizedText,
    workflowHints,
    workflowType,
    requesterName,
  });

  const extraction = legacyAdapterExtractionSchema.parse({
    workflowType,
    requesterName,
    accountId:
      accountCandidates.length === 1 ? accountCandidates[0] ?? null : null,
    requestSummary: extractRequestSummary({
      normalizedText,
      workflowHints,
      workflowType,
      requesterName,
      effectiveDate,
      targetEntity,
      accountCandidates,
      conflictSignals,
    }),
    effectiveDate,
    amountUsd,
    targetEntity,
    sourceChannel: resolveSourceChannel(input, normalizedText),
  });

  const recoveredFields = legacyAdapterFieldNames.filter((fieldName) =>
    fieldHasValue(extraction, fieldName),
  );
  const extractionFailed = recoveredFields.length === 0;
  const failureReason = extractionFailed
    ? 'No supported intake signals were recovered from the raw input.'
    : null;

  const result = {
    extraction,
    trace: {
      strategy: legacyAdapterExtractionStrategy,
      normalizedText,
      recoveredFields,
      workflowHints,
      accountCandidates,
      extractionFailed,
      failureReason,
      conflictSignals,
    },
  } satisfies LegacyAdapterExtractionStageResult;

  logContext.logger?.info(
    'legacy_adapter.extraction.completed',
    {
      requestId: logContext.requestId,
      projectId: legacyProjectId,
      runId: logContext.runId,
      promptVersionId: logContext.promptVersionId,
    },
    {
      extractionStrategy: result.trace.strategy,
      recoveredFields: result.trace.recoveredFields,
      workflowHints: result.trace.workflowHints,
      accountCandidates: result.trace.accountCandidates,
      extractionFailed: result.trace.extractionFailed,
      failureReason: result.trace.failureReason,
      extraction: result.extraction,
    },
  );

  return result;
}

export function runLegacyAdapterValidationStage(
  extractionStage: LegacyAdapterExtractionStageResult,
  logContext: StageLogContext = {},
): LegacyAdapterValidationStageResult {
  const requiredFields: LegacyAdapterFieldName[] =
    extractionStage.extraction.workflowType === null
      ? ['workflowType']
      : [...requiredFieldsByWorkflow[extractionStage.extraction.workflowType]];
  const missingFields = requiredFields.filter((fieldName) =>
    !fieldHasValue(extractionStage.extraction, fieldName),
  );

  if (
    extractionStage.extraction.workflowType === null &&
    !missingFields.includes('workflowType')
  ) {
    missingFields.unshift('workflowType');
  }

  if (
    extractionStage.trace.accountCandidates.length > 1 &&
    !missingFields.includes('accountId')
  ) {
    missingFields.push('accountId');
  }

  const reviewIssues = buildReviewIssues(extractionStage.trace);
  const warningIssues = buildWarningIssues(extractionStage.extraction);
  const blockingIssues =
    reviewIssues.length > 0
      ? reviewIssues
      : buildMissingFieldIssues(missingFields, extractionStage.extraction.workflowType);

  const issues = [...blockingIssues, ...warningIssues];
  const outcome = resolveValidationOutcome({
    blockingIssues,
    warningIssues,
  });

  const validation = legacyAdapterValidationResultSchema.parse({
    isValid: outcome === 'proceed' || outcome === 'continue_with_warnings',
    missingFields,
    issues,
    humanReviewRequired: outcome === 'trigger_review',
    canTransformPayload:
      outcome === 'proceed' || outcome === 'continue_with_warnings',
  });

  const result = {
    validation,
    outcome,
    trace: {
      requiredFieldsChecked: requiredFields,
      missingFields: validation.missingFields,
      blockingIssueCodes: blockingIssues.map((issue) => issue.code),
      warningIssueCodes: warningIssues.map((issue) => issue.code),
      outcome,
    },
  } satisfies LegacyAdapterValidationStageResult;

  logContext.logger?.info(
    'legacy_adapter.validation.completed',
    {
      requestId: logContext.requestId,
      projectId: legacyProjectId,
      runId: logContext.runId,
      promptVersionId: logContext.promptVersionId,
    },
    {
      requiredFieldsChecked: result.trace.requiredFieldsChecked,
      missingFields: result.trace.missingFields,
      outcome: result.outcome,
      validation: result.validation,
    },
  );

  return result;
}

export async function listLegacyAdapterSamples(): Promise<LegacyAdapterSampleListResponseData> {
  const samples = await loadLegacyAdapterSamples();

  return {
    samples,
    count: samples.length,
  };
}

export function runLegacyAdapterTransformationStage(
  extractionStage: LegacyAdapterExtractionStageResult,
  validationStage: LegacyAdapterValidationStageResult,
  logContext: StageLogContext = {},
): LegacyAdapterTransformationStageResult {
  const legacySubmissionStatus = resolveLegacySubmissionStatus(validationStage);

  if (
    !validationStage.validation.canTransformPayload ||
    extractionStage.extraction.workflowType === null ||
    extractionStage.extraction.accountId === null ||
    extractionStage.extraction.requesterName === null ||
    extractionStage.extraction.requestSummary === null
  ) {
    const result = {
      payload: null,
      legacySubmissionStatus,
      trace: {
        legacyWorkflowCode:
          extractionStage.extraction.workflowType === null
            ? null
            : legacyWorkflowCodes[extractionStage.extraction.workflowType],
        reviewCode:
          legacySubmissionStatus === 'needs_review'
            ? 'manual_review'
            : 'auto_reject',
        transformSkipped: true,
        skipReason: buildTransformationSkipReason(validationStage),
      },
    } satisfies LegacyAdapterTransformationStageResult;

    logContext.logger?.info(
      'legacy_adapter.transformation.completed',
      {
        requestId: logContext.requestId,
        projectId: legacyProjectId,
        runId: logContext.runId,
        promptVersionId: logContext.promptVersionId,
      },
      {
        legacySubmissionStatus: result.legacySubmissionStatus,
        transformSkipped: result.trace.transformSkipped,
        skipReason: result.trace.skipReason,
      },
    );

    return result;
  }

  const payload = legacyAdapterPayloadSchema.parse({
    legacyWorkflowCode:
      legacyWorkflowCodes[extractionStage.extraction.workflowType],
    legacyAccountId: extractionStage.extraction.accountId,
    operatorDisplayName: extractionStage.extraction.requesterName,
    normalizedSummary: buildNormalizedSummary(extractionStage.extraction),
    effectiveDate: resolveLegacyPayloadEffectiveDate(extractionStage.extraction),
    amountCents:
      extractionStage.extraction.amountUsd === null
        ? null
        : Math.round(extractionStage.extraction.amountUsd * 100),
    reviewCode: 'auto_accept',
  });

  const result = {
    payload,
    legacySubmissionStatus,
    trace: {
      legacyWorkflowCode: payload.legacyWorkflowCode,
      reviewCode: payload.reviewCode,
      transformSkipped: false,
      skipReason: null,
    },
  } satisfies LegacyAdapterTransformationStageResult;

  logContext.logger?.info(
    'legacy_adapter.transformation.completed',
    {
      requestId: logContext.requestId,
      projectId: legacyProjectId,
      runId: logContext.runId,
      promptVersionId: logContext.promptVersionId,
    },
    {
      legacySubmissionStatus: result.legacySubmissionStatus,
      transformSkipped: result.trace.transformSkipped,
      payload: result.payload,
    },
  );

  return result;
}

export function buildLegacyAdapterFinalOutput(
  extractionStage: LegacyAdapterExtractionStageResult,
  validationStage: LegacyAdapterValidationStageResult,
  transformationStage: LegacyAdapterTransformationStageResult,
  logContext: StageLogContext = {},
): LegacyAdapterOutputStageResult {
  const validationIssues = validationStage.validation.issues.map(
    (issue) => issue.message,
  );
  const nextStepReason = buildSuggestedNextStep(
    extractionStage,
    validationStage,
    transformationStage,
  );
  const confidence = resolveConfidence(
    extractionStage,
    validationStage,
    transformationStage,
  );

  const output = legacyAdapterOutputSchema.parse({
    normalizedInput: extractionStage.extraction,
    legacyPayload: transformationStage.payload,
    legacySubmissionStatus: transformationStage.legacySubmissionStatus,
    validationIssues,
    suggestedNextStep: nextStepReason,
    confidence,
    humanReviewRequired: validationStage.validation.humanReviewRequired,
  });

  const result = {
    output,
    trace: {
      validationIssueCount: validationIssues.length,
      confidence,
      nextStepReason,
    },
  } satisfies LegacyAdapterOutputStageResult;

  logContext.logger?.info(
    'legacy_adapter.output.completed',
    {
      requestId: logContext.requestId,
      projectId: legacyProjectId,
      runId: logContext.runId,
      promptVersionId: logContext.promptVersionId,
    },
    {
      legacySubmissionStatus: result.output.legacySubmissionStatus,
      confidence: result.trace.confidence,
      validationIssueCount: result.trace.validationIssueCount,
      suggestedNextStep: result.output.suggestedNextStep,
    },
  );

  return result;
}

export type LegacyAdapterDemoExecutionResult = {
  run: RunRecord;
  evaluation: EvaluationRecord;
  escalation: EscalationRecord | null;
  toolInvocations: ToolInvocationRecord[];
  result: LegacyAdapterOutput;
  trace: LegacyAdapterTraceData;
};

export async function runLegacyAdapterDemo(config: {
  requestId: string;
  payload: LegacyAdapterInput;
  environment: Environment;
  firestore: Firestore | null;
  logger: Logger;
}): Promise<LegacyAdapterDemoExecutionResult> {
  const startedAt = new Date();
  const promptVersionId = 'prompt-legacy-v1';
  const baseRun = createDemoRun(legacyProjectId, 'completed');
  const extractionStage = runLegacyAdapterExtractionStage(config.payload, {
    logger: config.logger,
    requestId: config.requestId,
    runId: baseRun.id,
    promptVersionId,
  });
  const validationStage = runLegacyAdapterValidationStage(extractionStage, {
    logger: config.logger,
    requestId: config.requestId,
    runId: baseRun.id,
    promptVersionId,
  });
  const transformationStage = runLegacyAdapterTransformationStage(
    extractionStage,
    validationStage,
    {
      logger: config.logger,
      requestId: config.requestId,
      runId: baseRun.id,
      promptVersionId,
    },
  );
  const outputStage = buildLegacyAdapterFinalOutput(
    extractionStage,
    validationStage,
    transformationStage,
    {
      logger: config.logger,
      requestId: config.requestId,
      runId: baseRun.id,
      promptVersionId,
    },
  );
  const toolInvocations = buildLegacyAdapterTraceInvocations({
    runId: baseRun.id,
    createdAt: startedAt,
    extractionStage,
    validationStage,
    transformationStage,
    outputStage,
  });
  const totalLatency = toolInvocations.reduce(
    (sum, toolInvocation) => sum + toolInvocation.durationMs,
    0,
  );
  const finishedAt = new Date(startedAt.getTime() + totalLatency);
  const fallbackTriggered = outputStage.output.humanReviewRequired;
  const schemaValid = resolveEvaluationSchemaValidity(validationStage);
  const policyPass = outputStage.output.legacySubmissionStatus !== 'rejected';
  const evaluationFlags = buildEvaluationFlags(
    validationStage,
    transformationStage,
    outputStage.output,
  );
  const derivedEvaluationStatus = deriveEvaluationStatus({
    schemaValid,
    policyPass,
    score: outputStage.output.confidence,
    fallbackTriggered,
  });
  const evaluationStatus =
    derivedEvaluationStatus === 'passed' && evaluationFlags.length > 0
      ? 'warning'
      : derivedEvaluationStatus;
  const runStatus = fallbackTriggered ? 'escalated' : 'completed';
  const escalation = fallbackTriggered
    ? ({
        id: `${baseRun.id}-escalation`,
        projectId: legacyProjectId,
        runId: baseRun.id,
        status: 'open',
        createdAt: finishedAt.toISOString(),
        reason:
          'Conflicting legacy workflow or account references require human review before submission.',
        owner: 'user-reviewer-dev',
      } satisfies EscalationRecord)
    : null;

  const run: RunRecord = {
    ...baseRun,
    status: runStatus,
    inputRef: buildInputRef(extractionStage, config.payload),
    outputRef: `legacy-output-${baseRun.id}`,
    confidence: outputStage.output.confidence,
    latencyMs: totalLatency,
    estimatedCostUsd: 0,
    promptVersionId,
    createdAt: startedAt.toISOString(),
    updatedAt: finishedAt.toISOString(),
    environment: config.environment,
    summary: buildRunSummary(outputStage.output),
    evaluationStatus,
    fallbackTriggered,
    escalated: fallbackTriggered,
    toolInvocationCount: toolInvocations.length,
  };

  const evaluation: EvaluationRecord = {
    id: `${run.id}-evaluation`,
    projectId: legacyProjectId,
    runId: run.id,
    status: evaluationStatus,
    createdAt: finishedAt.toISOString(),
    score: outputStage.output.confidence,
    schemaValid,
    policyPass,
    fallbackTriggered,
    ...(evaluationFlags.length > 0 ? { flags: evaluationFlags } : {}),
    groundednessScore: outputStage.output.confidence,
    notes: buildEvaluationNotes(
      outputStage.output,
      validationStage,
      transformationStage,
    ),
    summary: buildEvaluationSummary(outputStage.output, validationStage),
  };

  config.logger.runLifecycle('run.created', {
    requestId: config.requestId,
    projectId: run.projectId,
    runId: run.id,
    promptVersionId,
  });
  config.logger.runLifecycle('run.started', {
    requestId: config.requestId,
    projectId: run.projectId,
    runId: run.id,
    promptVersionId,
  });

  for (const toolInvocation of toolInvocations) {
    config.logger.runLifecycle(
      'tool.called',
      {
        requestId: config.requestId,
        projectId: run.projectId,
        runId: run.id,
        promptVersionId,
      },
      {
        toolName: toolInvocation.toolName,
      },
    );
    config.logger.runLifecycle(
      'tool.completed',
      {
        requestId: config.requestId,
        projectId: run.projectId,
        runId: run.id,
        latencyMs: toolInvocation.latencyMs,
        promptVersionId,
      },
      {
        toolName: toolInvocation.toolName,
        summary: toolInvocation.summary,
      },
    );
  }

  config.logger.runLifecycle(
    'schema.validated',
    {
      requestId: config.requestId,
      projectId: run.projectId,
      runId: run.id,
      promptVersionId,
    },
    {
      schemaValid: true,
      evaluationStatus,
      validationOutcome: validationStage.outcome,
      humanReviewRequired: outputStage.output.humanReviewRequired,
    },
  );

  if (fallbackTriggered) {
    config.logger.runLifecycle(
      'fallback.triggered',
      {
        requestId: config.requestId,
        projectId: run.projectId,
        runId: run.id,
        promptVersionId,
      },
      {
        fallbackReason: 'legacy-adapter-review-required',
      },
    );
    config.logger.runLifecycle(
      'escalation.created',
      {
        requestId: config.requestId,
        projectId: run.projectId,
        runId: run.id,
        promptVersionId,
      },
      {
        escalationId: escalation?.id ?? null,
        owner: escalation?.owner ?? null,
      },
    );
  }

  if (config.firestore) {
    await persistDemoRun(config.firestore, {
      run,
      evaluation,
      toolInvocations,
      escalation: escalation ?? undefined,
    });
  }

  config.logger.runLifecycle(
    'run.completed',
    {
      requestId: config.requestId,
      projectId: run.projectId,
      runId: run.id,
      latencyMs: totalLatency,
      promptVersionId,
    },
    {
      evaluationStatus,
      fallbackTriggered,
      persistedToFirestore: Boolean(config.firestore),
    },
  );

  return {
    run,
    evaluation,
    escalation,
    toolInvocations,
    result: outputStage.output,
    trace: {
      extraction: {
        strategy: extractionStage.trace.strategy,
        recoveredFields: extractionStage.trace.recoveredFields,
        workflowHints: extractionStage.trace.workflowHints,
        accountCandidates: extractionStage.trace.accountCandidates,
        extractionFailed: extractionStage.trace.extractionFailed,
        failureReason: extractionStage.trace.failureReason,
        conflictSignals: extractionStage.trace.conflictSignals,
      },
      validation: {
        requiredFieldsChecked: validationStage.trace.requiredFieldsChecked,
        missingFields: validationStage.trace.missingFields,
        blockingIssueCodes: validationStage.trace.blockingIssueCodes,
        warningIssueCodes: validationStage.trace.warningIssueCodes,
        outcome: validationStage.trace.outcome,
      },
      transformation: transformationStage.trace,
      finalStatus: {
        legacySubmissionStatus: outputStage.output.legacySubmissionStatus,
        validationIssueCount: outputStage.trace.validationIssueCount,
        confidence: outputStage.trace.confidence,
        suggestedNextStep: outputStage.trace.nextStepReason,
        humanReviewRequired: outputStage.output.humanReviewRequired,
      },
    },
  };
}

function normalizeInputText(sourceText: string): string {
  return sourceText.replace(/\s+/g, ' ').trim();
}

async function loadLegacyAdapterSamples(): Promise<LegacyAdapterSampleCase[]> {
  if (!sampleCache) {
    sampleCache = readLegacyAdapterSamples();
  }

  return sampleCache;
}

async function readLegacyAdapterSamples(): Promise<LegacyAdapterSampleCase[]> {
  const rawSamples = JSON.parse(
    await readFile(legacyAdapterSamplesFileUrl, 'utf8'),
  ) as unknown[];

  return rawSamples.map((rawSample) => {
    const parsed = parseLegacyAdapterSampleCase(rawSample);

    if (!parsed.success) {
      throw new Error('Legacy adapter sample fixtures failed schema validation.');
    }

    return parsed.data;
  });
}

function resolveLegacySubmissionStatus(
  validationStage: LegacyAdapterValidationStageResult,
): LegacySubmissionStatus {
  if (validationStage.validation.humanReviewRequired) {
    return 'needs_review';
  }

  if (!validationStage.validation.canTransformPayload) {
    return 'rejected';
  }

  return 'accepted';
}

function buildInputRef(
  extractionStage: LegacyAdapterExtractionStageResult,
  input: LegacyAdapterInput,
): string {
  const metadataHandoffId =
    typeof input.metadata?.handoffId === 'string' ? input.metadata.handoffId : null;

  if (metadataHandoffId) {
    return metadataHandoffId;
  }

  if (extractionStage.extraction.accountId) {
    return extractionStage.extraction.accountId;
  }

  if (extractionStage.extraction.workflowType) {
    return `legacy-${extractionStage.extraction.workflowType}`;
  }

  return 'legacy-intake-unresolved';
}

function buildRunSummary(output: LegacyAdapterOutput): string {
  if (output.legacySubmissionStatus === 'accepted') {
    return 'Legacy adapter run completed with a deterministic payload ready for downstream submission.';
  }

  if (output.legacySubmissionStatus === 'needs_review') {
    return 'Legacy adapter run completed with review-required output because conflicting intake signals were detected.';
  }

  return 'Legacy adapter run completed with deterministic rejection because required legacy fields were missing.';
}

function buildEvaluationSummary(
  output: LegacyAdapterOutput,
  validationStage: LegacyAdapterValidationStageResult,
): string {
  if (output.legacySubmissionStatus === 'accepted') {
    return 'Schema validation passed and the legacy adapter produced an acceptable payload.';
  }

  if (output.legacySubmissionStatus === 'needs_review') {
    return 'Schema remained valid, but the adapter triggered fallback review handling.';
  }

  return resolveEvaluationSchemaValidity(validationStage)
    ? 'The adapter stopped before payload transformation because the normalized structure was not safe for downstream submission.'
    : 'The extracted structure remained schema-invalid for the legacy workflow, so transformation was blocked.';
}

function buildEvaluationNotes(
  output: LegacyAdapterOutput,
  validationStage: LegacyAdapterValidationStageResult,
  transformationStage: LegacyAdapterTransformationStageResult,
): string {
  if (output.legacySubmissionStatus === 'accepted') {
    return validationStage.outcome === 'continue_with_warnings'
      ? 'The adapter remained transformable, but optional incompatible fields were ignored with reviewer-visible warnings.'
      : 'The adapter produced a legacy-compatible payload without requiring fallback handling.';
  }

  if (output.legacySubmissionStatus === 'needs_review') {
    return 'Conflicting workflow or account references triggered reviewer follow-up before any legacy submission could be produced.';
  }

  return transformationStage.trace.skipReason
    ? `Deterministic validation blocked transformation: ${transformationStage.trace.skipReason}`
    : 'Deterministic validation blocked submission until the required legacy fields are collected.';
}

function resolveEvaluationSchemaValidity(
  validationStage: LegacyAdapterValidationStageResult,
): boolean {
  return !validationStage.validation.issues.some((issue) =>
    ['missing_required_field', 'invalid_format', 'unsupported_workflow_type'].includes(
      issue.code,
    ),
  );
}

function buildEvaluationFlags(
  validationStage: LegacyAdapterValidationStageResult,
  transformationStage: LegacyAdapterTransformationStageResult,
  output: LegacyAdapterOutput,
): EvaluationFlag[] {
  const missingFields = validationStage.validation.missingFields;
  const extractionSchemaInvalid = validationStage.validation.issues.some((issue) =>
    ['invalid_format', 'unsupported_workflow_type'].includes(issue.code),
  );

  return aggregateEvaluationFlags([
    missingFields.length > 0
      ? ({
          type: 'schema_invalid',
          severity: 'warning',
          message: `Missing required legacy fields prevented transformation: ${missingFields.join(', ')}.`,
        } satisfies EvaluationFlag)
      : null,
    extractionSchemaInvalid
      ? ({
          type: 'schema_invalid',
          severity: 'critical',
          message:
            'The extracted structure remained incompatible with the legacy schema after deterministic validation.',
        } satisfies EvaluationFlag)
      : null,
    transformationStage.trace.transformSkipped
      ? ({
          type: output.humanReviewRequired
            ? 'fallback_triggered'
            : 'schema_invalid',
          severity: 'warning',
          message:
            transformationStage.trace.skipReason === null
              ? 'Legacy payload transformation stopped before a payload could be produced.'
              : `Legacy payload transformation stopped: ${transformationStage.trace.skipReason}`,
        } satisfies EvaluationFlag)
      : null,
    output.humanReviewRequired
      ? ({
          type: 'policy_review_required',
          severity: 'warning',
          message:
            'A reviewer must resolve the conflicting workflow or account references before submission.',
        } satisfies EvaluationFlag)
      : null,
    validationStage.outcome === 'continue_with_warnings'
      ? ({
          type: 'fallback_triggered',
          severity: 'info',
          message:
            'Optional incompatible fields were ignored while the adapter continued with warnings.',
        } satisfies EvaluationFlag)
      : null,
    evaluateFallbackTriggered({
      fallbackTriggered: output.humanReviewRequired,
      message:
        'Conflicting workflow or account references triggered reviewer fallback handling.',
    }),
    evaluateConfidenceThreshold({
      confidence: output.confidence,
    }),
  ]);
}

function buildLegacyAdapterTraceInvocations(config: {
  runId: string;
  createdAt: Date;
  extractionStage: LegacyAdapterExtractionStageResult;
  validationStage: LegacyAdapterValidationStageResult;
  transformationStage: LegacyAdapterTransformationStageResult;
  outputStage: LegacyAdapterOutputStageResult;
}): ToolInvocationRecord[] {
  const stageDefinitions = [
    {
      toolName: 'legacy-extraction-stage',
      success: !config.extractionStage.trace.extractionFailed,
      durationMs: stageDurationsMs.extraction,
      inputSummary: 'Parsed raw legacy intake text into typed candidate fields.',
      outputSummary: `Recovered fields: ${config.extractionStage.trace.recoveredFields.join(', ') || 'none'}.`,
      summary: `Extraction used ${config.extractionStage.trace.strategy} and found ${config.extractionStage.trace.recoveredFields.length} reviewer-visible fields.`,
    },
    {
      toolName: 'legacy-validation-stage',
      success:
        config.validationStage.outcome === 'proceed' ||
        config.validationStage.outcome === 'continue_with_warnings',
      durationMs: stageDurationsMs.validation,
      inputSummary: 'Applied deterministic validation rules to the typed extraction.',
      outputSummary:
        config.validationStage.validation.issues.length > 0
          ? config.validationStage.validation.issues
              .map((issue) => issue.message)
              .join(' | ')
          : 'Deterministic validation passed without issues.',
      summary: `Validation finished with outcome ${config.validationStage.outcome}.`,
    },
    {
      toolName: 'legacy-payload-transformation-stage',
      success: config.transformationStage.payload !== null,
      durationMs: stageDurationsMs.transformation,
      inputSummary: 'Transformed the validated extraction into the legacy payload shape.',
      outputSummary:
        config.transformationStage.payload === null
          ? config.transformationStage.trace.skipReason ??
            'Transformation did not produce a payload.'
          : `Payload ready with workflow code ${config.transformationStage.payload.legacyWorkflowCode}.`,
      summary:
        config.transformationStage.payload === null
          ? 'Transformation completed without a payload because validation blocked downstream submission.'
          : 'Transformation produced a legacy-compatible payload.',
    },
    {
      toolName: 'legacy-final-output-stage',
      success: true,
      durationMs: stageDurationsMs.finalStatus,
      inputSummary: 'Assembled the reviewer-facing final output and next-step guidance.',
      outputSummary: `Final status ${config.outputStage.output.legacySubmissionStatus} with confidence ${config.outputStage.output.confidence}.`,
      summary: 'Final output formatting completed for the legacy adapter run.',
    },
  ] as const;

  return stageDefinitions.map((stageDefinition, index) =>
    buildTraceInvocationRecord({
      runId: config.runId,
      createdAt: new Date(
        config.createdAt.getTime() +
          stageDefinitions
            .slice(0, index)
            .reduce((sum, stage) => sum + stage.durationMs, 0),
      ),
      toolName: stageDefinition.toolName,
      success: stageDefinition.success,
      durationMs: stageDefinition.durationMs,
      inputSummary: stageDefinition.inputSummary,
      outputSummary: stageDefinition.outputSummary,
      summary: stageDefinition.summary,
    }),
  );
}

function buildTraceInvocationRecord(config: {
  runId: string;
  createdAt: Date;
  toolName: string;
  success: boolean;
  durationMs: number;
  inputSummary: string;
  outputSummary: string;
  summary: string;
}): ToolInvocationRecord {
  const startedAt = config.createdAt.toISOString();
  const completedAt = new Date(
    config.createdAt.getTime() + config.durationMs,
  ).toISOString();

  return {
    id: `${config.runId}-${config.toolName}`,
    projectId: legacyProjectId,
    runId: config.runId,
    toolName: config.toolName,
    inputSummary: config.inputSummary,
    outputSummary: config.outputSummary,
    success: config.success,
    durationMs: config.durationMs,
    createdAt: startedAt,
    status: config.success ? 'completed' : 'failed',
    startedAt,
    completedAt,
    latencyMs: config.durationMs,
    summary: config.summary,
  };
}

function resolveWorkflowType(
  explicitWorkflowType: LegacyWorkflowType | null,
  workflowHints: LegacyWorkflowType[],
): LegacyWorkflowType | null {
  if (
    explicitWorkflowType &&
    (workflowHints.length === 0 ||
      workflowHints.every((workflowHint) => workflowHint === explicitWorkflowType))
  ) {
    return explicitWorkflowType;
  }

  if (workflowHints.length === 1) {
    return workflowHints[0] ?? null;
  }

  return null;
}

function detectWorkflowHints(normalizedText: string): LegacyWorkflowType[] {
  const hints = new Set<LegacyWorkflowType>();
  const lowered = normalizedText.toLowerCase();

  if (/\bbeneficiary\b/.test(lowered)) {
    hints.add('beneficiary_change');
  }

  if (
    /\bstatement\b/.test(lowered) ||
    /\bstmt\b/.test(lowered) ||
    /doc(?:ument)?\s+(?:rqst|request|reissue)/.test(lowered) ||
    /\bre-?send\b/.test(lowered) ||
    /\breissue\b/.test(lowered)
  ) {
    hints.add('document_reissue');
  }

  if (/\bdistribution\b/.test(lowered)) {
    hints.add('distribution_change');
  }

  if (
    /profile\s+update/.test(lowered) ||
    /address\s+change/.test(lowered) ||
    /contact\s+update/.test(lowered)
  ) {
    hints.add('profile_update');
  }

  return [...hints];
}

function detectAccountCandidates(normalizedText: string): string[] {
  const matches = normalizedText.match(/\bAC[-\s]?\d{4,8}\b/gi) ?? [];

  return [...new Set(matches.map(normalizeAccountId))];
}

function normalizeAccountId(rawAccountId: string): string {
  const digits = rawAccountId.replace(/[^0-9]/g, '');

  return `AC-${digits}`;
}

function detectConflictSignals(
  explicitWorkflowType: LegacyWorkflowType | null,
  workflowHints: LegacyWorkflowType[],
  accountCandidates: string[],
): string[] {
  const conflictSignals: string[] = [];

  if (workflowHints.length > 1) {
    conflictSignals.push(
      'The intake note contains multiple workflow interpretations.',
    );
  }

  if (
    explicitWorkflowType &&
    workflowHints.some((workflowHint) => workflowHint !== explicitWorkflowType)
  ) {
    conflictSignals.push(
      'The explicit workflow type conflicts with the workflow suggested by the intake note.',
    );
  }

  if (accountCandidates.length > 1) {
    conflictSignals.push(
      'The intake note contains more than one legacy account identifier.',
    );
  }

  return conflictSignals;
}

function extractRequesterName(normalizedText: string): string | null {
  const patterns = [
    /\b[Cc]lient\s*[=:]?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b/,
    /\b[Ff]or\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\s+(?:on|wants|effective|after|,|\.)/,
    /\b[Ff]rom\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b/,
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\s+wants\b/,
  ];

  for (const pattern of patterns) {
    const match = normalizedText.match(pattern);

    if (match?.[1]) {
      return match[1].replace(/^client\s+/i, '').trim();
    }
  }

  return null;
}

function extractEffectiveDate(normalizedText: string): string | null {
  const match = normalizedText.match(/\b(20\d{2}-\d{2}-\d{2})\b/);

  return match?.[1] ?? null;
}

function extractAmountUsd(normalizedText: string): number | null {
  const currencyMatch =
    normalizedText.match(/\$\s*(\d+(?:\.\d{1,2})?)/) ??
    normalizedText.match(/\b(\d+(?:\.\d{1,2})?)\s*usd\b/i);

  if (!currencyMatch?.[1]) {
    return null;
  }

  return Number(currencyMatch[1]);
}

function resolveSourceChannel(
  input: LegacyAdapterInput,
  normalizedText: string,
): string | null {
  const metadataSourceChannel =
    typeof input.metadata?.sourceChannel === 'string'
      ? input.metadata.sourceChannel.trim()
      : null;

  if (metadataSourceChannel) {
    return metadataSourceChannel;
  }

  const lowered = normalizedText.toLowerCase();

  if (lowered.includes('email')) {
    return 'email_forward';
  }

  if (lowered.includes('call')) {
    return 'call_note';
  }

  if (lowered.includes('portal')) {
    return 'ops_portal';
  }

  if (lowered.includes('batch')) {
    return 'batch_note';
  }

  return null;
}

function extractTargetEntity(config: {
  normalizedText: string;
  workflowHints: LegacyWorkflowType[];
  workflowType: LegacyWorkflowType | null;
  requesterName: string | null;
}): string | null {
  if (
    config.workflowHints.includes('beneficiary_change') &&
    config.workflowHints.includes('document_reissue')
  ) {
    return config.requesterName
      ? `${config.requesterName} / statement reissue`
      : 'statement reissue';
  }

  if (config.workflowType === 'beneficiary_change') {
    const match = config.normalizedText.match(
      /beneficiary(?:\s+updated)?\s+to\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b/i,
    );

    return match?.[1]?.replace(/\s+effective$/i, '').trim() ?? null;
  }

  if (config.workflowType === 'document_reissue') {
    const statementMatch = config.normalizedText.match(
      /\b(20\d{2}\s+Q[1-4]\s+statement)\b/i,
    );

    if (statementMatch?.[1]) {
      return statementMatch[1];
    }

    if (/\bstatement\b/i.test(config.normalizedText)) {
      return 'statement reissue';
    }
  }

  if (
    config.workflowType === 'distribution_change' &&
    /\bmonthly\b/i.test(config.normalizedText)
  ) {
    return 'monthly distribution schedule';
  }

  return null;
}

function extractRequestSummary(config: {
  normalizedText: string;
  workflowHints: LegacyWorkflowType[];
  workflowType: LegacyWorkflowType | null;
  requesterName: string | null;
  effectiveDate: string | null;
  targetEntity: string | null;
  accountCandidates: string[];
  conflictSignals: string[];
}): string | null {
  if (
    config.workflowHints.includes('beneficiary_change') &&
    config.workflowHints.includes('document_reissue') &&
    config.accountCandidates.length > 1
  ) {
    return 'Possible beneficiary change or document reissue referenced across two account IDs.';
  }

  if (config.workflowType === 'beneficiary_change' && config.targetEntity) {
    return `Update the primary beneficiary to ${config.targetEntity}.`;
  }

  if (config.workflowType === 'document_reissue' && config.targetEntity) {
    const wantsMail = /\bmail(?:ed)?\b/i.test(config.normalizedText);
    const wantsPdf = /\bpdf\b/i.test(config.normalizedText);

    if (wantsMail && wantsPdf) {
      return `Reissue the ${config.targetEntity} by mail and PDF.`;
    }

    if (wantsPdf) {
      return `Reissue the ${config.targetEntity} as a PDF.`;
    }

    return `Reissue the ${config.targetEntity}.`;
  }

  if (
    config.workflowType === 'distribution_change' &&
    /\bmonthly\b/i.test(config.normalizedText)
  ) {
    return 'Change the standing distribution schedule to monthly.';
  }

  if (config.workflowType === 'profile_update') {
    return 'Update the client profile details.';
  }

  if (config.conflictSignals.length > 0) {
    return 'The intake note contains conflicting signals and needs clarification.';
  }

  return null;
}

function fieldHasValue(
  extraction: LegacyAdapterExtraction,
  fieldName: LegacyAdapterFieldName,
): boolean {
  const value = extraction[fieldName];

  return value !== null && value !== '';
}

function buildReviewIssues(
  trace: LegacyAdapterExtractionTrace,
): LegacyAdapterValidationIssue[] {
  if (trace.conflictSignals.length === 0) {
    return [];
  }

  return [
    {
      code: 'conflicting_values',
      message:
        'Conflicting workflow and account references were detected in the same intake note.',
      severity: 'error',
    },
    {
      code: 'ambiguous_request',
      message:
        'The intake should be routed to a reviewer before any legacy payload is produced.',
      severity: 'error',
    },
  ];
}

function buildMissingFieldIssues(
  missingFields: LegacyAdapterFieldName[],
  workflowType: LegacyWorkflowType | null,
): LegacyAdapterValidationIssue[] {
  return missingFields.map((fieldName) => ({
    code: 'missing_required_field' as const,
    message: buildMissingFieldMessage(fieldName, workflowType),
    field: fieldName,
    severity: 'error' as const,
  }));
}

function buildMissingFieldMessage(
  fieldName: LegacyAdapterFieldName,
  workflowType: LegacyWorkflowType | null,
): string {
  if (workflowType === 'distribution_change' && fieldName === 'accountId') {
    return 'The accountId field is required before a distribution change can be transformed.';
  }

  if (workflowType === 'distribution_change' && fieldName === 'effectiveDate') {
    return 'The effectiveDate field is required before a distribution change can be submitted.';
  }

  if (workflowType === 'beneficiary_change' && fieldName === 'effectiveDate') {
    return 'The effectiveDate field is required before a beneficiary change can be submitted.';
  }

  return `The ${fieldName} field is required before this legacy workflow can continue.`;
}

function buildWarningIssues(
  extraction: LegacyAdapterExtraction,
): LegacyAdapterValidationIssue[] {
  const issues: LegacyAdapterValidationIssue[] = [];

  if (
    extraction.workflowType === 'document_reissue' &&
    extraction.effectiveDate !== null
  ) {
    issues.push({
      code: 'invalid_format',
      message:
        'The effectiveDate field is not used by the document reissue workflow and will be ignored.',
      field: 'effectiveDate',
      severity: 'warning',
    });
  }

  if (
    extraction.amountUsd !== null &&
    extraction.workflowType !== 'distribution_change'
  ) {
    issues.push({
      code: 'invalid_format',
      message:
        'The amountUsd field is not used by this workflow and will be ignored.',
      field: 'amountUsd',
      severity: 'warning',
    });
  }

  return issues;
}

function resolveValidationOutcome(config: {
  blockingIssues: LegacyAdapterValidationIssue[];
  warningIssues: LegacyAdapterValidationIssue[];
}): LegacyAdapterValidationOutcome {
  if (config.blockingIssues.some((issue) => issue.code === 'ambiguous_request')) {
    return 'trigger_review';
  }

  if (config.blockingIssues.length > 0) {
    return 'stop_workflow';
  }

  if (config.warningIssues.length > 0) {
    return 'continue_with_warnings';
  }

  return 'proceed';
}

function buildTransformationSkipReason(
  validationStage: LegacyAdapterValidationStageResult,
): string {
  if (validationStage.validation.humanReviewRequired) {
    return 'Human review is required before any legacy payload can be produced.';
  }

  if (validationStage.validation.missingFields.length > 0) {
    return `Transformation stopped because required fields are missing: ${validationStage.validation.missingFields.join(', ')}.`;
  }

  return 'Transformation stopped because deterministic validation did not allow a legacy payload.';
}

function buildNormalizedSummary(
  extraction: LegacyAdapterExtraction,
): string {
  if (
    extraction.workflowType === 'beneficiary_change' &&
    extraction.targetEntity &&
    extraction.effectiveDate
  ) {
    return `Update beneficiary to ${extraction.targetEntity} effective ${extraction.effectiveDate}.`;
  }

  if (extraction.workflowType === 'document_reissue' && extraction.requestSummary) {
    return extraction.requestSummary;
  }

  if (
    extraction.workflowType === 'distribution_change' &&
    extraction.targetEntity &&
    extraction.effectiveDate
  ) {
    return `Change distribution to ${extraction.targetEntity} effective ${extraction.effectiveDate}.`;
  }

  if (extraction.requestSummary) {
    return extraction.requestSummary;
  }

  return 'Legacy request prepared for submission.';
}

function resolveLegacyPayloadEffectiveDate(
  extraction: LegacyAdapterExtraction,
): string | null {
  if (extraction.workflowType === 'document_reissue') {
    return null;
  }

  return extraction.effectiveDate;
}

function buildSuggestedNextStep(
  extractionStage: LegacyAdapterExtractionStageResult,
  validationStage: LegacyAdapterValidationStageResult,
  transformationStage: LegacyAdapterTransformationStageResult,
): string {
  if (transformationStage.legacySubmissionStatus === 'needs_review') {
    return 'Route the case to human review to resolve the conflicting workflow and account references.';
  }

  if (transformationStage.legacySubmissionStatus === 'rejected') {
    const missingFieldLabels = validationStage.validation.missingFields.map(
      formatFieldLabel,
    );

    if (missingFieldLabels.length === 1) {
      return `Collect the ${missingFieldLabels[0]}, then retry the legacy submission.`;
    }

    if (missingFieldLabels.length > 1) {
      return `Collect the ${joinReadableList(missingFieldLabels)}, then retry the legacy submission.`;
    }

    return 'Resolve the blocking validation issues, then retry the legacy submission.';
  }

  if (validationStage.outcome === 'continue_with_warnings') {
    return 'Submit to the legacy queue and note the ignored optional fields in the reviewer-visible result.';
  }

  switch (extractionStage.extraction.workflowType) {
    case 'beneficiary_change':
      return 'Submit directly to the beneficiary change queue.';
    case 'document_reissue':
      return 'Submit to the document request queue and return the typed confirmation.';
    case 'distribution_change':
      return 'Submit to the distribution change queue and confirm the scheduled effective date.';
    case 'profile_update':
      return 'Submit to the profile update queue and return the typed confirmation.';
    default:
      return 'Submit to the legacy queue and return the typed confirmation.';
  }
}

function resolveConfidence(
  extractionStage: LegacyAdapterExtractionStageResult,
  validationStage: LegacyAdapterValidationStageResult,
  transformationStage: LegacyAdapterTransformationStageResult,
): number {
  if (transformationStage.legacySubmissionStatus === 'needs_review') {
    return 0.63;
  }

  if (transformationStage.legacySubmissionStatus === 'rejected') {
    return 0.41;
  }

  if (validationStage.outcome === 'continue_with_warnings') {
    return 0.82;
  }

  if (hasMessySignal(extractionStage.trace.normalizedText)) {
    return 0.88;
  }

  return 0.97;
}

function hasMessySignal(normalizedText: string): boolean {
  return /\bpls\b|\bacct\b|\brqst\b|\bstmt\b|\/\//i.test(normalizedText);
}

function formatFieldLabel(fieldName: LegacyAdapterFieldName): string {
  switch (fieldName) {
    case 'accountId':
      return 'account ID';
    case 'effectiveDate':
      return 'effective date';
    case 'requesterName':
      return 'requester name';
    case 'requestSummary':
      return 'request summary';
    case 'targetEntity':
      return 'target entity';
    case 'workflowType':
      return 'workflow type';
    case 'sourceChannel':
      return 'source channel';
    case 'amountUsd':
      return 'amount';
    default:
      return fieldName;
  }
}

function joinReadableList(values: string[]): string {
  if (values.length <= 1) {
    return values[0] ?? '';
  }

  if (values.length === 2) {
    return `${values[0]} and ${values[1]}`;
  }

  return `${values.slice(0, -1).join(', ')}, and ${values[values.length - 1]}`;
}
