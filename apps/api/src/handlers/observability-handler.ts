import { NotFoundError, ValidationError } from '../errors/api-error.js';
import type { AppContext } from '../app/context.js';
import type { RequestContext } from '../lib/http.js';
import { sendSuccess } from '../lib/http.js';
import {
  getObservabilityOverview,
  getProjectMetrics,
  isProjectId,
  listEvaluations,
  listProjects,
  listRuns,
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
    },
    context.requestId,
  );
}

export async function handleListRuns(
  context: RequestContext,
  app: AppContext,
): Promise<void> {
  const projectId = context.url.searchParams.get('projectId');

  if (projectId && !isProjectId(projectId)) {
    throw new ValidationError(
      'invalid_project_id',
      'Project ID must match a supported portfolio project.',
      { projectId },
    );
  }

  const runs = await listRuns(
    app.firestore,
    projectId && isProjectId(projectId) ? projectId : undefined,
  );

  sendSuccess(
    context.response,
    200,
    {
      runs,
      count: runs.length,
    },
    context.requestId,
  );
}

export async function handleListEvaluations(
  context: RequestContext,
  app: AppContext,
): Promise<void> {
  const projectId = context.url.searchParams.get('projectId');

  if (projectId && !isProjectId(projectId)) {
    throw new ValidationError(
      'invalid_project_id',
      'Project ID must match a supported portfolio project.',
      { projectId },
    );
  }

  const evaluations = await listEvaluations(
    app.firestore,
    projectId && isProjectId(projectId) ? projectId : undefined,
  );

  sendSuccess(
    context.response,
    200,
    {
      evaluations,
      count: evaluations.length,
    },
    context.requestId,
  );
}

export async function handleProjectMetrics(
  context: RequestContext,
  app: AppContext,
  params: { projectId?: string },
): Promise<void> {
  const projectId = params.projectId ?? '';

  if (!isProjectId(projectId)) {
    throw new NotFoundError(
      'project_not_found',
      'No project metrics were found for the requested project ID.',
      { projectId },
    );
  }

  const metrics = await getProjectMetrics(app.firestore, projectId);

  sendSuccess(context.response, 200, metrics, context.requestId);
}
