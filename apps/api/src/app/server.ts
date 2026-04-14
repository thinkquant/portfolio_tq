import { createServer } from 'node:http';

import { NotFoundError } from '../errors/api-error.js';
import { createRequestContext } from '../lib/http.js';
import { handleRouteError } from '../middleware/error-handler.js';
import { handleOptions } from '../middleware/cors.js';
import type { Router } from '../routes/router.js';
import type { AppContext } from './context.js';

export function createApiServer(app: AppContext, router: Router) {
  return createServer(async (request, response) => {
    const context = createRequestContext(request, response);

    app.logger.requestReceived(
      {
        requestId: context.requestId,
        requestIdSource: context.requestIdSource,
        method: context.method,
        path: context.path,
      },
      {
        origin: getHeaderValue(request.headers.origin),
        userAgent: getHeaderValue(request.headers['user-agent']),
        query: context.url.search || undefined,
      },
    );

    try {
      if (handleOptions(context.method, response)) {
        return;
      }

      const handled = await router.handle(context);

      if (!handled) {
        throw new NotFoundError(
          'not_found',
          'The requested route was not found.',
          {
            path: context.path,
          },
        );
      }
    } catch (error) {
      handleRouteError(error, context, app);
    } finally {
      app.logger.requestCompleted(
        {
          requestId: context.requestId,
          latencyMs: Date.now() - context.startedAt,
          method: context.method,
          path: context.path,
          statusCode: response.statusCode || 200,
        },
        {
          query: context.url.search || undefined,
        },
      );
    }
  });
}

function getHeaderValue(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return value.join(', ');
  }

  return value ?? undefined;
}
