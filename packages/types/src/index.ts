export const environments = ['dev', 'prod'] as const;

export type Environment = (typeof environments)[number];

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type JsonObject = { [key: string]: JsonValue };

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

export type FirestoreCollectionName = (typeof firestoreCollectionNames)[number];

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
  inputRef: string;
  outputRef?: string;
  confidence?: number;
  latencyMs?: number;
  estimatedCostUsd?: number;
  promptVersionId?: string;
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
  summary: string;
  evaluationStatus: EvaluationStatus;
  fallbackTriggered: boolean;
  escalated: boolean;
  toolInvocationCount: number;
}

export interface ToolInvocationRecord {
  id: string;
  projectId: ProjectId;
  runId: string;
  toolName: string;
  inputSummary: string;
  outputSummary: string;
  success: boolean;
  durationMs: number;
  createdAt: string;
  status: ToolInvocationStatus;
  startedAt: string;
  completedAt: string;
  latencyMs: number;
  summary: string;
}

export type CustomerTier = 'standard' | 'priority';
export type RiskBand = 'low' | 'medium' | 'high';
export type AccountType = 'individual' | 'joint' | 'trust';
export type OnboardingStatus = 'pending' | 'active' | 'restricted';
export type SuitabilityStatus = 'current' | 'review_required' | 'missing';
export type TimelineEventCategory =
  | 'created'
  | 'status'
  | 'note'
  | 'policy'
  | 'review'
  | 'escalation';

export interface CustomerProfileRecord {
  id: string;
  projectId: 'payment-exception-review';
  displayName: string;
  email: string;
  region: string;
  tier: CustomerTier;
  riskBand: RiskBand;
  priorDisputeCount: number;
  linkedCaseIds: string[];
  summary: string;
}

export interface AccountProfileRecord {
  id: string;
  projectId: 'investing-ops-copilot';
  householdName: string;
  accountType: AccountType;
  onboardingStatus: OnboardingStatus;
  suitabilityStatus: SuitabilityStatus;
  baseCurrency: string;
  linkedCaseIds: string[];
  summary: string;
}

export interface TimelineEventRecord {
  id: string;
  projectId: ProjectId;
  entityId: string;
  timestamp: string;
  category: TimelineEventCategory;
  summary: string;
}

export interface PolicySearchMatch {
  id: string;
  projectId: ProjectId;
  title: string;
  kind: DocumentRecord['kind'];
  summary: string;
  score: number;
}

