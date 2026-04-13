import {
  ArchitecturePanelFrame,
  Callout,
  Card,
  DemoLauncherPanel,
  MetricTile,
  PageHeading,
  ProofTag,
  SectionHeading,
} from '@portfolio-tq/ui';
import { useLoaderData } from 'react-router-dom';

import { RouteDataStateView } from '../../app/RouteDataStateView';
import type { ProjectDetailPageData } from './projectLoaders';
import type { PortfolioProject } from './projectCatalog';

type ProjectDetailPageContentProps = {
  project: PortfolioProject;
};

function ProjectDetailPageContent({ project }: ProjectDetailPageContentProps) {
  return (
    <div className="grid gap-8">
      <PageHeading
        actions={
          <>
            <ProofTag tone="accent">{project.status}</ProofTag>
            {project.proofTags.slice(0, 2).map((tag) => (
              <ProofTag key={tag}>{tag}</ProofTag>
            ))}
          </>
        }
        eyebrow="Project"
        lead={project.summary}
        title={project.title}
      />

      <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Card>
          <SectionHeading
            eyebrow="Problem"
            lead={project.problem}
            title="The workflow friction."
          />
        </Card>

        <Callout title="Why it matters for Orion / fintech operations">
          {project.whyItMatters}
        </Callout>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <ArchitecturePanelFrame
          kicker="Architecture overview"
          title="Planned system shape"
        >
          <p className="leading-7 text-stone-300">{project.architecture}</p>
        </ArchitecturePanelFrame>

        <Card>
          <SectionHeading
            eyebrow="Workflow"
            title="Intended execution path."
          />
          <ol className="mt-5 grid gap-3">
            {project.workflowSteps.map((step, index) => (
              <li
                className="grid gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-4"
                key={step}
              >
                <span className="font-mono text-xs text-amber-200">
                  STEP {index + 1}
                </span>
                <p className="leading-7 text-stone-300">{step}</p>
              </li>
            ))}
          </ol>
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <DemoLauncherPanel
          body="The route is available now as a structured shell. Later checklist sections will attach the interactive input, output, trace, and evaluation panels without changing this public project route."
          ctaLabel="Open demo shell"
          href={project.demoHref}
          meta="Backend integration lands in later sections"
          title="Demo entry"
        />

        <Card>
          <SectionHeading
            eyebrow="Fallback / safety / evaluation"
            lead={project.safetyAndEvaluation}
            title="The guardrails are part of the design."
          />
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <SectionHeading eyebrow="Stack / proof tags" title="What is visible." />
          <div className="mt-5 flex flex-wrap gap-2">
            {[...project.stackTags, ...project.proofTags].map((tag) => (
              <ProofTag key={tag}>{tag}</ProofTag>
            ))}
          </div>
        </Card>

        <div className="grid gap-5 sm:grid-cols-2">
          <MetricTile
            detail="Each project page now carries real problem, architecture, workflow, and safety framing."
            label="Project page"
            tone="success"
            value="Substantive"
          />
          <MetricTile
            detail="Live demo behavior is intentionally deferred to the demo-shell and backend integration sections."
            label="Demo status"
            tone="warning"
            value="Shell"
          />
        </div>
      </section>

      <section className="grid gap-5">
        <SectionHeading
          eyebrow="What this proves"
          lead={project.focus}
          title="Why this belongs in the portfolio."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {project.proves.map((proof) => (
            <Card className="leading-7 text-stone-300" key={proof}>
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
