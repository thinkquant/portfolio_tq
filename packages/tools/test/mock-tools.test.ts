import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildEscalationPreview,
  createEscalationPlaceholder,
  lookupEventTimeline,
  lookupPaymentCase,
  policySearchResponseSchema,
  searchPolicyDocuments,
  toolContracts,
  toolContractsById,
} from '../src/index.ts';

test('tool contracts expose stable IDs and schemas', () => {
  assert.equal(toolContracts.length, 6);
  assert.equal(toolContractsById['policy-search'].name, 'Policy search');
  assert.equal(
    toolContracts.every(
      (contract) => contract.inputSchema && contract.outputSchema,
    ),
    true,
  );
});

test('deterministic policy search returns stable schema-valid results', () => {
  const matches = searchPolicyDocuments(
    {
      projectId: 'payment-exception-review',
      query: 'payment review',
      limit: 5,
    },
    {
      documents: [
        {
          id: 'doc-policy-a',
          projectId: 'payment-exception-review',
          title: 'Payment review policy',
          kind: 'policy',
          createdAt: '2026-04-14T12:00:00.000Z',
          updatedAt: '2026-04-14T12:00:00.000Z',
          status: 'active',
          summary: 'Payment review guidance for operators.',
        },
        {
          id: 'doc-brief-b',
          projectId: 'payment-exception-review',
          title: 'Escalation brief',
          kind: 'brief',
          createdAt: '2026-04-14T12:00:00.000Z',
          updatedAt: '2026-04-14T12:00:00.000Z',
          status: 'active',
          summary: 'Brief for payment review fallback.',
        },
      ],
    },
  );

  assert.deepEqual(
    matches.map((match) => match.id),
    ['doc-policy-a', 'doc-brief-b'],
  );
  assert.equal(
    policySearchResponseSchema.safeParse({ matches, count: 2 }).success,
    true,
  );
  assert.equal(
    matches.every((match) => match.score <= 1),
    true,
  );
});

test('lookup helpers are repeatable for seeded cases and timelines', () => {
  const paymentCase = lookupPaymentCase(
    { caseId: 'case-a' },
    {
      paymentCases: [
        {
          id: 'case-a',
          projectId: 'payment-exception-review',
          title: 'Payment case A',
          queue: 'payments',
          priority: 'high',
          status: 'open',
          createdAt: '2026-04-14T12:00:00.000Z',
          updatedAt: '2026-04-14T12:00:00.000Z',
          summary: 'Seeded payment case.',
        },
      ],
    },
  );

  assert.equal(paymentCase?.id, 'case-a');

  const events = lookupEventTimeline(
    {
      projectId: 'payment-exception-review',
      entityId: 'case-a',
    },
    {
      timelineEvents: [
        {
          id: 'event-b',
          projectId: 'payment-exception-review',
          entityId: 'case-a',
          timestamp: '2026-04-14T12:01:00.000Z',
          category: 'note',
          summary: 'Second event.',
        },
        {
          id: 'event-a',
          projectId: 'payment-exception-review',
          entityId: 'case-a',
          timestamp: '2026-04-14T12:00:00.000Z',
          category: 'created',
          summary: 'First event.',
        },
      ],
    },
  );

  assert.deepEqual(
    events.map((event) => event.id),
    ['event-a', 'event-b'],
  );
});

test('escalation placeholders are deterministic and require seeded owners', () => {
  const payload = {
    projectId: 'payment-exception-review' as const,
    runId: 'run-a',
    ownerId: 'user-reviewer-dev',
    reason: 'Fallback triggered.',
  };

  assert.deepEqual(
    buildEscalationPreview(payload),
    buildEscalationPreview(payload),
  );
  assert.equal(
    createEscalationPlaceholder(payload, {
      users: [
        {
          id: 'user-reviewer-dev',
          displayName: 'Reviewer',
          role: 'reviewer',
          environment: 'dev',
          createdAt: '2026-04-14T12:00:00.000Z',
        },
      ],
    })?.ownerId,
    'user-reviewer-dev',
  );
  assert.equal(createEscalationPlaceholder(payload, { users: [] }), null);
});
