import {
  MetricTile,
  PageHeading,
  ProofTag,
  SectionHeading,
} from '@portfolio-tq/ui';

export type DashboardMetric = {
  label: string;
  value: string;
  detail: string;
  tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger';
};

export type DashboardChart = {
  title: string;
  description: string;
  bars: Array<{
    label: string;
    value: string;
    widthClass: string;
    toneClass: string;
  }>;
};

export type DashboardRun = {
  id: string;
  project: string;
  status: string;
  signal: string;
};

export type DashboardDetail = {
  title: string;
  rows: Array<{
    label: string;
    value: string;
  }>;
};

export type DashboardShellConfig = {
  detailLead?: string;
  eyebrow: string;
  title: string;
  lead: string;
  footerNote?: string;
  flaggedRunsLead?: string;
  flaggedRunsTitle?: string;
  tags: Array<{
    label: string;
    tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger';
  }>;
  metrics: DashboardMetric[];
  charts: DashboardChart[];
  runs: DashboardRun[];
  flaggedRuns: DashboardRun[];
  detail: DashboardDetail;
  recentRunsLead?: string;
  recentRunsTitle?: string;
};

type DashboardShellProps = {
  config: DashboardShellConfig;
};

function DashboardMetricsRow({ metrics }: { metrics: DashboardMetric[] }) {
  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {metrics.map((metric) => (
        <MetricTile
          detail={metric.detail}
          key={metric.label}
          label={metric.label}
          tone={metric.tone ?? 'neutral'}
          value={metric.value}
        />
      ))}
    </section>
  );
}

function ChartPanel({ chart }: { chart: DashboardChart }) {
  return (
    <figure className="grid gap-5 rounded-[var(--radius)] border border-border bg-card p-5 shadow-xl shadow-black/15">
      <figcaption>
        <h3 className="font-serif text-2xl font-semibold leading-tight text-foreground [text-wrap:balance]">
          {chart.title}
        </h3>
        <p className="mt-2 text-base leading-7 text-muted-foreground [text-wrap:pretty]">
          {chart.description}
        </p>
      </figcaption>
      <div className="grid gap-4">
        {chart.bars.map((bar) => (
          <div className="grid gap-2" key={bar.label}>
            <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
              <span>{bar.label}</span>
              <strong className="font-mono text-foreground">{bar.value}</strong>
            </div>
            <div className="h-3 overflow-hidden rounded-[var(--radius)] bg-background/80">
              <div
                className={`h-full rounded-lg ${bar.toneClass} ${bar.widthClass}`}
              />
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}

function RunListPanel({
  lead,
  runs,
  title,
  variant = 'neutral',
}: {
  lead: string;
  runs: DashboardRun[];
  title: string;
  variant?: 'neutral' | 'flagged';
}) {
  return (
    <section className="grid content-start gap-5 rounded-[var(--radius)] border border-border bg-card p-5 shadow-xl shadow-black/15">
      <SectionHeading
        eyebrow={variant === 'flagged' ? 'Review queue' : 'Run stream'}
        lead={lead}
        title={title}
      />
      <div className="grid gap-3">
        {runs.map((run) => (
          <article
            className="grid gap-2 rounded-[var(--radius)] border border-border bg-background/70 p-4"
            key={run.id}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-sm text-primary">{run.id}</span>
              <ProofTag tone={variant === 'flagged' ? 'warning' : 'neutral'}>
                {run.status}
              </ProofTag>
            </div>
            <p className="text-base leading-7 text-card-foreground">
              {run.project}
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              {run.signal}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function DetailPanel({
  detail,
  lead,
}: {
  detail: DashboardDetail;
  lead: string;
}) {
  return (
    <section className="grid content-start gap-5 rounded-[var(--radius)] border border-border bg-card p-5 shadow-xl shadow-black/15">
      <SectionHeading
        eyebrow="Selected record"
        lead={lead}
        title={detail.title}
      />
      <dl className="grid gap-3">
        {detail.rows.map((row) => (
          <div
            className="grid gap-2 rounded-[var(--radius)] border border-border bg-background/70 p-4"
            key={row.label}
          >
            <dt className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-primary">
              {row.label}
            </dt>
            <dd className="text-base leading-7 text-muted-foreground">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function DashboardShell({ config }: DashboardShellProps) {
  return (
    <div className="grid gap-10 lg:gap-12">
      <PageHeading
        actions={config.tags.map((tag) => (
          <ProofTag key={tag.label} tone={tag.tone ?? 'neutral'}>
            {tag.label}
          </ProofTag>
        ))}
        eyebrow={config.eyebrow}
        lead={config.lead}
        title={config.title}
      />

      <DashboardMetricsRow metrics={config.metrics} />

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        {config.charts.map((chart) => (
          <ChartPanel chart={chart} key={chart.title} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,0.95fr)_minmax(0,1.1fr)]">
        <RunListPanel
          lead={
            config.recentRunsLead ??
            'Recent run records will appear here as activity is captured.'
          }
          runs={config.runs}
          title={config.recentRunsTitle ?? 'Recent runs'}
        />
        <RunListPanel
          lead={
            config.flaggedRunsLead ??
            'Flagged records show control-boundary hits that need review.'
          }
          runs={config.flaggedRuns}
          title={config.flaggedRunsTitle ?? 'Runs needing attention'}
          variant="flagged"
        />
        <DetailPanel
          detail={config.detail}
          lead={config.detailLead ?? detailRowsToLead(config.detail.rows)}
        />
      </section>

      {config.footerNote ? (
        <p className="max-w-[68ch] text-base leading-7 text-muted-foreground [text-wrap:pretty]">
          {config.footerNote}
        </p>
      ) : null}
    </div>
  );
}

function detailRowsToLead(rows: DashboardDetail['rows']): string {
  return rows.map((row) => row.label).join(', ');
}
