import {
  parseLegacyAdapterInput,
  parsePaymentReviewDemoRequest,
} from '@portfolio-tq/schemas';
import { portfolioAgents } from '@portfolio-tq/agents';
import type {
  LegacyAdapterDemoResponseData,
  LegacyAdapterSampleListResponseData,
  PaymentReviewDemoResponseData,
} from '@portfolio-tq/types';

import type { AppContext } from '../app/context.js';
import type { RequestContext } from '../lib/http.js';
import { readJsonBody, sendSuccess } from '../lib/http.js';
import { assertValid } from '../lib/validation.js';
import {
  listLegacyAdapterSamples,
  runLegacyAdapterDemo,
} from '../services/demos/legacy-adapter.js';
import { runPaymentReviewDemo } from '../services/demos/payment-review.js';

export async function handlePaymentReviewRun(
  context: RequestContext,
  app: AppContext,
): Promise<void> {
  const rawPayload = await readJsonBody<Record<string, unknown>>(
    context.request,
  );
  const payload = assertValid(parsePaymentReviewDemoRequest(rawPayload), {
    code: 'invalid_request',
    message:
      'Payment review requests accept optional string values for caseId and note.',
  });

  const demoResult = await runPaymentReviewDemo({
    requestId: context.requestId,
    payload,
    environment: app.config.environment,
    firestore: app.firestore,
    logger: app.logger,
  });

  sendSuccess(
    context.response,
    200,
    {
      run: demoResult.run,
      evaluation: demoResult.evaluation,
      escalation: demoResult.escalation ?? null,
      result: demoResult.result,
      agentCount: portfolioAgents.length,
    } satisfies PaymentReviewDemoResponseData,
    context.requestId,
  );
}

export async function handleLegacyAdapterRun(
  context: RequestContext,
  app: AppContext,
): Promise<void> {
  const rawPayload = await readJsonBody<Record<string, unknown>>(
    context.request,
  );
  const payload = assertValid(parseLegacyAdapterInput(rawPayload), {
    code: 'invalid_request',
    message:
      'Legacy adapter requests require non-empty sourceText and optional supported workflowType or metadata values.',
  });

  const demoResult = await runLegacyAdapterDemo({
    requestId: context.requestId,
    payload,
    environment: app.config.environment,
    firestore: app.firestore,
    logger: app.logger,
  });

  sendSuccess(
    context.response,
    200,
    {
      run: demoResult.run,
      evaluation: demoResult.evaluation,
      escalation: demoResult.escalation,
      toolInvocations: demoResult.toolInvocations,
      result: demoResult.result,
      trace: demoResult.trace,
      agentCount: portfolioAgents.length,
    } satisfies LegacyAdapterDemoResponseData,
    context.requestId,
  );
}

export async function handleLegacyAdapterSamples(
  context: RequestContext,
): Promise<void> {
  const samples = await listLegacyAdapterSamples();

  sendSuccess(
    context.response,
    200,
    samples satisfies LegacyAdapterSampleListResponseData,
    context.requestId,
  );
}
