import type { ProjectId } from '@portfolio-tq/types';

export interface ToolDefinition {
  id: string;
  projectId: ProjectId;
  description: string;
}

export const toolCatalog: ToolDefinition[] = [
  {
    id: 'case-loader',
    projectId: 'payment-exception-review',
    description: 'Loads seeded payment exception review cases.',
  },
  {
    id: 'policy-search',
    projectId: 'investing-ops-copilot',
    description: 'Retrieves policy snippets for operational guidance.',
  },
];
