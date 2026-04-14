import {
  Callout,
  Card,
  PageHeading,
  ProofTag,
  SectionHeading,
  designTokens,
} from '@portfolio-tq/ui';
import { Link, useLoaderData } from 'react-router-dom';

import { projectCopyById } from '@/content/projectCopy';

import { RouteDataStateView } from '../../app/RouteDataStateView';
import type { ProjectDetailPageData } from './projectLoaders';

const reviewerPanels = [
  {
    title: 'Raw intake',
    body: 'Messy operator text, call notes, and handoff context stay visible instead of being hidden behind a clean-room form.',
  },
  {
    title: 'Normalized structure',
    body: 'Recovered fields are shown as typed structure so reviewers can see what the adapter actually extracted.',
  },
  {
    title: 'Deterministic validation',
    body: 'Missing fields, conflicting values, warnings, and review triggers are surfaced before any legacy payload is attempted.',
  },
  {
    title: 'Legacy payload',
    body: 'The transformed shape is rendered as the older service expects it, which keeps the before-and-after contrast obvious.',
  },
  {
    title: 'Final result',
    body: 'A typed outcome closes the loop with status, confidence, next-step guidance, and review state.',
  },
] as const;

function LegacyAdapterProjectContent({
  project,
}: Extract<ProjectDetailPageData, { status: 'success' }>['data']) {
  const content = projectCopyById['legacy-ai-adapter'];
  const workflowStages = [
    {
      index: '01',
      title: 'Messy intake',
      body: project.problem,
      accent: 'bg-accent/75',
    },
    {
      index: '02',
      title: 'Schema extraction',
      body: 'Typed structure is recovered from operator notes and semi-structured intake fragments.',
      accent: 'bg-background/70',
    },
    {
      index: '03',
      title: 'Deterministic validation',
      body: 'Compatibility rules decide whether the adapter can continue, should warn, or must route to review.',
      accent: 'bg-accent/45',
    },
    {
      index: '04',
      title: 'Legacy transform',
      body: 'Validated structure becomes a rigid downstream payload without inventing new workflow shapes.',
      accent: 'bg-background/70',
    },
    {
      index: '05',
      title: 'Typed response',
      body: 'The final status comes back in reviewer-readable language with next-step guidance and observability hooks.',
      accent: 'bg-accent/60',
    },
  ] as const;

  return (
    <div className={designTokens.pageSection}>
      <PageHeading
        actions={
          <>
            {project.filterTags.map((tag) => (
              <ProofTag key={tag}>{tag}</ProofTag>
            ))}
            <Link className={designTokens.buttonPrimary} to={project.demoHref}>
              Open Demo
            </Link>
          </>
        }
        eyebrow={content.detailEyebrow}
        lead={content.summary}
        title={content.title}
      />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)] lg:gap-8">
        <Card className="grid gap-5 p-6 sm:p-8">
          <SectionHeading
            eyebrow="Problem"
            lead={project.problem}
            title={content.problemTitle}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <article className="rounded-[var(--radius)] border border-border/80 bg-background/65 p-4">
              <p className={designTokens.label}>Legacy expectation</p>
              <p className="mt-3 text-base leading-7 text-foreground">
                Perfect fields, rigid workflow codes, clean dates, and already-normalized intent.
              </p>
            </article>
            <article className="rounded-[var(--radius)] border border-border/80 bg-background/65 p-4">
              <p className={designTokens.label}>Actual intake reality</p>
              <p className="mt-3 text-base leading-7 text-foreground">
                Handoff notes, shorthand, missing identifiers, and ambiguous requests that still need to move safely.
              </p>
            </article>
          </div>
        </Card>

        <Callout title={content.whyItMattersTitle}>
          <p>{project.whyItMatters}</p>
          <p className="mt-4">
            This module proves that modernization can be incremental, inspectable,
            and operationally safe without pretending the legacy system disappeared.
          </p>
        </Callout>
      </section>

      <section className="grid gap-7 border-y border-border/80 py-10 lg:gap-10 lg:py-12">
        <SectionHeading
          eyebrow="Workflow"
          lead="The reviewer-visible path stays compact on purpose: every stage explains what changed, what was checked, and why the downstream status is safe."
          title={content.howItWorksTitle}
        />

        <div className="grid gap-4 lg:grid-cols-5">
          {workflowStages.map((stage, index) => (
            <article
              className="grid gap-4 rounded-[var(--radius)] border border-border/80 bg-card p-5 shadow-lg shadow-black/10"
              key={stage.title}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-sm font-semibold text-primary">
                  {stage.index}
                </span>
                {index < workflowStages.length - 1 ? (
                  <span className="hidden text-primary/60 lg:block">→</span>
                ) : null}
              </div>
              <div className={`h-2 rounded-full ${stage.accent}`} />
              <h3 className="font-serif text-[1.3rem] font-semibold leading-tight text-foreground">
                {stage.title}
              </h3>
              <p className="text-base leading-7 text-muted-foreground">
                {stage.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10">
        <div className="grid gap-5">
          <SectionHeading
            eyebrow="Reviewer view"
            lead="The page and demo are designed so someone can inspect the transform in minutes, not reverse-engineer the workflow from code."
            title="What the reviewer can see"
          />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {reviewerPanels.map((panel) => (
              <article
                className="grid gap-3 rounded-[var(--radius)] border border-border/80 bg-card p-5 shadow-lg shadow-black/10"
                key={panel.title}
              >
                <p className={designTokens.label}>{panel.title}</p>
                <p className="text-base leading-7 text-muted-foreground">
                  {panel.body}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          <Card className="grid gap-5 p-6 sm:p-8">
            <SectionHeading eyebrow="Controls" title={content.controlsTitle} />
            <ul className="grid gap-3">
              {project.controls.map((control) => (
                <li
                  className="rounded-[var(--radius)] border border-border/75 bg-background/60 p-4 text-base leading-7 text-muted-foreground"
                  key={control}
                >
                  {control}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="grid gap-5 p-6 sm:p-8">
            <SectionHeading
              eyebrow="What this proves"
              title={content.whatThisProvesTitle}
            />
            <div className="flex flex-wrap gap-2">
              {project.proves.map((tag) => (
                <ProofTag key={tag} tone="accent">
                  {tag}
                </ProofTag>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 rounded-[var(--radius)] border border-border/80 bg-card p-6 shadow-lg shadow-black/10 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <SectionHeading
          eyebrow="Demo"
          lead={content.demoBody}
          title={content.demoTitle}
        />
        <Link className={designTokens.buttonPrimary} to={project.demoHref}>
          {content.cta}
        </Link>
      </section>
    </div>
  );
}

export function LegacyAdapterProjectPage() {
  const state = useLoaderData() as ProjectDetailPageData;

  return (
    <RouteDataStateView state={state}>
      {(data) => <LegacyAdapterProjectContent {...data} />}
    </RouteDataStateView>
  );
}
