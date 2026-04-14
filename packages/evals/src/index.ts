/**
 * Provides shared evaluation thresholds, checks, and run summaries.
 */

import {
  evaluationFlagLabels,
  sharedEvaluationThresholds,
} from '@portfolio-tq/config';
import { evaluationRecordSchema } from '@portfolio-tq/schemas';
import {
  demoRunStatuses,
  evaluationStatuses as evaluationResultStatusValues,
  type DemoRunStatus,
  type EvaluationFlag,
  type EvaluationFlagSeverity,
  type EvaluationFlagType,
  type EvaluationRecord,
  type EvaluationStatus,
  type FlaggedRunSummary,
  type ProjectId,
  type RunRecord,
} from '@portfolio-tq/types';

export const evaluationStatuses: DemoRunStatus[] = [...demoRunStatuses];

export const evaluationResultStatuses: EvaluationStatus[] = [
  ...evaluationResultStatusValues,
];

export const defaultEvaluationThresholds = {
  confidence: sharedEvaluationThresholds.confidenceReviewThreshold,
  groundedness: sharedEvaluationThresholds.groundednessReviewThreshold,
  latencyMs: sharedEvaluationThresholds.demoApiMedianLatencyTargetMs,
  estimatedCostUsd: sharedEvaluationThresholds.estimatedCostReviewUsd,
} as const;

export interface ReviewFlagCategory {
  type: EvaluationFlagType;
  label: string;
  defaultSeverity: EvaluationFlagSeverity;
  summary: string;
}

export const reviewFlagCategories: Record<
  EvaluationFlagType,
  ReviewFlagCategory
> = {
  low_confidence: {
    type: 'low_confidence',
    label: evaluationFlagLabels.low_confidence,
    defaultSeverity: 'warning',
    summary: 'Confidence fell below the shared review threshold.',
  },
  schema_invalid: {
    type: 'schema_invalid',
    label: evaluationFlagLabels.schema_invalid,
    defaultSeverity: 'critical',
    summary: 'The output or evaluation record failed schema validation.',
  },
  fallback_triggered: {
    type: 'fallback_triggered',
    label: evaluationFlagLabels.fallback_triggered,
    defaultSeverity: 'warning',
    summary: 'Fallback behavior was triggered during the run.',
  },
  policy_review_required: {
    type: 'policy_review_required',
    label: evaluationFlagLabels.policy_review_required,
    defaultSeverity: 'warning',
    summary: 'The run produced a policy-sensitive review signal.',
  },
  missing_sources: {
    type: 'missing_sources',
    label: evaluationFlagLabels.missing_sources,
    defaultSeverity: 'warning',
    summary: 'Grounding or citation evidence is missing or insufficient.',
  },
  latency_exceeded: {
    type: 'latency_exceeded',
    label: evaluationFlagLabels.latency_exceeded,
    defaultSeverity: 'warning',
    summary: 'Latency exceeded the shared review threshold.',
  },
};

export interface EvaluationCheckResult {
  id: string;
  passed: boolean;
  summary: string;
  flag?: EvaluationFlag;
}

export interface SchemaValidityEvaluationInput {
  schemaValid: boolean;
  message?: string;
}

export interface ConfidenceEvaluationInput {
  confidence?: number | null;
  threshold?: number;
}

export interface FallbackEvaluationInput {
  fallbackTriggered: boolean;
  message?: string;
}

export interface GroundingEvaluationInput {
  groundednessScore?: number | null;
  citedSourceCount?: number | null;
  threshold?: number;
}

export interface LatencyEvaluationInput {
  latencyMs?: number | null;
  thresholdMs?: number;
}

export interface EstimatedCostBandInput {
  estimatedCostUsd?: number | null;
  reviewThresholdUsd?: number;
}

export type EstimatedCostBand = 'unknown' | 'normal' | 'review';

export interface EstimatedCostBandResult {
  band: EstimatedCostBand;
  estimatedCostUsd: number | null;
  reviewThresholdUsd: number;
  summary: string;
}

export interface EvaluationStatusInput {
  schemaValid: boolean;
  policyPass: boolean;
  score: number;
  fallbackTriggered?: boolean;
}

export interface RunDashboardSummary {
  runId: string;
  projectId: ProjectId;
  status: DemoRunStatus;
  evaluationStatus: EvaluationStatus;
  score: number | null;
  confidence: number | null;
  latencyMs: number | null;
  estimatedCostUsd: number | null;
  fallbackTriggered: boolean;
  flagCount: number;
  flags: EvaluationFlag[];
  summary: string;
}

