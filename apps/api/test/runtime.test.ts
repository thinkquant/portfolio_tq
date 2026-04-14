import assert from 'node:assert/strict';
import test from 'node:test';

process.env.NODE_ENV = 'test';
process.env.PORT = '8080';
process.env.APP_ENV = 'dev';
process.env.SERVICE_NAME = 'portfolio-tq-api';
process.env.API_BASE_PATH = '/api';
process.env.LOG_LEVEL = 'debug';
process.env.GCP_PROJECT_ID = 'portfolio-tq-dev';
process.env.GOOGLE_CLOUD_PROJECT = 'portfolio-tq-dev';
process.env.FIRESTORE_DATABASE_ID = 'portfolio-tq-dev';
process.env.FIRESTORE_RUNS_COLLECTION = 'runs';
process.env.FIRESTORE_TOOL_INVOCATIONS_COLLECTION = 'tool_invocations';
process.env.FIRESTORE_EVALS_COLLECTION = 'evaluations';
process.env.FIRESTORE_SEED_COLLECTION = 'seed_data';
process.env.WEB_ALLOWED_ORIGIN = 'http://localhost:5173';
process.env.VERTEX_AI_LOCATION = 'us-central1';
process.env.VERTEX_AI_MODEL = '';
process.env.ENABLE_DEMO_GATES = 'false';
process.env.ENABLE_SEED_ENDPOINTS = 'true';

const [
  { createRun, getRunById, listRuns },
  { createEvaluation, listEvaluations },
  { createToolInvocation, listToolInvocations },
  { listPaymentCases, listSeedDocuments },
  {
    lookupCustomerProfile,
    lookupPaymentCase,
    lookupAccountProfile,
    searchPolicyDocuments,
    createEscalationPlaceholder,
  },
] = await Promise.all([
  import('../src/services/runs.js'),
  import('../src/services/evaluations.js'),
  import('../src/services/tool-invocations.js'),
  import('../src/services/seed-data.js'),
  import('../src/services/mock-tools.js'),
]);

test('shared runtime repositories persist and read back runs, evaluations, and tool invocations', async () => {
  const firestore = new InMemoryFirestore();

  const run = await createRun(
    firestore as any,
    {
      projectId: 'investing-ops-copilot',
      inputRef: 'test-runtime-input',
      summary: 'Test runtime run',
      status: 'completed',
      promptVersionId: 'prompt-test-runtime',
    },
    'dev',
  );

  const readRun = await getRunById(firestore as any, run.id);
  assert.ok(readRun);
  assert.equal(readRun?.id, run.id);
  assert.equal(readRun?.summary, 'Test runtime run');

  const evaluation = await createEvaluation(firestore as any, {
    projectId: 'investing-ops-copilot',
    runId: run.id,
    status: 'passed',
    score: 0.98,
    schemaValid: true,
    policyPass: true,
    fallbackTriggered: false,
    groundednessScore: 0.95,
    notes: 'Test runtime evaluation',
    summary: 'Test runtime evaluation passed',
  });

  const toolInvocation = await createToolInvocation(firestore as any, {
    projectId: 'investing-ops-copilot',
    runId: run.id,
    toolName: 'test-runtime-tool',
    inputSummary: 'Test tool input',
    outputSummary: 'Test tool output',
    success: true,
    durationMs: 37,
    createdAt: '2026-04-14T02:04:14.000Z',
  });

  const updatedRun = await getRunById(firestore as any, run.id);
  assert.ok(updatedRun);
  assert.equal(updatedRun?.evaluationStatus, evaluation.status);
  assert.equal(updatedRun?.toolInvocationCount, 1);

  const runs = await listRuns(firestore as any, {
    projectId: 'investing-ops-copilot',
    limit: 5,
  });
  const evaluations = await listEvaluations(firestore as any, {
    projectId: 'investing-ops-copilot',
    runId: run.id,
    limit: 5,
  });
  const toolInvocations = await listToolInvocations(firestore as any, {
    projectId: 'investing-ops-copilot',
    runId: run.id,
    limit: 5,
  });

  assert.equal(runs.length, 1);
  assert.equal(evaluations.length, 1);
  assert.equal(toolInvocations.length, 1);
  assert.equal(toolInvocations[0]?.id, toolInvocation.id);
});

test('validation failures and missing records are surfaced consistently', async () => {
  const firestore = new InMemoryFirestore();

  await assert.rejects(
    () =>
      createEvaluation(firestore as any, {
        projectId: 'investing-ops-copilot',
        runId: 'missing-run',
        status: 'passed',
        score: 0.9,
        schemaValid: true,
        policyPass: true,
        fallbackTriggered: false,
      }),
    (error: unknown) => isNamedError(error, 'NotFoundError'),
  );

  await assert.rejects(
    () =>
      createToolInvocation(firestore as any, {
        projectId: 'payment-exception-review',
        runId: 'missing-run',
        toolName: 'test-runtime-tool',
        inputSummary: 'Test tool input',
        outputSummary: 'Test tool output',
        success: true,
        durationMs: 5,
      }),
    (error: unknown) => isNamedError(error, 'NotFoundError'),
  );

  const run = await createRun(
    firestore as any,
    {
      projectId: 'payment-exception-review',
      inputRef: 'validation-test-input',
      status: 'queued',
    },
    'dev',
  );

  await assert.rejects(
    () =>
      createToolInvocation(firestore as any, {
        projectId: 'investing-ops-copilot',
        runId: run.id,
        toolName: 'test-runtime-tool',
        inputSummary: 'Test tool input',
        outputSummary: 'Test tool output',
        success: true,
        durationMs: 5,
      }),
    (error: unknown) => isNamedError(error, 'ValidationError'),
  );
});

