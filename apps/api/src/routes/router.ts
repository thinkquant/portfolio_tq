import type { AppContext } from '../app/context.js';
import type { RequestContext } from '../lib/http.js';

export type RouteMatch = {
  params: Record<string, string | undefined>;
  match?: RegExpMatchArray;
};

export type RouteHandler = (
  context: RequestContext,
  app: AppContext,
  match: RouteMatch,
) => Promise<void> | void;

export type RouteDefinition = {
  method: 'GET' | 'POST';
  path?: string;
  pattern?: RegExp;
  params?: (match: RegExpMatchArray) => Record<string, string | undefined>;
  handler: RouteHandler;
};

export type Router = {
  handle(context: RequestContext): Promise<boolean>;
};

export function createRouter(
  app: AppContext,
  routes: RouteDefinition[],
): Router {
  return {
    async handle(context: RequestContext): Promise<boolean> {
      for (const route of routes) {
        if (route.method !== context.method) {
          continue;
        }

        if (route.path && route.path === context.path) {
          await route.handler(context, app, { params: {} });
          return true;
        }

        if (route.pattern) {
          const match = context.path.match(route.pattern);

          if (match) {
            await route.handler(context, app, {
              match,
              params: route.params?.(match) ?? {},
            });
            return true;
          }
        }
      }

      return false;
    },
  };
}
