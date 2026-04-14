import type {
  LegacyAdapterDemoResponseData,
  LegacyAdapterInput,
  LegacyAdapterSampleListResponseData,
} from '@portfolio-tq/types';

import { ApiClientError, apiRequestJson, apiRoutes } from '@/lib/api/apiClient';

export async function fetchLegacyAdapterSamples(): Promise<LegacyAdapterSampleListResponseData> {
  return apiRequestJson<LegacyAdapterSampleListResponseData>(
    apiRoutes.demoSamples('legacy-ai-adapter'),
  );
}

export async function runLegacyAdapter(
  input: LegacyAdapterInput,
): Promise<LegacyAdapterDemoResponseData> {
  return apiRequestJson<LegacyAdapterDemoResponseData>(
    apiRoutes.demoRun('legacy-ai-adapter'),
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
  );
}

export function describeLegacyAdapterApiError(error: unknown): {
  detail?: string;
  message: string;
} {
  if (error instanceof ApiClientError) {
    const detail = error.requestId
      ? `Request ID: ${error.requestId}.`
      : undefined;

    return {
      message:
        error.apiMessage ??
        'The legacy adapter API request failed before a usable response was returned.',
      detail,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: 'Unknown legacy adapter API error.',
  };
}
