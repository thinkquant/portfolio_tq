export const environments = ['dev', 'prod'] as const;

export type Environment = (typeof environments)[number];

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export const firestoreCollections = {
  projects: 'projects',
  runs: 'runs',
  toolInvocations: 'toolInvocations',
  evaluations: 'evaluations',
  escalations: 'escalations',
  promptVersions: 'promptVersions',
  documents: 'documents',
  cases: 'cases',
  users: 'users',
  accessCodes: 'accessCodes',
} as const;

export const firestoreCollectionNames = Object.values(firestoreCollections);

export type FirestoreCollectionName =
  (typeof firestoreCollectionNames)[number];

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

export type ProjectStatus = 'planned' | 'active' | 'live';
export type EvaluationStatus = 'passed' | 'warning' | 'failed';
export type ToolInvocationStatus = 'completed' | 'failed';
export type EscalationStatus = 'open' | 'reviewed' | 'resolved';
export type CaseStatus = 'open' | 'reviewed' | 'closed';
export type CasePriority = 'low' | 'medium' | 'high';
export type PromptVersionStatus = 'candidate' | 'active' | 'retired';
export type AccessCodeStatus = 'inactive' | 'preview' | 'revoked';

export interface ProjectRecord {
  id: ProjectId;
  title: string;
  slug: string;
  tagline: string;
  summary: string;
  status: ProjectStatus;
  surfacePath: string;
  environment: 'all';
  updatedAt: string;
}

export interface RunRecord extends DemoRun {
  environment: Environment;
  durationMs: number;
  summary: string;
  promptVersionId: string;
  evaluationStatus: EvaluationStatus;
  escalated: boolean;
  toolInvocationCount: number;
}

export interface ToolInvocationRecord {
  id: string;
  projectId: ProjectId;
  runId: string;
  toolName: string;
  status: ToolInvocationStatus;
  startedAt: string;
  completedAt: string;
  latencyMs: number;
  summary: string;
}

export interface EvaluationRecord {
  id: string;
  projectId: ProjectId;
  runId: string;
  status: EvaluationStatus;
  createdAt: string;
  score: number;
  schemaValid: boolean;
  fallbackTriggered: boolean;
  summary: string;
}

export interface EscalationRecord {
  id: string;
  projectId: ProjectId;
  runId: string;
  status: EscalationStatus;
  createdAt: string;
  reason: string;
  owner: string | null;
}

export interface PromptVersionRecord {
  id: string;
  projectId: ProjectId;
  label: string;
  createdAt: string;
  status: PromptVersionStatus;
  model: string;
  summary: string;
}

export interface DocumentRecord {
  id: string;
  projectId: ProjectId;
  title: string;
  kind: 'policy' | 'reference' | 'brief';
  createdAt: string;
  updatedAt: string;
  status: 'active';
  summary: string;
}

export interface CaseRecord {
  id: string;
  projectId: ProjectId;
  title: string;
  queue: string;
  priority: CasePriority;
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;
  summary: string;
}

export interface UserRecord {
  id: string;
  displayName: string;
  role: 'admin' | 'reviewer' | 'viewer';
  environment: Environment;
  createdAt: string;
}

export interface AccessCodeRecord {
  id: string;
  projectId: ProjectId;
  label: string;
  status: AccessCodeStatus;
  createdAt: string;
  expiresAt: string;
  notes: string;
}
