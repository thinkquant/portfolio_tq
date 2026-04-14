const baseUrl = process.argv[2];

if (!baseUrl) {
  throw new Error('Usage: tsx scripts/smoke-firestore.ts <base-url>');
}

const projectsResponse = await fetch(`${baseUrl}/api/projects`);
const projectsPayload = (await projectsResponse.json()) as {
  ok?: boolean;
  data?: {
    projects?: Array<{ id?: string }>;
    count?: number;
  };
};

if (
  !projectsResponse.ok ||
  !projectsPayload.ok ||
  !projectsPayload.data?.projects?.some(
    (project) => project.id === 'payment-exception-review',
  )
) {
  throw new Error(
    `Expected /api/projects to return seeded project metadata, received HTTP ${projectsResponse.status} with payload ${JSON.stringify(projectsPayload)}.`,
  );
}

console.log(`Firestore smoke check passed for ${baseUrl}/api/projects`);

const metricsResponse = await fetch(
  `${baseUrl}/api/projects/payment-exception-review/metrics`,
);
const metricsPayload = (await metricsResponse.json()) as {
  ok?: boolean;
  data?: {
    project?: { id?: string };
    summary?: { totalRuns?: number; openEscalations?: number };
    latestRuns?: Array<{ id?: string }>;
  };
};

if (
  !metricsResponse.ok ||
  !metricsPayload.ok ||
  metricsPayload.data?.project?.id !== 'payment-exception-review' ||
  !metricsPayload.data?.summary?.totalRuns ||
  !metricsPayload.data?.latestRuns?.length
) {
  throw new Error(
    `Expected /api/projects/payment-exception-review/metrics to return seeded dashboard data, received HTTP ${metricsResponse.status} with payload ${JSON.stringify(metricsPayload)}.`,
  );
}

console.log(
  `Firestore smoke check passed for ${baseUrl}/api/projects/payment-exception-review/metrics (${metricsPayload.data?.summary?.openEscalations ?? 0} open escalations)`,
);
