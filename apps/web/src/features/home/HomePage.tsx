import {
  Callout,
  Card,
  DemoLauncherPanel,
  designTokens,
  MetricTile,
  ProofTag,
  SectionHeading,
} from '@portfolio-tq/ui';
import { Link } from 'react-router-dom';

const featuredModules = [
  {
    title: 'Payment Exception Review Agent',
    href: '/projects/payment-exception-review',
    summary:
      'A confidence-aware review workflow for payment exception cases with typed outputs, fallback logic, and escalation paths.',
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
      'A practical path for wrapping deterministic legacy processes with structured AI-native intake, validation, and transformation.',
    proofTags: ['Adapter pattern', 'Validation', 'Workflow redesign'],
  },
  {
    title: 'Evaluation and Reliability Console',
    href: '/projects/eval-console',
    summary:
      'An operational view over AI workflow quality: latency, cost, schema validity, fallbacks, and prompt-version comparison.',
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
    body: 'Project dossiers frame the problem, system design, workflow, safety choices, and proof tags for each flagship module.',
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
    ctaLabel: 'Read background',
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
      className={
        tone === 'primary'
          ? designTokens.buttonPrimary
          : designTokens.buttonSecondary
      }
      to={to}
    >
      {children}
    </Link>
  );
}

export function HomePage() {
  return (
    <div className={designTokens.pageSection}>
      <section className="grid gap-8 border-y border-border/80 py-12 lg:grid-cols-[minmax(0,1.18fr)_20rem] lg:items-end lg:gap-12 lg:py-18">
        <div className="grid gap-6">
          <div className="flex flex-wrap gap-2">
            <ProofTag tone="accent">Systems portfolio</ProofTag>
            <ProofTag>Public proof-of-work</ProofTag>
            <ProofTag tone="success">High-agency build discipline</ProofTag>
          </div>
          <div className="grid gap-4">
            <p className={designTokens.label}>Doctrine</p>
            <h1 className="max-w-[14ch] font-serif text-[3rem] leading-[0.94] text-foreground sm:text-[3.65rem] lg:text-[4.2rem]">
              Capture ambiguity. Process chaos. Produce ordered action.
            </h1>
            <p className="max-w-[66ch] text-[1.05rem] leading-8 text-muted-foreground">
              A serious public portfolio product by Daniel J.G. Oosthuyzen,
              built to show how systems thinking becomes architecture, demos,
              product judgment, and working software.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <HomeLink to="/work">Explore the work</HomeLink>
            <HomeLink tone="secondary" to="/architecture">
              Read the architecture
            </HomeLink>
            <HomeLink tone="secondary" to="/about">
              Read the background
            </HomeLink>
          </div>
        </div>

        <div className="grid gap-4 border border-border/80 bg-card px-5 py-5 shadow-lg shadow-black/10">
          <p className={designTokens.label}>Read this first</p>
          <p className="text-sm leading-7 text-muted-foreground">
            This site is designed for technical review. The goal is not to
            present disconnected projects, but one operating discipline made
            visible through product surfaces, architecture, and proof.
          </p>
          <div className="grid gap-3 border-t border-border/80 pt-4">
            {['Measured', 'Rigorous', 'Sovereign'].map((item) => (
              <div className="flex items-center justify-between gap-3" key={item}>
                <span className="text-sm font-semibold text-foreground">
                  {item}
                </span>
                <span className="h-px flex-1 bg-border/80" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_0.95fr]">
        <div className="grid gap-4">
          <SectionHeading
            eyebrow="Positioning"
            lead="The site is a disciplined systems portfolio disguised as a premium product experience. It exists to help a reviewer decide quickly whether the work reflects real architecture, execution discipline, and product seriousness."
            title="A calm, inspectable front door for technical evaluation."
          />
          <p className={designTokens.bodyText}>
            It is not a static resume, a blog-first personal site, or a vague
            AI-brand surface. Every later route should inherit this same logic:
            doctrine first, proof second, navigation third.
          </p>
        </div>

        <Callout title="Operating doctrine">
          The recurring pattern is simple: take messy inputs, impose useful
          structure, preserve auditability, and produce action that survives
          review.
        </Callout>
      </section>

      <section className="grid gap-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
          <SectionHeading
            eyebrow="Flagship modules"
            lead="The first milestone centers on AI-native workflow redesign in regulated-like or operationally sensitive contexts where typed outputs, observability, fallbacks, and evaluation matter."
            title="Proof pieces built to show systems judgment, not demo theatrics."
          />
          <p className={designTokens.bodyTextTight}>
            Each module should read as a compact case for how ambiguity becomes
            a working product path.
          </p>
        </div>

        <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
          {featuredModules.map((module) => (
            <Card className="grid gap-5" key={module.href}>
              <div className="grid gap-3">
                <h3 className="max-w-[18ch] font-serif text-[1.55rem] leading-tight text-foreground">
                  {module.title}
                </h3>
                <p className={designTokens.bodyTextTight}>{module.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {module.proofTags.map((tag) => (
                  <ProofTag key={tag}>{tag}</ProofTag>
                ))}
              </div>
              <div className="pt-1">
                <HomeLink tone="secondary" to={module.href}>
                  Open project
                </HomeLink>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_1.1fr]">
        <div className="grid gap-4">
          <SectionHeading
            eyebrow="Public proof"
            lead="The repository is part of the evaluation surface. Docs, checklists, shared packages, route structure, Terraform, CI/CD, and verification habits all sit beside the UI."
            title="The build process is visible by design."
          />
          <p className={designTokens.bodyText}>
            Reviewers should be able to see not only what shipped, but how the
            work was framed, decomposed, verified, and prepared for later
            system depth.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
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

      <section className="grid gap-6">
        <SectionHeading
          eyebrow="Next routes"
          lead="The public navigation should keep the reviewer's path short: inspect the work, inspect the system, then inspect the person behind it."
          title="Three places to go next."
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
