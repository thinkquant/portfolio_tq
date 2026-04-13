export type PortfolioProject = {
  id: string;
  title: string;
  href: string;
  demoHref: string;
  summary: string;
  status: string;
  proofTags: string[];
  focus: string;
  problem: string;
  whyItMatters: string;
  architecture: string;
  workflowSteps: string[];
  safetyAndEvaluation: string;
  stackTags: string[];
  proves: string[];
};

export const portfolioProjects: PortfolioProject[] = [
  {
    id: 'payment-exception-review',
    title: 'Payment Exception Review Agent',
    href: '/projects/payment-exception-review',
    demoHref: '/demo/payment-exception-review',
    summary:
      'A confidence-aware review workflow for payment exception cases, combining unstructured intake, typed outputs, tool calls, fallback logic, and escalation paths.',
    status: 'Flagship regulated-ops demo',
    proofTags: ['Structured output', 'Tool calls', 'Escalation', 'Traceability'],
    focus:
      'Shows how a high-friction operational review can become a controlled AI-native workflow without losing reviewability.',
    problem:
      'Payment operations teams often review exception cases by stitching together structured transaction metadata and messy notes from customers, processors, support, and analysts. That manual path is slow, inconsistent, and difficult to audit.',
    whyItMatters:
      'This is a direct fit for fintech operations because payment review needs speed, consistency, and controlled escalation. The page frames the work as an AI-native assistant for regulated-like workflows, not an autonomous money-movement system.',
    architecture:
      'The planned service receives mixed case intake, normalizes it, calls internal-style tools for transaction, customer, dispute, and policy context, validates a typed decision schema, then applies confidence and policy checks before persisting trace and evaluation records.',
    workflowSteps: [
      'Select or enter a synthetic exception case with structured fields and unstructured notes.',
      'Extract candidate facts and gather context through transaction, customer, dispute, and policy tools.',
      'Return a typed recommendation with rationale, confidence, compliance flags, and human-review status.',
      'Persist run, tool trace, schema validation, fallback, escalation, and evaluation data for later dashboard review.',
    ],
    safetyAndEvaluation:
      'Fallback policy is explicit: parse failures retry once, low confidence escalates, policy conflicts escalate, and missing fields request more information. Evaluation should confirm schema validity, confidence threshold behavior, escalation logic, and visible tool traces.',
    stackTags: ['React', 'TypeScript', 'Cloud Run API', 'Firestore traces', 'Vertex AI', 'Zod-style schema'],
    proves: [
      'Manual operational review can be reframed as a structured agent workflow.',
      'Tool calls and typed outputs can make model behavior inspectable.',
      'Fallback and escalation rules can preserve human control in sensitive flows.',
    ],
  },
  {
    id: 'investing-ops-copilot',
    title: 'Intelligent Investing Operations Copilot',
    href: '/projects/investing-ops-copilot',
    demoHref: '/demo/investing-ops-copilot',
    summary:
      'A wealth-operations copilot shaped around retrieval, policy context, grounded responses, and safe next-action support.',
    status: 'Wealth operations workflow',
    proofTags: ['Retrieval', 'Policy context', 'Citations', 'Safe actioning'],
    focus:
      'Demonstrates grounded assistance for internal investing operations where source context and boundaries matter.',
    problem:
      'Internal investing and wealth operations teams answer repeated account-state questions by searching across account records, onboarding status, event timelines, notes, and policy documents.',
    whyItMatters:
      'This module maps to intelligent investing operations without crossing into financial advice or autonomous restricted action. The reviewer should see a controlled copilot that speeds up support work while keeping policy context visible.',
    architecture:
      'The planned service combines live account-context tools with simple retrieval over a synthetic policy corpus, then produces a structured answer with cited sources, next actions, confidence, human-review status, and an internal case note.',
    workflowSteps: [
      'Choose a synthetic account and ask an internal operations question.',
      'Fetch account profile, suitability flags, onboarding status, and event timeline through tools.',
      'Retrieve relevant policy documents and ground the answer in cited sources.',
      'Return a structured response with safe next actions, confidence, review status, and trace data.',
    ],
    safetyAndEvaluation:
      'Safety rules prohibit live trading, investment advice, and autonomous restricted actions. Evaluation should check citation presence, policy-sensitive escalation, confidence behavior, retrieval trace visibility, and structured output validity.',
    stackTags: ['React', 'TypeScript', 'RAG', 'Tool calling', 'Policy corpus', 'Firestore evals'],
    proves: [
      'Retrieval and tool context can make internal copilot answers more grounded.',
      'A workflow can provide useful next steps without unsafe autonomous action.',
      'Citations, confidence, and trace views turn a chat-like surface into reviewable software.',
    ],
  },
  {
    id: 'legacy-ai-adapter',
    title: 'Legacy Workflow to AI-Native Service Adapter',
    href: '/projects/legacy-ai-adapter',
    demoHref: '/demo/legacy-ai-adapter',
    summary:
      'A practical path for wrapping deterministic legacy processes with structured AI-native intake, validation, transformation, and auditability.',
    status: 'Transformation adapter',
    proofTags: ['Adapter pattern', 'Validation', 'Typed payloads', 'Audit trail'],
    focus:
      'Turns messy inputs into validated legacy payloads while preserving the deterministic checks that keep the system safe.',
    problem:
      'Legacy services often require strict payloads and expose awkward statuses, leaving humans to manually normalize messy real-world input before anything can be submitted safely.',
    whyItMatters:
      'This is the clearest hybrid deterministic/probabilistic example: use AI where messy intake needs interpretation, then keep deterministic validation and legacy contracts where correctness matters.',
    architecture:
      'The planned adapter accepts messy text or semi-structured form input, extracts typed fields, runs deterministic validators, transforms the result into a strict legacy payload, submits to a mock legacy service, and returns a modern typed response.',
    workflowSteps: [
      'Enter a messy intake example or select a synthetic case.',
      'Extract normalized fields from the intake and show the before/after contrast.',
      'Run deterministic validation before transforming the payload for the legacy service.',
      'Show the legacy response and a typed human-readable final status, including failure or needs-review paths.',
    ],
    safetyAndEvaluation:
      'The deterministic validator remains the control point. Evaluation should make validation issues, rejected submissions, confidence, and the transformed legacy payload visible enough that a reviewer can inspect both success and failure paths.',
    stackTags: ['React', 'TypeScript', 'Adapter pattern', 'Mock legacy service', 'Validation rules', 'Typed payloads'],
    proves: [
      'Legacy workflows can be modernized without discarding safe control logic.',
      'AI-native intake can sit in front of strict deterministic systems.',
      'Before/after payload visibility makes migration thinking concrete.',
    ],
  },
  {
    id: 'eval-console',
    title: 'Evaluation and Reliability Console',
    href: '/projects/eval-console',
    demoHref: '/demo/eval-console',
    summary:
      'An operational view over AI workflow quality: latency, cost, schema validity, fallbacks, confidence thresholds, and prompt/version comparison.',
    status: 'Evaluation backbone',
    proofTags: ['Evaluation', 'Observability', 'Cost', 'Fallbacks'],
    focus:
      'Makes the reliability layer visible so the portfolio proves not only that demos run, but that their behavior can be inspected.',
    problem:
      'AI demos are easy to show as happy paths. Trustworthy systems need run history, metrics, failure visibility, prompt/version comparison, and evaluation standards that explain what happened when a run succeeds or fails.',
    whyItMatters:
      'This module demonstrates production-minded AI engineering: cost-aware execution, observability, latency and fallback visibility, schema checks, and evaluation dimensions that matter to senior reviewers.',
    architecture:
      'The console consumes run and evaluation records from the other demo modules, then surfaces tables, charts, flagged runs, run detail, latency, cost, fallback rates, confidence behavior, and prompt/version comparisons.',
    workflowSteps: [
      'Aggregate synthetic run and evaluation records across the demo projects.',
      'Filter by project, status, and date while retaining access to flagged run details.',
      'Show quality signals such as schema validity, fallback rate, confidence, escalation, latency, and cost.',
      'Compare prompt or run versions to make reliability work visible, not implied.',
    ],
    safetyAndEvaluation:
      'The console is the evaluation layer itself. It should expose schema validity, confidence thresholds, citation presence, policy pass/fail, fallback and escalation status, latency thresholds, unsupported-claim flags, and recent errors.',
    stackTags: ['React', 'TypeScript', 'Dashboard shell', 'Firestore records', 'Cloud Run feeds', 'Evaluation metrics'],
    proves: [
      'Reliability and observability are product surfaces, not afterthoughts.',
      'A portfolio demo can show failure handling and cost/latency tradeoffs directly.',
      'Cross-demo evaluation gives reviewers evidence beyond polished example outputs.',
    ],
  },
];

export function findPortfolioProject(
  href: string,
): PortfolioProject | undefined {
  return portfolioProjects.find((project) => project.href === href);
}

export function findPortfolioProjectByDemoHref(
  demoHref: string,
): PortfolioProject | undefined {
  return portfolioProjects.find((project) => project.demoHref === demoHref);
}
