import type { JsonValue, ProjectId } from '@portfolio-tq/types';

type LogSeverity = 'INFO' | 'WARNING' | 'ERROR';

type BaseLogContext = {
  requestId?: string | null;
  projectId?: ProjectId | null;
  runId?: string | null;
  latencyMs?: number | null;
  promptVersionId?: string | null;
};

type ExtraLogFields = Record<string, JsonValue | undefined>;

export type LifecycleEventType =
  | 'run.created'
  | 'run.started'
  | 'model.requested'
  | 'model.completed'
  | 'tool.called'
  | 'tool.completed'
  | 'schema.validated'
  | 'fallback.triggered'
  | 'escalation.created'
  | 'run.completed'
  | 'run.failed';

export type Logger = ReturnType<typeof createLogger>;

function pruneUndefined(fields: ExtraLogFields): Record<string, JsonValue> {
  return Object.fromEntries(
    Object.entries(fields).filter(([, value]) => value !== undefined),
  ) as Record<string, JsonValue>;
}

export function createLogger(config: {
  serviceName: string;
  environment: string;
}) {
  function emit(
    severity: LogSeverity,
    eventType: string,
    context: BaseLogContext = {},
    fields: ExtraLogFields = {},
  ): void {
    console.log(
      JSON.stringify({
        severity,
        service: config.serviceName,
        environment: config.environment,
        eventType,
        timestamp: new Date().toISOString(),
        requestId: context.requestId ?? null,
        projectId: context.projectId ?? null,
        runId: context.runId ?? null,
        latencyMs: context.latencyMs ?? null,
        promptVersionId: context.promptVersionId ?? null,
        ...pruneUndefined(fields),
      }),
    );
  }

  return {
    info(eventType: string, context?: BaseLogContext, fields?: ExtraLogFields): void {
      emit('INFO', eventType, context, fields);
    },
    runLifecycle(
      eventType: LifecycleEventType,
      context: BaseLogContext & { projectId: ProjectId; runId: string },
      fields?: ExtraLogFields,
    ): void {
      emit('INFO', eventType, context, fields);
    },
    error(
      eventType: string,
      error: unknown,
      context?: BaseLogContext,
      fields?: ExtraLogFields,
    ): void {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorName = error instanceof Error ? error.name : 'UnknownError';

      emit('ERROR', eventType, context, {
        errorName,
        errorMessage,
        ...fields,
      });
    },
  };
}
