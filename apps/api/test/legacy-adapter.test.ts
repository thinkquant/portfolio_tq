import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { parseLegacyAdapterSampleCase } from '@portfolio-tq/schemas';
import { legacyAdapterFieldNames } from '@portfolio-tq/types';

import type { AppContext } from '../src/app/context.js';
import { createApiServer } from '../src/app/server.js';
import type { RuntimeConfig } from '../src/config/runtime.js';
import { createLogger } from '../src/services/logs.js';
import { createApiRouter } from '../src/routes/index.js';
import {
  buildLegacyAdapterFinalOutput,
  listLegacyAdapterSamples,
  runLegacyAdapterDemo,
  runLegacyAdapterExtractionStage,
  runLegacyAdapterTransformationStage,
  runLegacyAdapterValidationStage,
} from '../src/services/demos/legacy-adapter.js';

test('legacy adapter extraction reproduces the seeded expected extractions', async () => {
  const samples = await loadLegacyAdapterSamples();

  for (const sample of samples) {
    const extractionStage = runLegacyAdapterExtractionStage(sample.input);

    assert.deepEqual(
      extractionStage.extraction,
      sample.expectedExtraction,
      `Expected extraction to match fixture for ${sample.id}.`,
    );
    assert.equal(extractionStage.trace.strategy, 'deterministic_parsing');
  }
});

test('legacy adapter validation reproduces the seeded expected validation results', async () => {
  const samples = await loadLegacyAdapterSamples();

  for (const sample of samples) {
    const extractionStage = runLegacyAdapterExtractionStage(sample.input);
    const validationStage = runLegacyAdapterValidationStage(extractionStage);

    assert.deepEqual(
      validationStage.validation,
      sample.expectedValidation,
      `Expected validation to match fixture for ${sample.id}.`,
    );
  }
});

test('legacy adapter transformation reproduces the seeded expected payloads', async () => {
  const samples = await loadLegacyAdapterSamples();

  for (const sample of samples) {
    const extractionStage = runLegacyAdapterExtractionStage(sample.input);
    const validationStage = runLegacyAdapterValidationStage(extractionStage);
    const transformationStage = runLegacyAdapterTransformationStage(
      extractionStage,
      validationStage,
    );

    assert.deepEqual(
      transformationStage.payload,
      sample.expectedPayload,
      `Expected payload transformation to match fixture for ${sample.id}.`,
    );
    assert.equal(
      transformationStage.legacySubmissionStatus,
      sample.expectedOutput.legacySubmissionStatus,
      `Expected submission status to match fixture for ${sample.id}.`,
    );
  }
});

test('legacy adapter final output reproduces the seeded expected outputs', async () => {
  const samples = await loadLegacyAdapterSamples();

  for (const sample of samples) {
    const extractionStage = runLegacyAdapterExtractionStage(sample.input);
    const validationStage = runLegacyAdapterValidationStage(extractionStage);
    const transformationStage = runLegacyAdapterTransformationStage(
      extractionStage,
      validationStage,
    );
    const outputStage = buildLegacyAdapterFinalOutput(
      extractionStage,
      validationStage,
      transformationStage,
    );

    assert.deepEqual(
      outputStage.output,
      sample.expectedOutput,
      `Expected final output to match fixture for ${sample.id}.`,
    );
  }
});

test('legacy adapter validation can continue with warnings when optional incompatible fields are present', () => {
  const extractionStage = {
    extraction: {
      workflowType: 'document_reissue',
      requesterName: 'Marco Ruiz',
      accountId: 'AC-99017',
      requestSummary: 'Reissue the 2026 Q1 statement by mail and PDF.',
      effectiveDate: '2026-04-18',
      amountUsd: 25,
      targetEntity: '2026 Q1 statement',
      sourceChannel: 'email_forward',
    },
    trace: {
      strategy: 'deterministic_parsing',
      normalizedText: 'doc request',
      recoveredFields: [...legacyAdapterFieldNames],
      workflowHints: ['document_reissue'],
      accountCandidates: ['AC-99017'],
      extractionFailed: false,
      failureReason: null,
      conflictSignals: [],
    },
  };
  const validationStage = runLegacyAdapterValidationStage(extractionStage);
  const transformationStage = runLegacyAdapterTransformationStage(
    extractionStage,
    validationStage,
  );
  const outputStage = buildLegacyAdapterFinalOutput(
    extractionStage,
    validationStage,
    transformationStage,
  );

  assert.equal(validationStage.outcome, 'continue_with_warnings');
  assert.equal(validationStage.validation.isValid, true);
  assert.equal(validationStage.validation.canTransformPayload, true);
  assert.equal(transformationStage.legacySubmissionStatus, 'accepted');
  assert.ok(transformationStage.payload);
  assert.equal(outputStage.output.humanReviewRequired, false);
  assert.equal(outputStage.output.legacySubmissionStatus, 'accepted');
  assert.ok(
    validationStage.validation.issues.every(
      (issue) => issue.severity === 'warning',
    ),
  );
  assert.match(
    outputStage.output.suggestedNextStep,
    /ignored optional fields/i,
  );
});

