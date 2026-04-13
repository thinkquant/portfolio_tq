import {
  Callout,
  Card,
  PageHeading,
  ProofTag,
  SectionHeading,
} from '@portfolio-tq/ui';
import { Link } from 'react-router-dom';
import { useLoaderData } from 'react-router-dom';

import { siteCopy } from '@/content/textCopy';

import { RouteDataStateView } from '../../app/RouteDataStateView';
import type { ProjectDetailPageData } from './projectLoaders';
import type { PortfolioProject } from './projectCatalog';

type ProjectDetailPageContentProps = {
  project: PortfolioProject;
};

function ProjectDetailPageContent({ project }: ProjectDetailPageContentProps) {
  const content = siteCopy.projects[project.id];

  return (
    <div className="grid gap-8">
      <PageHeading
        actions={
          <>
            {project.filterTags.map((tag) => (
              <ProofTag key={tag}>{tag}</ProofTag>
            ))}
          </>
        }
        eyebrow={content.detailEyebrow}
        lead={content.summary}
        title={content.title}
      />

      <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Card>
          <SectionHeading
            eyebrow={content.problemTitle}
            lead={project.problem}
            title={content.problemTitle}
          />
        </Card>

        <Callout title={content.whyItMattersTitle}>
          {project.whyItMatters}
        </Callout>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <SectionHeading
            eyebrow={content.howItWorksTitle}
            title={content.howItWorksTitle}
          />
          <ol className="mt-5 grid gap-3">
            {project.workflowSteps.map((step) => (
              <li
                className="grid gap-2 rounded-[var(--radius)] border border-border bg-background/70 p-4"
                key={step}
              >
                <p className="leading-7 text-muted-foreground">{step}</p>
              </li>
            ))}
          </ol>
        </Card>

        <Card>
          <SectionHeading
            eyebrow={content.controlsTitle}
            title={content.controlsTitle}
          />
          <ul className="mt-5 grid gap-3">
            {project.controls.map((control) => (
              <li
                className="rounded-[var(--radius)] border border-border bg-background/70 p-4 leading-7 text-muted-foreground"
                key={control}
              >
                {control}
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <SectionHeading
            eyebrow={content.demoTitle}
            lead={content.demoBody}
            title={content.demoTitle}
          />
          <div className="mt-5">
            <Link className="inline-flex min-h-11 items-center rounded-[var(--radius)] bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-chart-2 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background" to={project.demoHref}>
              Open Demo
            </Link>
          </div>
        </Card>

        <Card>
          <SectionHeading
            eyebrow={content.whatThisProvesTitle}
            lead={content.summary}
            title={content.whatThisProvesTitle}
          />
          <div className="mt-5 flex flex-wrap gap-2">
            {project.proves.map((tag) => (
              <ProofTag key={tag}>{tag}</ProofTag>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-5">
        <SectionHeading
          eyebrow={content.whatThisProvesTitle}
          lead={content.summary}
          title={content.whatThisProvesTitle}
        />
        <div className="grid gap-5 md:grid-cols-3">
          {project.proves.map((proof) => (
            <Card className="leading-7 text-muted-foreground" key={proof}>
              {proof}
            </Card>
          ))}
        </div>
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
