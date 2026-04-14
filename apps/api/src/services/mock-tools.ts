import type {
  AccountProfileLookupRequest,
  AccountProfileRecord,
  CustomerProfileLookupRequest,
  CustomerProfileRecord,
  EscalationCreatePlaceholderRequest,
  EscalationPreviewRecord,
  EventTimelineRequest,
  PaymentCaseLookupRequest,
  PolicySearchMatch,
  PolicySearchRequest,
  TimelineEventRecord,
} from '@portfolio-tq/types';

import { NotFoundError } from '../errors/api-error.js';
import {
  buildEscalationPreview,
  getAccountProfileById,
  getCustomerProfileById,
  getUserById,
  listTimelineEvents,
} from '../repositories/mock-tool-repository.js';
import { listPaymentCases, listSeedDocuments } from './seed-data.js';

export async function lookupCustomerProfile(
  payload: CustomerProfileLookupRequest,
): Promise<CustomerProfileRecord> {
  const customerProfile = await getCustomerProfileById(payload.customerId);

  if (!customerProfile) {
    throw new NotFoundError(
      'not_found',
      'No customer profile was found for the requested customer ID.',
      {
        customerId: payload.customerId,
      },
    );
  }

  return customerProfile;
}

export async function lookupPaymentCase(payload: PaymentCaseLookupRequest) {
  const paymentCases = await listPaymentCases({
    projectId: 'payment-exception-review',
  });
  const paymentCase = paymentCases.find(
    (seedCase) => seedCase.id === payload.caseId,
  );

  if (!paymentCase) {
    throw new NotFoundError(
      'not_found',
      'No payment case was found for the requested case ID.',
      {
        caseId: payload.caseId,
      },
    );
  }

  return paymentCase;
}

export async function lookupAccountProfile(
  payload: AccountProfileLookupRequest,
): Promise<AccountProfileRecord> {
  const accountProfile = await getAccountProfileById(payload.accountId);

  if (!accountProfile) {
    throw new NotFoundError(
      'not_found',
      'No account profile was found for the requested account ID.',
      {
        accountId: payload.accountId,
      },
    );
  }

  return accountProfile;
}

export async function searchPolicyDocuments(
  payload: PolicySearchRequest,
): Promise<PolicySearchMatch[]> {
  const documents = await listSeedDocuments({
    projectId: payload.projectId,
    limit: payload.limit ?? 10,
  });
  const normalizedQuery = payload.query.trim().toLowerCase();

  return documents
    .map((document) => ({
      id: document.id,
      projectId: document.projectId,
      title: document.title,
      kind: document.kind,
      summary: document.summary,
      score: calculatePolicyScore(document, normalizedQuery),
    }))
    .filter((match) => match.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, payload.limit ?? 5);
}

export async function lookupEventTimeline(
  payload: EventTimelineRequest,
): Promise<TimelineEventRecord[]> {
  return listTimelineEvents(
    payload.projectId,
    payload.entityId,
    payload.limit ?? 10,
  );
}

export async function createEscalationPlaceholder(
  payload: EscalationCreatePlaceholderRequest,
): Promise<EscalationPreviewRecord> {
  const ownerId = payload.ownerId ?? 'user-reviewer-dev';
  const owner = await getUserById(ownerId);

  if (!owner) {
    throw new NotFoundError(
      'not_found',
      'No reviewer was found for the requested escalation owner.',
      {
        ownerId,
      },
    );
  }

  return buildEscalationPreview({
    ...payload,
    ownerId: owner.id,
  });
}

function calculatePolicyScore(
  document: {
    title: string;
    summary: string;
    kind: PolicySearchMatch['kind'];
  },
  normalizedQuery: string,
): number {
  const searchableTitle = document.title.toLowerCase();
  const searchableSummary = document.summary.toLowerCase();
  let score = 0;

  if (searchableTitle.includes(normalizedQuery)) {
    score += 1;
  }

  if (searchableSummary.includes(normalizedQuery)) {
    score += 0.75;
  }

  if (document.kind === 'policy') {
    score += 0.25;
  }

  return Number(score.toFixed(2));
}
