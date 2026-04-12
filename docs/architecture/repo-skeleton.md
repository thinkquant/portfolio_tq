# `portfolio_tq` Monorepo Skeleton

```txt
portfolio_tq/
  apps/
    web/
      src/
        app/
        components/
        features/
          home/
          about/
          projects/
          project-pages/
          dashboards/
          demos/
            payment-exception-review/
            investing-ops-copilot/
            legacy-ai-adapter/
            eval-console/
        lib/
        routes/
        styles/
      public/
      package.json
      vite.config.ts
      tsconfig.json
    api/
      src/
        index.ts
        routes/
          health/
          demos/
            payment-review.ts
            investing-copilot.ts
            legacy-adapter.ts
          evals/
          observability/
          auth/
        services/
          agents/
          tools/
          retrieval/
          evals/
          logs/
          orchestrators/
        middleware/
        lib/
      package.json
      tsconfig.json
  packages/
    ui/
    schemas/
    agents/
    tools/
    evals/
    types/
    config/
  infra/
    terraform/
      modules/
        artifact_registry/
        cloud_run_service/
        firebase_hosting/
        firestore_indexes/
        iam_service_account/
        logging_metrics/
        monitoring_dashboard/
        github_oidc/
        secrets/
      environments/
        dev/
          main.tf
          variables.tf
          outputs.tf
          terraform.tfvars.example
        prod/
          main.tf
          variables.tf
          outputs.tf
          terraform.tfvars.example
  data/
    seed/
      payment-cases/
      investing-cases/
      policy-docs/
      legacy-cases/
  docs/
    README.md
    architecture/
      repo-skeleton.md
      system-architecture.md
      observability-and-dashboards.md
      iac-and-cicd.md
    specs/
      prd-overall.md
      technical-spec-overall.md
      service-web.md
      service-api.md
      service-payment-exception-review.md
      service-investing-ops-copilot.md
      service-legacy-ai-adapter.md
      service-eval-console.md
    checklists/
      master-checklist.md
      build-checklist-definition-of-done.md
```

## Monorepo decision
There is one primary product surface: the web portfolio app. The demo projects are feature domains within that app, backed by one API service and shared packages.

## Deployment decision
- `apps/web` deploys to Firebase Hosting.
- `apps/api` deploys to Google Cloud Run.
- Shared packages are versioned only inside the monorepo.
- Terraform manages infra from day one.
- GitHub is the default repo host and CI/CD platform for this project because GitHub-hosted runners are free for public repositories, while GitLab Free hosted runners consume limited compute minutes. See `docs/architecture/iac-and-cicd.md`.
