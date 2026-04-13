import {
  routeDataError,
  routeDataSuccess,
  type RouteDataState,
} from '../../app/routeData';
import {
  evalConsoleDashboardConfig,
  observabilityDashboardConfig,
} from './dashboardConfigs';
import type { DashboardShellConfig } from './DashboardShell';

export type DashboardPageData = RouteDataState<{
  config: DashboardShellConfig;
}>;

async function loadDashboardPageData(
  config: DashboardShellConfig,
): Promise<DashboardPageData> {
  try {
    return routeDataSuccess({
      config,
    });
  } catch (error) {
    return routeDataError(
      'The dashboard shell could not be prepared.',
      'The dashboard content is temporarily unavailable.',
      error instanceof Error ? error.message : 'Unknown dashboard error.',
    );
  }
}

export async function loadObservabilityPageData(): Promise<DashboardPageData> {
  return loadDashboardPageData(observabilityDashboardConfig);
}

export async function loadEvalConsolePageData(): Promise<DashboardPageData> {
  return loadDashboardPageData(evalConsoleDashboardConfig);
}