test('legacy adapter extraction fails cleanly when the note contains no supported signals', () => {
  const extractionStage = runLegacyAdapterExtractionStage({
    sourceText: 'Please help with this item when you have time.',
  });

  assert.deepEqual(extractionStage.extraction, {
    workflowType: null,
    requesterName: null,
    accountId: null,
    requestSummary: null,
    effectiveDate: null,
    amountUsd: null,
    targetEntity: null,
    sourceChannel: null,
  });
  assert.equal(extractionStage.trace.extractionFailed, true);
  assert.equal(
    extractionStage.trace.failureReason,
    'No supported intake signals were recovered from the raw input.',
  );
});

test('legacy adapter sample list exposes the rich demo fixtures', async () => {
  const sampleList = await listLegacyAdapterSamples();

  assert.equal(sampleList.count, 4);
  assert.ok(sampleList.samples.some((sample) => sample.id === 'sample-legacy-clean-001'));
  assert.ok(
    sampleList.samples.some((sample) => sample.id === 'sample-legacy-ambiguous-004'),
  );
});

test('legacy adapter demo execution persists runs, evaluations, and stage traces', async () => {
  const firestore = new InMemoryFirestore();
  const logger = createSilentLogger();
  const samples = await loadLegacyAdapterSamples();
  const ambiguousSample = samples.find(
    (sample) => sample.id === 'sample-legacy-ambiguous-004',
  );

  assert.ok(ambiguousSample);

  const demoResult = await runLegacyAdapterDemo({
    requestId: 'legacy-test-request',
    payload: ambiguousSample.input,
    environment: 'dev',
    firestore: firestore as any,
    logger,
  });

  assert.equal(demoResult.run.projectId, 'legacy-ai-adapter');
  assert.equal(demoResult.run.status, 'escalated');
  assert.equal(demoResult.evaluation.fallbackTriggered, true);
  assert.equal(demoResult.result.legacySubmissionStatus, 'needs_review');
  assert.equal(demoResult.toolInvocations.length, 4);
  assert.ok(
    demoResult.toolInvocations.some(
      (toolInvocation) => toolInvocation.toolName === 'legacy-extraction-stage',
    ),
  );
  assert.ok(
    demoResult.toolInvocations.some(
      (toolInvocation) =>
        toolInvocation.toolName === 'legacy-payload-transformation-stage',
    ),
  );
  assert.ok(
    demoResult.evaluation.flags?.some(
      (flag) => flag.type === 'fallback_triggered',
    ),
  );
  assert.ok(
    demoResult.evaluation.flags?.some(
      (flag) => flag.type === 'policy_review_required',
    ),
  );
  assert.ok(demoResult.escalation);

  const persistedRuns = firestore.dumpCollection('runs');
  const persistedEvaluations = firestore.dumpCollection('evaluations');
  const persistedToolInvocations = firestore.dumpCollection('tool_invocations');
  const persistedEscalations = firestore.dumpCollection('escalations');

  assert.equal(persistedRuns.length, 1);
  assert.equal(persistedEvaluations.length, 1);
  assert.equal(persistedToolInvocations.length, 4);
  assert.equal(persistedEscalations.length, 1);
});

