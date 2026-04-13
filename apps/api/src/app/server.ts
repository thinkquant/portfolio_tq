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

    app.logger.info(
      'request.received',
      {
        requestId: context.requestId,
      },
      {
        method: context.method,
        path: context.path,
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
      app.logger.info(
        'request.completed',
        {
          requestId: context.requestId,
          latencyMs: Date.now() - context.startedAt,
        },
        {
          method: context.method,
          path: context.path,
          statusCode: response.statusCode || 200,
        },
      );
    }
  });
}
