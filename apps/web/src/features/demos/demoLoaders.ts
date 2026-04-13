import {
  routeDataEmpty,
  routeDataError,
  routeDataSuccess,
  type RouteDataState,
} from '../../app/routeData';
import { apiRoutes, describeApiRequest } from '../../lib/api/apiClient';
import {
  findPortfolioProjectByDemoHref,
  portfolioProjects,
  type PortfolioProject,
} from '../projects/projectCatalog';
import {
  demoShellContentByHref,
  type DemoPanelContent,
} from './demoShellContent';

export type DemoIndexPageData = RouteDataState<{
  backendNote: string;
  projects: PortfolioProject[];
}>;

export type DemoShellPageData = RouteDataState<{
  content: DemoPanelContent;
  project: PortfolioProject;
}>;

function describeSharedDemoApis(projectId: string): string {
  return [
    describeApiRequest('POST', apiRoutes.demoRun(projectId)),
    describeApiRequest('GET', apiRoutes.runs()),
    describeApiRequest('GET', apiRoutes.evaluations()),
  ].join(', ');
}

export async function loadDemoIndexPageData(): Promise<DemoIndexPageData> {
  try {
    if (portfolioProjects.length === 0) {
      return routeDataEmpty(
        'No demo modules are listed yet.',
        'The demo index expects a project catalog before shells can be launched.',
      );
    }

    return routeDataSuccess({
      backendNote: `Demo execution will flow through ${describeApiRequest(
        'POST',
        apiRoutes.demoRun(':projectId'),
      )}, then read run detail, trace, metrics, and evaluation records from the shared run feeds.`,
      projects: portfolioProjects,
    });
  } catch (error) {
    return routeDataError(
      'The demo index could not be prepared.',
      'Demo-launch data should resolve in a route loader before the access shell renders.',
      error instanceof Error ? error.message : 'Unknown demo index loader error.',
    );
  }
}

export async function loadDemoShellPageData(
  demoHref: string,
): Promise<DemoShellPageData> {
  try {
    const project = findPortfolioProjectByDemoHref(demoHref);
    const content = demoShellContentByHref[demoHref];

    if (!project || !content) {
      return routeDataEmpty(
        'That demo route is not ready.',
        'The shell exists, but the project data or panel configuration is missing.',
      );
    }

    return routeDataSuccess({
      content: {
        ...content,
        backendNote: `Wire this page through ${describeSharedDemoApis(project.id)} so the input, trace, and evaluation panels can hydrate from shared runtime records.`,
      },
      project,
    });
  } catch (error) {
    return routeDataError(
      'The demo shell could not be prepared.',
      'Demo route data should resolve in a loader before the shell panels render.',
      error instanceof Error ? error.message : 'Unknown demo shell loader error.',
    );
  }
}
