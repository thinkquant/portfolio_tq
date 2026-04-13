import type { Firestore } from '@google-cloud/firestore';
import { createDemoRun } from '@portfolio-tq/schemas';
import type {
  Environment,
  EscalationRecord,
  EvaluationRecord,
  RunRecord,
  ToolInvocationRecord,
} from '@portfolio-tq/types';

import type { Logger } from '../logs.js';
import { persistDemoRun } from '../observability.js';

export type DemoRequestPayload = {
  caseId?: string;
  note?: string;
};

export type PaymentReviewDemoResult = {
  run: RunRecord;
  evaluation: EvaluationRecord;
  toolInvocations: ToolInvocationRecord[];
  escalation?: EscalationRecord;
  result: {
    decision: string;
    summary: string;
    note: string;
  };
};

function maybeEscalate(payload: DemoRequestPayload): boolean {
  return (
    payload.caseId === 'case-payment-bootstrap-002' ||
    payload.note?.toLowerCase().includes('escalate') === true
  );
}

export async function runPaymentReviewDemo(config: {
  requestId: string;
  payload: DemoRequestPayload;
  environment: Environment;
  firestore: Firestore | null;
  logger: Logger;
}): Promise<PaymentReviewDemoResult> {
  const baseRun = createDemoRun('payment-exception-review', 'completed');
  const requiresEscalation = maybeEscalate(config.payload);
  const startedAt = new Date();
  const promptVersionId = 'prompt-payment-v1';
  const toolLatencyA = 184;
  const toolLatencyB = 267;
  const totalLatency = baseRun.latencyMs ?? toolLatencyA + toolLatencyB + 969;
  const finishedAt = new Date(startedAt.getTime() + totalLatency);
  const confidence = requiresEscalation ? 0.74 : (baseRun.confidence ?? 0.98);
  const estimatedCostUsd = requiresEscalation
    ? 0.0031
    : (baseRun.estimatedCostUsd ?? 0.0024);
  const status = requiresEscalation ? 'escalated' : 'completed';
  const evaluationStatus = requiresEscalation ? 'warning' : 'passed';

  const run: RunRecord = {
    ...baseRun,
    status,
    inputRef: config.payload.caseId ?? 'case-payment-bootstrap-001',
    outputRef: `payment-output-${baseRun.id}`,
    confidence,
    latencyMs: totalLatency,
    estimatedCostUsd,
    promptVersionId,
    createdAt: startedAt.toISOString(),
    updatedAt: finishedAt.toISOString(),
    environment: config.environment,
    summary: requiresEscalation
      ? 'Payment exception run completed with fallback handling and reviewer escalation.'
      : 'Payment exception run completed with deterministic approval guidance.',
    evaluationStatus,
    fallbackTriggered: requiresEscalation,
    escalated: requiresEscalation,
    toolInvocationCount: requiresEscalation ? 3 : 2,
  };

  const toolInvocations: ToolInvocationRecord[] = [
    {
      id: `${run.id}-tool-case-loader`,
      projectId: run.projectId,
      runId: run.id,
      toolName: 'case-loader',
      status: 'completed',
      startedAt: new Date(startedAt.getTime() + 40).toISOString(),
      completedAt: new Date(
        startedAt.getTime() + 40 + toolLatencyA,
      ).toISOString(),
      latencyMs: toolLatencyA,
      summary: 'Loaded payment case context for the exception review workflow.',
    },
    {
      id: `${run.id}-tool-policy-search`,
      projectId: run.projectId,
      runId: run.id,
      toolName: 'policy-search',
      status: 'completed',
      startedAt: new Date(startedAt.getTime() + 310).toISOString(),
      completedAt: new Date(
        startedAt.getTime() + 310 + toolLatencyB,
      ).toISOString(),
      latencyMs: toolLatencyB,
      summary: 'Retrieved synthetic payment review policy guidance.',
    },
  ];

  if (requiresEscalation) {
    toolInvocations.push({
      id: `${run.id}-tool-review-router`,
      projectId: run.projectId,
      runId: run.id,
      toolName: 'review-router',
      status: 'completed',
      startedAt: new Date(startedAt.getTime() + 650).toISOString(),
      completedAt: new Date(startedAt.getTime() + 770).toISOString(),
      latencyMs: 120,
      summary:
        'Routed the run to reviewer follow-up because fallback handling was triggered.',
    });
  }

  const evaluation: EvaluationRecord = {
    id: `${run.id}-evaluation`,
    projectId: run.projectId,
    runId: run.id,
    status: evaluationStatus,
    createdAt: finishedAt.toISOString(),
    score: requiresEscalation ? 0.74 : 0.98,
    schemaValid: true,
    fallbackTriggered: requiresEscalation,
    summary: requiresEscalation
      ? 'Schema remained valid, but the run required a reviewer escalation.'
      : 'Schema validation passed and the run remained within the approval confidence band.',
  };

  const escalation = requiresEscalation
    ? ({
        id: `${run.id}-escalation`,
        projectId: run.projectId,
        runId: run.id,
        status: 'open',
        createdAt: finishedAt.toISOString(),
        reason:
          'Conflicting payment notes triggered fallback and reviewer escalation.',
        owner: 'user-reviewer-dev',
      } satisfies EscalationRecord)
    : undefined;

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
  config.logger.runLifecycle(
    'model.requested',
    {
      requestId: config.requestId,
      projectId: run.projectId,
      runId: run.id,
      promptVersionId,
    },
    {
      caseId: run.inputRef,
    },
  );

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
    'model.completed',
    {
      requestId: config.requestId,
      projectId: run.projectId,
      runId: run.id,
      latencyMs: totalLatency,
      promptVersionId,
    },
    {
      confidence,
      estimatedCostUsd,
    },
  );
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
    },
  );

  if (requiresEscalation) {
    config.logger.runLifecycle(
      'fallback.triggered',
      {
        requestId: config.requestId,
        projectId: run.projectId,
        runId: run.id,
        promptVersionId,
      },
      {
        fallbackReason: 'conflicting-payment-notes',
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
      escalation,
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
      fallbackTriggered: requiresEscalation,
      persistedToFirestore: Boolean(config.firestore),
    },
  );

  return {
    run,
    evaluation,
    toolInvocations,
    escalation,
    result: {
      decision: requiresEscalation
        ? 'escalate-for-review'
        : 'approve-with-review-note',
      summary: requiresEscalation
        ? 'The run stayed schema-valid but triggered fallback handling and reviewer escalation.'
        : 'The run completed with deterministic approval guidance suitable for smoke verification.',
      note: config.payload.note ?? 'No custom note supplied.',
    },
  };
}
