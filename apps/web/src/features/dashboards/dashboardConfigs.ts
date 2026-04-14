import { evalConsoleDemoCopy } from '@/content/demoCopy';
import { shellCopy } from '@/content/sharedCopy';

import type { DashboardShellConfig } from './DashboardShell';

const sharedCharts = [
  {
    title: 'Latency and cost baseline',
    description:
      'Tracks median latency, p95 latency, and estimated cost as runs become available.',
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
    title: 'Reliability signal baseline',
    description:
      'Tracks schema validity, fallback rate, low-confidence rate, and escalation rate.',
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
    { label: 'Public-safe', tone: 'success' },
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
      detail: 'Median response time from recorded runs.',
    },
    {
      label: 'estimated cost',
      value: '--',
      detail: 'Estimated model and tool cost per run.',
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
        value: 'Timeline from run start through completion or failure.',
      },
      {
        label: 'evaluation',
        value:
          'Schema, confidence, latency, fallback, and project-specific checks land here.',
      },
      {
        label: 'debug note',
        value:
          'Failures stay explainable without exposing secrets or private data.',
      },
    ],
  },
  recentRunsTitle: 'Latest runs',
  flaggedRunsTitle: 'Latest flagged runs',
};

export const evalConsoleDashboardConfig: DashboardShellConfig = {
  eyebrow: 'Demo',
  title: evalConsoleDemoCopy.title,
  lead: evalConsoleDemoCopy.subhead,
  tags: [
    { label: shellCopy.states.loadingLabel, tone: 'accent' },
    { label: shellCopy.states.flaggedLabel, tone: 'warning' },
    { label: 'Comparison' },
  ],
  metrics: evalConsoleDemoCopy.metricLabels.map((label, index) => ({
    label,
    value: '--',
    detail: shellCopy.states.noDataBody,
    tone: index === 4 ? 'success' : index === 5 ? 'warning' : 'neutral',
  })),
  charts: [
    ...sharedCharts,
    {
      title: evalConsoleDemoCopy.comparisonTitle,
      description: evalConsoleDemoCopy.comparisonBody,
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
      status: shellCopy.states.loadingLabel,
      signal: evalConsoleDemoCopy.recentRunsColumns.join(', '),
    },
    {
      id: 'eval-run-002',
      project: 'Investing Operations Copilot',
      status: shellCopy.states.loadingLabel,
      signal: evalConsoleDemoCopy.recentRunsEmpty,
    },
    {
      id: 'eval-run-003',
      project: 'Legacy AI Adapter',
      status: shellCopy.states.loadingLabel,
      signal: evalConsoleDemoCopy.recentRunsEmpty,
    },
  ],
  flaggedRuns: [
    {
      id: 'flag-low-confidence',
      project: 'Cross-demo',
      status: shellCopy.states.flaggedLabel,
      signal: evalConsoleDemoCopy.flaggedRunsBody,
    },
    {
      id: 'flag-fallback',
      project: 'Cross-demo',
      status: shellCopy.states.flaggedLabel,
      signal: evalConsoleDemoCopy.flaggedRunsBody,
    },
  ],
  detail: {
    title: evalConsoleDemoCopy.runDetailTitle,
    rows: evalConsoleDemoCopy.runDetailFields.map((field) => ({
      label: field,
      value: shellCopy.states.noDataBody,
    })),
  },
  recentRunsTitle: evalConsoleDemoCopy.recentRunsTitle,
  recentRunsLead: evalConsoleDemoCopy.recentRunsColumns.join(', '),
  flaggedRunsTitle: evalConsoleDemoCopy.flaggedRunsTitle,
  flaggedRunsLead: evalConsoleDemoCopy.flaggedRunsBody,
  detailLead: evalConsoleDemoCopy.runDetailFields.join(', '),
  footerNote: evalConsoleDemoCopy.footerNote,
};
