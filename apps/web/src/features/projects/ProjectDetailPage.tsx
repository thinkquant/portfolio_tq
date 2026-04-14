import {
  Callout,
  Card,
  designTokens,
  PageHeading,
  ProofTag,
  SectionHeading,
} from '@portfolio-tq/ui';
import { Link, useLoaderData } from 'react-router-dom';

import { projectCopyById } from '@/content/projectCopy';

import { RouteDataStateView } from '../../app/RouteDataStateView';
import type { PortfolioProject } from './projectCatalog';
import type { ProjectDetailPageData } from './projectLoaders';

type ProjectDetailPageContentProps = {
  project: PortfolioProject;
};

function ProjectDetailPageContent({ project }: ProjectDetailPageContentProps) {
  const content = projectCopyById[project.id];

  return (
    <div className={designTokens.pageSection}>
      <PageHeading
        actions={project.filterTags.map((tag) => (
          <ProofTag key={tag}>{tag}</ProofTag>
        ))}
        eyebrow={content.detailEyebrow}
        lead={content.summary}
        title={content.title}
      />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-10">
        <Card className="grid gap-4 p-6 sm:p-8">
          <SectionHeading
            eyebrow="Constraint"
            lead={project.problem}
            title={content.problemTitle}
          />
        </Card>

        <Callout title={content.whyItMattersTitle}>
          {project.whyItMatters}
        </Callout>
      </section>

      <section className="grid gap-8 border-y border-border/80 py-10 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-12">
        <SectionHeading
          eyebrow="Workflow"
          lead={content.summary}
          title={content.howItWorksTitle}
        />

        <ol className="grid gap-0 divide-y divide-border/80">
          {project.workflowSteps.map((step, index) => (
            <li
              className="grid gap-3 py-5 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-5"
              key={step}
            >
              <span className="font-mono text-sm font-semibold text-primary">
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className="text-base leading-7 text-muted-foreground [text-wrap:pretty]">
                {step}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10">
        <Card className="grid content-start gap-5">
          <SectionHeading eyebrow="Safeguards" title={content.controlsTitle} />
          <ul className="grid gap-3">
            {project.controls.map((control) => (
              <li
                className="rounded-[var(--radius)] border border-border bg-background/70 p-4 text-base leading-7 text-muted-foreground [text-wrap:pretty]"
                key={control}
              >
                {control}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="grid content-start gap-5 p-6 sm:p-8">
          <SectionHeading
            eyebrow="What it shows"
            lead={content.summary}
            title={content.whatThisProvesTitle}
          />
          <div className="flex flex-wrap gap-2">
            {project.proves.map((tag) => (
              <ProofTag key={tag}>{tag}</ProofTag>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 rounded-[var(--radius)] border border-border/80 bg-card p-6 text-card-foreground shadow-lg shadow-black/10 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <SectionHeading
          eyebrow="Demo"
          lead={content.demoBody}
          title={content.demoTitle}
        />
        <Link className={designTokens.buttonPrimary} to={project.demoHref}>
          Open Demo
        </Link>
      </section>
    </div>
  );
}

export function ProjectDetailPage() {
  const state = useLoaderData() as ProjectDetailPageData;

  return (
    <RouteDataStateView state={state}>
      {({ project }) => <ProjectDetailPageContent project={project} />}
    </RouteDataStateView>
  );
}
