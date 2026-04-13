import {
  Callout,
  Card,
  DemoLauncherPanel,
  MetricTile,
  PageHeading,
  ProofTag,
  SectionHeading,
} from '@portfolio-tq/ui';

const skillDomains = [
  {
    title: 'AI-native workflow design',
    body: 'Structured-output-first flows, tool boundaries, retrieval patterns, fallback design, and evaluation loops.',
  },
  {
    title: 'Full-stack systems',
    body: 'React, TypeScript, API surfaces, shared packages, typed contracts, and product-facing data flows.',
  },
  {
    title: 'Operational discipline',
    body: 'Checklist-driven execution, CI/CD, Terraform-managed environments, observability, and public repo hygiene.',
  },
  {
    title: 'Finance and analytics framing',
    body: 'Work shaped for fintech-style review, risk boundaries, quantitative reasoning, dashboards, and decision support.',
  },
];

const operatingPrinciples = [
  'Start by making the ambiguous thing observable.',
  'Separate deterministic control from probabilistic assistance.',
  'Treat traces, fallbacks, and evaluation as product surfaces.',
  'Build in public without leaking secrets, private data, or false polish.',
];

export function AboutPage() {
  return (
    <div className="grid gap-8">
      <PageHeading
        actions={
          <>
            <ProofTag tone="accent">Builder profile</ProofTag>
            <ProofTag>Systems thinking</ProofTag>
            <ProofTag tone="success">Delivery focused</ProofTag>
          </>
        }
        eyebrow="About"
        lead="Daniel J.G. Oosthuyzen works across systems architecture, AI-assisted execution, quantitative reasoning, product framing, and practical software delivery."
        title="The human context behind the system."
      />

      <section className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
        <Card>
          <SectionHeading
            eyebrow="Positioning"
            lead="My path is non-traditional, but the work is grounded in applied system-building: take incomplete requirements, find the structure, and turn the result into something a reviewer or operator can actually use."
            title="Strongest where ambiguity has to become a working system."
          />
          <p className="mt-5 leading-7 text-stone-300">
            This portfolio is built for technical review. It connects the
            finished surfaces to the underlying specs, route map, shared
            packages, infrastructure, and verification habits behind them.
          </p>
        </Card>

        <Callout title="Operating philosophy">
          Capture ambiguity. Process chaos. Produce ordered action. The phrase
          is not a slogan here; it is the pattern behind the project choices,
          the build order, and the way each demo is framed.
        </Callout>
      </section>

      <section className="grid gap-5">
        <SectionHeading
          eyebrow="Skill domains"
          lead="The public portfolio is intended to make these capabilities concrete through working routes, code, docs, and later live demo behavior."
          title="The capability map."
        />

        <div className="grid gap-5 md:grid-cols-2">
          {skillDomains.map((domain) => (
            <Card className="grid gap-3" key={domain.title}>
              <h3 className="font-serif text-2xl text-white">
                {domain.title}
              </h3>
              <p className="leading-7 text-stone-300">{domain.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-5 sm:grid-cols-2">
          <MetricTile
            detail="AI-native workflow demos are the first project family."
            label="Focus"
            tone="success"
            value="AI ops"
          />
          <MetricTile
            detail="The repo and product are designed to be reviewed together."
            label="Proof"
            tone="accent"
            value="Public"
          />
        </div>

        <Card>
          <SectionHeading
            eyebrow="Working principles"
            title="How the build is supposed to feel under review."
          />
          <ul className="mt-5 grid gap-3">
            {operatingPrinciples.map((principle) => (
              <li
                className="rounded-lg border border-white/10 bg-white/[0.03] p-4 leading-7 text-stone-300"
                key={principle}
              >
                {principle}
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <DemoLauncherPanel
          body="The Work index is the best next stop for the Orion-aligned module set and the proof tags attached to each build."
          ctaLabel="Open work"
          href="/work"
          meta="Public project index"
          title="Project dossiers"
        />
        <DemoLauncherPanel
          body="The repo workflow page is the holding place for branch strategy, CI/CD rationale, Terraform notes, and public build discipline."
          ctaLabel="Open repo workflow"
          href="/repo-workflow"
          meta="Build process context"
          title="Background material"
        />
      </section>
    </div>
  );
}
