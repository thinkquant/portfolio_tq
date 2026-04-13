import {
  Card,
  designTokens,
  PageHeading,
  ProofTag,
  SectionHeading,
} from '@portfolio-tq/ui';
import { useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';

import { RouteDataStateView } from '../../app/RouteDataStateView';
import { siteCopy } from '../../content/textCopy';
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
        <h3 className="max-w-[18ch] font-serif text-[1.5rem] leading-tight text-foreground">
          {project.title}
        </h3>
        <p className={designTokens.bodyTextTight}>{project.summary}</p>
        <p className="text-sm leading-6 text-muted-foreground">{project.problem}</p>
        <div className="flex flex-wrap gap-2">
          {project.workCardProves.map((tag) => (
            <ProofTag key={tag}>{tag}</ProofTag>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link className={designTokens.buttonPrimary} to={project.href}>
          {project.workCardCta}
        </Link>
      </div>
    </Card>
  );
}

export function WorkPage() {
  const state = useLoaderData() as WorkPageData;
  const [activeFilter, setActiveFilter] = useState(siteCopy.work.filterOptions[0]);

  return (
    <RouteDataStateView state={state}>
      {({ projects }) => {
        const filteredProjects =
          activeFilter === 'All'
            ? projects
            : projects.filter((project) =>
                project.filterTags.includes(activeFilter),
              );

        return (
          <div className={designTokens.pageSection}>
          <PageHeading
            eyebrow={siteCopy.work.eyebrow}
            lead={siteCopy.work.body}
            title={siteCopy.work.title}
          />

          <section className="grid gap-6">
            <SectionHeading
              eyebrow={siteCopy.work.filterLabel}
              lead={siteCopy.work.body}
              title={siteCopy.work.title}
            />
            <div className="flex flex-wrap gap-2">
              {siteCopy.work.filterOptions.map((filter) => (
                <button
                  className={[
                    'min-h-11 rounded-[var(--radius)] border px-4 py-2.5 text-sm font-semibold transition',
                    activeFilter === filter
                      ? 'border-primary/80 bg-primary text-primary-foreground'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
                  ].join(' ')}
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  type="button"
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.href} project={project} />
              ))}
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <Card>
              <SectionHeading
                eyebrow={siteCopy.work.bottomTitle}
                lead={siteCopy.work.bottomBody}
                title={siteCopy.work.bottomTitle}
              />
            </Card>
            <Card className="grid content-start gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {siteCopy.shell.contactPrompt.short}
              </p>
              <p className={designTokens.bodyTextTight}>
                {siteCopy.shell.contactPrompt.long}
              </p>
              <Link className={designTokens.buttonSecondary} to="/demo">
                {siteCopy.shell.ctas.tertiary}
              </Link>
            </Card>
          </section>
          </div>
        );
      }}
    </RouteDataStateView>
  );
}
