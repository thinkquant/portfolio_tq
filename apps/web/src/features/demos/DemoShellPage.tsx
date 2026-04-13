import {
  Callout,
  Card,
  EmptyState,
  PageHeading,
  SectionHeading,
} from '@portfolio-tq/ui';
import { Link, useLoaderData } from 'react-router-dom';

import { siteCopy } from '@/content/textCopy';

import { RouteDataStateView } from '../../app/RouteDataStateView';
import type { DemoShellPageData } from './demoLoaders';

type DemoShellPageContentProps = {
  content: NonNullable<
    Extract<DemoShellPageData, { status: 'success' }>['data']
  >['content'];
  project: NonNullable<
    Extract<DemoShellPageData, { status: 'success' }>['data']
  >['project'];
};

function PanelList({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 grid gap-3">
      {items.map((item) => (
        <li
          className="rounded-[var(--radius)] border border-border bg-background/70 p-4 leading-7 text-muted-foreground"
          key={item}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function DemoShellPageContent({
  content,
  project,
}: DemoShellPageContentProps) {
  return (
    <div className="grid gap-8">
      <PageHeading
        eyebrow="Demo"
        lead={content.subhead}
        title={content.title}
      />

      <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <SectionHeading
            title={content.inputTitle}
          />
          <PanelList items={content.inputFields} />
          <label className="mt-5 grid gap-2 text-sm font-bold text-foreground">
            Input
            <textarea
              className="min-h-32 resize-y rounded-[var(--radius)] border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground"
              disabled
              placeholder={content.inputFields[0]}
            />
          </label>
          <div className="mt-5 flex flex-wrap gap-3">
            <button className="min-h-11 rounded-[var(--radius)] bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground opacity-75" disabled type="button">
              {content.primaryAction}
            </button>
            <button className="min-h-11 rounded-[var(--radius)] border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground opacity-75" disabled type="button">
              {content.secondaryAction}
            </button>
          </div>
        </Card>

        <Card>
          <SectionHeading
            title={content.outputTitle}
          />
          <PanelList items={content.outputFields} />
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <SectionHeading
            title={content.detailPanelTitle ?? siteCopy.shell.states.noDataTitle}
          />
          {content.detailLabels?.length ? (
            <PanelList items={content.detailLabels} />
          ) : (
            <EmptyState
              message={content.emptyState ?? siteCopy.shell.states.noDataBody}
              title={siteCopy.shell.states.noDataTitle}
            />
          )}
        </Card>

        <section className="grid content-start gap-5">
          <SectionHeading
            title={content.evaluationTitle}
          />
          <div className="grid gap-3">
            {content.evaluationMetrics.map((signal) => (
              <Card className="grid gap-2" key={signal}>
                <p className="text-xs font-black uppercase tracking-[0.12em] text-primary">
                  {signal}
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  {siteCopy.shell.states.noDataBody}
                </p>
              </Card>
            ))}
          </div>
        </section>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        {content.noteTitle && content.noteBody ? (
          <Callout title={content.noteTitle} tone="accent">
            {content.noteBody}
          </Callout>
        ) : (
          <Callout title={siteCopy.shell.states.comingSoonTitle} tone="warning">
            {siteCopy.shell.states.comingSoonBody}
          </Callout>
        )}

        <section className="grid content-start gap-5">
          <SectionHeading
            title="State model"
          />
          <div className="grid gap-3">
            <EmptyState
              message={content.emptyState ?? siteCopy.shell.states.noDataBody}
              title={siteCopy.shell.states.noDataTitle}
            />
            <div className="rounded-[var(--radius)] border border-border bg-muted p-4 leading-7 text-muted-foreground">
              {siteCopy.shell.states.loadingLabel}
            </div>
            {content.stateTitle && content.stateBody ? (
              <Callout title={content.stateTitle} tone="warning">
                {content.stateBody}
              </Callout>
            ) : null}
            {content.successTitle && content.successBody ? (
              <Callout title={content.successTitle} tone="success">
                {content.successBody}
              </Callout>
            ) : null}
          </div>
        </section>
      </section>

      <section className="flex flex-wrap gap-3">
        <Link
          className="inline-flex min-h-11 items-center rounded-[var(--radius)] bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-chart-2 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          to="/demo"
        >
          Back to Demos
        </Link>
        <Link
          className="inline-flex min-h-11 items-center rounded-[var(--radius)] border border-border bg-card px-5 py-2 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          to={project.href}
        >
          Open Module
        </Link>
      </section>
    </div>
  );
}

export function DemoShellPage() {
  const state = useLoaderData() as DemoShellPageData;

  return (
    <RouteDataStateView state={state}>
      {(data) => <DemoShellPageContent {...data} />}
    </RouteDataStateView>
  );
}
