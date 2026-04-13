import { randomUUID } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';

import { ValidationError } from '../errors/api-error.js';
import { applyCors } from '../middleware/cors.js';

export type RequestContext = {
  request: IncomingMessage;
  response: ServerResponse;
  requestId: string;
  method: string;
  url: URL;
  path: string;
  startedAt: number;
};

export type ApiSuccessResponse<T> = {
  ok: true;
  data: T;
  requestId?: string;
};

export type ApiErrorResponse = {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  requestId: string;
};

export function createRequestContext(
  request: IncomingMessage,
  response: ServerResponse,
): RequestContext {
  const url = new URL(request.url ?? '/', 'http://localhost');

  return {
    request,
    response,
    requestId: randomUUID(),
    method: request.method ?? 'GET',
    url,
    path: url.pathname,
    startedAt: Date.now(),
  };
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
  } satisfies ApiSuccessResponse<T>);
}

export function sendError(
  response: ServerResponse,
  statusCode: number,
  requestId: string,
  code: string,
  message: string,
  details?: Record<string, unknown>,
): void {
  sendJson(response, statusCode, {
    ok: false,
    error: {
      code,
      message,
      ...(details && Object.keys(details).length ? { details } : {}),
    },
    requestId,
  } satisfies ApiErrorResponse);
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
