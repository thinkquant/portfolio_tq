import { readFile } from 'node:fs/promises';

import type {
  AccountProfileRecord,
  CustomerProfileRecord,
  ProjectId,
  TimelineEventRecord,
  UserRecord,
} from '@portfolio-tq/types';

const customerProfilesFileUrl = new URL(
  '../../../../data/seed/customer-profiles/customer-profiles.json',
  import.meta.url,
);
const accountProfilesFileUrl = new URL(
  '../../../../data/seed/account-profiles/account-profiles.json',
  import.meta.url,
);
const timelineEventsFileUrl = new URL(
  '../../../../data/seed/event-timelines/events.json',
  import.meta.url,
);
const usersFileUrl = new URL(
  '../../../../data/seed/users/users.json',
  import.meta.url,
);

let customerProfilesCache: Promise<CustomerProfileRecord[]> | null = null;
let accountProfilesCache: Promise<AccountProfileRecord[]> | null = null;
let timelineEventsCache: Promise<TimelineEventRecord[]> | null = null;
let usersCache: Promise<UserRecord[]> | null = null;

export async function getCustomerProfileById(
  customerId: string,
): Promise<CustomerProfileRecord | null> {
  const customerProfiles = await listCustomerProfiles();

  return customerProfiles.find((profile) => profile.id === customerId) ?? null;
}

export async function listCustomerProfiles(): Promise<CustomerProfileRecord[]> {
  return loadCustomerProfiles();
}

export async function getAccountProfileById(
  accountId: string,
): Promise<AccountProfileRecord | null> {
  const accountProfiles = await listAccountProfiles();

  return accountProfiles.find((profile) => profile.id === accountId) ?? null;
}

export async function listAccountProfiles(): Promise<AccountProfileRecord[]> {
  return loadAccountProfiles();
}

export async function listTimelineEvents(
  projectId: ProjectId,
  entityId: string,
  limit = 10,
): Promise<TimelineEventRecord[]> {
  const timelineEvents = await listTimelineEventRecords();

  return timelineEvents
    .filter(
      (timelineEvent) =>
        timelineEvent.projectId === projectId &&
        timelineEvent.entityId === entityId,
    )
    .sort((left, right) => left.timestamp.localeCompare(right.timestamp))
    .slice(0, limit);
}

export async function listTimelineEventRecords(): Promise<
  TimelineEventRecord[]
> {
  return loadTimelineEvents();
}

export async function getUserById(userId: string): Promise<UserRecord | null> {
  const users = await listUsers();

  return users.find((user) => user.id === userId) ?? null;
}

export async function listUsers(): Promise<UserRecord[]> {
  return loadUsers();
}

async function loadCustomerProfiles(): Promise<CustomerProfileRecord[]> {
  if (!customerProfilesCache) {
    customerProfilesCache = readSeedRecords<CustomerProfileRecord>(
      customerProfilesFileUrl,
    );
  }

  return customerProfilesCache;
}

async function loadAccountProfiles(): Promise<AccountProfileRecord[]> {
  if (!accountProfilesCache) {
    accountProfilesCache = readSeedRecords<AccountProfileRecord>(
      accountProfilesFileUrl,
    );
  }

  return accountProfilesCache;
}

async function loadTimelineEvents(): Promise<TimelineEventRecord[]> {
  if (!timelineEventsCache) {
    timelineEventsCache = readSeedRecords<TimelineEventRecord>(
      timelineEventsFileUrl,
    );
  }

  return timelineEventsCache;
}

async function loadUsers(): Promise<UserRecord[]> {
  if (!usersCache) {
    usersCache = readSeedRecords<UserRecord>(usersFileUrl);
  }

  return usersCache;
}

async function readSeedRecords<T>(fileUrl: URL): Promise<T[]> {
  const content = await readFile(fileUrl, 'utf8');

  return JSON.parse(content) as T[];
}
