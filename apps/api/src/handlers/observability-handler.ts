import { parseProjectId } from '@portfolio-tq/schemas';
import type { ProjectListResponseData } from '@portfolio-tq/types';

import { NotFoundError } from '../errors/api-error.js';
import type { AppContext } from '../app/context.js';
import type { RequestContext } from '../lib/http.js';
import { sendSuccess } from '../lib/http.js';
import {
  getObservabilityOverview,
  getProjectMetrics,
  listProjects,
} from '../services/observability.js';

export async function handleObservabilityOverview(
  context: RequestContext,
  app: AppContext,
): Promise<void> {
  const overview = await getObservabilityOverview(app.firestore);

  sendSuccess(context.response, 200, overview, context.requestId);
}

export async function handleListProjects(
  context: RequestContext,
  app: AppContext,
): Promise<void> {
  const projects = await listProjects(app.firestore);

  sendSuccess(
    context.response,
    200,
    {
      projects,
      count: projects.length,
    } satisfies ProjectListResponseData,
    context.requestId,
  );
}

export async function handleProjectMetrics(
  context: RequestContext,
  app: AppContext,
  params: { projectId?: string },
): Promise<void> {
  const parsedProjectId = parseProjectId(params.projectId ?? '');

  if (!parsedProjectId.success) {
    throw new NotFoundError(
      'project_not_found',
      'No project metrics were found for the requested project ID.',
      {
        projectId: params.projectId ?? '',
      },
    );
  }

  const metrics = await getProjectMetrics(app.firestore, parsedProjectId.data);

  sendSuccess(context.response, 200, metrics, context.requestId);
}
