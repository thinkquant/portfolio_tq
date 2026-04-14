import type { JsonValue, ProjectId } from '@portfolio-tq/types';

type LogSeverity = 'INFO' | 'WARNING' | 'ERROR';
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

type BaseLogContext = {
  requestId?: string | null;
  projectId?: ProjectId | null;
  runId?: string | null;
  latencyMs?: number | null;
  promptVersionId?: string | null;
};

type ExtraLogFields = Record<string, JsonValue | undefined>;

type LogRecord = {
  severity: LogSeverity;
  service: string;
  environment: string;
  eventType: string;
  timestamp: string;
  requestId: string | null;
  projectId: ProjectId | null;
  runId: string | null;
  latencyMs: number | null;
  promptVersionId: string | null;
} & Record<string, JsonValue | null>;

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

const logLevelRank: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const logSeverityRank: Record<LogSeverity, number> = {
  INFO: 20,
  WARNING: 30,
  ERROR: 40,
};

function pruneUndefined(fields: ExtraLogFields): Record<string, JsonValue> {
  return Object.fromEntries(
    Object.entries(fields).filter(([, value]) => value !== undefined),
  ) as Record<string, JsonValue>;
}

export function createLogger(config: {
  serviceName: string;
  environment: string;
  nodeEnv: 'development' | 'test' | 'production';
  logLevel: LogLevel;
}) {
  function emit(
    severity: LogSeverity,
    eventType: string,
    context: BaseLogContext = {},
    fields: ExtraLogFields = {},
  ): void {
    if (!shouldEmit(severity, config.logLevel)) {
      return;
    }

    const record: LogRecord = {
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
    };

    if (config.nodeEnv === 'development') {
      console.log(formatPrettyLog(record));
      return;
    }

    console.log(JSON.stringify(record));
  }

  return {
    info(
      eventType: string,
      context?: BaseLogContext,
      fields?: ExtraLogFields,
    ): void {
      emit('INFO', eventType, context, fields);
    },
    requestReceived(
      context: BaseLogContext & {
        requestId: string;
        method: string;
        path: string;
        requestIdSource: 'generated' | 'x-request-id' | 'x-correlation-id';
      },
      fields?: ExtraLogFields,
    ): void {
      emit(
        'INFO',
        'request.received',
        {
          requestId: context.requestId,
          projectId: context.projectId,
          runId: context.runId,
          promptVersionId: context.promptVersionId,
        },
        {
          method: context.method,
          path: context.path,
          requestIdSource: context.requestIdSource,
          ...fields,
        },
      );
    },
    requestCompleted(
      context: BaseLogContext & {
        requestId: string;
        method: string;
        path: string;
        statusCode: number;
        latencyMs: number;
      },
      fields?: ExtraLogFields,
    ): void {
      emit(
        'INFO',
        'request.completed',
        {
          requestId: context.requestId,
          projectId: context.projectId,
          runId: context.runId,
          latencyMs: context.latencyMs,
          promptVersionId: context.promptVersionId,
        },
        {
          method: context.method,
          path: context.path,
          statusCode: context.statusCode,
          ...fields,
        },
      );
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
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorName = error instanceof Error ? error.name : 'UnknownError';

      emit('ERROR', eventType, context, {
        errorName,
        errorMessage,
        errorStack:
          config.nodeEnv === 'development' && error instanceof Error
            ? error.stack
            : undefined,
        ...fields,
      });
    },
    requestFailed(
      error: unknown,
      context: BaseLogContext & {
        requestId: string;
        method: string;
        path: string;
        statusCode: number;
        latencyMs: number;
      },
      fields?: ExtraLogFields,
    ): void {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorName = error instanceof Error ? error.name : 'UnknownError';

      emit(
        'ERROR',
        'request.failed',
        {
          requestId: context.requestId,
          projectId: context.projectId,
          runId: context.runId,
          latencyMs: context.latencyMs,
          promptVersionId: context.promptVersionId,
        },
        {
          errorName,
          errorMessage,
          errorStack:
            config.nodeEnv === 'development' && error instanceof Error
              ? error.stack
              : undefined,
          method: context.method,
          path: context.path,
          statusCode: context.statusCode,
          ...fields,
        },
      );
    },
  };
}

function shouldEmit(severity: LogSeverity, logLevel: LogLevel): boolean {
  return logSeverityRank[severity] >= logLevelRank[logLevel];
}

function formatPrettyLog(record: LogRecord): string {
  const { severity, eventType, timestamp, ...fields } = record;
  const fieldEntries = Object.entries(fields).filter(
    ([, value]) => value !== null,
  );

  return [
    timestamp,
    severity,
    eventType,
    ...fieldEntries.map(([key, value]) => `${key}=${formatPrettyValue(value)}`),
  ].join(' ');
}

function formatPrettyValue(value: JsonValue): string {
  return typeof value === 'string' && /^[A-Za-z0-9._:/-]+$/.test(value)
    ? value
    : JSON.stringify(value);
}
