import { PageHeading } from '@portfolio-tq/ui';
import { createBrowserRouter, Navigate } from 'react-router-dom';

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

function RouteHydrateFallback() {
  return (
    <div className="grid gap-8">
      <PageHeading
        eyebrow="Loading"
        lead="Preparing the portfolio view and its shared runtime data."
        title="Loading portfolio module."
      />
    </div>
  );
}

async function loadHomeRoute() {
  const { HomePage } = await import('../features/home/HomePage');

  return { Component: HomePage };
}

async function loadAboutRoute() {
  const { AboutPage } = await import('../features/about/AboutPage');

  return { Component: AboutPage };
}

async function loadWorkRoute() {
  const [{ WorkPage }, { loadWorkPageData }] = await Promise.all([
    import('../features/projects/WorkPage'),
    import('../features/projects/projectLoaders'),
  ]);

  return {
    Component: WorkPage,
    loader: loadWorkPageData,
  };
}

async function loadArchitectureRoute() {
  const { ArchitecturePage } = await import(
    '../features/architecture/ArchitecturePage'
  );

  return { Component: ArchitecturePage };
}

async function loadObservabilityRoute() {
  const [{ ObservabilityPage }, { loadObservabilityPageData }] =
    await Promise.all([
      import('../features/dashboards/ObservabilityPage'),
      import('../features/dashboards/dashboardLoaders'),
    ]);

  return {
    Component: ObservabilityPage,
    loader: loadObservabilityPageData,
  };
}

async function loadRepoWorkflowRoute() {
  const { RepoWorkflowPage } = await import(
    '../features/repo/RepoWorkflowPage'
  );

  return { Component: RepoWorkflowPage };
}

async function loadProjectDetailRoute(href: string) {
  const [{ ProjectDetailPage }, { loadProjectDetailPageData }] =
    await Promise.all([
      import('../features/projects/ProjectDetailPage'),
      import('../features/projects/projectLoaders'),
    ]);

  return {
    Component: ProjectDetailPage,
    loader: () => loadProjectDetailPageData(href),
  };
}

async function loadLegacyAdapterProjectRoute() {
  const [{ LegacyAdapterProjectPage }, { loadProjectDetailPageData }] =
    await Promise.all([
      import('../features/projects/LegacyAdapterProjectPage'),
      import('../features/projects/projectLoaders'),
    ]);

  return {
    Component: LegacyAdapterProjectPage,
    loader: () => loadProjectDetailPageData('/projects/legacy-ai-adapter'),
  };
}

async function loadDemoIndexRoute() {
  const [{ DemoAccessShell }, { DemoIndexPage }, { loadDemoIndexPageData }] =
    await Promise.all([
      import('../features/access/DemoAccessShell'),
      import('../features/demos/DemoIndexPage'),
      import('../features/demos/demoLoaders'),
    ]);

  function DemoIndexRoute() {
    return (
      <DemoAccessShell>
        <DemoIndexPage />
      </DemoAccessShell>
    );
  }

  return {
    Component: DemoIndexRoute,
    loader: loadDemoIndexPageData,
  };
}

async function loadDemoShellRoute(demoHref: string) {
  const [{ DemoAccessShell }, { DemoShellPage }, { loadDemoShellPageData }] =
    await Promise.all([
      import('../features/access/DemoAccessShell'),
      import('../features/demos/DemoShellPage'),
      import('../features/demos/demoLoaders'),
    ]);

  function DemoShellRoute() {
    return (
      <DemoAccessShell>
        <DemoShellPage />
      </DemoAccessShell>
    );
  }

  return {
    Component: DemoShellRoute,
    loader: () => loadDemoShellPageData(demoHref),
  };
}

async function loadLegacyAdapterDemoRoute() {
  const [
    { DemoAccessShell },
    { LegacyAdapterDemoPage },
    { loadLegacyAdapterDemoPageData },
  ] = await Promise.all([
    import('../features/access/DemoAccessShell'),
    import('../features/demos/LegacyAdapterDemoPage'),
    import('../features/demos/legacyAdapterDemoLoaders'),
  ]);

  function LegacyAdapterDemoRoute() {
    return (
      <DemoAccessShell>
        <LegacyAdapterDemoPage />
      </DemoAccessShell>
    );
  }

  return {
    Component: LegacyAdapterDemoRoute,
    loader: loadLegacyAdapterDemoPageData,
  };
}

async function loadEvalConsoleRoute() {
  const [
    { DemoAccessShell },
    { EvalConsoleDashboardPage },
    { loadEvalConsolePageData },
  ] = await Promise.all([
    import('../features/access/DemoAccessShell'),
    import('../features/dashboards/EvalConsoleDashboardPage'),
    import('../features/dashboards/dashboardLoaders'),
  ]);

  function EvalConsoleRoute() {
    return (
      <DemoAccessShell>
        <EvalConsoleDashboardPage />
      </DemoAccessShell>
    );
  }

  return {
    Component: EvalConsoleRoute,
    loader: loadEvalConsolePageData,
  };
}

export const appRouter = createBrowserRouter([
  {
    element: <RootLayout />,
    HydrateFallback: RouteHydrateFallback,
    children: [
      {
        index: true,
        lazy: loadHomeRoute,
      },
      {
        path: 'about',
        lazy: loadAboutRoute,
      },
      {
        path: 'work',
        lazy: loadWorkRoute,
      },
      {
        path: 'projects',
        element: <Navigate replace to="/work" />,
      },
      {
        path: 'architecture',
        lazy: loadArchitectureRoute,
      },
      {
        path: 'observability',
        lazy: loadObservabilityRoute,
      },
      {
        path: 'repo-workflow',
        lazy: loadRepoWorkflowRoute,
      },
      {
        path: 'projects/payment-exception-review',
        lazy: () => loadProjectDetailRoute('/projects/payment-exception-review'),
      },
      {
        path: 'projects/investing-ops-copilot',
        lazy: () => loadProjectDetailRoute('/projects/investing-ops-copilot'),
      },
      {
        path: 'projects/legacy-ai-adapter',
        lazy: loadLegacyAdapterProjectRoute,
      },
      {
        path: 'projects/eval-console',
        lazy: () => loadProjectDetailRoute('/projects/eval-console'),
      },
      {
        path: 'demo',
        lazy: loadDemoIndexRoute,
      },
      {
        path: 'demo/payment-exception-review',
        lazy: () => loadDemoShellRoute('/demo/payment-exception-review'),
      },
      {
        path: 'demo/investing-ops-copilot',
        lazy: () => loadDemoShellRoute('/demo/investing-ops-copilot'),
      },
      {
        path: 'demo/legacy-ai-adapter',
        lazy: loadLegacyAdapterDemoRoute,
      },
      {
        path: 'demo/eval-console',
        lazy: loadEvalConsoleRoute,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
