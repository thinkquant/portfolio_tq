import { portfolioAgents } from '@portfolio-tq/agents';
import { evaluationStatuses } from '@portfolio-tq/evals';
import { createDemoRun } from '@portfolio-tq/schemas';

const run = createDemoRun('payment-exception-review', 'queued');

console.log(
  `API scaffold ready with ${portfolioAgents.length} agent definitions and ${evaluationStatuses.length} evaluation states for run ${run.id}.`,
);
