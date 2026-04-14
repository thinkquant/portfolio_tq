/**
 * Publishes shared portfolio metadata, labels, routes, and defaults.
 */

import {
  demoRunStatuses,
  environments,
  evaluationFlagTypes,
  evaluationStatuses,
  featureFlagKeys,
  projectIds,
  type DemoRunStatus,
  type Environment,
  type EvaluationFlagType,
  type EvaluationStatus,
  type FeatureFlagConfig,
  type FeatureFlagKey,
  type ProjectId,
  type ProjectModuleSummary,
  type PromptVersionRecord,
  type SeedDataGroupDescriptor,
} from '@portfolio-tq/types';

export const repositoryMetadata = {
  productName: 'portfolio-tq',
  publicHost: 'thinkquant.co',
  defaultBranch: 'main',
  integrationBranch: 'dev',
} as const;

export const environmentLabels: Record<Environment, string> = {
  dev: 'Development',
  prod: 'Production',
};

export const supportedEnvironments = [...environments];

export const routeSafeProjectIds = [...projectIds];
export const supportedProjectModuleIds = [...projectIds];
export const supportedRunStatuses = [...demoRunStatuses];
export const supportedEvaluationStatuses = [...evaluationStatuses];
export const supportedEvaluationFlagTypes = [...evaluationFlagTypes];

export const projectRoutes: Record<ProjectId, string> = {
  'payment-exception-review': '/projects/payment-exception-review',
  'investing-ops-copilot': '/projects/investing-ops-copilot',
  'legacy-ai-adapter': '/projects/legacy-ai-adapter',
  'eval-console': '/projects/eval-console',
};

export const demoRoutes: Record<ProjectId, string> = {
  'payment-exception-review': '/demo/payment-exception-review',
  'investing-ops-copilot': '/demo/investing-ops-copilot',
  'legacy-ai-adapter': '/demo/legacy-ai-adapter',
  'eval-console': '/demo/eval-console',
};

export const projectModuleTitles: Record<ProjectId, string> = {
  'payment-exception-review': 'Payment Exception Review Agent',
  'investing-ops-copilot': 'Intelligent Investing Operations Copilot',
  'legacy-ai-adapter': 'Legacy Workflow to AI-Native Service Adapter',
  'eval-console': 'Evaluation & Reliability Console',
};

export const projectModuleSummaries: Record<ProjectId, string> = {
  'payment-exception-review':
    'Confidence-aware payment exception review with typed output, traceable tools, fallback behavior, and human escalation.',
  'investing-ops-copilot':
    'Policy-aware investing operations support that grounds account answers in internal context, citations, and safe next actions.',
  'legacy-ai-adapter':
    'A structured adapter that turns messy operator input into validated, legacy-compatible workflow submissions.',
  'eval-console':
    'A reliability surface for run history, schema validity, fallback behavior, latency, cost, confidence, and prompt comparisons.',
};

export const projectModuleProofTags: Record<ProjectId, string[]> = {
  'payment-exception-review': [
    'structured output',
    'tool calling',
    'fallback logic',
    'human escalation',
  ],
  'investing-ops-copilot': [
    'grounded answers',
    'policy retrieval',
    'safe next actions',
    'source citations',
  ],
  'legacy-ai-adapter': [
    'legacy wrapping',
    'deterministic validation',
    'payload normalization',
    'hybrid workflow',
  ],
  'eval-console': [
    'observability',
    'evaluation metrics',
    'flagged runs',
    'prompt comparison',
  ],
};

export const projectModuleMetadata: ProjectModuleSummary[] = projectIds.map(
  (projectId) => ({
    id: projectId,
    slug: projectId,
    title: projectModuleTitles[projectId],
    shortSummary: projectModuleSummaries[projectId],
    proofTags: projectModuleProofTags[projectId],
    demoRoute: demoRoutes[projectId],
    projectRoute: projectRoutes[projectId],
    status: 'active',
    visibility: 'public',
  }),
);

export const projectModuleMetadataById: Record<
  ProjectId,
  ProjectModuleSummary
> = Object.fromEntries(
  projectModuleMetadata.map((module) => [module.id, module]),
) as Record<ProjectId, ProjectModuleSummary>;

export const runStatusLabels: Record<DemoRunStatus, string> = {
  queued: 'Queued',
  running: 'Running',
  completed: 'Completed',
  failed: 'Failed',
  escalated: 'Escalated',
};

export const evaluationStatusLabels: Record<EvaluationStatus, string> = {
  passed: 'Passed',
  warning: 'Warning',
  failed: 'Failed',
};

