import {
  parseAccountProfileLookupRequest,
  parseCustomerProfileLookupRequest,
  parseEscalationCreatePlaceholderRequest,
  parseEventTimelineRequest,
  parsePaymentCaseLookupRequest,
  parsePolicySearchRequest,
} from '@portfolio-tq/schemas';
import type {
  AccountProfileLookupResponseData,
  CustomerProfileLookupResponseData,
  EscalationCreatePlaceholderResponseData,
  EventTimelineResponseData,
  PaymentCaseLookupResponseData,
  PolicySearchResponseData,
} from '@portfolio-tq/types';

import type { RequestContext } from '../lib/http.js';
import { readJsonBody, sendSuccess } from '../lib/http.js';
import { assertValid } from '../lib/validation.js';
import {
  createEscalationPlaceholder,
  lookupAccountProfile,
  lookupCustomerProfile,
  lookupEventTimeline,
  lookupPaymentCase,
  searchPolicyDocuments,
} from '../services/mock-tools.js';

export async function handleLookupCustomerProfile(
  context: RequestContext,
): Promise<void> {
  const rawPayload = await readJsonBody<Record<string, unknown>>(
    context.request,
  );
  const payload = assertValid(parseCustomerProfileLookupRequest(rawPayload), {
    code: 'invalid_request',
    message:
      'Customer profile lookup requires a non-empty customerId in the request body.',
  });
  const customerProfile = await lookupCustomerProfile(payload);

  sendSuccess(
    context.response,
    200,
    { customerProfile } satisfies CustomerProfileLookupResponseData,
    context.requestId,
  );
}

export async function handleLookupPaymentCase(
  context: RequestContext,
): Promise<void> {
  const rawPayload = await readJsonBody<Record<string, unknown>>(
    context.request,
  );
  const payload = assertValid(parsePaymentCaseLookupRequest(rawPayload), {
    code: 'invalid_request',
    message:
      'Payment case lookup requires a non-empty caseId in the request body.',
  });
  const paymentCase = await lookupPaymentCase(payload);

  sendSuccess(
    context.response,
    200,
    { paymentCase } satisfies PaymentCaseLookupResponseData,
    context.requestId,
  );
}

export async function handleLookupAccountProfile(
  context: RequestContext,
): Promise<void> {
  const rawPayload = await readJsonBody<Record<string, unknown>>(
    context.request,
  );
  const payload = assertValid(parseAccountProfileLookupRequest(rawPayload), {
    code: 'invalid_request',
    message:
      'Account profile lookup requires a non-empty accountId in the request body.',
  });
  const accountProfile = await lookupAccountProfile(payload);

  sendSuccess(
    context.response,
    200,
    { accountProfile } satisfies AccountProfileLookupResponseData,
    context.requestId,
  );
}

export async function handleSearchPolicy(
  context: RequestContext,
): Promise<void> {
  const rawPayload = await readJsonBody<Record<string, unknown>>(
    context.request,
  );
  const payload = assertValid(parsePolicySearchRequest(rawPayload), {
    code: 'invalid_request',
    message:
      'Policy search requires a supported projectId, a non-empty query, and an optional positive numeric limit.',
  });
  const matches = await searchPolicyDocuments(payload);

  sendSuccess(
    context.response,
    200,
    {
      matches,
      count: matches.length,
    } satisfies PolicySearchResponseData,
    context.requestId,
  );
}

export async function handleLookupEventTimeline(
  context: RequestContext,
): Promise<void> {
  const rawPayload = await readJsonBody<Record<string, unknown>>(
    context.request,
  );
  const payload = assertValid(parseEventTimelineRequest(rawPayload), {
    code: 'invalid_request',
    message:
      'Event timeline lookup requires a supported projectId, a non-empty entityId, and an optional positive numeric limit.',
  });
  const events = await lookupEventTimeline(payload);

  sendSuccess(
    context.response,
    200,
    {
      events,
      count: events.length,
    } satisfies EventTimelineResponseData,
    context.requestId,
  );
}

export async function handleCreateEscalationPlaceholder(
  context: RequestContext,
): Promise<void> {
  const rawPayload = await readJsonBody<Record<string, unknown>>(
    context.request,
  );
  const payload = assertValid(
    parseEscalationCreatePlaceholderRequest(rawPayload),
    {
      code: 'invalid_request',
      message:
        'Escalation placeholder creation requires a supported projectId plus a non-empty reason.',
    },
  );
  const escalation = await createEscalationPlaceholder(payload);

  sendSuccess(
    context.response,
    200,
    { escalation } satisfies EscalationCreatePlaceholderResponseData,
    context.requestId,
  );
}
