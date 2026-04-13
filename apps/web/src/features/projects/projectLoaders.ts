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
        'Published project modules will appear here.',
      );
    }

    return routeDataSuccess({
      projects: portfolioProjects,
    });
  } catch (error) {
    return routeDataError(
      'The work index could not be prepared.',
      'Project data is temporarily unavailable.',
      error instanceof Error ? error.message : 'Unknown project error.',
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
        'Use the Work page to return to the published project list.',
      );
    }

    return routeDataSuccess({
      project,
    });
  } catch (error) {
    return routeDataError(
      'The project page could not be prepared.',
      'This project page is temporarily unavailable.',
      error instanceof Error ? error.message : 'Unknown project detail error.',
    );
  }
}
