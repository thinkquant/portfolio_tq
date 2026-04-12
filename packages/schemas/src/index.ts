import type { DemoRun, DemoRunStatus, ProjectId } from '@portfolio-tq/types';

export function createDemoRun(
  projectId: ProjectId,
  status: DemoRunStatus,
): DemoRun {
  const timestamp = new Date().toISOString();

  return {
    id: `${projectId}-${status}`,
    projectId,
    status,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}
