import {
  Firestore,
  type DocumentData,
  type QuerySnapshot,
} from '@google-cloud/firestore';
import {
  firestoreCollections,
  projectIds,
  type CaseRecord,
  type DemoRunStatus,
  type EscalationRecord,
  type EvaluationRecord,
  type ProjectId,
  type ProjectRecord,
  type PromptVersionRecord,
  type RunRecord,
  type ToolInvocationRecord,
} from '@portfolio-tq/types';

export type ObservabilityOverview = {
  projects: ProjectRecord[];
  summary: {
    totalRuns: number;
    completedRuns: number;
    failedRuns: number;
    escalatedRuns: number;
    fallbackRate: number;
    passRate: number;
    averageLatencyMs: number;
    averageConfidence: number;
    averageEstimatedCostUsd: number;
    latestRunAt: string | null;
    confidenceDistribution: {
      high: number;
      medium: number;
      low: number;
    };
  };
  projectBreakdown: Array<{
    projectId: ProjectId;
    title: string;
    runCount: number;
    passRate: number;
    fallbackCount: number;
    averageLatencyMs: number;
    averageConfidence: number;
    latestRunStatus: DemoRunStatus | 'none';
  }>;
  latestFlaggedRuns: Array<{
    id: string;
    projectId: ProjectId;
    summary: string;
    status: DemoRunStatus;
    createdAt: string;
    evaluationStatus: RunRecord['evaluationStatus'];
    fallbackTriggered: boolean;
    confidence: number;
  }>;
  latestEvaluations: EvaluationRecord[];
};

export type ProjectMetrics = {
  project: ProjectRecord | null;
  latestRuns: RunRecord[];
  recentEvaluations: EvaluationRecord[];
  recentEscalations: EscalationRecord[];
  recentToolInvocations: ToolInvocationRecord[];
  promptVersions: PromptVersionRecord[];
  recentCases: CaseRecord[];
  summary: {
    totalRuns: number;
    completedRuns: number;
    failedRuns: number;
    escalatedRuns: number;
    openEscalations: number;
    averageLatencyMs: number;
    averageEvaluationScore: number;
    latestRunAt: string | null;
    promptVersionCount: number;
    caseCount: number;
  };
};

export type PersistRunPayload = {
  run: RunRecord;
  evaluation: EvaluationRecord;
  toolInvocations: ToolInvocationRecord[];
  escalation?: EscalationRecord;
};

export function createFirestoreClient(config: {
  projectId?: string;
  databaseId?: string;
}): Firestore | null {
  if (!config.projectId || !config.databaseId) {
    return null;
  }

  return new Firestore({
    projectId: config.projectId,
    databaseId: config.databaseId,
  });
}

function requireFirestore(firestore: Firestore | null): Firestore {
  if (!firestore) {
    throw new Error('Firestore is not configured for this runtime.');
  }

  return firestore;
}

async function readQuery<T>(
  queryPromise: Promise<QuerySnapshot<DocumentData>>,
): Promise<T[]> {
  const snapshot = await queryPromise;

  return snapshot.docs.map((document) => document.data() as T);
}

export function isProjectId(value: string): value is ProjectId {
  return (projectIds as readonly string[]).includes(value);
}

export async function listProjects(
  firestore: Firestore | null,
): Promise<ProjectRecord[]> {
  return readQuery<ProjectRecord>(
    requireFirestore(firestore)
      .collection(firestoreCollections.projects)
      .orderBy('updatedAt', 'desc')
      .get(),
  );
}

export async function listRuns(
  firestore: Firestore | null,
  projectId?: ProjectId,
  limit = 20,
): Promise<RunRecord[]> {
  const collection = requireFirestore(firestore).collection(
    firestoreCollections.runs,
  );

  const query = projectId
    ? collection
        .where('projectId', '==', projectId)
        .orderBy('createdAt', 'desc')
        .limit(limit)
    : collection.orderBy('createdAt', 'desc').limit(limit);

  return readQuery<RunRecord>(query.get());
}

export async function listEvaluations(
  firestore: Firestore | null,
  projectId?: ProjectId,
  limit = 20,
): Promise<EvaluationRecord[]> {
  const collection = requireFirestore(firestore).collection(
    firestoreCollections.evaluations,
  );

  const query = projectId
    ? collection
        .where('projectId', '==', projectId)
        .orderBy('createdAt', 'desc')
        .limit(limit)
    : collection.orderBy('createdAt', 'desc').limit(limit);

  return readQuery<EvaluationRecord>(query.get());
}

