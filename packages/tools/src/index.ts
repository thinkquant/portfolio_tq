import type { ProjectId } from '@portfolio-tq/types';

export interface ToolDefinition {
  id: string;
  projectId: ProjectId;
  description: string;
}

export const toolCatalog: ToolDefinition[] = [
  {
    id: 'customer-profile',
    projectId: 'payment-exception-review',
    description: 'Looks up seeded customer risk and support profile metadata.',
  },
  {
    id: 'policy-search',
    projectId: 'payment-exception-review',
    description: 'Searches seeded payment policy guidance deterministically.',
  },
  {
    id: 'payment-case',
    projectId: 'payment-exception-review',
    description: 'Looks up seeded payment exception case metadata.',
  },
  {
    id: 'event-timeline',
    projectId: 'payment-exception-review',
    description: 'Returns seeded event history for payment case review.',
  },
  {
    id: 'escalation',
    projectId: 'payment-exception-review',
    description: 'Builds a deterministic reviewer escalation placeholder.',
  },
  {
    id: 'account-profile',
    projectId: 'investing-ops-copilot',
    description: 'Looks up seeded investing account profile metadata.',
  },
  {
    id: 'policy-search',
    projectId: 'investing-ops-copilot',
    description:
      'Searches seeded investing ops policy guidance deterministically.',
  },
  {
    id: 'event-timeline',
    projectId: 'investing-ops-copilot',
    description:
      'Returns seeded account timeline events for investing ops questions.',
  },
  {
    id: 'event-timeline',
    projectId: 'legacy-ai-adapter',
    description: 'Returns seeded legacy workflow timeline events.',
  },
];
