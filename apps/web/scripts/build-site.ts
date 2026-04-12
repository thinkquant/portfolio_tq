import { createHash } from 'node:crypto';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { repositoryMetadata } from '../../../packages/config/src/index.ts';
import { primaryNavigation } from '../../../packages/ui/src/index.ts';

type PageDefinition = {
  path: string;
  title: string;
  eyebrow: string;
  heading: string;
  lead: string;
  sections: Array<{
    title: string;
    body: string;
  }>;
};

const projectPages = [
  {
    href: '/projects/payment-exception-review',
    label: 'Payment Exception Review Agent',
    summary:
      'A confidence-aware operations workflow that combines typed outputs, tool calls, fallback logic, and escalation.',
  },
  {
    href: '/projects/investing-ops-copilot',
    label: 'Intelligent Investing Operations Copilot',
    summary:
      'A retrieval- and policy-aware operations copilot for grounded portfolio servicing and next-action support.',
  },
  {
    href: '/projects/legacy-ai-adapter',
    label: 'Legacy Workflow to AI-Native Adapter',
    summary:
      'A transformation layer that preserves deterministic controls while exposing an AI-native operating surface.',
  },
];

const pages: PageDefinition[] = [
  {
    path: '/',
    title: 'Home',
    eyebrow: 'Public build log',
    heading: 'A portfolio app built as a real system from day one.',
    lead:
      'portfolio_tq is a public proof-of-work repo for showing architecture, delivery discipline, and AI-native workflow design in the open.',
    sections: [
      {
        title: 'What this shell proves',
        body:
          'The web deployment path is now live on Firebase Hosting, with separate dev and prod projects, static route coverage, and source-controlled delivery assets.',
      },
      {
        title: 'Current focus',
        body:
          'This stage is intentionally lean: it prioritizes environment separation, deployment repeatability, and public-repo safety before deeper frontend implementation begins.',
      },
    ],
  },
  {
    path: '/projects',
    title: 'Projects',
    eyebrow: 'Portfolio modules',
    heading: 'Flagship demos are scaffolded as product surfaces, not one-off experiments.',
    lead:
      'Each project area is meant to demonstrate architecture, orchestration, observability, and operational judgment, not just isolated code samples.',
    sections: [
      {
        title: 'Initial project set',
        body: projectPages.map((page) => `${page.label}: ${page.summary}`).join(' '),
      },
      {
        title: 'Delivery note',
        body:
          'The routes are intentionally live now so Hosting, rewrites, and smoke verification can be exercised before the richer React experience lands.',
      },
    ],
  },
  {
    path: '/projects/payment-exception-review',
    title: 'Payment Exception Review Agent',
    eyebrow: 'Example project page',
    heading: 'Payment Exception Review Agent',
    lead:
      'This project demonstrates how ambiguous operations work can be shaped into a typed, confidence-aware workflow with escalation paths and traceability.',
    sections: [
      {
        title: 'Why it belongs in the portfolio',
        body:
          'It showcases structured outputs, tool orchestration, fallback behavior, and the kind of review logic that matters in operationally sensitive domains.',
      },
      {
        title: 'What comes next',
        body:
          'The eventual app route will add richer UI, live traces, evaluation surfaces, and backend-driven demo execution on top of this deployed route shell.',
      },
    ],
  },
  {
    path: '/architecture',
    title: 'Architecture',
    eyebrow: 'System framing',
    heading: 'One monorepo, two environments, visible delivery discipline.',
    lead:
      'The portfolio is structured as a web app on Firebase Hosting, an API on Cloud Run, shared packages, and Terraform-managed infrastructure from the beginning.',
    sections: [
      {
        title: 'Infra stance',
        body:
          'Separate dev and prod projects exist, GitHub OIDC is in place for deploy auth, and Terraform owns the infrastructure shape instead of console-only drift.',
      },
      {
        title: 'Why this matters',
        body:
          'Even at an early stage, the repo should show operational clarity, not just UI ambition. The deployment path is part of the product story.',
      },
    ],
  },
  {
    path: '/observability',
    title: 'Observability',
    eyebrow: 'Signals and traces',
    heading: 'Observability is a first-class feature, not an afterthought.',
    lead:
      'Cloud Logging, Monitoring, Firestore-backed run records, and in-app dashboards are all part of the target operating model for this portfolio.',
    sections: [
      {
        title: 'Platform-level',
        body:
          'Cloud Run request volume, latency, error behavior, and deploy metadata will surface through the provisioned dashboard and log-based metrics.',
      },
      {
        title: 'Application-level',
        body:
          'Runs, tool calls, fallbacks, and evaluations will later feed the web app so architecture and behavior can be reviewed together.',
      },
    ],
  },
  {
    path: '/repo-workflow',
    title: 'Repo Workflow',
    eyebrow: 'Operating rules',
    heading: 'Public-repo safety and deployment repeatability are part of the implementation standard.',
    lead:
      'This repository is public, so frontend deploys must keep secrets out of source, keep ignore files current, and separate public config from backend-only credentials.',
    sections: [
      {
        title: 'Frontend env strategy',
        body:
          'The current web shell ships no secret runtime configuration. Any future client-exposed values should be explicitly public, build-time only, and named to make that obvious. Backend secrets stay in Secret Manager and never move into frontend bundles.',
      },
      {
        title: 'Release flow',
        body:
          'Active validation happens on the dev Firebase project, while milestone-grade releases promote the same static site build to the prod Firebase project.',
      },
    ],
  },
];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, '..');
const distDir = path.join(appRoot, 'dist');
const assetsDir = path.join(distDir, 'assets');