export async function getProjectMetrics(
  firestore: Firestore | null,
  projectId: ProjectId,
): Promise<ProjectMetrics> {
  const client = requireFirestore(firestore);
  const projectDocument = await client
    .collection(firestoreCollections.projects)
    .doc(projectId)
    .get();

  const [
    latestRuns,
    recentEvaluations,
    recentEscalations,
    recentToolInvocations,
    promptVersions,
    recentCases,
  ] = await Promise.all([
    readQuery<RunRecord>(
      client
        .collection(firestoreCollections.runs)
        .where('projectId', '==', projectId)
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get(),
    ),
    readQuery<EvaluationRecord>(
      client
        .collection(firestoreCollections.evaluations)
        .where('projectId', '==', projectId)
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get(),
    ),
    readQuery<EscalationRecord>(
      client
        .collection(firestoreCollections.escalations)
        .where('projectId', '==', projectId)
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get(),
    ),
    readQuery<ToolInvocationRecord>(
      client
        .collection(firestoreCollections.toolInvocations)
        .where('projectId', '==', projectId)
        .orderBy('startedAt', 'desc')
        .limit(10)
        .get(),
    ),
    readQuery<PromptVersionRecord>(
      client
        .collection(firestoreCollections.promptVersions)
        .where('projectId', '==', projectId)
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get(),
    ),
    readQuery<CaseRecord>(
      client
        .collection(firestoreCollections.cases)
        .where('projectId', '==', projectId)
        .orderBy('updatedAt', 'desc')
        .limit(10)
        .get(),
    ),
  ]);

  const totalLatency = latestRuns.reduce(
    (sum, run) => sum + (run.latencyMs ?? 0),
    0,
  );
  const totalScore = recentEvaluations.reduce(
    (sum, evaluation) => sum + evaluation.score,
    0,
  );

  return {
    project: projectDocument.exists
      ? (projectDocument.data() as ProjectRecord)
      : null,
    latestRuns,
    recentEvaluations,
    recentEscalations,
    recentToolInvocations,
    promptVersions,
    recentCases,
    summary: {
      totalRuns: latestRuns.length,
      completedRuns: latestRuns.filter((run) => run.status === 'completed')
        .length,
      failedRuns: latestRuns.filter((run) => run.status === 'failed').length,
      escalatedRuns: latestRuns.filter(
        (run) => run.escalated || run.status === 'escalated',
      ).length,
      openEscalations: recentEscalations.filter(
        (escalation) => escalation.status === 'open',
      ).length,
      averageLatencyMs: latestRuns.length
        ? Math.round(totalLatency / latestRuns.length)
        : 0,
      averageEvaluationScore: recentEvaluations.length
        ? Number((totalScore / recentEvaluations.length).toFixed(3))
        : 0,
      latestRunAt: latestRuns[0]?.createdAt ?? null,
      promptVersionCount: promptVersions.length,
      caseCount: recentCases.length,
    },
  };
}

