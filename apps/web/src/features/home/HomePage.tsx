import {
  Callout,
  Card,
  DemoLauncherPanel,
  MetricTile,
  PageHeading,
  ProofTag,
  SectionHeading,
} from '@portfolio-tq/ui';
import { Link } from 'react-router-dom';

const featuredModules = [
  {
    title: 'Payment Exception Review Agent',
    href: '/projects/payment-exception-review',
    summary:
      'A confidence-aware review workflow for payment exception cases, combining unstructured intake, typed output, tool calls, fallback logic, and escalation paths.',
    proofTags: ['Structured output', 'Escalation', 'Traceable flow'],
  },
  {
    title: 'Intelligent Investing Operations Copilot',
    href: '/projects/investing-ops-copilot',
    summary:
      'A wealth-operations copilot shaped around retrieval, policy context, grounded responses, and safe next-action support.',
    proofTags: ['Retrieval', 'Policy context', 'Safe actioning'],
  },
  {
    title: 'Legacy Workflow to AI-Native Service Adapter',
    href: '/projects/legacy-ai-adapter',
    summary:
      'A practical path for wrapping deterministic legacy processes with structured AI-native intake, validation, transformation, and auditability.',
    proofTags: ['Adapter pattern', 'Validation', 'Workflow redesign'],
  },
  {
    title: 'Evaluation and Reliability Console',
    href: '/projects/eval-console',
    summary:
      'An operational view over AI workflow quality: latency, cost, schema validity, fallbacks, confidence thresholds, and prompt/version comparison.',
    proofTags: ['Evaluation', 'Observability', 'Reliability'],
  },
];

const proofPoints = [
  {
    label: 'Branches',
    value: '2',
    detail: 'dev for active integration; main for milestone-grade releases.',
  },
  {
    label: 'Environments',
    value: 'dev/prod',
    detail: 'Separate Firebase and GCP projects keep validation and public release paths distinct.',
  },
  {
    label: 'Demos',
    value: '4',
    detail: 'AI-native workflow modules anchor the first portfolio milestone.',
  },
];

const routeCards = [
  {
    title: 'Work',
    body: 'Project pages frame the problem, system design, workflow, safety choices, and proof tags for each flagship module.',
    ctaLabel: 'Explore work',
    href: '/work',
  },
  {
    title: 'Architecture',
    body: 'The system story covers the monorepo, Terraform-managed infrastructure, CI/CD, environment split, and shared package boundaries.',
    ctaLabel: 'Read architecture',
    href: '/architecture',
  },
  {
    title: 'About',
    body: 'The background story connects the operating philosophy to systems architecture, AI-assisted execution, product judgment, and delivery discipline.',
    ctaLabel: 'Meet Daniel',
    href: '/about',
  },
];

function HomeLink({
  children,
  to,
  tone = 'primary',
}: {
  children: string;
  to: string;
  tone?: 'primary' | 'secondary';
}) {
  return (
    <Link
      className={[
        'inline-flex min-h-11 items-center rounded-full px-5 py-2 text-sm font-black transition focus:outline-none focus:ring-2 focus:ring-amber-200 focus:ring-offset-2 focus:ring-offset-stone-950',
        tone === 'primary'
          ? 'bg-amber-300 text-stone-950 shadow-lg shadow-amber-950/30 hover:bg-amber-200'
          : 'border border-white/15 bg-white/[0.04] text-stone-100 hover:border-amber-300/60 hover:bg-white/[0.08]',
      ].join(' ')}
      to={to}
    >
      {children}
    </Link>
  );
}

export function HomePage() {
  return (
    <div className="grid gap-8">
      <PageHeading
        actions={
          <>
            <ProofTag tone="accent">Real product</ProofTag>
            <ProofTag>Public proof-of-work</ProofTag>
            <ProofTag tone="success">AI-native systems</ProofTag>
          </>
        }
        eyebrow="thinkquant"
        lead="A public portfolio product by Daniel J.G. Oosthuyzen, built to make systems thinking, AI-native workflow design, and disciplined software delivery inspectable in one place."
        title="Capture ambiguity. Process chaos. Produce ordered action."
      />

      <section className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
        <Card>
          <SectionHeading
            eyebrow="Portfolio purpose"
            lead="portfolio-tq is not a static resume site. It is a working web application and public engineering artifact for fintech-relevant AI workflow demos, architecture notes, observability surfaces, and proof-oriented project narratives."
            title="A serious portfolio app, built in the open."
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <HomeLink to="/work">Explore the work</HomeLink>
            <HomeLink tone="secondary" to="/architecture">
              Read the system story
            </HomeLink>
          </div>
        </Card>

        <Callout title="Operating doctrine">
          The portfolio is organized around one recurring pattern: take messy
          inputs, impose useful structure, preserve auditability, and produce
          action that can survive review.
        </Callout>
      </section>

      <section className="grid gap-5">
        <SectionHeading
          eyebrow="Featured work"
          lead="The first milestone centers on regulated-ops-style workflows where typed outputs, tool use, fallbacks, evaluation, and observability matter as much as the model response."
          title="Flagship modules for AI-native workflow redesign."
        />

        <div className="grid gap-5 lg:grid-cols-2">
          {featuredModules.map((module) => (
            <Card className="grid gap-5" key={module.href}>
              <div className="grid gap-3">
                <h3 className="font-serif text-2xl text-white">
                  {module.title}
                </h3>
                <p className="leading-7 text-stone-300">{module.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {module.proofTags.map((tag) => (
                  <ProofTag key={tag}>{tag}</ProofTag>
                ))}
              </div>
              <div>
                <HomeLink tone="secondary" to={module.href}>
                  Open project
                </HomeLink>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card tone="accent">
          <SectionHeading
            eyebrow="Public repo"
            lead="The repository is part of the proof: docs, checklists, branch discipline, shared packages, Terraform, CI/CD, and local verification all sit beside the product code."
            title="The build process is visible by design."
          />
          <p className="mt-5 leading-7 text-amber-50/85">
            Reviewers should be able to understand not only what shipped, but
            how the system was framed, decomposed, implemented, and verified
            over time.
          </p>
        </Card>

        <div className="grid gap-5 sm:grid-cols-3">
          {proofPoints.map((point) => (
            <MetricTile
              detail={point.detail}
              key={point.label}
              label={point.label}
              tone={point.label === 'Demos' ? 'success' : 'neutral'}
              value={point.value}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-5">
        <SectionHeading
          eyebrow="Next paths"
          lead="The main public routes keep the review path short: understand the work, inspect the architecture, then connect the system back to the person building it."
          title="Move from proof to context."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {routeCards.map((card) => (
            <DemoLauncherPanel
              body={card.body}
              ctaLabel={card.ctaLabel}
              href={card.href}
              key={card.href}
              title={card.title}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
