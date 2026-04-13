import {
  Card,
  DemoLauncherPanel,
  designTokens,
  EmptyState,
  PageHeading,
  ProofTag,
  SectionHeading,
} from '@portfolio-tq/ui';
import { Link, useLoaderData } from 'react-router-dom';

import { RouteDataStateView } from '../../app/RouteDataStateView';
import type { WorkPageData } from './projectLoaders';
import { type PortfolioProject } from './projectCatalog';

function ProjectCard({
  project,
}: {
  project: PortfolioProject;
}) {
  return (
    <Card className="grid gap-5">
      <div className="grid gap-3">
        <div className="flex flex-wrap gap-2">
          <ProofTag tone="accent">{project.status}</ProofTag>
          {project.proofTags.slice(0, 2).map((tag) => (
            <ProofTag key={tag}>{tag}</ProofTag>
          ))}
        </div>
        <h3 className="max-w-[18ch] font-serif text-[1.5rem] leading-tight text-foreground">
          {project.title}
        </h3>
        <p className={designTokens.bodyTextTight}>{project.summary}</p>
        <p className="text-sm leading-6 text-muted-foreground">{project.focus}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link className={designTokens.buttonPrimary} to={project.href}>
          Open project
        </Link>
        <Link className={designTokens.buttonSecondary} to={project.demoHref}>
          Demo shell
        </Link>
      </div>
    </Card>
  );
}

export function WorkPage() {
  const state = useLoaderData() as WorkPageData;

  return (
    <RouteDataStateView state={state}>
      {({ projects }) => (
        <div className={designTokens.pageSection}>
          <PageHeading
            actions={
              <>
                <ProofTag tone="accent">4 modules</ProofTag>
                <ProofTag>Orion aligned</ProofTag>
                <ProofTag tone="success">Workflow demos</ProofTag>
              </>
            }
            eyebrow="Work"
            lead="The first portfolio milestone is a focused set of AI-native workflow modules for regulated-like operations, fintech review paths, and reliability-minded demo infrastructure."
            title="Four project surfaces anchor the portfolio proof."
          />

          <section className="grid gap-6">
            <SectionHeading
              eyebrow="Project index"
              lead="Each module has a public project route and a demo route. The index should feel like a clean dossier list rather than a gallery of unrelated experiments."
              title="Flagship modules."
            />

            <div className="grid gap-5 lg:grid-cols-2">
              {projects.map((project) => (
                <ProjectCard key={project.href} project={project} />
              ))}
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
            <DemoLauncherPanel
              body="Demo routes are already present as structured shells. Later sections will add input, output, trace, and evaluation panels without changing the public route map."
              ctaLabel="Open demo index"
              href="/demo"
              meta="Controlled-access structure comes later"
              title="Demo entry path"
            />
            <EmptyState
              message="Future portfolio expansion can add analytics, decision systems, strategic writing, and architecture case studies after the first AI-native workflow set is complete."
              title="Expansion slot reserved."
            />
          </section>
        </div>
      )}
    </RouteDataStateView>
  );
}
