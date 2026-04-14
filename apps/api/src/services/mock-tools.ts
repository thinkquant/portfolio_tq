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
import {
  createEscalationPlaceholder as createSharedEscalationPlaceholder,
  lookupAccountProfile as lookupSharedAccountProfile,
  lookupCustomerProfile as lookupSharedCustomerProfile,
  lookupEventTimeline as lookupSharedEventTimeline,
  lookupPaymentCase as lookupSharedPaymentCase,
  searchPolicyDocuments as searchSharedPolicyDocuments,
} from '@portfolio-tq/tools';

import { NotFoundError } from '../errors/api-error.js';
import {
  listAccountProfiles,
  listCustomerProfiles,
  listTimelineEventRecords,
  listUsers,
} from '../repositories/mock-tool-repository.js';
import { listPaymentCases, listSeedDocuments } from './seed-data.js';

export async function lookupCustomerProfile(
  payload: CustomerProfileLookupRequest,
): Promise<CustomerProfileRecord> {
  const customerProfiles = await listCustomerProfiles();
  const customerProfile = lookupSharedCustomerProfile(payload, {
    customerProfiles,
  });

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
  const paymentCase = lookupSharedPaymentCase(payload, { paymentCases });

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
  const accountProfiles = await listAccountProfiles();
  const accountProfile = lookupSharedAccountProfile(payload, {
    accountProfiles,
  });

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

  return searchSharedPolicyDocuments(payload, { documents });
}

export async function lookupEventTimeline(
  payload: EventTimelineRequest,
): Promise<TimelineEventRecord[]> {
  const timelineEvents = await listTimelineEventRecords();

  return lookupSharedEventTimeline(payload, { timelineEvents });
}

export async function createEscalationPlaceholder(
  payload: EscalationCreatePlaceholderRequest,
): Promise<EscalationPreviewRecord> {
  const users = await listUsers();
  const ownerId = payload.ownerId ?? 'user-reviewer-dev';
  const escalation = createSharedEscalationPlaceholder(payload, { users });

  if (!escalation) {
    throw new NotFoundError(
      'not_found',
      'No reviewer was found for the requested escalation owner.',
      {
        ownerId,
      },
    );
  }

  return escalation;
}