export interface EscalationPreviewRecord {
  id: string;
  projectId: ProjectId;
  runId: string | null;
  ownerId: string | null;
  status: 'draft';
  createdAt: string;
  reason: string;
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
  policyPass: boolean;
  fallbackTriggered: boolean;
  groundednessScore: number | null;
  notes: string;
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

export interface ApiSuccessEnvelope<T> {
  ok: true;
  data: T;
  requestId?: string;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: JsonObject;
}

export interface ApiErrorEnvelope {
  ok: false;
  error: ApiErrorPayload;
  requestId: string;
}

export interface ProjectScopedListQuery {
  projectId?: ProjectId;
}

export interface RunListQuery extends ProjectScopedListQuery {
  status?: DemoRunStatus;
  limit?: number;
}

export interface ToolInvocationListQuery extends ProjectScopedListQuery {
  runId?: string;
  toolName?: string;
  limit?: number;
}

export interface PolicySearchRequest {
  projectId: ProjectId;
  query: string;
  limit?: number;
}

export interface EventTimelineRequest {
  projectId: ProjectId;
  entityId: string;
  limit?: number;
}

export interface EvaluationListQuery extends ProjectScopedListQuery {
  runId?: string;
  status?: EvaluationStatus;
  limit?: number;
}

export interface PaymentReviewDemoRequest {
  caseId?: string;
  note?: string;
}

export interface PaymentReviewDemoResult {
  decision: string;
  summary: string;
  note: string;
}

export interface PaymentReviewDemoResponseData {
  run: RunRecord;
  evaluation: EvaluationRecord;
  escalation: EscalationRecord | null;
  result: PaymentReviewDemoResult;
  agentCount: number;
}

export interface HealthStatusData {
  status: 'ok';
  service: string;
  environment: Environment;
  timestamp: string;
  version: string;
  commitSha: string | null;
  buildId: string | null;
  vertexAiLocation: string;
  projectId: string;
  firestoreDatabaseId: string;
}

export interface ReadyStatusData {
  status: 'ready' | 'degraded';
  service: string;
  environment: Environment;
  timestamp: string;
  version: string;
  commitSha: string | null;
  buildId: string | null;
  dependencies: {
    firestore: {
      status: 'configured' | 'unconfigured';
      projectId: string | null;
      databaseId: string | null;
    };
  };
}

export interface ServiceIndexData {
  service: string;
  environment: Environment;
  timestamp: string;
  version: string;
  commitSha: string | null;
  buildId: string | null;
  routes: string[];
  agentCount: number;
  evaluationStatuses: DemoRunStatus[];
}

export interface ProjectListResponseData {
  projects: ProjectRecord[];
  count: number;
}

export interface RunListResponseData {
  runs: RunRecord[];
  count: number;
}

export interface EvaluationListResponseData {
  evaluations: EvaluationRecord[];
  count: number;
}

export interface SeedCaseListResponseData {
  cases: CaseRecord[];
  count: number;
}

export interface SeedDocumentListResponseData {
  documents: DocumentRecord[];
  count: number;
}

export interface NamespacePlaceholderData {
  namespace: 'tools' | 'seed';
  environment: Environment;
  routes: string[];
  status: 'reserved' | 'active';
}

export interface RunCreateRequest {
  projectId: ProjectId;
  inputRef: string;
  status?: DemoRunStatus;
  promptVersionId?: string | null;
  summary?: string | null;
}

export interface EvaluationCreateRequest {
  runId: string;
  projectId: ProjectId;
  status: EvaluationStatus;
  score: number;
  schemaValid: boolean;
  policyPass: boolean;
  fallbackTriggered: boolean;
  groundednessScore?: number | null;
  notes?: string | null;
  summary?: string | null;
  createdAt?: string | null;
}

export interface ToolInvocationCreateRequest {
  runId: string;
  projectId: ProjectId;
  toolName: string;
  inputSummary: string;
  outputSummary: string;
  success: boolean;
  durationMs: number;
  createdAt?: string | null;
}

export interface CustomerProfileLookupRequest {
  customerId: string;
}

export interface PaymentCaseLookupRequest {
  caseId: string;
}

export interface AccountProfileLookupRequest {
  accountId: string;
}

export interface EscalationCreatePlaceholderRequest {
  projectId: ProjectId;
  runId?: string | null;
  ownerId?: string | null;
  reason: string;
  title?: string | null;
}

export interface SeedCasesQuery {
  projectId?: ProjectId;
  limit?: number;
}

export interface SeedDocumentsQuery {
  projectId?: ProjectId;
  kind?: DocumentRecord['kind'];
  limit?: number;
}

export interface RunCreateResponseData {
  run: RunRecord;
}

export interface RunDetailResponseData {
  run: RunRecord;
}

export interface EvaluationCreateResponseData {
  evaluation: EvaluationRecord;
}

export interface ToolInvocationCreateResponseData {
  toolInvocation: ToolInvocationRecord;
}

export interface ToolInvocationListResponseData {
  toolInvocations: ToolInvocationRecord[];
  count: number;
}

export interface CustomerProfileLookupResponseData {
  customerProfile: CustomerProfileRecord;
}

export interface PaymentCaseLookupResponseData {
  paymentCase: CaseRecord;
}

export interface AccountProfileLookupResponseData {
  accountProfile: AccountProfileRecord;
}

export interface PolicySearchResponseData {
  matches: PolicySearchMatch[];
  count: number;
}

export interface EventTimelineResponseData {
  events: TimelineEventRecord[];
  count: number;
}

export interface EscalationCreatePlaceholderResponseData {
  escalation: EscalationPreviewRecord;
}