const styles = `
:root {
  color-scheme: light;
  --bg: #f5f0e8;
  --panel: rgba(255, 252, 247, 0.82);
  --panel-strong: #fffaf1;
  --ink: #16212b;
  --muted: #51606d;
  --accent: #9a3b2f;
  --accent-deep: #6c1f1b;
  --line: rgba(22, 33, 43, 0.12);
  --shadow: 0 24px 80px rgba(22, 33, 43, 0.12);
  --radius-lg: 28px;
  --radius-md: 18px;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: "Avenir Next", "Segoe UI Variable", "Trebuchet MS", sans-serif;
  color: var(--ink);
  background:
    radial-gradient(circle at top left, rgba(154, 59, 47, 0.18), transparent 36%),
    radial-gradient(circle at top right, rgba(41, 86, 122, 0.14), transparent 28%),
    linear-gradient(180deg, #f8f4ee 0%, var(--bg) 100%);
}

a {
  color: inherit;
}

.shell {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
  padding: 28px 0 56px;
}

.topbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  padding: 18px 22px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: rgba(255, 250, 241, 0.72);
  backdrop-filter: blur(12px);
  box-shadow: var(--shadow);
}

.brand {
  display: grid;
  gap: 4px;
}

.brand-kicker {
  font-size: 0.78rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent-deep);
}

.brand-title {
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(1.55rem, 3vw, 2.1rem);
  line-height: 1;
}

.brand-subtitle {
  color: var(--muted);
  max-width: 44rem;
}

.nav {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.nav a {
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid transparent;
  text-decoration: none;
  color: var(--muted);
}

.nav a.is-active {
  color: var(--panel-strong);
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-deep) 100%);
  box-shadow: 0 14px 40px rgba(108, 31, 27, 0.28);
}

.hero {
  display: grid;
  gap: 18px;
  margin-bottom: 24px;
  padding: clamp(28px, 5vw, 56px);
  border-radius: calc(var(--radius-lg) + 8px);
  background:
    linear-gradient(145deg, rgba(255, 251, 245, 0.96), rgba(255, 244, 231, 0.92)),
    radial-gradient(circle at top right, rgba(154, 59, 47, 0.08), transparent 38%);
  border: 1px solid rgba(108, 31, 27, 0.12);
  box-shadow: var(--shadow);
}

.eyebrow {
  font-size: 0.8rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent-deep);
}

.hero h1 {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2.2rem, 6vw, 4.6rem);
  line-height: 0.98;
  max-width: 14ch;
}

.hero p {
  margin: 0;
  max-width: 52rem;
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--muted);
}

.grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 18px;
}

.card,
.project-card {
  grid-column: span 6;
  padding: 22px;
  border-radius: var(--radius-md);
  border: 1px solid var(--line);
  background: var(--panel);
  box-shadow: 0 16px 48px rgba(22, 33, 43, 0.08);
}

.card h2,
.project-card h2 {
  margin: 0 0 10px;
  font-size: 1.1rem;
}

.card p,
.project-card p {
  margin: 0;
  color: var(--muted);
  line-height: 1.65;
}

.project-grid {
  margin-top: 18px;
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.project-card a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  color: var(--accent-deep);
  text-decoration: none;
  font-weight: 600;
}

.footer {
  margin-top: 24px;
  padding: 20px 22px 0;
  color: var(--muted);
  font-size: 0.95rem;
}

@media (max-width: 900px) {
  .card,
  .project-card {
    grid-column: span 12;
  }

  .project-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .shell {
    width: min(100% - 20px, 1120px);
    padding: 18px 0 36px;
  }

  .topbar,
  .hero,
  .card,
  .project-card {
    padding: 18px;
  }

  .hero h1 {
    max-width: none;
  }
}
`.trim();

