import { createApiServer } from './app/server.js';
import { env, getRuntimeConfig } from './config/index.js';
import { createApiRouter } from './routes/index.js';
import { createLogger } from './services/logs.js';
import { createFirestoreClient } from './services/observability.js';
import { portfolioAgents } from '@portfolio-tq/agents';
import { evaluationStatuses } from '@portfolio-tq/evals';

const config = getRuntimeConfig();
const firestore = createFirestoreClient({
  projectId: config.firestoreProjectId,
  databaseId: config.firestoreDatabaseId,
});
const logger = createLogger({
  serviceName: config.serviceName,
  environment: config.environment,
  nodeEnv: config.nodeEnv,
  logLevel: config.logLevel,
});
const app = {
  config,
  firestore,
  logger,
};
const router = createApiRouter(app);
const server = createApiServer(app, router);

server.listen(env.runtime.port, '0.0.0.0', () => {
  logger.info(
    'service.started',
    {
      latencyMs: 0,
    },
    {
      port: env.runtime.port,
      agentCount: portfolioAgents.length,
      evaluationStatusCount: evaluationStatuses.length,
      firestoreEnabled: Boolean(firestore),
    },
  );
});
