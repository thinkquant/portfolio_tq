import { randomUUID } from 'node:crypto';

import type { DemoRun, DemoRunStatus, ProjectId } from '@portfolio-tq/types';

export function createDemoRun(
  projectId: ProjectId,
  status: DemoRunStatus,
): DemoRun {
  const timestamp = new Date().toISOString();

  return {
    id: `${projectId}-${randomUUID()}`,
    projectId,
    status,
    inputRef: 'bootstrap-case',
    outputRef: 'bootstrap-output',
    confidence: 0.98,
    latencyMs: 1420,
    estimatedCostUsd: 0.0024,
    promptVersionId: 'prompt-payment-v1',
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}
