import assert from 'node:assert/strict';
import test from 'node:test';

import {
  aggregateEvaluationFlags,
  deriveEvaluationStatus,
  evaluateConfidenceThreshold,
  evaluateFallbackTriggered,
  evaluateLatencyThreshold,
  isFlaggedRun,
  reviewFlagCategories,
  summarizeFlaggedRun,
} from '../src/index.ts';

test('evaluation helpers produce stable flags and derived statuses', () => {
  const confidence = evaluateConfidenceThreshold({
    confidence: 0.52,
    threshold: 0.7,
  });
  const fallback = evaluateFallbackTriggered({ fallbackTriggered: true });
  const latency = evaluateLatencyThreshold({
    latencyMs: 9_500,
    thresholdMs: 8_000,
  });

  const flags = aggregateEvaluationFlags([confidence, fallback, latency]);

  assert.deepEqual(
    flags.map((flag) => flag.type),
    ['low_confidence', 'fallback_triggered', 'latency_exceeded'],
  );
  assert.equal(
    deriveEvaluationStatus({
      schemaValid: true,
      policyPass: true,
      score: 0.52,
      fallbackTriggered: false,
    }),
    'warning',
  );
});

test('flagged-run vocabulary stays limited and meaningful', () => {
  assert.deepEqual(Object.keys(reviewFlagCategories).sort(), [
    'fallback_triggered',
    'latency_exceeded',
    'low_confidence',
    'missing_sources',
    'policy_review_required',
    'schema_invalid',
  ]);

  assert.equal(
    isFlaggedRun({
      evaluationStatus: 'passed',
      schemaValid: true,
      policyPass: true,
      fallbackTriggered: false,
      flags: [],
      score: 0.95,
    }),
    false,
  );
  assert.equal(
    isFlaggedRun({
      evaluationStatus: 'warning',
      schemaValid: true,
      policyPass: true,
      fallbackTriggered: true,
      flags: [{ type: 'fallback_triggered', severity: 'warning' }],
      score: 0.74,
    }),
    true,
  );
});

test('flagged run summaries expose dashboard-ready fields', () => {
  const summary = summarizeFlaggedRun(
    {
      id: 'run-a',
      projectId: 'payment-exception-review',
      status: 'completed',
      inputRef: 'case-a',
      confidence: 0.68,
      latencyMs: 9_500,
      estimatedCostUsd: 0.002,
      createdAt: '2026-04-14T12:00:00.000Z',
      updatedAt: '2026-04-14T12:00:00.000Z',
      environment: 'dev',
      summary: 'Run completed with fallback.',
      evaluationStatus: 'warning',
      fallbackTriggered: true,
      escalated: true,
      toolInvocationCount: 2,
    },
    {
      id: 'eval-a',
      projectId: 'payment-exception-review',
      runId: 'run-a',
      status: 'warning',
      createdAt: '2026-04-14T12:00:00.000Z',
      score: 0.68,
      schemaValid: true,
      policyPass: true,
      fallbackTriggered: true,
      flags: [{ type: 'fallback_triggered', severity: 'warning' }],
      groundednessScore: 0.9,
      notes: 'Fallback triggered.',
      summary: 'Evaluation warning.',
    },
  );

  assert.equal(summary.flagged, true);
  assert.equal(summary.highestSeverity, 'warning');
  assert.deepEqual(summary.reasons, ['fallback_triggered']);
});
