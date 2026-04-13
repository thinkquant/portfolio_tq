import {
  Callout,
  Card,
  PageHeading,
  ProofTag,
  SectionHeading,
} from '@portfolio-tq/ui';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import { DemoAccessShell } from '../features/access/DemoAccessShell';
import { AboutPage } from '../features/about/AboutPage';
import { ArchitecturePage } from '../features/architecture/ArchitecturePage';
import { EvalConsoleDashboardPage } from '../features/dashboards/EvalConsoleDashboardPage';
import { ObservabilityPage } from '../features/dashboards/ObservabilityPage';
import {
  loadEvalConsolePageData,
  loadObservabilityPageData,
} from '../features/dashboards/dashboardLoaders';
import { DemoIndexPage } from '../features/demos/DemoIndexPage';
import { DemoShellPage } from '../features/demos/DemoShellPage';
import {
  loadDemoIndexPageData,
  loadDemoShellPageData,
} from '../features/demos/demoLoaders';
import { HomePage } from '../features/home/HomePage';
import { ProjectDetailPage } from '../features/projects/ProjectDetailPage';
import {
  loadProjectDetailPageData,
  loadWorkPageData,
} from '../features/projects/projectLoaders';
import { WorkPage } from '../features/projects/WorkPage';
import { RepoWorkflowPage } from '../features/repo/RepoWorkflowPage';
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

function withDemoAccess(element: React.ReactNode) {
  return <DemoAccessShell>{element}</DemoAccessShell>;
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
        element: <AboutPage />,
      },
      {
        path: 'work',
        loader: loadWorkPageData,
        element: <WorkPage />,
      },
      {
        path: 'projects',
        element: <Navigate replace to="/work" />,
      },
      {
        path: 'architecture',
        element: <ArchitecturePage />,
      },
      {
        path: 'observability',
        loader: loadObservabilityPageData,
        element: <ObservabilityPage />,
      },
      {
        path: 'repo-workflow',
        element: <RepoWorkflowPage />,
      },
      {
        path: 'projects/payment-exception-review',
        loader: () =>
          loadProjectDetailPageData('/projects/payment-exception-review'),
        element: <ProjectDetailPage />,
      },
      {
        path: 'projects/investing-ops-copilot',
        loader: () =>
          loadProjectDetailPageData('/projects/investing-ops-copilot'),
        element: <ProjectDetailPage />,
      },
      {
        path: 'projects/legacy-ai-adapter',
        loader: () => loadProjectDetailPageData('/projects/legacy-ai-adapter'),
        element: <ProjectDetailPage />,
      },
      {
        path: 'projects/eval-console',
        loader: () => loadProjectDetailPageData('/projects/eval-console'),
        element: <ProjectDetailPage />,
      },
      {
        path: 'demo',
        loader: loadDemoIndexPageData,
        element: withDemoAccess(<DemoIndexPage />),
      },
      {
        path: 'demo/payment-exception-review',
        loader: () => loadDemoShellPageData('/demo/payment-exception-review'),
        element: withDemoAccess(<DemoShellPage />),
      },
      {
        path: 'demo/investing-ops-copilot',
        loader: () => loadDemoShellPageData('/demo/investing-ops-copilot'),
        element: withDemoAccess(<DemoShellPage />),
      },
      {
        path: 'demo/legacy-ai-adapter',
        loader: () => loadDemoShellPageData('/demo/legacy-ai-adapter'),
        element: withDemoAccess(<DemoShellPage />),
      },
      {
        path: 'demo/eval-console',
        loader: loadEvalConsolePageData,
        element: withDemoAccess(<EvalConsoleDashboardPage />),
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
