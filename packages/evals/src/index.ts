import type { DemoRunStatus } from '@portfolio-tq/types';

export const evaluationStatuses: DemoRunStatus[] = [
  'queued',
  'running',
  'completed',
  'failed',
  'escalated',
];

export function isTerminalStatus(status: DemoRunStatus): boolean {
  return ['completed', 'failed', 'escalated'].includes(status);
}
