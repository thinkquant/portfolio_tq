type RouteExpectation = {
  path: string;
  marker: string;
};

const baseUrl = process.argv[2];

if (!baseUrl) {
  throw new Error('Usage: tsx scripts/smoke-check.ts <base-url>');
}

const routes: RouteExpectation[] = [
  {
    path: '/',
    marker: 'A portfolio app built as a real system from day one.',
  },
  {
    path: '/projects',
    marker: 'Flagship demos are scaffolded as product surfaces, not one-off experiments.',
  },
  {
    path: '/projects/payment-exception-review',
    marker: 'Payment Exception Review Agent',
  },
  {
    path: '/demo/runtime-route-check',
    marker: 'A portfolio app built as a real system from day one.',
  },
];

const homeResponse = await fetch(`${baseUrl}/`);
const homeBody = await homeResponse.text();
const indexResponse = await fetch(`${baseUrl}/index.html`);
const indexBody = await indexResponse.text();

if (!homeResponse.ok) {
  throw new Error(`Expected / to return 200, received ${homeResponse.status}.`);
}

if (!indexResponse.ok) {
  throw new Error(`Expected /index.html to return 200, received ${indexResponse.status}.`);
}

const indexCacheControl = indexResponse.headers.get('cache-control') ?? '';

if (!indexCacheControl.includes('must-revalidate')) {
  throw new Error(
    `Expected /index.html to be revalidated, received Cache-Control "${indexCacheControl}".`,
  );
}

const assetMatch = homeBody.match(/href="(\/assets\/[^"]+\.css)"/);

if (!assetMatch) {
  throw new Error('Expected home page to reference a hashed CSS asset under /assets/.');
}

const assetResponse = await fetch(`${baseUrl}${assetMatch[1]}`);
const assetCacheControl = assetResponse.headers.get('cache-control') ?? '';

if (!assetResponse.ok) {
  throw new Error(`Expected asset ${assetMatch[1]} to return 200, received ${assetResponse.status}.`);
}

if (!assetCacheControl.includes('immutable')) {
  throw new Error(
    `Expected asset ${assetMatch[1]} to be immutable, received Cache-Control "${assetCacheControl}".`,
  );
}

if (!indexBody.includes('A portfolio app built as a real system from day one.')) {
  throw new Error('Expected /index.html to contain the home page marker.');
}

console.log('Cache header checks passed for /index.html and the generated CSS asset');

for (const route of routes) {
  const response = route.path === '/' ? homeResponse : await fetch(`${baseUrl}${route.path}`);
  const body = route.path === '/' ? homeBody : await response.text();

  if (!response.ok) {
    throw new Error(`Expected ${route.path} to return 200, received ${response.status}.`);
  }

  if (!body.includes(route.marker)) {
    throw new Error(`Expected ${route.path} to contain marker "${route.marker}".`);
  }

  console.log(`Smoke check passed for ${route.path}`);
}

console.log(`All smoke checks passed for ${baseUrl}`);
