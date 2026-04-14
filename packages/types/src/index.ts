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
export const projectModuleIds = projectIds;
export type ProjectModuleId = ProjectId;
export type WorkflowModuleId = ProjectId;

export const demoRunStatuses = [
  'queued',
  'running',
  'completed',
  'failed',
  'escalated',
] as const;

export type DemoRunStatus = (typeof demoRunStatuses)[number];

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

export const projectStatuses = ['planned', 'active', 'live'] as const;
export type ProjectStatus = (typeof projectStatuses)[number];

export const evaluationStatuses = ['passed', 'warning', 'failed'] as const;
export type EvaluationStatus = (typeof evaluationStatuses)[number];

export const evaluationFlagTypes = [
  'low_confidence',
  'schema_invalid',
  'fallback_triggered',
  'policy_review_required',
  'missing_sources',
  'latency_exceeded',
] as const;

export type EvaluationFlagType = (typeof evaluationFlagTypes)[number];

export type EvaluationFlagSeverity = 'info' | 'warning' | 'critical';

export interface EvaluationFlag {
  type: EvaluationFlagType;
  severity: EvaluationFlagSeverity;
  message?: string;
}

export type FlaggedRunReason = EvaluationFlagType;

export interface FlaggedRunSummary {
  runId: string;
  projectId: ProjectId;
  evaluationStatus: EvaluationStatus;
  flagged: boolean;
  reasons: FlaggedRunReason[];
  highestSeverity: EvaluationFlagSeverity | null;
  fallbackTriggered: boolean;
  score: number | null;
  confidence: number | null;
  latencyMs: number | null;
  summary: string;
}

export const toolInvocationStatuses = ['completed', 'failed'] as const;
export type ToolInvocationStatus = (typeof toolInvocationStatuses)[number];

export const escalationStatuses = ['open', 'reviewed', 'resolved'] as const;
export type EscalationStatus = (typeof escalationStatuses)[number];

export const caseStatuses = ['open', 'reviewed', 'closed'] as const;
export type CaseStatus = (typeof caseStatuses)[number];

export const casePriorities = ['low', 'medium', 'high'] as const;
export type CasePriority = (typeof casePriorities)[number];

export const promptVersionStatuses = [
  'candidate',
  'active',
  'retired',
] as const;
export type PromptVersionStatus = (typeof promptVersionStatuses)[number];

export const accessCodeStatuses = ['inactive', 'preview', 'revoked'] as const;
export type AccessCodeStatus = (typeof accessCodeStatuses)[number];

export const paymentExceptionTypes = [
  'settlement_mismatch',
  'duplicate_charge',
  'refund_delay',
  'authorization_dispute',
  'unknown',
] as const;

export type PaymentExceptionType = (typeof paymentExceptionTypes)[number];

export const paymentReviewRecommendedActions = [
  'approve_adjustment',
  'request_more_info',
  'escalate_to_human',
  'close_case_no_action',
] as const;

export type PaymentReviewRecommendedAction =
  (typeof paymentReviewRecommendedActions)[number];

export const investingOpsIssueCategories = [
  'missing_documents',
  'suitability_review',
  'allocation_question',
  'pending_verification',
  'general_ops',
] as const;

export type InvestingOpsIssueCategory =
  (typeof investingOpsIssueCategories)[number];

export const legacySubmissionStatuses = [
  'accepted',
  'rejected',
  'needs_review',
] as const;

export type LegacySubmissionStatus = (typeof legacySubmissionStatuses)[number];

export interface PaymentReviewOutput {
  caseSummary: string;
  exceptionType: PaymentExceptionType;
  recommendedAction: PaymentReviewRecommendedAction;
  rationale: string[];
  confidence: number;
  complianceFlags: string[];
  humanReviewRequired: boolean;
}

export interface InvestingOpsOutput {
  accountSummary: string;
  issueCategory: InvestingOpsIssueCategory;
  recommendedNextActions: string[];
  citedSources: string[];
  confidence: number;
  humanReviewRequired: boolean;
  internalCaseNote: string;
}

export interface LegacyAdapterOutput {
  normalizedInput: JsonObject;
  legacySubmissionStatus: LegacySubmissionStatus;
  validationIssues: string[];
  suggestedNextStep: string;
  confidence: number;
}

export const moduleVisibilityStates = ['public', 'gated', 'hidden'] as const;

export type ModuleVisibilityState = (typeof moduleVisibilityStates)[number];

export const featureFlagKeys = [
  'demo_access_gate',
  'mock_tools_enabled',
  'observability_live_data',
] as const;

export type FeatureFlagKey = (typeof featureFlagKeys)[number];

export interface FeatureFlagConfig {
  key: FeatureFlagKey;
  enabled: boolean;
  description?: string;
}

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

export interface ProjectModuleSummary {
  id: ProjectModuleId;
  slug: ProjectId;
  title: string;
  shortSummary: string;
  proofTags: string[];
  demoRoute: string;
  projectRoute: string;
  status: ProjectStatus;
  visibility: ModuleVisibilityState;
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

export type ToolInvocation = ToolInvocationRecord;

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
  flags?: EvaluationFlag[];
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

export type PromptVersion = PromptVersionRecord;

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

export type SeedDocument = DocumentRecord;

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

export type SeedCase = CaseRecord;

export const seedCaseGroups = ['payment', 'investing', 'legacy'] as const;

export type SeedCaseGroup = (typeof seedCaseGroups)[number];

export const seedDataGroupIds = [
  'payment-cases',
  'investing-cases',
  'legacy-intakes',
  'policy-documents',
] as const;

export type SeedDataGroupId = (typeof seedDataGroupIds)[number];

export type SeedDataSourceKind = 'file_seed' | 'firestore_runtime';

export interface SeedDataGroupDescriptor {
  id: SeedDataGroupId;
  recordKind: 'case' | 'document';
  source: 'file_seed';
  projectId?: ProjectId;
  caseGroup?: SeedCaseGroup;
}

export interface SeedDataLoaderContract {
  source: 'file_seed';
  listCases(group: SeedCaseGroup, query?: SeedCasesQuery): Promise<SeedCase[]>;
  listDocuments(query?: SeedDocumentsQuery): Promise<SeedDocument[]>;
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

export type ApiResponseEnvelope<T> = ApiSuccessEnvelope<T> | ApiErrorEnvelope;
export type ErrorResponse = ApiErrorEnvelope;
export type SuccessEnvelope<T> = ApiSuccessEnvelope<T>;

export interface ProjectScopedListQuery {
  projectId?: ProjectId;
}

export interface ListResponse<T> {
  items: T[];
  count: number;
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
