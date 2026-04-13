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
import { type PortfolioProject } from './projectCatalog';
import type { WorkPageData } from './projectLoaders';

function ProjectCard({ project }: { project: PortfolioProject }) {
  return (
    <Card className="grid content-between gap-6">
      <div className="grid gap-4">
        <div className="flex flex-wrap gap-2">
          {project.workCardProves.map((tag) => (
            <ProofTag key={tag}>{tag}</ProofTag>
          ))}
        </div>
        <div className="grid gap-3">
          <h3 className="max-w-[18ch] font-serif text-[1.5rem] font-semibold leading-tight text-foreground [text-wrap:balance]">
            {project.title}
          </h3>
          <p className={designTokens.bodyTextTight}>{project.summary}</p>
        </div>
      </div>

      <div className="grid content-end gap-4">
        <p className="text-base leading-7 text-muted-foreground [text-wrap:pretty]">
          {project.problem}
        </p>
        <Link className={designTokens.buttonPrimary} to={project.href}>
          {project.workCardCta}
        </Link>
      </div>
    </Card>
  );
}

export function WorkPage() {
  const state = useLoaderData() as WorkPageData;
  const [activeFilter, setActiveFilter] = useState(
    siteCopy.work.filterOptions[0],
  );

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

            <section className="grid gap-7">
              <div className="grid gap-4 border-b border-border/80 pb-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                <div className="grid gap-2">
                  <p className={designTokens.label}>
                    {siteCopy.work.filterLabel}
                  </p>
                  <p className={designTokens.bodyTextTight}>
                    {filteredProjects.length} project
                    {filteredProjects.length === 1 ? '' : 's'} shown.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 lg:justify-end">
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
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.href} project={project} />
                ))}
              </div>
            </section>

            <section className="grid gap-6 border-t border-border/80 pt-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
              <SectionHeading
                eyebrow="Review note"
                lead={siteCopy.work.bottomBody}
                title={siteCopy.work.bottomTitle}
              />
              <Card className="grid content-start gap-4">
                <p className="text-[0.75rem] font-semibold uppercase tracking-[0.11em] text-muted-foreground">
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
