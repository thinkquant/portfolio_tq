import { randomUUID } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';

import type {
  ApiErrorEnvelope,
  ApiSuccessEnvelope,
  JsonObject,
} from '@portfolio-tq/types';
import { ValidationError } from '../errors/api-error.js';
import { applyCors } from '../middleware/cors.js';

export type RequestContext = {
  request: IncomingMessage;
  response: ServerResponse;
  requestId: string;
  requestIdSource: 'generated' | 'x-request-id' | 'x-correlation-id';
  method: string;
  url: URL;
  path: string;
  startedAt: number;
};

export function createRequestContext(
  request: IncomingMessage,
  response: ServerResponse,
): RequestContext {
  const url = new URL(request.url ?? '/', 'http://localhost');
  const { requestId, requestIdSource } = resolveRequestId(request);

  applyRequestHeaders(response, requestId);

  return {
    request,
    response,
    requestId,
    requestIdSource,
    method: request.method ?? 'GET',
    url,
    path: url.pathname,
    startedAt: Date.now(),
  };
}

function resolveRequestId(request: IncomingMessage): {
  requestId: string;
  requestIdSource: RequestContext['requestIdSource'];
} {
  const headerCandidates = [
    ['x-request-id', request.headers['x-request-id']],
    ['x-correlation-id', request.headers['x-correlation-id']],
  ] as const;

  for (const [headerName, headerValue] of headerCandidates) {
    const requestId = normalizeRequestId(headerValue);

    if (requestId) {
      return {
        requestId,
        requestIdSource: headerName,
      };
    }
  }

  return {
    requestId: randomUUID(),
    requestIdSource: 'generated',
  };
}

function normalizeRequestId(
  headerValue: string | string[] | undefined,
): string | null {
  const candidate = Array.isArray(headerValue) ? headerValue[0] : headerValue;
  const normalized = candidate?.split(',')[0]?.trim();

  if (!normalized || normalized.length > 128) {
    return null;
  }

  return /^[A-Za-z0-9][A-Za-z0-9._:/-]{0,127}$/.test(normalized)
    ? normalized
    : null;
}

function applyRequestHeaders(
  response: ServerResponse,
  requestId: string,
): void {
  response.setHeader('X-Request-Id', requestId);
  response.setHeader('X-Correlation-Id', requestId);
}

export function sendJson(
  response: ServerResponse,
  statusCode: number,
  payload: unknown,
): void {
  applyCors(response);
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(`${JSON.stringify(payload)}\n`);
}

export function sendSuccess<T>(
  response: ServerResponse,
  statusCode: number,
  payload: T,
  requestId?: string,
): void {
  sendJson(response, statusCode, {
    ok: true,
    data: payload,
    ...(requestId ? { requestId } : {}),
  } satisfies ApiSuccessEnvelope<T>);
}

export function sendError(
  response: ServerResponse,
  statusCode: number,
  requestId: string,
  code: string,
  message: string,
  details?: JsonObject,
): void {
  sendJson(response, statusCode, {
    ok: false,
    error: {
      code,
      message,
      ...(details && Object.keys(details).length ? { details } : {}),
    },
    requestId,
  } satisfies ApiErrorEnvelope);
}

export async function readJsonBody<TPayload extends object>(
  request: IncomingMessage,
): Promise<TPayload> {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (chunks.length === 0) {
    return {} as TPayload;
  }

  const body = Buffer.concat(chunks).toString('utf8');

  if (!body.trim()) {
    return {} as TPayload;
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(body) as unknown;
  } catch (error) {
    throw new ValidationError(
      'invalid_json',
      'Request body must be valid JSON.',
      {
        cause:
          error instanceof Error ? error.message : 'Unknown JSON parse failure',
      },
    );
  }

  return typeof parsed === 'object' && parsed !== null
    ? (parsed as TPayload)
    : (() => {
        throw new ValidationError(
          'invalid_request',
          'Request body must be a JSON object.',
        );
      })();
}
