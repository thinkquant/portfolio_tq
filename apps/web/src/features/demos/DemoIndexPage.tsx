import {
  Callout,
  Card,
  designTokens,
  PageHeading,
  SectionHeading,
} from '@portfolio-tq/ui';
import { Link, useLoaderData } from 'react-router-dom';

import { RouteDataStateView } from '../../app/RouteDataStateView';
import { demoIndexCopy } from '../../content/demoCopy';
import { shellCopy } from '../../content/sharedCopy';
import type { DemoIndexPageData } from './demoLoaders';

export function DemoIndexPage() {
  const state = useLoaderData() as DemoIndexPageData;

  return (
    <RouteDataStateView state={state}>
      {({ projects }) => (
        <div className={designTokens.pageSection}>
          <PageHeading
            eyebrow={demoIndexCopy.eyebrow}
            lead={demoIndexCopy.body}
            title={demoIndexCopy.title}
          />

          <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-10">
            <Card className="grid content-start gap-4 p-6 sm:p-8">
              <SectionHeading
                eyebrow="Availability"
                lead={demoIndexCopy.accessBody}
                title={demoIndexCopy.accessTitle}
              />
            </Card>

            <Callout title={shellCopy.states.comingSoonTitle} tone="warning">
              {shellCopy.states.comingSoonBody}
            </Callout>
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            {projects.map((project, index) => (
              <Card
                className="grid content-between gap-5"
                key={project.demoHref}
              >
                <div className="grid gap-3">
                  <p className={designTokens.label}>Demo {index + 1}</p>
                  <h3 className="max-w-[18ch] font-serif text-[1.5rem] font-semibold leading-tight text-foreground [text-wrap:balance]">
                    {demoIndexCopy.cards[index]?.title ?? project.title}
                  </h3>
                  <p className={designTokens.bodyTextTight}>
                    {demoIndexCopy.cards[index]?.body ?? project.summary}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    className={designTokens.buttonPrimary}
                    to={project.demoHref}
                  >
                    {demoIndexCopy.cards[index]?.cta ?? shellCopy.ctas.tertiary}
                  </Link>
                  <Link
                    className={designTokens.buttonSecondary}
                    to={project.href}
                  >
                    Open Module
                  </Link>
                </div>
              </Card>
            ))}
          </section>
        </div>
      )}
    </RouteDataStateView>
  );
}
