const baseUrl = process.argv[2];

if (!baseUrl) {
  throw new Error('Usage: tsx scripts/smoke-check.ts <base-url>');
}

const healthResponse = await fetch(`${baseUrl}/health`);
const healthEnvelope = (await healthResponse.json()) as {
  ok?: boolean;
  data?: { status?: string; environment?: string };
};
const health = healthEnvelope.data;

if (!healthResponse.ok || !healthEnvelope.ok || health?.status !== 'ok') {
  throw new Error(
    `Expected /health to return status ok, received HTTP ${healthResponse.status} with payload ${JSON.stringify(
      healthEnvelope,
    )}.`,
  );
}

console.log(
  `Smoke check passed for ${baseUrl}/health (${health.environment ?? 'unknown'})`,
);

const demoResponse = await fetch(
  `${baseUrl}/api/demo/payment-exception-review/run`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      caseId: 'bootstrap-case',
      note: 'smoke-check',
    }),
  },
);

const demoEnvelope = (await demoResponse.json()) as {
  ok?: boolean;
  data?: {
    run?: { projectId?: string; status?: string };
    result?: { decision?: string };
  };
};
const demo = demoEnvelope.data;

if (
  !demoResponse.ok ||
  !demoEnvelope.ok ||
  demo.run?.projectId !== 'payment-exception-review' ||
  demo.run?.status !== 'completed'
) {
  throw new Error(
    `Expected demo route to return a completed payment-exception-review run, received HTTP ${demoResponse.status} with payload ${JSON.stringify(
      demoEnvelope,
    )}.`,
  );
}

console.log(
  `Smoke check passed for ${baseUrl}/api/demo/payment-exception-review/run (${demo.result?.decision ?? 'no-decision'})`,
);
