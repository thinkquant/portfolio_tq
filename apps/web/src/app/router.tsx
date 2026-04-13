import { PageHeading } from '@portfolio-tq/ui';
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
      <PageHeading eyebrow={eyebrow} lead={body} title={title} />
    </div>
  );
}

function NotFoundPage() {
  return (
    <ShellPage
      body="That address does not point to a published page. Use the primary navigation to return to the portfolio."
      eyebrow="404"
      title="Page not found."
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
