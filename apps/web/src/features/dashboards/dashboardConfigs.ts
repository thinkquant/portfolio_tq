import type { DashboardShellConfig } from './DashboardShell';

const sharedCharts = [
  {
    title: 'Latency and cost placeholder',
    description:
      'Reserved chart space for median latency, p95 latency, and estimated cost per project once run data is hydrated.',
    bars: [
      {
        label: 'median latency',
        value: 'pending',
        widthClass: 'w-7/12',
        toneClass: 'bg-chart-1',
      },
      {
        label: 'p95 latency',
        value: 'pending',
        widthClass: 'w-10/12',
        toneClass: 'bg-chart-2',
      },
      {
        label: 'estimated cost',
        value: 'pending',
        widthClass: 'w-5/12',
        toneClass: 'bg-chart-3',
      },
    ],
  },
  {
    title: 'Reliability signal placeholder',
    description:
      'Reserved chart space for schema validity, fallback rate, low-confidence rate, and escalation rate.',
    bars: [
      {
        label: 'schema valid',
        value: 'pending',
        widthClass: 'w-11/12',
        toneClass: 'bg-chart-3',
      },
      {
        label: 'fallback rate',
        value: 'pending',
        widthClass: 'w-4/12',
        toneClass: 'bg-chart-4',
      },
      {
        label: 'confidence flags',
        value: 'pending',
        widthClass: 'w-3/12',
        toneClass: 'bg-chart-5',
      },
    ],
  },
];

export const observabilityDashboardConfig: DashboardShellConfig = {
  eyebrow: 'Observability',
  title: 'Cross-project operational signal shell.',
  lead: 'A portfolio-level observability surface for run counts, failures, fallbacks, latency, cost, confidence, schema validity, and latest flagged runs across the demo system.',
  tags: [
    { label: 'Portfolio overview', tone: 'accent' },
    { label: 'Firestore-backed later' },
    { label: 'Public-safe shell', tone: 'success' },
  ],
  metrics: [
    {
      label: 'runs',
      value: '--',
      detail: 'Total runs across the demo modules.',
      tone: 'accent',
    },
    {
      label: 'schema validity',
      value: '--',
      detail: 'Share of runs with valid structured outputs.',
      tone: 'success',
    },
    {
      label: 'fallback rate',
      value: '--',
      detail: 'Fallback-triggered runs from the shared event stream.',
      tone: 'warning',
    },
    {
      label: 'confidence flags',
      value: '--',
      detail: 'Low-confidence or review-required runs.',
      tone: 'warning',
    },
    {
      label: 'median latency',
      value: '--',
      detail: 'API runtime signal from persisted run records.',
    },
    {
      label: 'estimated cost',
      value: '--',
      detail: 'Estimated model/tool cost once execution is wired.',
    },
  ],
  charts: sharedCharts,
  runs: [
    {
      id: 'run-pending-001',
      project: 'Payment Exception Review Agent',
      status: 'empty',
      signal: 'Will show latest run status, latency, and schema outcome.',
    },
    {
      id: 'run-pending-002',
      project: 'Investing Operations Copilot',
      status: 'empty',
      signal: 'Will show citation and policy evaluation status.',
    },
    {
      id: 'run-pending-003',
      project: 'Legacy AI Adapter',
      status: 'empty',
      signal: 'Will show validator and legacy submission status.',
    },
  ],
  flaggedRuns: [
    {
      id: 'flag-pending-001',
      project: 'Any demo module',
      status: 'flag slot',
      signal: 'Low confidence, fallback, unsupported claim, or schema issue.',
    },
    {
      id: 'flag-pending-002',
      project: 'Any demo module',
      status: 'flag slot',
      signal: 'Escalation or human-review-required path.',
    },
  ],
  detail: {
    title: 'Selected run detail',
    rows: [
      {
        label: 'trace',
        value: 'Timeline will show run.created through run.completed or run.failed events.',
      },
      {
        label: 'evaluation',
        value: 'Schema, confidence, latency, fallback, and project-specific checks land here.',
      },
      {
        label: 'debug note',
        value: 'Failures should be explainable without exposing secrets or private data.',
      },
    ],
  },
  backendNote:
    'Hydrate this route from GET /api/observability/overview, GET /api/runs, GET /api/evaluations, and GET /api/projects/:projectId/metrics.',
};

