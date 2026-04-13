import { JSDOM, VirtualConsole } from 'jsdom';

const baseUrl = process.argv[2];

if (!baseUrl) {
  throw new Error('Usage: tsx scripts/smoke-observability.ts <base-url>');
}

const virtualConsole = new VirtualConsole();
virtualConsole.on('error', () => {});

const environment = baseUrl.includes('portfolio-tq-prod') ? 'prod' : 'dev';
const apiBase =
  environment === 'prod'
    ? 'https://portfolio-tq-api-prod-gl2p3fjrxa-uc.a.run.app'
    : 'https://portfolio-tq-api-dev-twgxaiygta-uc.a.run.app';

const dom = await JSDOM.fromURL(`${baseUrl}/observability`, {
  pretendToBeVisual: true,
  virtualConsole,
});

const document = dom.window.document;
const summaryTiles = document.querySelectorAll('.metric-tile');
const inlineScripts = Array.from(document.querySelectorAll('script'))
  .map((script) => script.textContent ?? '')
  .join('\n');

if (!document.querySelector('[data-observability-root]')) {
  throw new Error(
    'Expected the observability page shell to include the observability root container.',
  );
}

if (!document.querySelector('[data-observability-state]')) {
  throw new Error(
    'Expected the observability page shell to include the observability state element.',
  );
}

if (!inlineScripts.includes('/api/observability/overview')) {
  throw new Error(
    'Expected the observability page to include the live observability fetch path.',
  );
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
  throw new Error('Expected the observability overview payload to include a summary object.');
}

if (!Array.isArray(payload.projectBreakdown)) {
  throw new Error('Expected the observability overview payload to include projectBreakdown.');
}

if (!Array.isArray(payload.latestFlaggedRuns)) {
  throw new Error('Expected the observability overview payload to include latestFlaggedRuns.');
}

console.log(
  `Observability shell and API verified successfully for ${baseUrl} (${summaryTiles.length} static summary tiles before hydration, ${payload.projectBreakdown.length} project rows from ${environment} API).`,
);
