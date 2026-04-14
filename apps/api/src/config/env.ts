import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { config as loadDotenv } from 'dotenv';
import { z } from 'zod';

const packageRoot = fileURLToPath(new URL('../../', import.meta.url));

loadDotenv({ path: resolve(packageRoot, '.env.local') });
loadDotenv({ path: resolve(packageRoot, '.env') });

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(8080),
  APP_ENV: z.enum(['dev', 'prod']).default('dev'),
  SERVICE_NAME: z.string().min(1).default('portfolio-tq-api'),
  API_BASE_PATH: z.string().min(1).default('/api'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('debug'),
  GCP_PROJECT_ID: z.string().min(1),
  GOOGLE_CLOUD_PROJECT: z.string().min(1),
  FIRESTORE_DATABASE_ID: z.string().min(1),
  FIRESTORE_RUNS_COLLECTION: z.string().min(1).default('runs'),
  FIRESTORE_TOOL_INVOCATIONS_COLLECTION: z
    .string()
    .min(1)
    .default('tool_invocations'),
  FIRESTORE_EVALS_COLLECTION: z.string().min(1).default('evaluations'),
  FIRESTORE_SEED_COLLECTION: z.string().min(1).default('seed_data'),
  WEB_ALLOWED_ORIGIN: z.string().url(),
  VERTEX_AI_LOCATION: z.string().min(1).default('us-central1'),
  VERTEX_AI_MODEL: z.string().default(''),
  ENABLE_DEMO_GATES: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
  ENABLE_SEED_ENDPOINTS: z
    .enum(['true', 'false'])
    .default('true')
    .transform((value) => value === 'true'),
  BUILD_ID: z.string().min(1).optional(),
  GIT_COMMIT_SHA: z.string().min(1).optional(),
  COMMIT_SHA: z.string().min(1).optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid API environment configuration:');
  console.error(JSON.stringify(parsed.error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

const raw = parsed.data;

export const env = {
  runtime: {
    nodeEnv: raw.NODE_ENV,
    port: raw.PORT,
    appEnv: raw.APP_ENV,
    serviceName: raw.SERVICE_NAME,
    apiBasePath: raw.API_BASE_PATH,
    logLevel: raw.LOG_LEVEL,
    isDev: raw.APP_ENV === 'dev',
    isProd: raw.APP_ENV === 'prod',
  },
  gcp: {
    projectId: raw.GCP_PROJECT_ID,
    googleCloudProject: raw.GOOGLE_CLOUD_PROJECT,
  },
  firestore: {
    databaseId: raw.FIRESTORE_DATABASE_ID,
    collections: {
      runs: raw.FIRESTORE_RUNS_COLLECTION,
      toolInvocations: raw.FIRESTORE_TOOL_INVOCATIONS_COLLECTION,
      evaluations: raw.FIRESTORE_EVALS_COLLECTION,
      seedData: raw.FIRESTORE_SEED_COLLECTION,
    },
  },
  cors: {
    allowedOrigin: raw.WEB_ALLOWED_ORIGIN,
  },
  vertex: {
    location: raw.VERTEX_AI_LOCATION,
    model: raw.VERTEX_AI_MODEL,
    enabled: raw.VERTEX_AI_MODEL.trim().length > 0,
  },
  features: {
    demoGates: raw.ENABLE_DEMO_GATES,
    seedEndpoints: raw.ENABLE_SEED_ENDPOINTS,
  },
  build: {
    buildId: raw.BUILD_ID ?? null,
    commitSha: raw.GIT_COMMIT_SHA ?? raw.COMMIT_SHA ?? null,
  },
} as const;

export type AppEnv = typeof env;
