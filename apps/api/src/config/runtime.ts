import { createRequire } from 'node:module';
import type { Environment } from '@portfolio-tq/types';

const require = createRequire(import.meta.url);
const packageJson = require('../../package.json') as { version: string };

export type RuntimeConfig = {
  environment: Environment;
  port: number;
  serviceName: string;
  serviceVersion: string;
  buildCommitSha: string | null;
  buildId: string | null;
  vertexAiLocation: string;
  corsAllowedOrigin: string;
  logLevel: 'info' | 'debug';
  firestoreProjectId?: string;
  firestoreDatabaseId?: string;
};

export const requiredEnvVars = {
  base: [] as const,
  firestore: ['GCP_PROJECT_ID', 'FIRESTORE_DATABASE'] as const,
} as const;

export function getRuntimeConfig(
  env: NodeJS.ProcessEnv = process.env,
): RuntimeConfig {
  const environment: Environment = env.APP_ENV === 'prod' ? 'prod' : 'dev';
  const logLevel = env.LOG_LEVEL === 'debug' ? 'debug' : 'info';

  return {
    environment,
    port: Number(env.PORT ?? 8080),
    serviceName: 'portfolio-tq-api',
    serviceVersion: packageJson.version,
    buildCommitSha: env.GIT_COMMIT_SHA ?? env.COMMIT_SHA ?? null,
    buildId: env.BUILD_ID ?? null,
    vertexAiLocation:
      env.VERTEX_AI_LOCATION ?? env.FIRESTORE_LOCATION ?? 'us-central1',
    corsAllowedOrigin: env.CORS_ALLOWED_ORIGIN ?? '*',
    logLevel,
    firestoreProjectId: env.GCP_PROJECT_ID,
    firestoreDatabaseId: env.FIRESTORE_DATABASE,
  };
}
