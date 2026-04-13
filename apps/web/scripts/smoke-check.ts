type RouteExpectation = {
  path: string;
};

const baseUrl = process.argv[2];

if (!baseUrl) {
  throw new Error('Usage: tsx scripts/smoke-check.ts <base-url>');
}

const routes: RouteExpectation[] = [
  { path: '/' },
  { path: '/work' },
  { path: '/projects/payment-exception-review' },
  { path: '/observability' },
  { path: '/demo/runtime-route-check' },
];

function assertSpaDocument(body: string, routePath: string): void {
  if (!body.includes('<div id="root"></div>')) {
    throw new Error(`Expected ${routePath} to include the React root element.`);
  }

  if (!body.includes('src="/assets/') || !body.includes('href="/assets/')) {
    throw new Error(`Expected ${routePath} to reference Vite-built assets.`);
  }
}

const homeResponse = await fetch(`${baseUrl}/`);
const homeBody = await homeResponse.text();
const indexResponse = await fetch(`${baseUrl}/index.html`);
const indexBody = await indexResponse.text();

if (!homeResponse.ok) {
  throw new Error(`Expected / to return 200, received ${homeResponse.status}.`);
}

if (!indexResponse.ok) {
  throw new Error(
    `Expected /index.html to return 200, received ${indexResponse.status}.`,
  );
}

const indexCacheControl = indexResponse.headers.get('cache-control') ?? '';

if (!indexCacheControl.includes('must-revalidate')) {
  throw new Error(
    `Expected /index.html to be revalidated, received Cache-Control "${indexCacheControl}".`,
  );
}

const assetMatch = homeBody.match(/href="(\/assets\/[^"]+\.css)"/);

if (!assetMatch) {
  throw new Error(
    'Expected home page to reference a hashed CSS asset under /assets/.',
  );
}

const assetResponse = await fetch(`${baseUrl}${assetMatch[1]}`);
const assetCacheControl = assetResponse.headers.get('cache-control') ?? '';

if (!assetResponse.ok) {
  throw new Error(
    `Expected asset ${assetMatch[1]} to return 200, received ${assetResponse.status}.`,
  );
}

if (!assetCacheControl.includes('immutable')) {
  throw new Error(
    `Expected asset ${assetMatch[1]} to be immutable, received Cache-Control "${assetCacheControl}".`,
  );
}

assertSpaDocument(indexBody, '/index.html');
console.log(
  'Cache header checks passed for /index.html and the generated CSS asset',
);

for (const route of routes) {
  const response =
    route.path === '/' ? homeResponse : await fetch(`${baseUrl}${route.path}`);
  const body = route.path === '/' ? homeBody : await response.text();

  if (!response.ok) {
    throw new Error(
      `Expected ${route.path} to return 200, received ${response.status}.`,
    );
  }

  assertSpaDocument(body, route.path);
  console.log(`Smoke check passed for ${route.path}`);
}

console.log(`All smoke checks passed for ${baseUrl}`);
