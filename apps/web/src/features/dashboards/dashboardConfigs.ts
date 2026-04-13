import { siteCopy } from '@/content/textCopy';

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
  title: 'Cross-project operational signals.',
  lead: 'Aggregate run counts, pass and fail patterns, latency, cost, fallback behavior, and latest flagged cases across the portfolio workflows.',
  tags: [
    { label: 'Portfolio overview', tone: 'accent' },
    { label: 'Cross-demo visibility' },
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
  recentRunsTitle: 'Latest runs',
  flaggedRunsTitle: 'Latest flagged runs',
};

export const evalConsoleDashboardConfig: DashboardShellConfig = {
  eyebrow: 'Demo',
  title: siteCopy.demos.evalConsole.title,
  lead: siteCopy.demos.evalConsole.subhead,
  tags: [
    { label: siteCopy.shell.states.loadingLabel, tone: 'accent' },
    { label: siteCopy.shell.states.flaggedLabel, tone: 'warning' },
    { label: 'Comparison' },
  ],
  metrics: siteCopy.demos.evalConsole.metricLabels.map((label, index) => ({
      label,
      value: '--',
      detail: siteCopy.shell.states.noDataBody,
      tone:
        index === 4
          ? 'success'
          : index === 5
            ? 'warning'
            : 'neutral',
    })),
  charts: [
    ...sharedCharts,
    {
      title: siteCopy.demos.evalConsole.comparisonTitle,
      description: siteCopy.demos.evalConsole.comparisonBody,
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
      status: siteCopy.shell.states.loadingLabel,
      signal: siteCopy.demos.evalConsole.recentRunsColumns.join(', '),
    },
    {
      id: 'eval-run-002',
      project: 'Investing Operations Copilot',
      status: siteCopy.shell.states.loadingLabel,
      signal: siteCopy.demos.evalConsole.recentRunsEmpty,
    },
    {
      id: 'eval-run-003',
      project: 'Legacy AI Adapter',
      status: siteCopy.shell.states.loadingLabel,
      signal: siteCopy.demos.evalConsole.recentRunsEmpty,
    },
  ],
  flaggedRuns: [
    {
      id: 'flag-low-confidence',
      project: 'Cross-demo',
      status: siteCopy.shell.states.flaggedLabel,
      signal: siteCopy.demos.evalConsole.flaggedRunsBody,
    },
    {
      id: 'flag-fallback',
      project: 'Cross-demo',
      status: siteCopy.shell.states.flaggedLabel,
      signal: siteCopy.demos.evalConsole.flaggedRunsBody,
    },
  ],
  detail: {
    title: siteCopy.demos.evalConsole.runDetailTitle,
    rows: siteCopy.demos.evalConsole.runDetailFields.map((field) => ({
      label: field,
      value: siteCopy.shell.states.noDataBody,
    })),
  },
  backendNote:
    'Hydrate this route from GET /api/runs, GET /api/runs/:id, GET /api/evaluations, and GET /api/projects/:projectId/metrics once the demo runtimes emit real records.',
  recentRunsTitle: siteCopy.demos.evalConsole.recentRunsTitle,
  recentRunsLead: siteCopy.demos.evalConsole.recentRunsColumns.join(', '),
  flaggedRunsTitle: siteCopy.demos.evalConsole.flaggedRunsTitle,
  flaggedRunsLead: siteCopy.demos.evalConsole.flaggedRunsBody,
  detailLead: siteCopy.demos.evalConsole.runDetailFields.join(', '),
  footerNote: siteCopy.demos.evalConsole.footerNote,
};
