export type DemoPanelContent = {
  inputTitle: string;
  inputFields: string[];
  outputTitle: string;
  outputFields: string[];
  traceEvents: string[];
  evaluationSignals: string[];
  backendNote: string;
};

export const demoShellContentByHref: Record<string, DemoPanelContent> = {
  '/demo/payment-exception-review': {
    inputTitle: 'Exception intake',
    inputFields: [
      'Synthetic case selector',
      'Transaction metadata',
      'Customer email and analyst notes',
      'Processor note or support transcript snippet',
    ],
    outputTitle: 'Structured payment review output',
    outputFields: [
      'Case summary',
      'Exception type',
      'Recommended action',
      'Confidence and compliance flags',
      'Human review required',
    ],
    traceEvents: [
      'run.created',
      'lookupTransactionDetails',
      'lookupCustomerProfile',
      'lookupPriorDisputes',
      'searchPaymentPolicy',
      'schema.validated',
      'escalation.created when needed',
    ],
    evaluationSignals: [
      'schema validity',
      'confidence threshold',
      'fallback triggered',
      'escalation required',
    ],
    backendNote:
      'Wire this page to POST /api/demo/payment-exception-review/run, then hydrate trace and evaluation panels from run and evaluation endpoints.',
  },
  '/demo/investing-ops-copilot': {
    inputTitle: 'Investing operations question',
    inputFields: [
      'Synthetic account selector',
      'Internal ops question',
      'Account event timeline',
      'Policy corpus scope',
    ],
    outputTitle: 'Grounded copilot response',
    outputFields: [
      'Account summary',
      'Issue category',
      'Recommended next actions',
      'Cited sources',
      'Internal case note',
    ],
    traceEvents: [
      'run.created',
      'lookupAccountProfile',
      'lookupSuitabilityFlags',
      'lookupOnboardingChecklist',
      'lookupAccountTimeline',
      'searchPolicyDocuments',
      'schema.validated',
    ],
    evaluationSignals: [
      'citation presence',
      'policy pass/fail',
      'confidence threshold',
      'human review required',
    ],
    backendNote:
      'Wire this page to POST /api/demo/investing-ops-copilot/run, then hydrate retrieval trace, tool trace, and evaluation panels from the shared run APIs.',
  },
  '/demo/legacy-ai-adapter': {
    inputTitle: 'Messy legacy intake',
    inputFields: [
      'Synthetic intake example',
      'Free-text messy request',
      'Legacy schema target',
      'Validation rule set',
    ],
    outputTitle: 'Legacy-compatible response',
    outputFields: [
      'Normalized input',
      'Validation issues',
      'Transformed legacy payload',
      'Legacy submission status',
      'Suggested next step',
    ],
    traceEvents: [
      'run.created',
      'intake parsed',
      'schema extracted',
      'deterministic validator completed',
      'legacy payload transformed',
      'mock legacy service responded',
      'schema.validated',
    ],
    evaluationSignals: [
      'validation issue count',
      'legacy acceptance status',
      'confidence threshold',
      'failure path visible',
    ],
    backendNote:
      'Wire this page to POST /api/demo/legacy-ai-adapter/run, then hydrate before/after payload, validator, legacy response, and run trace panels.',
  },
  '/demo/eval-console': {
    inputTitle: 'Evaluation console filters',
    inputFields: [
      'Project filter',
      'Run status filter',
      'Date range',
      'Prompt or run version selector',
    ],
    outputTitle: 'Reliability dashboard output',
    outputFields: [
      'Run table',
      'Flagged run detail',
      'Latency and cost cards',
      'Fallback and confidence rates',
      'Prompt/version comparison',
    ],
    traceEvents: [
      'GET /api/runs',
      'GET /api/evaluations',
      'GET /api/projects/:projectId/metrics',
      'flagged runs loaded',
      'run detail selected',
      'prompt comparison prepared',
    ],
    evaluationSignals: [
      'schema validity',
      'fallback rate',
      'low-confidence rate',
      'latency threshold',
      'estimated cost',
    ],
    backendNote:
      'Wire this page to the run, evaluation, and project metrics feeds so it can consume real records emitted by the other demo modules.',
  },
};
