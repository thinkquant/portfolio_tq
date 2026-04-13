import {
  routeDataEmpty,
  routeDataError,
  routeDataSuccess,
  type RouteDataState,
} from '../../app/routeData';
import {
  findPortfolioProject,
  portfolioProjects,
  type PortfolioProject,
} from './projectCatalog';

export type WorkPageData = RouteDataState<{
  projects: PortfolioProject[];
}>;

export type ProjectDetailPageData = RouteDataState<{
  project: PortfolioProject;
}>;

export async function loadWorkPageData(): Promise<WorkPageData> {
  try {
    if (portfolioProjects.length === 0) {
      return routeDataEmpty(
        'No projects are published yet.',
        'The work index is wired for project data, but the catalog is still empty.',
      );
    }

    return routeDataSuccess({
      projects: portfolioProjects,
    });
  } catch (error) {
    return routeDataError(
      'The work index could not be prepared.',
      'Route-level data should resolve through a loader before the page renders.',
      error instanceof Error ? error.message : 'Unknown project loader error.',
    );
  }
}

export async function loadProjectDetailPageData(
  href: string,
): Promise<ProjectDetailPageData> {
  try {
    const project = findPortfolioProject(href);

    if (!project) {
      return routeDataEmpty(
        'That project route is not available.',
        'The route exists in the shell, but no project definition was found for it.',
      );
    }

    return routeDataSuccess({
      project,
    });
  } catch (error) {
    return routeDataError(
      'The project page could not be prepared.',
      'Project routes should resolve their page model in a loader before the detail view renders.',
      error instanceof Error ? error.message : 'Unknown project detail loader error.',
    );
  }
}
