import { createRequire } from 'node:module';

import type { Environment } from '@portfolio-tq/types';

import { env } from './env.js';

const require = createRequire(import.meta.url);
const packageJson = require('../../package.json') as { version: string };

export type RuntimeConfig = {
  environment: Environment;
  port: number;
  serviceName: string;
  serviceVersion: string;
  nodeEnv: 'development' | 'test' | 'production';
  apiBasePath: string;
  buildCommitSha: string | null;
  buildId: string | null;
  vertexAiLocation: string;
  corsAllowedOrigin: string;
  vertexAiModel: string;
  vertexAiEnabled: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  firestoreProjectId: string;
  googleCloudProject: string;
  firestoreDatabaseId: string;
  firestoreCollections: {
    runs: string;
    toolInvocations: string;
    evaluations: string;
    seedData: string;
  };
  features: {
    demoGates: boolean;
    seedEndpoints: boolean;
  };
};

export const requiredEnvVars = {
  base: [
    'NODE_ENV',
    'PORT',
    'APP_ENV',
    'GCP_PROJECT_ID',
    'GOOGLE_CLOUD_PROJECT',
    'FIRESTORE_DATABASE_ID',
    'FIRESTORE_RUNS_COLLECTION',
    'FIRESTORE_TOOL_INVOCATIONS_COLLECTION',
    'FIRESTORE_EVALS_COLLECTION',
    'FIRESTORE_SEED_COLLECTION',
    'WEB_ALLOWED_ORIGIN',
  ] as const,
  firestore: [
    'GCP_PROJECT_ID',
    'GOOGLE_CLOUD_PROJECT',
    'FIRESTORE_DATABASE_ID',
  ] as const,
} as const;

export function getRuntimeConfig(): RuntimeConfig {
  return {
    environment: env.runtime.appEnv,
    port: env.runtime.port,
    serviceName: env.runtime.serviceName,
    serviceVersion: packageJson.version,
    nodeEnv: env.runtime.nodeEnv,
    apiBasePath: env.runtime.apiBasePath,
    buildCommitSha: env.build.commitSha,
    buildId: env.build.buildId,
    vertexAiLocation: env.vertex.location,
    vertexAiModel: env.vertex.model,
    vertexAiEnabled: env.vertex.enabled,
    corsAllowedOrigin: env.cors.allowedOrigin,
    logLevel: env.runtime.logLevel,
    firestoreProjectId: env.gcp.projectId,
    googleCloudProject: env.gcp.googleCloudProject,
    firestoreDatabaseId: env.firestore.databaseId,
    firestoreCollections: env.firestore.collections,
    features: env.features,
  };
}
