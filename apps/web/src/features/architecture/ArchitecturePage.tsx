import {
  ArchitecturePanelFrame,
  Callout,
  Card,
  designTokens,
  MetricTile,
  PageHeading,
  ProofTag,
  SectionHeading,
} from '@portfolio-tq/ui';

const repoLayers = [
  {
    title: 'apps/web',
    body: 'React, TypeScript, Tailwind, and React Router render the public portfolio, project pages, demo shells, and dashboard surfaces.',
  },
  {
    title: 'apps/api',
    body: 'The Cloud Run API owns demo orchestration, model access, tool calls, schema enforcement, persistence, and dashboard feeds.',
  },
  {
    title: 'packages/*',
    body: 'Shared UI, types, schemas, agents, tools, eval helpers, and config keep cross-cutting contracts out of one-off app code.',
  },
  {
    title: 'infra/terraform',
    body: 'Terraform modules and environment folders represent Firebase Hosting, Cloud Run, IAM, Artifact Registry, Firestore indexes, monitoring, and OIDC.',
  },
];

const environmentRows = [
  ['dev', 'portfolio-tq-dev', 'Active integration and validation'],
  ['prod', 'portfolio-tq-prod', 'Milestone-grade public release'],
];

export function ArchitecturePage() {
  return (
    <div className={designTokens.pageSection}>
      <PageHeading
        actions={
          <>
            <ProofTag tone="accent">Terraform first</ProofTag>
            <ProofTag>dev/prod split</ProofTag>
            <ProofTag tone="success">Shared contracts</ProofTag>
          </>
        }
        eyebrow="Architecture"
        lead="The portfolio is shaped as a real product surface: one public web app, one backend API, shared monorepo packages, Terraform-managed cloud infrastructure, and observable dev/prod environments."
        title="Architecture is part of the portfolio proof."
      />

      <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Card>
          <SectionHeading
            eyebrow="Monorepo shape"
            lead="There is one primary product surface: the web portfolio app. The demo projects are feature domains inside that app, backed by one API service and shared packages."
            title="One system, not scattered mini-projects."
          />
        </Card>

        <Callout title="Public-safe boundary">
          The frontend ships public-safe configuration only. Secrets and
          sensitive execution details belong behind Cloud Run, Secret Manager,
          Terraform, and environment-scoped infrastructure.
        </Callout>
      </section>

      <section className="grid gap-5">
        <SectionHeading
          eyebrow="Repository layers"
          lead="The shell follows the documented repo skeleton so later demos can add behavior without changing the architecture story."
          title="Frontend, backend, shared packages, infrastructure."
        />

        <div className="grid gap-5 md:grid-cols-2">
          {repoLayers.map((layer) => (
            <Card className="grid gap-3" key={layer.title}>
              <h3 className="font-serif text-[1.45rem] leading-tight text-foreground">
                {layer.title}
              </h3>
              <p className={designTokens.bodyTextTight}>{layer.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        <div className="grid gap-5">
          <SectionHeading
            eyebrow="Environments"
            lead="Daily work lands in dev. Public milestone releases land in prod. The names stay consistent across branches, Firebase projects, GCP projects, and Terraform folders."
            title="A simple dev/prod split."
          />

          <div className="grid gap-3">
            {environmentRows.map(([name, project, purpose]) => (
              <Card className="grid gap-2" key={name}>
                <div className="flex flex-wrap items-center gap-2">
                  <ProofTag tone={name === 'dev' ? 'accent' : 'success'}>
                    {name}
                  </ProofTag>
                  <span className="font-mono text-sm text-muted-foreground">
                    {project}
                  </span>
                </div>
                <p className={designTokens.bodyTextTight}>{purpose}</p>
              </Card>
            ))}
          </div>
        </div>

        <ArchitecturePanelFrame
          kicker="Diagram slot"
          title="Runtime relationship"
        >
          <div className="grid gap-3 text-sm leading-6 text-muted-foreground">
            <div className="rounded-[var(--radius)] border border-primary/20 bg-accent p-4 text-accent-foreground">
              Firebase Hosting serves the React portfolio shell.
            </div>
            <div className="rounded-[var(--radius)] border border-emerald-300/25 bg-emerald-300/10 p-4 text-emerald-100">
              Cloud Run hosts the API and orchestrates demo execution.
            </div>
            <div className="rounded-[var(--radius)] border border-rose-300/25 bg-rose-300/10 p-4 text-rose-100">
              Firestore stores runs, traces, evaluations, cases, documents, and
              access records.
            </div>
            <div className="rounded-[var(--radius)] border border-border/80 bg-card p-4 text-card-foreground">
              Cloud Logging and Monitoring expose platform telemetry.
            </div>
          </div>
        </ArchitecturePanelFrame>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-5 sm:grid-cols-2">
          <MetricTile
            detail="Development and production are separate from the start."
            label="Cloud envs"
            tone="success"
            value="2"
          />
          <MetricTile
            detail="GitHub Actions is the default path for CI/CD and deploys."
            label="CI/CD"
            tone="accent"
            value="OIDC"
          />
        </div>

        <Card>
          <SectionHeading
            eyebrow="Delivery baseline"
            lead="Terraform owns the managed resources, GitHub Actions runs lint/typecheck/test/build and deploy workflows, and Firebase Hosting plus Cloud Run provide the public app/API split."
            title="Infrastructure and delivery are part of the review surface."
          />
          <p className={`mt-5 ${designTokens.bodyText}`}>
            The architecture page leaves space for real diagrams as the demo
            modules mature, while the current panel gives reviewers a useful
            system map before later visual assets are added.
          </p>
        </Card>
      </section>
    </div>
  );
}