export interface FlaggedRunCriteriaInput {
  evaluationStatus: EvaluationStatus;
  schemaValid: boolean;
  policyPass: boolean;
  fallbackTriggered: boolean;
  flags?: readonly EvaluationFlag[];
  score?: number | null;
}

/**
 * Identifies demo run statuses that no longer advance.
 *
 * @param status Demo run status to classify.
 * @returns True when the status is completed, failed, or escalated.
 */
export function isTerminalStatus(status: DemoRunStatus): boolean {
  return ['completed', 'failed', 'escalated'].includes(status);
}

/**
 * Evaluates whether a schema validation check passed.
 *
 * @param input Schema validity state and optional failure message.
 * @returns A check result with a critical schema flag when validation fails.
 */
export function evaluateSchemaValidity(
  input: SchemaValidityEvaluationInput,
): EvaluationCheckResult {
  if (input.schemaValid) {
    return {
      id: 'schema-validity',
      passed: true,
      summary: 'Schema validation passed.',
    };
  }

  return {
    id: 'schema-validity',
    passed: false,
    summary: input.message ?? 'Schema validation failed.',
    flag: createEvaluationFlag(
      'schema_invalid',
      'critical',
      input.message ?? 'The output did not satisfy the shared schema contract.',
    ),
  };
}

/**
 * Validates an unknown value against the evaluation record schema.
 *
 * @param input Value to parse as an evaluation record.
 * @returns A schema validity check result for the parsed value.
 */
export function evaluateEvaluationRecordSchema(
  input: unknown,
): EvaluationCheckResult {
  const parsedRecord = evaluationRecordSchema.safeParse(input);

  return evaluateSchemaValidity({
    schemaValid: parsedRecord.success,
    message: parsedRecord.success
      ? undefined
      : 'Evaluation record failed shared runtime schema validation.',
  });
}

/**
 * Evaluates confidence against the review threshold.
 *
 * Missing confidence is treated as a failed check so reviewers can see that
 * the run did not produce a usable confidence value.
 *
 * @param input Confidence value and optional threshold override.
 * @returns A check result with a low-confidence flag when the check fails.
 */
export function evaluateConfidenceThreshold(
  input: ConfidenceEvaluationInput,
): EvaluationCheckResult {
  const threshold = input.threshold ?? defaultEvaluationThresholds.confidence;
  const confidence = input.confidence ?? null;

  if (confidence !== null && confidence >= threshold) {
    return {
      id: 'confidence-threshold',
      passed: true,
      summary: `Confidence ${confidence.toFixed(2)} met threshold ${threshold.toFixed(2)}.`,
    };
  }

  return {
    id: 'confidence-threshold',
    passed: false,
    summary:
      confidence === null
        ? 'Confidence was not recorded.'
        : `Confidence ${confidence.toFixed(2)} fell below threshold ${threshold.toFixed(2)}.`,
    flag: createEvaluationFlag(
      'low_confidence',
      'warning',
      confidence === null
        ? 'Confidence was not recorded.'
        : `Confidence ${confidence.toFixed(2)} fell below the review threshold.`,
    ),
  };
}

/**
 * Evaluates whether fallback behavior was triggered.
 *
 * @param input Fallback state and optional review message.
 * @returns A check result with a fallback flag when fallback occurred.
 */
export function evaluateFallbackTriggered(
  input: FallbackEvaluationInput,
): EvaluationCheckResult {
  if (!input.fallbackTriggered) {
    return {
      id: 'fallback-triggered',
      passed: true,
      summary: 'Fallback handling was not triggered.',
    };
  }

  return {
    id: 'fallback-triggered',
    passed: false,
    summary: input.message ?? 'Fallback handling was triggered.',
    flag: createEvaluationFlag(
      'fallback_triggered',
      'warning',
      input.message ?? 'The run triggered fallback handling.',
    ),
  };
}

/**
 * Evaluates grounding and source citation presence.
 *
 * Unknown groundedness scores or citation counts are not failures, but known
 * missing citations or below-threshold scores are flagged for review.
 *
 * @param input Groundedness score, citation count, and optional threshold.
 * @returns A check result with a missing-sources flag when the check fails.
 */
export function evaluateGroundingPresence(
  input: GroundingEvaluationInput,
): EvaluationCheckResult {
  const threshold = input.threshold ?? defaultEvaluationThresholds.groundedness;
  const groundednessScore = input.groundednessScore ?? null;
  const citedSourceCount = input.citedSourceCount ?? null;
  const hasSources = citedSourceCount === null || citedSourceCount > 0;
  const meetsScore =
    groundednessScore === null || groundednessScore >= threshold;

  if (hasSources && meetsScore) {
    return {
      id: 'grounding-presence',
      passed: true,
      summary: 'Grounding and citation checks passed.',
    };
  }

  return {
    id: 'grounding-presence',
    passed: false,
    summary: 'Grounding or citation evidence was missing or below threshold.',
    flag: createEvaluationFlag(
      'missing_sources',
      'warning',
      'Grounding or citation evidence was missing or below threshold.',
    ),
  };
}

