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
      {({ backendNote, projects }) => (
        <div className={designTokens.pageSection}>
          <PageHeading
            eyebrow={siteCopy.demoIndex.eyebrow}
            lead={siteCopy.demoIndex.body}
            title={siteCopy.demoIndex.title}
          />

          <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
            <Card>
              <SectionHeading
                eyebrow={siteCopy.demoIndex.accessTitle}
                lead={siteCopy.demoIndex.accessBody}
                title={siteCopy.demoIndex.accessTitle}
              />
            </Card>

            <Callout title={siteCopy.shell.states.comingSoonTitle} tone="warning">
              {siteCopy.shell.states.comingSoonBody}
            </Callout>
          </section>

          <section className="grid gap-5">
            <SectionHeading
              eyebrow={siteCopy.demoIndex.title}
              lead={siteCopy.demoIndex.body}
              title={siteCopy.demoIndex.title}
            />

            <div className="grid gap-5 lg:grid-cols-2">
              {projects.map((project, index) => (
                <Card className="grid gap-5" key={project.demoHref}>
                  <div className="grid gap-3">
                    <h3 className="max-w-[18ch] font-serif text-[1.5rem] leading-tight text-foreground">
                      {siteCopy.demoIndex.cards[index]?.title ?? project.title}
                    </h3>
                    <p className={designTokens.bodyTextTight}>
                      {siteCopy.demoIndex.cards[index]?.body ?? project.summary}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link className={designTokens.buttonPrimary} to={project.demoHref}>
                      {siteCopy.demoIndex.cards[index]?.cta ?? siteCopy.shell.ctas.tertiary}
                    </Link>
                    <Link className={designTokens.buttonSecondary} to={project.href}>
                      Open Module
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <Card className="grid gap-3">
            <SectionHeading
              eyebrow="Runtime wiring"
              lead={backendNote}
              title="The route map is in place."
            />
          </Card>
        </div>
      )}
    </RouteDataStateView>
  );
}
