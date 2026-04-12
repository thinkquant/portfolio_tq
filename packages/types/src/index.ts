export const environments = ['dev', 'prod'] as const;

export type Environment = (typeof environments)[number];

export const projectIds = [
  'payment-exception-review',
  'investing-ops-copilot',
  'legacy-ai-adapter',
  'eval-console',
] as const;

export type ProjectId = (typeof projectIds)[number];

export type DemoRunStatus =
  | 'queued'
  | 'running'
  | 'completed'
  | 'failed'
  | 'escalated';

export interface DemoRun {
  id: string;
  projectId: ProjectId;
  status: DemoRunStatus;
  createdAt: string;
  updatedAt: string;
}
