import {
  routeDataEmpty,
  routeDataError,
  routeDataSuccess,
  type RouteDataState,
} from '../../app/routeData';
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
  projects: PortfolioProject[];
}>;

export type DemoShellPageData = RouteDataState<{
  content: DemoPanelContent;
  project: PortfolioProject;
}>;

export async function loadDemoIndexPageData(): Promise<DemoIndexPageData> {
  try {
    if (portfolioProjects.length === 0) {
      return routeDataEmpty(
        'No demo modules are listed yet.',
        'The demo index expects a project catalog before shells can be launched.',
      );
    }

    return routeDataSuccess({
      projects: portfolioProjects,
    });
  } catch (error) {
    return routeDataError(
      'The demo index could not be prepared.',
      'Demo links are temporarily unavailable.',
      error instanceof Error ? error.message : 'Unknown demo index error.',
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
      content,
      project,
    });
  } catch (error) {
    return routeDataError(
      'The demo shell could not be prepared.',
      'This demo is temporarily unavailable.',
      error instanceof Error ? error.message : 'Unknown demo error.',
    );
  }
}