export async function getObservabilityOverview(
  firestore: Firestore | null,
): Promise<ObservabilityOverview> {
  const [projects, runs, evaluations] = await Promise.all([
    listProjects(firestore),
    listRuns(firestore, undefined, 50),
    listEvaluations(firestore, undefined, 50),
  ]);

  const totalLatency = runs.reduce((sum, run) => sum + (run.latencyMs ?? 0), 0);
  const totalConfidence = runs.reduce(
    (sum, run) => sum + (run.confidence ?? 0),
    0,
  );
  const totalEstimatedCost = runs.reduce(
    (sum, run) => sum + (run.estimatedCostUsd ?? 0),
    0,
  );

  const confidenceDistribution = runs.reduce(
    (distribution, run) => {
      const confidence = run.confidence ?? 0;

      if (confidence >= 0.9) {
        distribution.high += 1;
      } else if (confidence >= 0.75) {
        distribution.medium += 1;
      } else {
        distribution.low += 1;
      }

      return distribution;
    },
    { high: 0, medium: 0, low: 0 },
  );

  const projectBreakdown = projects.map((project) => {
    const projectRuns = runs.filter((run) => run.projectId === project.id);
    const successfulRuns = projectRuns.filter(
      (run) =>
        run.evaluationStatus === 'passed' &&
        !run.fallbackTriggered &&
        !run.escalated,
    );
    const totalProjectLatency = projectRuns.reduce(
      (sum, run) => sum + (run.latencyMs ?? 0),
      0,
    );
    const totalProjectConfidence = projectRuns.reduce(
      (sum, run) => sum + (run.confidence ?? 0),
      0,
    );

    return {
      projectId: project.id,
      title: project.title,
      runCount: projectRuns.length,
      passRate: projectRuns.length
        ? Number(
            ((successfulRuns.length / projectRuns.length) * 100).toFixed(1),
          )
        : 0,
      fallbackCount: projectRuns.filter((run) => run.fallbackTriggered).length,
      averageLatencyMs: projectRuns.length
        ? Math.round(totalProjectLatency / projectRuns.length)
        : 0,
      averageConfidence: projectRuns.length
        ? Number((totalProjectConfidence / projectRuns.length).toFixed(3))
        : 0,
      latestRunStatus: projectRuns[0]?.status ?? 'none',
    };
  });

  const latestFlaggedRuns = runs
    .filter(
      (run) =>
        run.status !== 'completed' ||
        run.evaluationStatus !== 'passed' ||
        run.fallbackTriggered ||
        run.escalated,
    )
    .slice(0, 8)
    .map((run) => ({
      id: run.id,
      projectId: run.projectId,
      summary: run.summary,
      status: run.status,
      createdAt: run.createdAt,
      evaluationStatus: run.evaluationStatus,
      fallbackTriggered: run.fallbackTriggered,
      confidence: run.confidence ?? 0,
    }));

  const passedRuns = runs.filter(
    (run) =>
      run.evaluationStatus === 'passed' &&
      !run.fallbackTriggered &&
      !run.escalated,
  ).length;

  return {
    projects,
    summary: {
      totalRuns: runs.length,
      completedRuns: runs.filter((run) => run.status === 'completed').length,
      failedRuns: runs.filter((run) => run.status === 'failed').length,
      escalatedRuns: runs.filter(
        (run) => run.escalated || run.status === 'escalated',
      ).length,
      fallbackRate: runs.length
        ? Number(
            (
              (runs.filter((run) => run.fallbackTriggered).length /
                runs.length) *
              100
            ).toFixed(1),
          )
        : 0,
      passRate: runs.length
        ? Number(((passedRuns / runs.length) * 100).toFixed(1))
        : 0,
      averageLatencyMs: runs.length
        ? Math.round(totalLatency / runs.length)
        : 0,
      averageConfidence: runs.length
        ? Number((totalConfidence / runs.length).toFixed(3))
        : 0,
      averageEstimatedCostUsd: runs.length
        ? Number((totalEstimatedCost / runs.length).toFixed(4))
        : 0,
      latestRunAt: runs[0]?.createdAt ?? null,
      confidenceDistribution,
    },
    projectBreakdown,
    latestFlaggedRuns,
    latestEvaluations: evaluations.slice(0, 8),
  };
}

export async function persistDemoRun(
  firestore: Firestore | null,
  payload: PersistRunPayload,
): Promise<void> {
  const client = requireFirestore(firestore);
  const batch = client.batch();
  const seededAt = new Date().toISOString();

  batch.set(client.collection(firestoreCollections.runs).doc(payload.run.id), {
    ...payload.run,
    observedAt: seededAt,
  });

  batch.set(
    client
      .collection(firestoreCollections.evaluations)
      .doc(payload.evaluation.id),
    {
      ...payload.evaluation,
      observedAt: seededAt,
    },
  );

  for (const toolInvocation of payload.toolInvocations) {
    batch.set(
      client
        .collection(firestoreCollections.toolInvocations)
        .doc(toolInvocation.id),
      {
        ...toolInvocation,
        observedAt: seededAt,
      },
    );
  }

  if (payload.escalation) {
    batch.set(
      client
        .collection(firestoreCollections.escalations)
        .doc(payload.escalation.id),
      {
        ...payload.escalation,
        observedAt: seededAt,
      },
    );
  }

  await batch.commit();
}