/**
 * Evaluates latency against the review threshold.
 *
 * @param input Latency value and optional threshold override.
 * @returns A check result with a latency flag when the value is too high.
 */
export function evaluateLatencyThreshold(
  input: LatencyEvaluationInput,
): EvaluationCheckResult {
  const thresholdMs =
    input.thresholdMs ?? defaultEvaluationThresholds.latencyMs;
  const latencyMs = input.latencyMs ?? null;

  if (latencyMs === null || latencyMs <= thresholdMs) {
    return {
      id: 'latency-threshold',
      passed: true,
      summary:
        latencyMs === null
          ? 'Latency was not recorded.'
          : `Latency ${latencyMs}ms stayed within threshold ${thresholdMs}ms.`,
    };
  }

  return {
    id: 'latency-threshold',
    passed: false,
    summary: `Latency ${latencyMs}ms exceeded threshold ${thresholdMs}ms.`,
    flag: createEvaluationFlag(
      'latency_exceeded',
      'warning',
      `Latency ${latencyMs}ms exceeded the review threshold.`,
    ),
  };
}

/**
 * Classifies estimated cost into unknown, normal, or review bands.
 *
 * @param input Estimated cost and optional review threshold override.
 * @returns Cost band details with the normalized threshold and summary.
 */
export function bandEstimatedCost(
  input: EstimatedCostBandInput,
): EstimatedCostBandResult {
  const reviewThresholdUsd =
    input.reviewThresholdUsd ?? defaultEvaluationThresholds.estimatedCostUsd;
  const estimatedCostUsd = input.estimatedCostUsd ?? null;

  if (estimatedCostUsd === null) {
    return {
      band: 'unknown',
      estimatedCostUsd,
      reviewThresholdUsd,
      summary: 'Estimated cost was not recorded.',
    };
  }

  if (estimatedCostUsd > reviewThresholdUsd) {
    return {
      band: 'review',
      estimatedCostUsd,
      reviewThresholdUsd,
      summary: `Estimated cost ${estimatedCostUsd.toFixed(4)} USD exceeded review threshold ${reviewThresholdUsd.toFixed(4)} USD.`,
    };
  }

  return {
    band: 'normal',
    estimatedCostUsd,
    reviewThresholdUsd,
    summary: `Estimated cost ${estimatedCostUsd.toFixed(4)} USD stayed within review threshold ${reviewThresholdUsd.toFixed(4)} USD.`,
  };
}

/**
 * Deduplicates evaluation flags by type while keeping highest severity.
 *
 * Results and raw flags can be mixed; nullish values and passed checks without
 * flags are ignored.
 *
 * @param inputs Evaluation check results, raw flags, or empty values.
 * @returns One flag per type, preserving the most severe flag seen.
 */
export function aggregateEvaluationFlags(
  inputs: readonly (
    | EvaluationCheckResult
    | EvaluationFlag
    | null
    | undefined
  )[],
): EvaluationFlag[] {
  const flagsByType = new Map<EvaluationFlagType, EvaluationFlag>();

  for (const input of inputs) {
    const flag = normalizeFlagInput(input);

    if (!flag) {
      continue;
    }

    const existingFlag = flagsByType.get(flag.type);

    if (
      !existingFlag ||
      severityRank(flag.severity) > severityRank(existingFlag.severity)
    ) {
      flagsByType.set(flag.type, flag);
    }
  }

  return [...flagsByType.values()];
}

/**
 * Determines whether a run should appear in flagged-run views.
 *
 * @param input Evaluation status, policy state, fallback state, and score.
 * @returns True when any review or failure signal is present.
 */
export function isFlaggedRun(input: FlaggedRunCriteriaInput): boolean {
  return (
    input.evaluationStatus !== 'passed' ||
    !input.schemaValid ||
    !input.policyPass ||
    input.fallbackTriggered ||
    Boolean(input.flags?.length) ||
    (input.score !== null &&
      input.score !== undefined &&
      input.score < defaultEvaluationThresholds.confidence)
  );
}

/**
 * Builds the flagged-run summary used by evaluation surfaces.
 *
 * @param run Run record that supplies project, status, and telemetry fields.
 * @param evaluation Optional evaluation record that overrides run signals.
 * @returns A summary of flag state, reasons, severity, and display text.
 */