export const evalConsoleDashboardConfig: DashboardShellConfig = {
  eyebrow: 'Evaluation console',
  title: 'Reliability console shell for AI workflow runs.',
  lead: 'A route-level monitoring console for run history, pass/fail summaries, latency, estimated cost, fallback rate, low-confidence rate, prompt/version comparison, and flagged run investigation.',
  tags: [
    { label: 'Run table', tone: 'accent' },
    { label: 'Flagged runs', tone: 'warning' },
    { label: 'Prompt comparison' },
  ],
  metrics: [
    {
      label: 'success rate',
      value: '--',
      detail: 'Pass/fail summary across selected demo runs.',
      tone: 'success',
    },
    {
      label: 'latency',
      value: '--',
      detail: 'Median and threshold status for selected run set.',
      tone: 'accent',
    },
    {
      label: 'cost',
      value: '--',
      detail: 'Estimated total and per-project execution cost.',
    },
    {
      label: 'schema validity',
      value: '--',
      detail: 'Structured output contract pass rate.',
      tone: 'success',
    },
    {
      label: 'fallback rate',
      value: '--',
      detail: 'Runs that required fallback behavior.',
      tone: 'warning',
    },
    {
      label: 'confidence flags',
      value: '--',
      detail: 'Low-confidence, review-required, or escalation-triggered runs.',
      tone: 'danger',
    },
  ],
  charts: [
    ...sharedCharts,
    {
      title: 'Prompt/version comparison placeholder',
      description:
        'Reserved comparison view for candidate versus active prompts and run-version behavior.',
      bars: [
        {
          label: 'active prompt',
          value: 'baseline',
          widthClass: 'w-8/12',
          toneClass: 'bg-chart-1',
        },
        {
          label: 'candidate prompt',
          value: 'pending',
          widthClass: 'w-6/12',
          toneClass: 'bg-chart-2',
        },
      ],
    },
  ],
  runs: [
    {
      id: 'eval-run-001',
      project: 'Payment Exception Review Agent',
      status: 'pending data',
      signal: 'Schema valid, confidence, fallback, escalation, and latency will appear here.',
    },
    {
      id: 'eval-run-002',
      project: 'Investing Operations Copilot',
      status: 'pending data',
      signal: 'Citation presence, policy pass/fail, and confidence will appear here.',
    },
    {
      id: 'eval-run-003',
      project: 'Legacy AI Adapter',
      status: 'pending data',
      signal: 'Validation issues, legacy status, and failure path will appear here.',
    },
  ],
  flaggedRuns: [
    {
      id: 'flag-low-confidence',
      project: 'Cross-demo',
      status: 'flag slot',
      signal: 'Low-confidence or unsupported-claim flags land here.',
    },
    {
      id: 'flag-fallback',
      project: 'Cross-demo',
      status: 'flag slot',
      signal: 'Fallback, escalation, or policy conflict runs land here.',
    },
  ],
  detail: {
    title: 'Run detail inspector',
    rows: [
      {
        label: 'inputs',
        value: 'Selected run input reference and project metadata.',
      },
      {
        label: 'trace',
        value: 'Tool calls, retrieval calls, schema validation, fallback, and run status events.',
      },
      {
        label: 'evaluation',
        value: 'Schema valid, confidence threshold, latency threshold, policy pass/fail, and cost.',
      },
    ],
  },
  backendNote:
    'Hydrate this route from GET /api/runs, GET /api/runs/:id, GET /api/evaluations, and GET /api/projects/:projectId/metrics once the demo runtimes emit real records.',
};
