import {
  Callout,
  Card,
  EmptyState,
  MetricTile,
  PageHeading,
  ProofTag,
  SectionHeading,
} from '@portfolio-tq/ui';
import { Link, useLoaderData } from 'react-router-dom';

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
          className="rounded-lg border border-white/10 bg-white/[0.03] p-4 leading-7 text-stone-300"
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
        actions={
          <>
            <ProofTag tone="accent">Route shell</ProofTag>
            <ProofTag>Backend-ready</ProofTag>
            <ProofTag tone="warning">No live run yet</ProofTag>
          </>
        }
        eyebrow="Demo"
        lead={project.summary}
        title={`${project.title} Demo`}
      />

      <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <SectionHeading
            eyebrow="Input panel area"
            lead="This area will become the reviewer-facing intake form once the demo runtime is connected."
            title={content.inputTitle}
          />
          <PanelList items={content.inputFields} />
          <label className="mt-5 grid gap-2 text-sm font-bold text-stone-300">
            Reviewer input placeholder
            <textarea
              className="min-h-32 resize-y rounded-lg border border-white/10 bg-stone-950/70 p-4 text-sm leading-6 text-stone-300"
              disabled
              placeholder="Synthetic demo input will land here."
            />
          </label>
        </Card>

        <Card>
          <SectionHeading
            eyebrow="Output panel area"
            lead="This panel reserves the structured output shape that the API response will hydrate later."
            title={content.outputTitle}
          />
          <PanelList items={content.outputFields} />
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <SectionHeading
            eyebrow="Trace / timeline area"
            lead="The timeline follows the shared observability event vocabulary and the project-specific tool/retrieval flow."
            title="Execution trace placeholder."
          />
          <ol className="mt-5 grid gap-3">
            {content.traceEvents.map((event, index) => (
              <li
                className="grid gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-4"
                key={event}
              >
                <span className="font-mono text-xs text-amber-200">
                  T+{String(index).padStart(2, '0')}
                </span>
                <p className="leading-7 text-stone-300">{event}</p>
              </li>
            ))}
          </ol>
        </Card>

        <section className="grid content-start gap-5">
          <SectionHeading
            eyebrow="Evaluation / metrics area"
            lead="These are the quality signals the demo page will expose after the backend produces run and evaluation records."
            title="Run quality placeholder."
          />
          <div className="grid gap-3">
            {content.evaluationSignals.map((signal) => (
              <MetricTile
                detail="Pending live run data"
                key={signal}
                label={signal}
                tone="neutral"
                value="--"
              />
            ))}
          </div>
        </section>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Callout title="Backend integration landing zone" tone="warning">
          {content.backendNote}
        </Callout>

        <section className="grid content-start gap-5">
          <SectionHeading
            eyebrow="State model"
            lead="The shell reserves the state language that later data-fetching work can use consistently."
            title="Empty, loading, and error states."
          />
          <div className="grid gap-3">
            <EmptyState
              message="No run has been started for this demo route yet."
              title="Empty state"
            />
            <div className="rounded-lg border border-amber-300/40 bg-amber-300/10 p-4 leading-7 text-amber-100">
              Loading state: run queued or executing, with trace events streaming
              into the timeline.
            </div>
            <div className="rounded-lg border border-rose-300/40 bg-rose-300/10 p-4 leading-7 text-rose-100">
              Error state: API failure, schema validation issue, or policy guard
              fallback requiring reviewer attention.
            </div>
          </div>
        </section>
      </section>

      <section className="flex flex-wrap gap-3">
        <Link
          className="inline-flex min-h-11 items-center rounded-lg bg-amber-300 px-5 py-2 text-sm font-black text-stone-950 shadow-lg shadow-amber-950/30 transition hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:ring-offset-2 focus:ring-offset-stone-950"
          to="/demo"
        >
          Back to demo index
        </Link>
        <Link
          className="inline-flex min-h-11 items-center rounded-lg border border-white/15 bg-white/[0.04] px-5 py-2 text-sm font-black text-stone-100 transition hover:border-amber-300/60 hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-amber-200 focus:ring-offset-2 focus:ring-offset-stone-950"
          to={project.href}
        >
          Read project page
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
