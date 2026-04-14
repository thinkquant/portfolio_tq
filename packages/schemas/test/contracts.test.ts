import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  evaluationRecordSchema,
  legacyAdapterOutputSchema,
  legacyAdapterSampleCaseSchema,
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

test('legacy adapter schemas accept the strengthened output contract', () => {
  assert.equal(
    legacyAdapterOutputSchema.safeParse({
      normalizedInput: {
        workflowType: 'beneficiary_change',
        requesterName: 'Nora Patel',
        accountId: 'AC-20418',
        requestSummary: 'Update the primary beneficiary to Liam Patel.',
        effectiveDate: '2026-04-18',
        amountUsd: null,
        targetEntity: 'Liam Patel',
        sourceChannel: 'ops_portal',
      },
      legacyPayload: {
        legacyWorkflowCode: 'BENE_CHG',
        legacyAccountId: 'AC-20418',
        operatorDisplayName: 'Nora Patel',
        normalizedSummary:
          'Update beneficiary to Liam Patel effective 2026-04-18.',
        effectiveDate: '2026-04-18',
        amountCents: null,
        reviewCode: 'auto_accept',
      },
      legacySubmissionStatus: 'accepted',
      validationIssues: [],
      suggestedNextStep: 'Submit directly to the beneficiary change queue.',
      confidence: 0.97,
      humanReviewRequired: false,
    }).success,
    true,
  );

  assert.equal(
    legacyAdapterOutputSchema.safeParse({
      normalizedInput: {
        workflowType: 'beneficiary_change',
        requesterName: 'Nora Patel',
        accountId: 'AC-20418',
        requestSummary: 'Update the primary beneficiary to Liam Patel.',
        effectiveDate: '2026-04-18',
        amountUsd: null,
        targetEntity: 'Liam Patel',
        sourceChannel: 'ops_portal',
      },
      legacySubmissionStatus: 'accepted',
      validationIssues: [],
      suggestedNextStep: 'Submit directly to the beneficiary change queue.',
      confidence: 0.97,
    }).success,
    false,
  );
});

test('legacy adapter sample fixtures stay aligned with shared schemas', async () => {
  const fileUrl = new URL(
    '../../../data/seed/legacy-cases/intake-examples.json',
    import.meta.url,
  );
  const content = await readFile(fileUrl, 'utf8');
  const samples = JSON.parse(content) as unknown[];

  assert.equal(samples.length >= 4, true);

  for (const sample of samples) {
    assert.equal(legacyAdapterSampleCaseSchema.safeParse(sample).success, true);
  }
});