function normalizePath(routePath: string): string {
  return routePath === '/' ? '/' : routePath.replace(/\/+$/, '');
}

function pageHref(routePath: string): string {
  return normalizePath(routePath);
}

function outputFilePath(routePath: string): string {
  if (routePath === '/') {
    return path.join(distDir, 'index.html');
  }

  const segments = routePath.replace(/^\//, '').split('/');
  return path.join(distDir, ...segments, 'index.html');
}

function titleFor(page: PageDefinition): string {
  return `${page.title} | ${repositoryMetadata.productName}`;
}

function renderProjectGrid(): string {
  return `
    <section class="project-grid" aria-label="Featured projects">
      ${projectPages
        .map(
          (project) => `
            <article class="project-card">
              <h2>${project.label}</h2>
              <p>${project.summary}</p>
              <a href="${project.href}">Open route</a>
            </article>
          `,
        )
        .join('')}
    </section>
  `.trim();
}

function renderPage(page: PageDefinition, cssHref: string): string {
  const currentPath = normalizePath(page.path);

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${page.lead}">
    <title>${titleFor(page)}</title>
    <link rel="stylesheet" href="${cssHref}">
  </head>
  <body>
    <div class="shell">
      <header class="topbar">
        <div class="brand">
          <span class="brand-kicker">thinkquant</span>
          <strong class="brand-title">${repositoryMetadata.productName}</strong>
          <span class="brand-subtitle">Public portfolio monorepo with Firebase Hosting, Cloud Run, Terraform, and visible delivery notes.</span>
        </div>
        <nav class="nav" aria-label="Primary">
          ${primaryNavigation
            .map((item) => {
              const href = pageHref(item.href);
              const active = href === currentPath ? 'is-active' : '';

              return `<a class="${active}" href="${href}">${item.label}</a>`;
            })
            .join('')}
        </nav>
      </header>

      <main>
        <section class="hero">
          <span class="eyebrow">${page.eyebrow}</span>
          <h1>${page.heading}</h1>
          <p>${page.lead}</p>
        </section>

        <section class="grid">
          ${page.sections
            .map(
              (section) => `
                <article class="card">
                  <h2>${section.title}</h2>
                  <p>${section.body}</p>
                </article>
              `,
            )
            .join('')}
        </section>

        ${currentPath === '/' || currentPath === '/projects' ? renderProjectGrid() : ''}
      </main>

      <footer class="footer">
        Separate Firebase projects are used for dev and prod. This frontend deploys only public assets; backend secrets remain outside the web bundle.
      </footer>
    </div>
  </body>
</html>
  `.trim();
}

function renderNotFound(cssHref: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Not Found | ${repositoryMetadata.productName}</title>
    <link rel="stylesheet" href="${cssHref}">
  </head>
  <body>
    <div class="shell">
      <section class="hero">
        <span class="eyebrow">404</span>
        <h1>That route is not part of the portfolio yet.</h1>
        <p>The Hosting path is active, but this specific page has not been authored. Return home and continue from there.</p>
      </section>
      <section class="grid">
        <article class="card">
          <h2>Return path</h2>
          <p><a href="/">Go back to the portfolio home page.</a></p>
        </article>
      </section>
    </div>
  </body>
</html>
  `.trim();
}

async function main(): Promise<void> {
  await rm(distDir, { recursive: true, force: true });
  await mkdir(assetsDir, { recursive: true });

  const cssHash = createHash('sha256').update(styles).digest('hex').slice(0, 10);
  const cssFileName = `site.${cssHash}.css`;
  const cssFilePath = path.join(assetsDir, cssFileName);
  const cssHref = `/assets/${cssFileName}`;

  await writeFile(cssFilePath, `${styles}\n`, 'utf8');

  for (const page of pages) {
    const filePath = outputFilePath(page.path);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, `${renderPage(page, cssHref)}\n`, 'utf8');
  }

  await writeFile(path.join(distDir, '404.html'), `${renderNotFound(cssHref)}\n`, 'utf8');
}

await main();
