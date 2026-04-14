/**
 * Exports portfolio agent metadata derived from shared tool coverage.
 */

import { repositoryMetadata } from '@portfolio-tq/config';
import { createDemoRun } from '@portfolio-tq/schemas';
import { toolCatalog } from '@portfolio-tq/tools';
import type { ProjectId } from '@portfolio-tq/types';

export interface AgentDefinition {
  id: ProjectId;
  label: string;
  toolCount: number;
  previewRunId: string;
  branch: string;
}

const projectLabels: Record<ProjectId, string> = {
  'payment-exception-review': 'Payment Exception Review Agent',
  'investing-ops-copilot': 'Intelligent Investing Operations Copilot',
  'legacy-ai-adapter': 'Legacy Workflow to AI-Native Adapter',
  'eval-console': 'Evaluation and Reliability Console',
};

export const portfolioAgents: AgentDefinition[] = (
  Object.keys(projectLabels) as ProjectId[]
).map((projectId) => ({
  id: projectId,
  label: projectLabels[projectId],
  toolCount: toolCatalog.filter((tool) => tool.projectId === projectId).length,
  previewRunId: createDemoRun(projectId, 'queued').id,
  branch: repositoryMetadata.integrationBranch,
}));
