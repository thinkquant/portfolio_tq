const baseUrl = process.argv[2];

if (!baseUrl) {
  throw new Error('Usage: tsx scripts/smoke-check.ts <base-url>');
}

const healthResponse = await fetch(`${baseUrl}/health`);
const health = (await healthResponse.json()) as { status?: string; environment?: string };

if (!healthResponse.ok || health.status !== 'ok') {
  throw new Error(
    `Expected /health to return status ok, received HTTP ${healthResponse.status} with payload ${JSON.stringify(
      health,
    )}.`,
  );
}

console.log(`Smoke check passed for ${baseUrl}/health (${health.environment ?? 'unknown'})`);

const demoResponse = await fetch(`${baseUrl}/api/demo/payment-exception-review/run`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    caseId: 'bootstrap-case',
    note: 'smoke-check',
  }),
});

const demo = (await demoResponse.json()) as {
  run?: { projectId?: string; status?: string };
  result?: { decision?: string };
};

if (
  !demoResponse.ok ||
  demo.run?.projectId !== 'payment-exception-review' ||
  demo.run?.status !== 'completed'
) {
  throw new Error(
    `Expected demo route to return a completed payment-exception-review run, received HTTP ${demoResponse.status} with payload ${JSON.stringify(
      demo,
    )}.`,
  );
}

console.log(
  `Smoke check passed for ${baseUrl}/api/demo/payment-exception-review/run (${demo.result?.decision ?? 'no-decision'})`,
);
