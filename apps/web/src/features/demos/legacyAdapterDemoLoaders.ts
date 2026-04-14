import type { LegacyAdapterSampleCase } from '@portfolio-tq/types';

import { legacyAiAdapterDemoCopy } from '@/content/demoCopy';

import {
  routeDataEmpty,
  routeDataError,
  routeDataSuccess,
  type RouteDataState,
} from '../../app/routeData';
import {
  findPortfolioProjectByDemoHref,
  type PortfolioProject,
} from '../projects/projectCatalog';
import {
  describeLegacyAdapterApiError,
  fetchLegacyAdapterSamples,
} from './legacyAdapterApi';

export type LegacyAdapterDemoPageData = RouteDataState<{
  content: typeof legacyAiAdapterDemoCopy;
  project: PortfolioProject;
  samples: LegacyAdapterSampleCase[];
}>;

export async function loadLegacyAdapterDemoPageData(): Promise<LegacyAdapterDemoPageData> {
  try {
    const project = findPortfolioProjectByDemoHref('/demo/legacy-ai-adapter');

    if (!project) {
      return routeDataEmpty(
        'The legacy adapter demo route is not configured.',
        'Project metadata for this demo is temporarily unavailable.',
      );
    }

    const sampleResponse = await fetchLegacyAdapterSamples();
    const legacyAdapterSamples = sampleResponse.samples;

    if (legacyAdapterSamples.length === 0) {
      return routeDataEmpty(
        'No legacy adapter samples are available yet.',
        'The shared API returned an empty sample set for the legacy adapter demo.',
      );
    }

    return routeDataSuccess({
      content: legacyAiAdapterDemoCopy,
      project,
      samples: legacyAdapterSamples,
    });
  } catch (error) {
    const apiError = describeLegacyAdapterApiError(error);

    return routeDataError(
      'The legacy adapter demo could not be prepared.',
      'The shared API sample feed is temporarily unavailable.',
      apiError.detail ? `${apiError.message} ${apiError.detail}` : apiError.message,
    );
  }
}
