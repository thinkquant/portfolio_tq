const baseUrl = process.argv[2];

if (!baseUrl) {
  throw new Error('Usage: tsx scripts/smoke-observability.ts <base-url>');
}

const environment = baseUrl.includes('portfolio-tq-prod') ? 'prod' : 'dev';
const apiBase =
  environment === 'prod'
    ? 'https://portfolio-tq-api-prod-gl2p3fjrxa-uc.a.run.app'
    : 'https://portfolio-tq-api-dev-twgxaiygta-uc.a.run.app';

const observabilityResponse = await fetch(`${baseUrl}/observability`);
const observabilityBody = await observabilityResponse.text();

if (!observabilityResponse.ok) {
  throw new Error(
    `Expected /observability to return 200, received ${observabilityResponse.status}.`,
  );
}

if (!observabilityBody.includes('<div id="root"></div>')) {
  throw new Error('Expected /observability to return the React SPA document.');
}

const overviewResponse = await fetch(`${apiBase}/api/observability/overview`);

if (!overviewResponse.ok) {
  throw new Error(
    `Expected observability overview API to return 200, received ${overviewResponse.status}.`,
  );
}

const payload = (await overviewResponse.json()) as {
  summary?: Record<string, unknown>;
  projectBreakdown?: unknown[];
  latestFlaggedRuns?: unknown[];
};

if (!payload.summary) {
  throw new Error(
    'Expected the observability overview payload to include a summary object.',
  );
}

if (!Array.isArray(payload.projectBreakdown)) {
  throw new Error(
    'Expected the observability overview payload to include projectBreakdown.',
  );
}

if (!Array.isArray(payload.latestFlaggedRuns)) {
  throw new Error(
    'Expected the observability overview payload to include latestFlaggedRuns.',
  );
}

console.log(
  `Observability shell and API verified successfully for ${baseUrl} (${payload.projectBreakdown.length} project rows from ${environment} API).`,
);
