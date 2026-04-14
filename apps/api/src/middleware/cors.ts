import type { ServerResponse } from 'node:http';

import { env } from '../config/env.js';

export function applyCors(response: ServerResponse): void {
  response.setHeader('Access-Control-Allow-Origin', env.cors.allowedOrigin);
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Vary', 'Origin');
}

export function handleOptions(
  method: string,
  response: ServerResponse,
): boolean {
  if (method !== 'OPTIONS') {
    return false;
  }

  applyCors(response);
  response.statusCode = 204;
  response.end();

  return true;
}
