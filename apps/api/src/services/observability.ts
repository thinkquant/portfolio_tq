import type { Firestore } from '@google-cloud/firestore';
import type { ProjectId } from '@portfolio-tq/types';

import {
  createFirestoreClient as createRepositoryFirestoreClient,
  getObservabilityOverview as getRepositoryObservabilityOverview,
  getProjectMetrics as getRepositoryProjectMetrics,
  isProjectId,
  listEvaluations as listRepositoryEvaluations,
  listProjects as listRepositoryProjects,
  listRuns as listRepositoryRuns,
  persistDemoRun as persistRepositoryDemoRun,
  type PersistRunPayload,
} from '../repositories/observability-repository.js';

export { isProjectId };

export function createFirestoreClient(config: {
  projectId?: string;
  databaseId?: string;
}): Firestore | null {
  return createRepositoryFirestoreClient(config);
}

export async function listProjects(firestore: Firestore | null) {
  return listRepositoryProjects(firestore);
}

export async function listRuns(
  firestore: Firestore | null,
  projectId?: ProjectId,
  limit?: number,
) {
  return listRepositoryRuns(firestore, projectId, limit);
}

export async function listEvaluations(
  firestore: Firestore | null,
  projectId?: ProjectId,
  limit?: number,
) {
  return listRepositoryEvaluations(firestore, projectId, limit);
}

export async function getProjectMetrics(
  firestore: Firestore | null,
  projectId: ProjectId,
) {
  return getRepositoryProjectMetrics(firestore, projectId);
}

export async function getObservabilityOverview(firestore: Firestore | null) {
  return getRepositoryObservabilityOverview(firestore);
}

export async function persistDemoRun(
  firestore: Firestore | null,
  payload: PersistRunPayload,
): Promise<void> {
  await persistRepositoryDemoRun(firestore, payload);
}
