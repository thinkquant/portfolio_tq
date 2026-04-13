import {
  Callout,
  Card,
  designTokens,
  PageHeading,
  SectionHeading,
} from '@portfolio-tq/ui';
import { Link, useLoaderData } from 'react-router-dom';

import { RouteDataStateView } from '../../app/RouteDataStateView';
import { siteCopy } from '../../content/textCopy';
import type { DemoIndexPageData } from './demoLoaders';

export function DemoIndexPage() {
  const state = useLoaderData() as DemoIndexPageData;

  return (
    <RouteDataStateView state={state}>
      {({ projects }) => (
        <div className={designTokens.pageSection}>
          <PageHeading
            eyebrow={siteCopy.demoIndex.eyebrow}
            lead={siteCopy.demoIndex.body}
            title={siteCopy.demoIndex.title}
          />

          <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-10">
            <Card className="grid content-start gap-4 p-6 sm:p-8">
              <SectionHeading
                eyebrow="Availability"
                lead={siteCopy.demoIndex.accessBody}
                title={siteCopy.demoIndex.accessTitle}
              />
            </Card>

            <Callout
              title={siteCopy.shell.states.comingSoonTitle}
              tone="warning"
            >
              {siteCopy.shell.states.comingSoonBody}
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
                    {siteCopy.demoIndex.cards[index]?.title ?? project.title}
                  </h3>
                  <p className={designTokens.bodyTextTight}>
                    {siteCopy.demoIndex.cards[index]?.body ?? project.summary}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    className={designTokens.buttonPrimary}
                    to={project.demoHref}
                  >
                    {siteCopy.demoIndex.cards[index]?.cta ??
                      siteCopy.shell.ctas.tertiary}
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
