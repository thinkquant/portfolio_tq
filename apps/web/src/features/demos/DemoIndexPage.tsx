import {
  Callout,
  Card,
  DemoLauncherPanel,
  designTokens,
  PageHeading,
  ProofTag,
  SectionHeading,
} from '@portfolio-tq/ui';
import { Link, useLoaderData } from 'react-router-dom';

import { RouteDataStateView } from '../../app/RouteDataStateView';
import type { DemoIndexPageData } from './demoLoaders';

export function DemoIndexPage() {
  const state = useLoaderData() as DemoIndexPageData;

  return (
    <RouteDataStateView state={state}>
      {({ backendNote, projects }) => (
    <div className={designTokens.pageSection}>
      <PageHeading
        actions={
          <>
            <ProofTag tone="accent">Demo shells</ProofTag>
            <ProofTag>Public-safe data</ProofTag>
            <ProofTag tone="warning">Access model pending</ProofTag>
          </>
        }
        eyebrow="Demo access"
        lead="The demo routes are structured now so backend execution, trace hydration, evaluation panels, and future access control can land without changing the public route map."
        title="AI-native workflow demos start here."
      />

      <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Card>
          <SectionHeading
            eyebrow="Access messaging"
            lead="The current demo surfaces are public-safe shells. They show the intended panel structure and integration points, while full execution and any reviewer access gate arrive in later checklist sections."
            title="Prepared for controlled demo access."
          />
        </Card>

        <Callout title="Backend integration landing zone" tone="warning">
          {backendNote}
        </Callout>
      </section>

      <section className="grid gap-5">
        <SectionHeading
          eyebrow="Launch cards"
          lead="Each card opens an individual route with input, output, trace, evaluation, and state panels already reserved."
          title="Choose a demo shell."
        />

        <div className="grid gap-5 lg:grid-cols-2">
          {projects.map((project) => (
            <Card className="grid gap-5" key={project.demoHref}>
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
              </div>

              <div className="flex flex-wrap gap-3">
                <Link className={designTokens.buttonPrimary} to={project.demoHref}>
                  Open demo shell
                </Link>
                <Link className={designTokens.buttonSecondary} to={project.href}>
                  Read project
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <DemoLauncherPanel
        body="The next implementation step will replace shell-only panels with working controls, API calls, live traces, and persisted evaluation data."
        ctaLabel="Read architecture"
        href="/architecture"
        meta="Integration-ready route structure"
        title="What happens next"
      />
    </div>
      )}
    </RouteDataStateView>
  );
}
