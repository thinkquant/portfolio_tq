type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type ApiRequestJsonOptions = Omit<RequestInit, 'body' | 'method'> & {
  body?: BodyInit | null;
  method?: ApiMethod;
};

type ApiRouteBuilder = (...segments: string[]) => string;

function trimSlashes(value: string): string {
  return value.replace(/^\/+|\/+$/g, '');
}

function joinPath(basePath: string, path: string): string {
  const normalizedBase = trimSlashes(basePath);
  const normalizedPath = trimSlashes(path);

  if (!normalizedBase) {
    return normalizedPath ? `/${normalizedPath}` : '/';
  }

  if (!normalizedPath) {
    return `/${normalizedBase}`;
  }

  return `/${normalizedBase}/${normalizedPath}`;
}

function buildApiRoute(path: string): string {
  return joinPath(resolveApiBasePath(), path);
}

function buildSegmentRoute(prefix: string): ApiRouteBuilder {
  return (...segments) => buildApiRoute(joinPath(prefix, segments.join('/')));
}

export function resolveApiBasePath(): string {
  const envBase = import.meta.env.VITE_API_BASE_PATH;

  return typeof envBase === 'string' && envBase.trim()
    ? joinPath(envBase, '')
    : '/api';
}

export const apiRoutes = {
  observabilityOverview: () => buildApiRoute('observability/overview'),
  runs: () => buildApiRoute('runs'),
  runDetail: buildSegmentRoute('runs'),
  evaluations: () => buildApiRoute('evaluations'),
  projectMetrics: buildSegmentRoute('projects'),
  demoRun: (projectId: string) => buildApiRoute(`demo/${projectId}/run`),
};

export function describeApiRequest(method: ApiMethod, path: string): string {
  return `${method} ${path}`;
}

export class ApiClientError extends Error {
  readonly status: number;
  readonly statusText: string;
  readonly responseBody: string;

  constructor(status: number, statusText: string, responseBody: string) {
    super(`API request failed with ${status} ${statusText}`.trim());
    this.name = 'ApiClientError';
    this.status = status;
    this.statusText = statusText;
    this.responseBody = responseBody;
  }
}

export async function apiRequestJson<T>(
  path: string,
  options: ApiRequestJsonOptions = {},
): Promise<T> {
  const { body, headers, method = 'GET', ...rest } = options;
  const response = await fetch(path, {
    ...rest,
    body,
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    method,
  });

  if (!response.ok) {
    throw new ApiClientError(
      response.status,
      response.statusText,
      await response.text(),
    );
  }

  return (await response.json()) as T;
}