test('seed fixtures and mock tools are available for later demo flows', async () => {
  const paymentCases = await listPaymentCases({
    projectId: 'payment-exception-review',
  });
  const documents = await listSeedDocuments({
    projectId: 'investing-ops-copilot',
    kind: 'brief',
  });

  assert.ok(paymentCases.some((seedCase) => seedCase.id === 'case-payment-bootstrap-001'));
  assert.ok(
    documents.some((document) => document.id === 'doc-investing-ops-policy'),
  );

  const customerProfile = await lookupCustomerProfile({
    customerId: 'cust-payment-001',
  });
  const paymentCase = await lookupPaymentCase({
    caseId: 'case-payment-bootstrap-001',
  });
  const accountProfile = await lookupAccountProfile({
    accountId: 'acct-investing-001',
  });
  const policyMatches = await searchPolicyDocuments({
    projectId: 'payment-exception-review',
    query: 'payment review',
    limit: 3,
  });
  const escalation = await createEscalationPlaceholder({
    projectId: 'investing-ops-copilot',
    reason: 'Test escalation placeholder',
    ownerId: 'user-reviewer-dev',
  });

  assert.equal(customerProfile.id, 'cust-payment-001');
  assert.equal(paymentCase.id, 'case-payment-bootstrap-001');
  assert.equal(accountProfile.id, 'acct-investing-001');
  assert.ok(policyMatches.length > 0);
  assert.equal(escalation.ownerId, 'user-reviewer-dev');
});

class InMemoryFirestore {
  private readonly collections = new Map<string, Map<string, Record<string, unknown>>>();

  collection(name: string): InMemoryCollectionRef {
    return new InMemoryCollectionRef(this, name);
  }

  getCollection(name: string): Map<string, Record<string, unknown>> {
    let collection = this.collections.get(name);

    if (!collection) {
      collection = new Map<string, Record<string, unknown>>();
      this.collections.set(name, collection);
    }

    return collection;
  }
}

class InMemoryCollectionRef {
  constructor(
    private readonly firestore: InMemoryFirestore,
    private readonly collectionName: string,
    private readonly queryState: QueryState = {
      filters: [],
    },
  ) {}

  doc(documentId: string): InMemoryDocumentRef {
    return new InMemoryDocumentRef(
      this.firestore,
      this.collectionName,
      documentId,
    );
  }

  where(field: string, _operator: string, value: unknown): InMemoryCollectionRef {
    return new InMemoryCollectionRef(this.firestore, this.collectionName, {
      ...this.queryState,
      filters: [...this.queryState.filters, { field, value }],
    });
  }

  orderBy(field: string, direction: 'asc' | 'desc' = 'asc'): InMemoryCollectionRef {
    return new InMemoryCollectionRef(this.firestore, this.collectionName, {
      ...this.queryState,
      orderBy: { field, direction },
    });
  }

  limit(limit: number): InMemoryCollectionRef {
    return new InMemoryCollectionRef(this.firestore, this.collectionName, {
      ...this.queryState,
      limit,
    });
  }

  async get(): Promise<InMemoryQuerySnapshot> {
    const collection = this.firestore.getCollection(this.collectionName);
    let docs = Array.from(collection.entries()).map(([id, data]) =>
      createSnapshot(id, data),
    );

    for (const filter of this.queryState.filters) {
      docs = docs.filter((doc) => doc.data()[filter.field] === filter.value);
    }

    if (this.queryState.orderBy) {
      const { field, direction } = this.queryState.orderBy;

      docs.sort((left, right) => {
        const leftValue = String(left.data()[field] ?? '');
        const rightValue = String(right.data()[field] ?? '');
        const comparison = leftValue.localeCompare(rightValue);

        return direction === 'desc' ? -comparison : comparison;
      });
    }

    if (typeof this.queryState.limit === 'number') {
      docs = docs.slice(0, this.queryState.limit);
    }

    return { docs };
  }
}

class InMemoryDocumentRef {
  constructor(
    private readonly firestore: InMemoryFirestore,
    private readonly collectionName: string,
    private readonly documentId: string,
  ) {}

  async set(data: Record<string, unknown>): Promise<void> {
    this.firestore.getCollection(this.collectionName).set(this.documentId, {
      ...structuredClone(data),
    });
  }

  async get(): Promise<InMemoryDocumentSnapshot> {
    const collection = this.firestore.getCollection(this.collectionName);
    const data = collection.get(this.documentId);

    return {
      exists: Boolean(data),
      data: () => (data ? structuredClone(data) : undefined),
    };
  }
}

type QueryState = {
  filters: Array<{ field: string; value: unknown }>;
  orderBy?: { field: string; direction: 'asc' | 'desc' };
  limit?: number;
};

type InMemoryQuerySnapshot = {
  docs: InMemoryDocumentSnapshot[];
};

type InMemoryDocumentSnapshot = {
  exists: boolean;
  data: () => Record<string, unknown> | undefined;
};

function createSnapshot(
  id: string,
  data: Record<string, unknown>,
): InMemoryDocumentSnapshot & { id: string } {
  return {
    id,
    exists: true,
    data: () => structuredClone(data),
  };
}

function isNamedError(error: unknown, name: string): boolean {
  return error instanceof Error && error.name === name;
}
