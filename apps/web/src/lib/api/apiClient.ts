import type { ApiErrorEnvelope, ApiSuccessEnvelope } from '@portfolio-tq/types';

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
  return joinApiBase(resolveApiBasePath(), path);
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

function joinApiBase(basePath: string, path: string): string {
  if (/^https?:\/\//i.test(basePath)) {
    const baseUrl = new URL(basePath);
    const normalizedPath = trimSlashes(path);

    baseUrl.pathname = joinPath(baseUrl.pathname, normalizedPath);

    return baseUrl.toString().replace(/\/$/, '');
  }

  return joinPath(basePath, path);
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
  readonly apiCode: string | null;
  readonly apiMessage: string | null;
  readonly requestId: string | null;

  constructor(status: number, statusText: string, responseBody: string) {
    const parsed = parseApiErrorEnvelope(responseBody);
    const apiMessage = parsed?.error?.message ?? null;

    super(
      apiMessage ?? `API request failed with ${status} ${statusText}`.trim(),
    );
    this.name = 'ApiClientError';
    this.status = status;
    this.statusText = statusText;
    this.responseBody = responseBody;
    this.apiCode = parsed?.error?.code ?? null;
    this.apiMessage = apiMessage;
    this.requestId = parsed?.requestId ?? null;
  }
}

function parseApiErrorEnvelope(responseBody: string): ApiErrorEnvelope | null {
  try {
    const parsed = JSON.parse(responseBody) as unknown;

    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'ok' in parsed &&
      (parsed as { ok?: unknown }).ok === false
    ) {
      return parsed as ApiErrorEnvelope;
    }
  } catch {
    return null;
  }

  return null;
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

  const payload = (await response.json()) as ApiSuccessEnvelope<T> | T;

  if (
    typeof payload === 'object' &&
    payload !== null &&
    'ok' in payload &&
    (payload as { ok?: unknown }).ok === true &&
    'data' in payload
  ) {
    return (payload as ApiSuccessEnvelope<T>).data;
  }

  return payload as T;
}
