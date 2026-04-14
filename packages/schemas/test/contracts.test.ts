import assert from 'node:assert/strict';
import test from 'node:test';

import {
  evaluationRecordSchema,
  seedDataGroupDescriptorSchema,
  seedDocumentSchema,
  toolInvocationRecordSchema,
} from '../src/index.ts';

test('critical record schemas accept valid shared contracts', () => {
  assert.equal(
    evaluationRecordSchema.safeParse({
      id: 'eval-test-001',
      projectId: 'payment-exception-review',
      runId: 'run-test-001',
      status: 'warning',
      createdAt: '2026-04-14T12:00:00.000Z',
      score: 0.74,
      schemaValid: true,
      policyPass: true,
      fallbackTriggered: true,
      flags: [
        {
          type: 'fallback_triggered',
          severity: 'warning',
          message: 'Fallback was triggered.',
        },
      ],
      groundednessScore: 0.71,
      notes: 'Evaluation generated a review signal.',
      summary: 'Evaluation stayed valid but triggered fallback.',
    }).success,
    true,
  );

  assert.equal(
    toolInvocationRecordSchema.safeParse({
      id: 'tool-test-001',
      projectId: 'payment-exception-review',
      runId: 'run-test-001',
      toolName: 'policy-search',
      inputSummary: 'Searched seeded policy docs.',
      outputSummary: 'Returned one policy match.',
      success: true,
      durationMs: 32,
      createdAt: '2026-04-14T12:00:00.000Z',
      status: 'completed',
      startedAt: '2026-04-14T12:00:00.000Z',
      completedAt: '2026-04-14T12:00:00.032Z',
      latencyMs: 32,
      summary: 'Policy search completed.',
    }).success,
    true,
  );
});

test('seed schemas enforce supported seed descriptors and documents', () => {
  assert.equal(
    seedDataGroupDescriptorSchema.safeParse({
      id: 'payment-cases',
      recordKind: 'case',
      source: 'file_seed',
      projectId: 'payment-exception-review',
      caseGroup: 'payment',
    }).success,
    true,
  );

  assert.equal(
    seedDocumentSchema.safeParse({
      id: 'doc-test-001',
      projectId: 'investing-ops-copilot',
      title: 'Investing ops policy',
      kind: 'policy',
      createdAt: '2026-04-14T12:00:00.000Z',
      updatedAt: '2026-04-14T12:00:00.000Z',
      status: 'active',
      summary: 'Seeded policy document.',
    }).success,
    true,
  );

  assert.equal(
    seedDataGroupDescriptorSchema.safeParse({
      id: 'unknown-cases',
      recordKind: 'case',
      source: 'file_seed',
    }).success,
    false,
  );
});
