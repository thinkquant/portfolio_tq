import {
  routeDataError,
  routeDataSuccess,
  type RouteDataState,
} from '../../app/routeData';
import {
  apiRoutes,
  describeApiRequest,
} from '../../lib/api/apiClient';
import {
  evalConsoleDashboardConfig,
  observabilityDashboardConfig,
} from './dashboardConfigs';
import type { DashboardShellConfig } from './DashboardShell';

export type DashboardPageData = RouteDataState<{
  config: DashboardShellConfig;
}>;

function withSharedApiNotes(config: DashboardShellConfig): DashboardShellConfig {
  return {
    ...config,
    backendNote: [
      describeApiRequest('GET', apiRoutes.observabilityOverview()),
      describeApiRequest('GET', apiRoutes.runs()),
      describeApiRequest('GET', apiRoutes.evaluations()),
      describeApiRequest('GET', apiRoutes.projectMetrics(':projectId/metrics')),
    ].join(', '),
  };
}

async function loadDashboardPageData(
  config: DashboardShellConfig,
): Promise<DashboardPageData> {
  try {
    return routeDataSuccess({
      config: withSharedApiNotes(config),
    });
  } catch (error) {
    return routeDataError(
      'The dashboard shell could not be prepared.',
      'Dashboard routes should resolve their shell data in a loader before the page renders.',
      error instanceof Error ? error.message : 'Unknown dashboard loader error.',
    );
  }
}

export async function loadObservabilityPageData(): Promise<DashboardPageData> {
  return loadDashboardPageData(observabilityDashboardConfig);
}

export async function loadEvalConsolePageData(): Promise<DashboardPageData> {
  return loadDashboardPageData(evalConsoleDashboardConfig);
}
