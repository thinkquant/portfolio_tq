process.env.NODE_ENV = 'test';

const testEnvDefaults: Record<string, string> = {
  PORT: '8080',
  APP_ENV: 'dev',
  SERVICE_NAME: 'portfolio-tq-api',
  API_BASE_PATH: '/api',
  LOG_LEVEL: 'debug',
  GCP_PROJECT_ID: 'portfolio-tq-dev',
  GOOGLE_CLOUD_PROJECT: 'portfolio-tq-dev',
  FIRESTORE_DATABASE_ID: 'portfolio-tq-dev',
  FIRESTORE_RUNS_COLLECTION: 'runs',
  FIRESTORE_TOOL_INVOCATIONS_COLLECTION: 'tool_invocations',
  FIRESTORE_EVALS_COLLECTION: 'evaluations',
  FIRESTORE_SEED_COLLECTION: 'seed_data',
  WEB_ALLOWED_ORIGIN: 'http://localhost:5173',
  VERTEX_AI_LOCATION: 'us-central1',
  VERTEX_AI_MODEL: '',
  ENABLE_DEMO_GATES: 'false',
  ENABLE_SEED_ENDPOINTS: 'true',
};

for (const [key, value] of Object.entries(testEnvDefaults)) {
  process.env[key] ||= value;
}
