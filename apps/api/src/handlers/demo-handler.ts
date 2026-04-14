import { parsePaymentReviewDemoRequest } from '@portfolio-tq/schemas';
import { portfolioAgents } from '@portfolio-tq/agents';
import type { PaymentReviewDemoResponseData } from '@portfolio-tq/types';

import type { AppContext } from '../app/context.js';
import type { RequestContext } from '../lib/http.js';
import { readJsonBody, sendSuccess } from '../lib/http.js';
import { assertValid } from '../lib/validation.js';
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
