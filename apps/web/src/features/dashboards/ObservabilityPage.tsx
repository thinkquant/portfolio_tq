import { useLoaderData } from 'react-router-dom';

import { RouteDataStateView } from '../../app/RouteDataStateView';
import { DashboardShell } from './DashboardShell';
import type { DashboardPageData } from './dashboardLoaders';

export function ObservabilityPage() {
  const state = useLoaderData() as DashboardPageData;

  return (
    <RouteDataStateView state={state}>
      {({ config }) => <DashboardShell config={config} />}
    </RouteDataStateView>
  );
}