test('legacy adapter demo routes return stable success and error envelopes', async () => {
  await withTestApiServer(async ({ baseUrl }) => {
    const samplesResponse = await fetch(
      `${baseUrl}/api/demo/legacy-ai-adapter/samples`,
    );
    const samplesPayload = (await samplesResponse.json()) as {
      ok: boolean;
      data?: { count?: number; samples?: Array<{ id: string }> };
    };

    assert.equal(samplesResponse.status, 200);
    assert.equal(samplesPayload.ok, true);
    assert.equal(samplesPayload.data?.count, 4);

    const runResponse = await fetch(`${baseUrl}/api/demo/legacy-ai-adapter/run`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sourceText:
          'Beneficiary change request for account AC-20418. Client Nora Patel wants the primary beneficiary updated to Liam Patel effective 2026-04-18.',
        workflowType: 'beneficiary_change',
      }),
    });
    const runPayload = (await runResponse.json()) as {
      ok: boolean;
      data?: {
        run?: { projectId?: string };
        result?: { legacySubmissionStatus?: string };
        trace?: { extraction?: unknown; validation?: unknown; transformation?: unknown; finalStatus?: unknown };
      };
      requestId?: string;
    };

    assert.equal(runResponse.status, 200);
    assert.equal(runPayload.ok, true);
    assert.equal(runPayload.data?.run?.projectId, 'legacy-ai-adapter');
    assert.equal(runPayload.data?.result?.legacySubmissionStatus, 'accepted');
    assert.ok(runPayload.data?.trace?.extraction);
    assert.ok(runPayload.data?.trace?.validation);
    assert.ok(runPayload.data?.trace?.transformation);
    assert.ok(runPayload.data?.trace?.finalStatus);
    assert.ok(runPayload.requestId);

    const invalidResponse = await fetch(
      `${baseUrl}/api/demo/legacy-ai-adapter/run`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sourceText: '',
        }),
      },
    );
    const invalidPayload = (await invalidResponse.json()) as {
      ok: boolean;
      error?: { code?: string; message?: string };
      requestId?: string;
    };

    assert.equal(invalidResponse.status, 400);
    assert.equal(invalidPayload.ok, false);
    assert.equal(invalidPayload.error?.code, 'invalid_request');
    assert.ok(invalidPayload.error?.message);
    assert.ok(invalidPayload.requestId);
  });
});

async function loadLegacyAdapterSamples() {
  const rawSamples = JSON.parse(
    await readFile(
      new URL('../../../data/seed/legacy-cases/intake-examples.json', import.meta.url),
      'utf8',
    ),
  ) as unknown[];

  return rawSamples.map((rawSample) => {
    const parsed = parseLegacyAdapterSampleCase(rawSample);
    assert.equal(parsed.success, true);

    return parsed.data;
  });
}

function createSilentLogger() {
  return createLogger({
    serviceName: 'portfolio-tq-api',
    environment: 'dev',
    nodeEnv: 'test',
    logLevel: 'error',
  });
}

async function withTestApiServer(
  run: (config: { baseUrl: string }) => Promise<void>,
) {
  const app = createTestAppContext();
  const router = createApiRouter(app);
  const server = createApiServer(app, router);

  await new Promise<void>((resolve) => server.listen(0, resolve));

  const address = server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    await run({ baseUrl });
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
}

function createTestAppContext(): AppContext {
  const config: RuntimeConfig = {
    environment: 'dev',
    port: 0,
    serviceName: 'portfolio-tq-api',
    serviceVersion: '0.1.0',
    nodeEnv: 'test',
    apiBasePath: '/api',
    buildCommitSha: null,
    buildId: null,
    vertexAiLocation: 'us-central1',
    corsAllowedOrigin: 'http://localhost:5173',
    vertexAiModel: '',
    vertexAiEnabled: false,
    logLevel: 'error',
    firestoreProjectId: 'portfolio-tq-dev',
    googleCloudProject: 'portfolio-tq-dev',
    firestoreDatabaseId: 'portfolio-tq-dev',
    firestoreCollections: {
      runs: 'runs',
      toolInvocations: 'toolInvocations',
      evaluations: 'evaluations',
      seedData: 'seed_data',
    },
    features: {
      demoGates: false,
      seedEndpoints: true,
    },
  };

  return {
    config,
    firestore: null,
    logger: createSilentLogger(),
  };
}

class InMemoryFirestore {
  private readonly collections = new Map<string, Map<string, Record<string, unknown>>>();

  batch() {
    const operations: Array<() => void> = [];

    return {
      set: (ref: InMemoryDocumentRef, data: Record<string, unknown>) => {
        operations.push(() => {
          ref.setSync(data);
        });
      },
      commit: async () => {
        for (const operation of operations) {
          operation();
        }
      },
    };
  }

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

  dumpCollection(name: string) {
    return Array.from(this.getCollection(name).values());
  }
}

class InMemoryCollectionRef {
  constructor(
    private readonly firestore: InMemoryFirestore,
    private readonly collectionName: string,
  ) {}

  doc(documentId: string): InMemoryDocumentRef {
    return new InMemoryDocumentRef(
      this.firestore,
      this.collectionName,
      documentId,
    );
  }
}

class InMemoryDocumentRef {
  constructor(
    private readonly firestore: InMemoryFirestore,
    private readonly collectionName: string,
    private readonly documentId: string,
  ) {}

  setSync(data: Record<string, unknown>) {
    this.firestore.getCollection(this.collectionName).set(this.documentId, {
      ...structuredClone(data),
    });
  }
}
