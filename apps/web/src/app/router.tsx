import {
  Callout,
  Card,
  PageHeading,
  ProofTag,
  SectionHeading,
} from '@portfolio-tq/ui';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import { HomePage } from '../features/home/HomePage';
import { RootLayout } from './RootLayout';

type ShellPageProps = {
  eyebrow: string;
  title: string;
  body: string;
};

function ShellPage({ eyebrow, title, body }: ShellPageProps) {
  return (
    <div className="grid gap-8">
      <PageHeading
        actions={
          <>
            <ProofTag tone="accent">Shell baseline</ProofTag>
            <ProofTag>Public-safe</ProofTag>
          </>
        }
        eyebrow={eyebrow}
        lead={body}
        title={title}
      />

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <SectionHeading
            eyebrow="Composable surface"
            lead="This route is intentionally using shared primitives now so later page work can focus on content and behavior instead of repeating styling decisions."
            title="Reusable shell components are active."
          />
        </Card>

        <Callout title="Implementation note">
          Later checklist sections will replace the route copy with substantive
          page content, while preserving the shared spacing, typography, and
          feedback conventions introduced here.
        </Callout>
      </section>
    </div>
  );
}

function NotFoundPage() {
  return (
    <ShellPage
      body="This route is not part of the locked web shell route map yet. Use the primary navigation to return to a supported portfolio surface."
      eyebrow="404"
      title="That route is outside the current shell."
    />
  );
}

export const appRouter = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'about',
        element: (
          <ShellPage
            body="This page will carry the concise background, operating philosophy, and capability framing for the public portfolio."
            eyebrow="About"
            title="The human context behind the system."
          />
        ),
      },
      {
        path: 'work',
        element: (
          <ShellPage
            body="This is the stable project index route for the shell phase. Project detail routes live under /projects/*."
            eyebrow="Work"
            title="Four Orion-aligned project surfaces anchor the portfolio."
          />
        ),
      },
      {
        path: 'projects',
        element: <Navigate replace to="/work" />,
      },
      {
        path: 'architecture',
        element: (
          <ShellPage
            body="This route will explain the monorepo shape, dev/prod split, Terraform baseline, and frontend/backend/shared package boundaries."
            eyebrow="Architecture"
            title="Architecture is part of the portfolio proof."
          />
        ),
      },
      {
        path: 'observability',
        element: (
          <ShellPage
            body="This route remains approved from the bootstrap phase and will become the live application observability surface."
            eyebrow="Observability"
            title="Operational signals are a first-class interface."
          />
        ),
      },
      {
        path: 'repo-workflow',
        element: (
          <ShellPage
            body="This support route explains the public build process, CI/CD, branch model, and reviewable repo workflow."
            eyebrow="Repo workflow"
            title="The repository is part of the product story."
          />
        ),
      },
      {
        path: 'projects/payment-exception-review',
        element: (
          <ShellPage
            body="A structured shell for the payment exception review project page. The full problem, architecture, flow, and demo launcher arrive in the project-page checklist section."
            eyebrow="Project"
            title="Payment Exception Review Agent"
          />
        ),
      },
      {
        path: 'projects/investing-ops-copilot',
        element: (
          <ShellPage
            body="A structured shell for the investing operations copilot project page. The full narrative and workflow detail arrive later in this checklist."
            eyebrow="Project"
            title="Intelligent Investing Operations Copilot"
          />
        ),
      },
      {
        path: 'projects/legacy-ai-adapter',
        element: (
          <ShellPage
            body="A structured shell for the legacy workflow to AI-native adapter project page."
            eyebrow="Project"
            title="Legacy Workflow to AI-Native Adapter"
          />
        ),
      },
      {
        path: 'projects/eval-console',
        element: (
          <ShellPage
            body="A structured shell for the evaluation and reliability console project page."
            eyebrow="Project"
            title="Evaluation and Reliability Console"
          />
        ),
      },
      {
        path: 'demo',
        element: (
          <ShellPage
            body="The demo index route is reserved for controlled access messaging and launch cards."
            eyebrow="Demo access"
            title="Demo surfaces start here."
          />
        ),
      },
      {
        path: 'demo/payment-exception-review',
        element: (
          <ShellPage
            body="A route-level shell for the future payment exception review demo experience."
            eyebrow="Demo"
            title="Payment Exception Review Demo"
          />
        ),
      },
      {
        path: 'demo/investing-ops-copilot',
        element: (
          <ShellPage
            body="A route-level shell for the future investing operations copilot demo experience."
            eyebrow="Demo"
            title="Investing Operations Copilot Demo"
          />
        ),
      },
      {
        path: 'demo/legacy-ai-adapter',
        element: (
          <ShellPage
            body="A route-level shell for the future legacy workflow adapter demo experience."
            eyebrow="Demo"
            title="Legacy AI Adapter Demo"
          />
        ),
      },
      {
        path: 'demo/eval-console',
        element: (
          <ShellPage
            body="A route-level shell for the future evaluation and reliability console."
            eyebrow="Demo"
            title="Evaluation Console Demo"
          />
        ),
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
