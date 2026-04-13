import { portfolioAgents } from '@portfolio-tq/agents';

import type { AppContext } from '../app/context.js';
import { ValidationError } from '../errors/api-error.js';
import type { RequestContext } from '../lib/http.js';
import { readJsonBody, sendSuccess } from '../lib/http.js';
import {
  runPaymentReviewDemo,
  type DemoRequestPayload,
} from '../services/demos/payment-review.js';

export async function handlePaymentReviewRun(
  context: RequestContext,
  app: AppContext,
): Promise<void> {
  const payload = await readJsonBody<DemoRequestPayload>(context.request);

  if (
    (payload.caseId !== undefined && typeof payload.caseId !== 'string') ||
    (payload.note !== undefined && typeof payload.note !== 'string')
  ) {
    throw new ValidationError(
      'invalid_request',
      'Payment review requests accept optional string values for caseId and note.',
      {
        caseIdType: typeof payload.caseId,
        noteType: typeof payload.note,
      },
    );
  }

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
    },
    context.requestId,
  );
}