export const evaluationFlagLabels: Record<EvaluationFlagType, string> = {
  low_confidence: 'Low confidence',
  schema_invalid: 'Schema invalid',
  fallback_triggered: 'Fallback triggered',
  policy_review_required: 'Policy review required',
  missing_sources: 'Missing sources',
  latency_exceeded: 'Latency exceeded',
};

export const seedDataCategoryLabels = {
  paymentCases: 'Payment cases',
  investingCases: 'Investing ops cases',
  legacyCases: 'Legacy intake examples',
  policyDocuments: 'Policy and source documents',
  customerProfiles: 'Customer profiles',
  accountProfiles: 'Account profiles',
  eventTimelines: 'Event timelines',
} as const;

export const seedDataGroupDescriptors: SeedDataGroupDescriptor[] = [
  {
    id: 'payment-cases',
    recordKind: 'case',
    source: 'file_seed',
    projectId: 'payment-exception-review',
    caseGroup: 'payment',
  },
  {
    id: 'investing-cases',
    recordKind: 'case',
    source: 'file_seed',
    projectId: 'investing-ops-copilot',
    caseGroup: 'investing',
  },
  {
    id: 'legacy-intakes',
    recordKind: 'case',
    source: 'file_seed',
    projectId: 'legacy-ai-adapter',
    caseGroup: 'legacy',
  },
  {
    id: 'policy-documents',
    recordKind: 'document',
    source: 'file_seed',
  },
];

export const seedDataGroupDescriptorsById: Record<
  SeedDataGroupDescriptor['id'],
  SeedDataGroupDescriptor
> = Object.fromEntries(
  seedDataGroupDescriptors.map((descriptor) => [descriptor.id, descriptor]),
) as Record<SeedDataGroupDescriptor['id'], SeedDataGroupDescriptor>;

export const sharedPaginationDefaults = {
  defaultLimit: 20,
  maxLimit: 100,
  policySearchLimit: 5,
  policySearchMaxLimit: 20,
  eventTimelineLimit: 10,
  eventTimelineMaxLimit: 50,
} as const;

export const sharedEvaluationThresholds = {
  demoApiMedianLatencyTargetMs: 8_000,
  confidenceReviewThreshold: 0.7,
  groundednessReviewThreshold: 0.7,
  estimatedCostReviewUsd: 0.01,
} as const;

export const defaultFeatureFlags: Record<FeatureFlagKey, FeatureFlagConfig> =
  Object.fromEntries(
    featureFlagKeys.map((key) => [
      key,
      {
        key,
        enabled:
          key === 'mock_tools_enabled' || key === 'observability_live_data',
        description:
          key === 'demo_access_gate'
            ? 'Optional access gate for demo surfaces.'
            : key === 'mock_tools_enabled'
              ? 'Deterministic synthetic tool surfaces are available.'
              : 'Observability views read seeded or live shared runtime data.',
      } satisfies FeatureFlagConfig,
    ]),
  ) as Record<FeatureFlagKey, FeatureFlagConfig>;

export type PromptVersionMetadata = Pick<
  PromptVersionRecord,
  'id' | 'projectId' | 'label' | 'status' | 'model' | 'summary'
>;

export const promptVersionMetadata: PromptVersionMetadata[] = [
  {
    id: 'prompt-payment-v1',
    projectId: 'payment-exception-review',
    label: 'payment-review-bootstrap-v1',
    status: 'active',
    model: 'vertex-ai-gemini',
    summary: 'Synthetic prompt version for the payment review bootstrap flow.',
  },
  {
    id: 'prompt-investing-v1',
    projectId: 'investing-ops-copilot',
    label: 'investing-ops-bootstrap-v1',
    status: 'active',
    model: 'vertex-ai-gemini',
    summary:
      'Synthetic prompt version for the investing operations bootstrap flow.',
  },
  {
    id: 'prompt-legacy-v1',
    projectId: 'legacy-ai-adapter',
    label: 'legacy-adapter-bootstrap-v1',
    status: 'active',
    model: 'vertex-ai-gemini',
    summary: 'Synthetic prompt version for the legacy adapter bootstrap flow.',
  },
  {
    id: 'prompt-evals-v1',
    projectId: 'eval-console',
    label: 'eval-console-bootstrap-v1',
    status: 'active',
    model: 'vertex-ai-gemini',
    summary: 'Synthetic prompt version for the eval console bootstrap flow.',
  },
];

export const promptVersionMetadataById: Record<
  PromptVersionMetadata['id'],
  PromptVersionMetadata
> = Object.fromEntries(
  promptVersionMetadata.map((promptVersion) => [
    promptVersion.id,
    promptVersion,
  ]),
);