export function summarizeFlaggedRun(
  run: RunRecord,
  evaluation?: EvaluationRecord | null,
): FlaggedRunSummary {
  const flags = aggregateEvaluationFlags(evaluation?.flags ?? []);
  const evaluationStatus = evaluation?.status ?? run.evaluationStatus;
  const fallbackTriggered =
    evaluation?.fallbackTriggered ?? run.fallbackTriggered ?? false;
  const score = evaluation?.score ?? null;
  const flagged = evaluation
    ? isFlaggedRun({
        evaluationStatus,
        schemaValid: evaluation.schemaValid,
        policyPass: evaluation.policyPass,
        fallbackTriggered,
        flags,
        score,
      })
    : fallbackTriggered || evaluationStatus !== 'passed';

  return {
    runId: run.id,
    projectId: run.projectId,
    evaluationStatus,
    flagged,
    reasons: flags.map((flag) => flag.type),
    highestSeverity: highestFlagSeverity(flags),
    fallbackTriggered,
    score,
    confidence: run.confidence ?? null,
    latencyMs: run.latencyMs ?? null,
    summary: evaluation?.summary ?? run.summary,
  };
}

/**
 * Derives the aggregate evaluation status from core checks.
 *
 * @param input Schema, policy, score, and fallback inputs to evaluate.
 * @returns Failed, warning, or passed status for the evaluation record.
 */
export function deriveEvaluationStatus(
  input: EvaluationStatusInput,
): EvaluationStatus {
  if (!input.schemaValid || !input.policyPass || input.score < 0.5) {
    return 'failed';
  }

  if (
    input.fallbackTriggered ||
    input.score < defaultEvaluationThresholds.confidence
  ) {
    return 'warning';
  }

  return 'passed';
}

/**
 * Builds a dashboard summary for a run and optional evaluation.
 *
 * @param run Run record that supplies status, telemetry, and fallback state.
 * @param evaluation Optional evaluation record that supplies score and flags.
 * @returns Dashboard-ready run metrics and summary text.
 */
export function summarizeRunForDashboard(
  run: RunRecord,
  evaluation?: EvaluationRecord | null,
): RunDashboardSummary {
  const flags = evaluation?.flags ?? [];

  return {
    runId: run.id,
    projectId: run.projectId,
    status: run.status,
    evaluationStatus: evaluation?.status ?? run.evaluationStatus,
    score: evaluation?.score ?? null,
    confidence: run.confidence ?? null,
    latencyMs: run.latencyMs ?? null,
    estimatedCostUsd: run.estimatedCostUsd ?? null,
    fallbackTriggered:
      evaluation?.fallbackTriggered ?? run.fallbackTriggered ?? false,
    flagCount: flags.length,
    flags,
    summary: evaluation?.summary ?? run.summary,
  };
}

/**
 * Creates an evaluation flag value.
 *
 * @param type Flag category to report.
 * @param severity Review severity associated with the flag.
 * @param message Human-readable explanation for the flag.
 * @returns The normalized evaluation flag.
 */
function createEvaluationFlag(
  type: EvaluationFlagType,
  severity: EvaluationFlagSeverity,
  message: string,
): EvaluationFlag {
  return {
    type,
    severity,
    message,
  };
}

/**
 * Extracts a flag from a raw flag or check result.
 *
 * @param input Evaluation check result, raw flag, or empty value.
 * @returns The contained flag, or null when no flag is present.
 */
function normalizeFlagInput(
  input: EvaluationCheckResult | EvaluationFlag | null | undefined,
): EvaluationFlag | null {
  if (!input) {
    return null;
  }

  if ('type' in input) {
    return input;
  }

  return input.flag ?? null;
}

/**
 * Converts flag severity into an ordering rank.
 *
 * @param severity Severity label to rank.
 * @returns Numeric rank where critical is highest and info is lowest.
 */
function severityRank(severity: EvaluationFlagSeverity): number {
  if (severity === 'critical') {
    return 3;
  }

  if (severity === 'warning') {
    return 2;
  }

  return 1;
}

/**
 * Finds the highest severity present in a flag list.
 *
 * @param flags Flags to scan for severity.
 * @returns The highest severity, or null when the list is empty.
 */
function highestFlagSeverity(
  flags: readonly EvaluationFlag[],
): EvaluationFlagSeverity | null {
  let highestSeverity: EvaluationFlagSeverity | null = null;

  for (const flag of flags) {
    if (
      !highestSeverity ||
      severityRank(flag.severity) > severityRank(highestSeverity)
    ) {
      highestSeverity = flag.severity;
    }
  }

  return highestSeverity;
}
