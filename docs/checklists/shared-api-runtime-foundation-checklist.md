# Shared API Runtime Foundation Checklist

## Agent instructions before starting

Before making changes, read these documents in this order:

1. `README.md`
2. `docs/specs/technical-spec-overall.md`
3. `docs/specs/service-api.md`
4. `docs/specs/service-web.md`
5. `docs/specs/service-eval-console.md`
6. `docs/architecture/repo-skeleton.md`
7. `docs/architecture/observability-and-dashboards.md`
8. `docs/checklists/build-checklist-definition-of-done.md`
9. `docs/checklists/shared-api-runtime-foundation-checklist.md`

Agent operating rules:

- Do not invent alternate architecture unless a checklist item explicitly calls for a deviation note.
- Keep all environment names consistent with `dev` and `prod`.
- Keep the API foundation generic and reusable across all demo modules.
- Prefer shared runtime utilities over demo-specific one-off code.
- Never commit secrets, service account keys, `.tfvars`, or local env files.
- Never write sensitive values into docs, comments, examples, commits, or source files; this repository is public.
- If a manual cloud console step is unavoidable, document it in a short markdown note under `docs/architecture/adr-bootstrapping-notes.md`.

---

Purpose:

- build the shared backend runtime foundation in `apps/api`
- create the reusable API structure that all later portfolio demos will plug into
- finish with a deployed and verifiable dev API that supports health checks, run logging, trace retrieval, evaluation logging, seeded data access, and mock internal tool access

Rules:

- work on `dev`
- do not build demo-specific business logic in this milestone unless the checklist explicitly requires a placeholder
- optimize for clarity, reuse, and predictable extension
- the API should be deployable and testable before deeper demo logic begins

---

## 1. Confirm backend scope and ownership boundaries

Reference docs:

- `docs/specs/technical-spec-overall.md`
- `docs/specs/service-api.md`
- `docs/specs/service-web.md`

- [x] Confirm `apps/api` is the single shared backend runtime for the portfolio demos.
- [x] Confirm later demo modules will plug into the shared API foundation rather than becoming separate backend apps.
- [x] Confirm the API owns:
  - [x] health and readiness endpoints
  - [x] run creation and run retrieval
  - [x] tool invocation logging
  - [x] evaluation record creation and retrieval
  - [x] seeded data access
  - [x] mock internal tool access
  - [x] common error handling
- [x] Confirm the API does not yet need:
  - [x] full production auth
  - [x] real third-party integrations
  - [x] heavy background job orchestration
  - [x] demo-specific AI workflow logic beyond stubs/placeholders

Verification note:

- Confirmed on `dev` from `README.md`, `docs/specs/technical-spec-overall.md`, `docs/specs/service-api.md`, and `docs/specs/service-web.md`.
- The architecture remains one portfolio web app backed by one API/orchestration service and shared packages; demo modules should plug into that foundation rather than becoming separate backend apps.
- The milestone scope stays generic: shared health/readiness, run/eval/tool logging, seeded data, mock tools, and common API error handling before deeper demo-specific workflows.
- Full production auth, real third-party integrations, heavy background jobs, and non-placeholder demo-specific AI workflow logic are intentionally outside this section's milestone boundary.

Definition of done:

- [x] backend scope is locked for this milestone
- [x] service boundaries are explicit before deeper implementation begins

---

## 2. Confirm runtime stack and app baseline

Reference docs:

- `docs/specs/service-api.md`
- `docs/architecture/repo-skeleton.md`

- [x] Confirm the backend runtime stack.
- [x] Confirm TypeScript configuration in `apps/api` is clean and stable.
- [x] Confirm build output path and runtime entrypoint are explicit.
- [x] Confirm local development command works.
- [x] Confirm production build command works.
- [x] Confirm current scaffold files are either adopted cleanly or removed.

Recommended baseline:

- [x] Node.js
- [x] TypeScript
- [x] lightweight HTTP server framework already chosen for the repo
- [x] clear route/module separation
- [x] shared package imports resolving cleanly

Verification note:

- Confirmed on `dev`.
- Runtime stack is Node.js + TypeScript using `tsx` for local development and `tsc -b` for production builds.
- The current HTTP runtime uses Node's built-in `node:http` server in `apps/api/src/app/server.ts`; no external framework is introduced for this baseline.
- `apps/api/tsconfig.json` extends the shared NodeNext strict config, uses `rootDir: "src"`, emits to `dist`, and references shared workspace packages.
- Runtime entrypoint and build output are explicit: `start` runs `node dist/index.js`, and `outDir` is `dist`.
- Verified `pnpm --filter @portfolio-tq/api typecheck` passes.
- Verified `pnpm --filter @portfolio-tq/api build` passes.
- Verified `pnpm --filter @portfolio-tq/api dev` starts locally by running it on temporary port `18080` and checking `GET /health`.
- Route/module separation was completed in section 3 by splitting bootstrap, routes, handlers, services, repositories, middleware, config, errors, and shared HTTP helpers into dedicated modules.

Definition of done:

- [x] `apps/api` starts locally without errors
- [x] `apps/api` builds cleanly
- [x] runtime baseline is stable enough for real route/module implementation

---

## 3. Establish API folder structure and module boundaries

Reference docs:

- `docs/architecture/repo-skeleton.md`
- `docs/specs/service-api.md`

- [x] Create or finalize a clean internal API structure.
- [x] Separate concerns into clear folders/modules for:
  - [x] app bootstrap
  - [x] routes
  - [x] handlers/controllers
  - [x] services
  - [x] repositories/data access
  - [x] middleware
  - [x] logging
  - [x] config
  - [x] error handling
- [x] Add a shared route prefix strategy if appropriate.
- [x] Ensure module naming is consistent and predictable.
- [x] Avoid route logic being mixed with storage or evaluation logic.

Recommended route groups:

- [x] `/health`
- [x] `/runs`
- [x] `/evals`
- [x] `/tools`
- [x] `/seed`
- [x] `/demo` or workflow-specific routing namespace placeholder if needed later

Verification note:

- Confirmed on `dev`.
- API bootstrap now lives in `apps/api/src/index.ts` and `apps/api/src/app/server.ts`.
- Shared app context lives in `apps/api/src/app/context.ts`.
- Runtime config lives in `apps/api/src/config/runtime.ts`.
- Route groups live under `apps/api/src/routes/`, with `/health` plus API-prefixed groups for `/api/runs`, `/api/evals`, `/api/tools`, `/api/seed`, `/api/demo`, `/api/observability`, and `/api/projects`.
- Handler/controller logic lives under `apps/api/src/handlers/`.
- Service logic lives under `apps/api/src/services/`, including demo workflow placeholder logic under `apps/api/src/services/demos/`.
- Firestore data access lives under `apps/api/src/repositories/`.
- Middleware lives under `apps/api/src/middleware/`.
- Logging remains centralized in `apps/api/src/services/logs.ts`.
- Error handling is split between `apps/api/src/errors/api-error.ts` and `apps/api/src/middleware/error-handler.ts`.
- Shared HTTP helpers live in `apps/api/src/lib/http.ts`.
- Added reserved namespace endpoints for `GET /api/tools` and `GET /api/seed` so those future route groups exist without adding real tool or seed business logic early.
- Preserved the existing `/api/evaluations` route while adding `/api/evals` as the section 3 route group alias.
- Verified `pnpm --filter @portfolio-tq/api typecheck` passes.
- Verified `pnpm --filter @portfolio-tq/api build` passes.
- Verified `pnpm --filter @portfolio-tq/api lint` passes.
- Verified `pnpm --filter @portfolio-tq/api dev` starts locally by running it on temporary port `18082` and checking `GET /health`, `GET /api/tools`, and `GET /api/seed`.
- Verified Prettier formatting on the section 3 files and this checklist.

Definition of done:

- [x] the API codebase has stable structure before feature logic grows
- [x] future demos can slot in without structural rewrites

---

## 4. Implement configuration and environment handling

Reference docs:

- `docs/specs/service-api.md`
- `docs/specs/technical-spec-overall.md`

- [x] Create explicit runtime configuration handling for `dev` and `prod`.
- [x] Centralize environment-variable access behind one config module.
- [x] Define required environment variables for this milestone.
- [x] Create `.env.example` or equivalent non-sensitive example config if not already present.
- [x] Ensure local defaults do not leak secrets.
- [x] Ensure the API can run in dev without production-only settings.

Likely config categories:

- [x] app runtime
- [x] Firestore collection names
- [x] Vertex AI/model placeholders
- [x] logging level
- [x] frontend origin / CORS allowance
- [ ] feature flags for gated demo behavior

Verification note:

- Confirmed on `dev`.
- Centralized runtime config now lives in `apps/api/src/config/runtime.ts`.
- Defined required environment variables for Firestore persistence via `requiredEnvVars.firestore`.
- Added non-sensitive example config at `apps/api/.env.example`.
- The current API env contract uses explicit runtime and Firestore settings including `NODE_ENV`, `PORT`, `APP_ENV`, `SERVICE_NAME`, `API_BASE_PATH`, `GCP_PROJECT_ID`, `GOOGLE_CLOUD_PROJECT`, `FIRESTORE_DATABASE_ID`, collection-name envs, `WEB_ALLOWED_ORIGIN`, and the current feature flags.
- The committed example config now reflects the existing named dev Firestore database ID used by repo infrastructure rather than assuming `(default)`.
- Verified `pnpm --filter @portfolio-tq/api typecheck` passes.
- Verified `pnpm --filter @portfolio-tq/api lint` passes.
- Verified `pnpm --filter @portfolio-tq/api dev` starts locally with the current env contract and still exposes `GET /health`.

Definition of done:

- [x] the API has one clear source of runtime config truth
- [x] no route directly reads ad hoc environment variables

---

## 5. Implement health, readiness, and version surfaces

Reference docs:

- `docs/specs/service-api.md`
- `docs/architecture/observability-and-dashboards.md`

- [x] Implement a basic health endpoint.
- [x] Implement a readiness endpoint if separated from health.
- [x] Include version/build metadata if reasonably available.
- [x] Return structured JSON responses.
- [x] Ensure failed internal dependency states can be represented clearly later.

Suggested minimum endpoints:

- [x] `GET /health`
- [x] `GET /ready`

Suggested response fields:

- [x] status
- [x] service
- [x] environment
- [x] timestamp
- [x] version or commit identifier placeholder

Verification note:

- Confirmed on `dev`.
- `GET /health` is implemented in `apps/api/src/handlers/system-handler.ts` and routed from `apps/api/src/routes/health.ts`.
- `GET /health` and `GET /ready` both use the shared API success envelope from section 6: `{ ok: true, data, requestId? }`.
- `GET /ready` is implemented separately and currently returns dependency state for Firestore based on configured runtime state so unconfigured/degraded conditions can be represented cleanly.
- Version/build metadata now comes from `apps/api/src/config/runtime.ts`, including package version plus optional `GIT_COMMIT_SHA`/`COMMIT_SHA` and `BUILD_ID`.
- The root service surface now advertises `/ready` alongside `/health`.
- Temporary implementation note: before the shared API runtime milestone is considered fully closed, `GET /ready` should be upgraded to perform a real Firestore read probe instead of only reporting configured dependency state.
- Verified `pnpm --filter @portfolio-tq/api typecheck` passes.
- Verified `pnpm --filter @portfolio-tq/api build` passes.
- Verified `pnpm --filter @portfolio-tq/api lint` passes.
- Verified `GET /health` on temporary port `18084` returns the shared success envelope with `data.status`, `data.service`, `data.environment`, `data.timestamp`, `data.version`, and `data.commitSha`.
- Verified `GET /ready` on temporary port `18084` returns `503` with the shared success envelope and `data.status: "degraded"` plus `data.dependencies.firestore.status: "unconfigured"` when Firestore env vars are absent.
- Verified `GET /ready` on temporary port `18085` returns `200` with the shared success envelope and `data.status: "ready"` plus `data.dependencies.firestore.status: "configured"` when Firestore env vars are present.

Definition of done:

- [x] the API exposes a clean health surface for smoke checks, deployment verification, and future monitoring

---

## 6. Implement shared response and error handling conventions

Reference docs:

- `docs/specs/service-api.md`
- `docs/specs/technical-spec-overall.md`

- [x] Create one consistent success response shape where appropriate.
- [x] Create one consistent error response shape.
- [x] Add a typed application error model.
- [x] Add centralized error middleware/handling.
- [x] Map validation errors cleanly.
- [x] Map not-found errors cleanly.
- [x] Map internal errors cleanly without leaking sensitive details.
- [x] Ensure API errors are readable from the frontend demo shells.

Suggested response qualities:

- [x] predictable
- [x] typed
- [x] concise
- [x] non-leaky
- [x] easy to inspect in demo surfaces

Verification note:

- Confirmed on `dev`.
- Success responses now use a shared envelope in `apps/api/src/lib/http.ts`: `{ ok: true, data, requestId? }`.
- Error responses now use a shared envelope in `apps/api/src/lib/http.ts`: `{ ok: false, error: { code, message, details? }, requestId }`.
- The typed application error model now includes `ApiError`, `ValidationError`, and `NotFoundError` in `apps/api/src/errors/api-error.ts`.
- Centralized error mapping remains in `apps/api/src/middleware/error-handler.ts`.
- Invalid JSON bodies are now mapped to `invalid_json` instead of surfacing as generic server failures.
- Unsupported request shapes for the payment review demo are now mapped to `invalid_request`.
- Bad project IDs are mapped to `invalid_project_id`.
- Missing routes are mapped to `not_found`.
- Internal errors return `internal_error` with a stable non-leaky message.
- Frontend API handling in `apps/web/src/lib/api/apiClient.ts` now unwraps success envelopes and parses error envelopes into readable `apiCode`, `apiMessage`, and `requestId` fields on `ApiClientError`.
- Verified `pnpm --filter @portfolio-tq/api typecheck` passes.
- Verified `pnpm --filter @portfolio-tq/api build` passes.
- Verified `pnpm --filter @portfolio-tq/api lint` passes.
- Verified `pnpm --filter @portfolio-tq/web typecheck` passes.
- Verified `pnpm --filter @portfolio-tq/api smoke http://127.0.0.1:18089` passes with Firestore env vars unset, confirming the success envelope for `/health` and the demo route.
- Verified on temporary port `18087` that invalid project IDs return `invalid_project_id`, malformed JSON returns `invalid_json`, unknown routes return `not_found`, and internal dependency failures return `internal_error`.

Definition of done:

- [x] all implemented endpoints fail cleanly and consistently
- [x] frontend integration can rely on stable response behavior

---

## 7. Implement request validation and shared typed contracts

Reference docs:

- `docs/specs/service-api.md`
- `docs/specs/service-eval-console.md`
- `docs/specs/technical-spec-overall.md`

- [x] Define request/response contracts for the shared runtime endpoints.
- [x] Wire validation to shared packages where appropriate.
- [x] Confirm `packages/schemas` and `packages/types` are used instead of duplicate local types where possible.
- [x] Add validation for:
  - [x] run creation payloads
  - [x] evaluation write payloads
  - [x] tool invocation request payloads
  - [x] seed data request/query payloads where needed
- [x] Ensure invalid input returns a stable validation error shape.

Verification note:

- Confirmed on `dev`.
- Shared typed endpoint contracts now live in `packages/types/src/index.ts`, including request/query payloads and current response data shapes for health, readiness, service index, runs, evaluations, projects, namespaces, and the payment review demo.
- Shared validators now live in `packages/schemas/src/index.ts` using `zod`, including:
  - `paymentReviewDemoRequestSchema`
  - `projectScopedListQuerySchema`
  - `runCreateRequestSchema`
  - `evaluationCreateRequestSchema`
  - `toolInvocationCreateRequestSchema`
  - `seedCasesQuerySchema`
  - `seedDocumentsQuerySchema`
- The API now consumes shared schemas instead of local one-off validation in:
  - `apps/api/src/handlers/demo-handler.ts`
  - `apps/api/src/handlers/observability-handler.ts`
- Shared validation issue formatting lives in `packages/schemas/src/index.ts`, and API-side schema failures are mapped through `apps/api/src/lib/validation.ts` into the stable section 6 error envelope.
- Verified `pnpm --filter @portfolio-tq/types typecheck` passes.
- Verified `pnpm --filter @portfolio-tq/types lint` passes.
- Verified `pnpm --filter @portfolio-tq/schemas typecheck` passes.
- Verified `pnpm --filter @portfolio-tq/schemas lint` passes.
- Verified `pnpm --filter @portfolio-tq/api typecheck` passes.
- Verified `pnpm --filter @portfolio-tq/api build` passes.
- Verified `pnpm --filter @portfolio-tq/api lint` passes.
- Verified `pnpm --filter @portfolio-tq/web typecheck` passes after updating the web API client to remain compatible with the shared envelope contracts.
- Verified shared schema parsing for future run/eval/tool/seed payloads via a local `tsx` smoke import, with valid sample payloads succeeding.
- Verified on temporary port `18090` that:
  - invalid demo request payloads return `invalid_request` with schema-derived `issues`
  - invalid `projectId` query values return `invalid_project_id` with schema-derived `issues`

Definition of done:

- [x] implemented endpoints reject malformed input predictably
- [x] typed contracts are aligned between backend and future frontend consumers

---

## 8. Implement run logging foundation

Reference docs:

- `docs/specs/service-api.md`
- `docs/specs/service-eval-console.md`
- `docs/architecture/observability-and-dashboards.md`

- [x] Define the run record model.
- [x] Implement endpoint to create a run record.
- [x] Implement endpoint to fetch a run by ID.
- [x] Implement endpoint to list runs with simple filters.
- [x] Include fields needed for later demos:
  - [x] id
  - [x] projectId
  - [x] status
  - [x] inputRef or input summary
  - [x] outputRef placeholder
  - [x] confidence placeholder
  - [x] latency placeholder
  - [x] estimated cost placeholder
  - [x] promptVersionId placeholder
  - [x] createdAt
- [x] Decide whether initial persistence is Firestore-backed or a thin local abstraction that already targets Firestore.

Suggested endpoints:

- [x] `POST /runs`
- [x] `GET /runs`
- [x] `GET /runs/:id`

Verification note:

- Confirmed on `dev`.
- The shared run ledger model remains centered on `RunRecord` in `packages/types/src/index.ts`, which already carries the section 8 fields needed by later demos and the eval console: `id`, `projectId`, `status`, `inputRef`, optional output/confidence/latency/cost/prompt metadata, and timestamps.
- Added shared request/query contracts for section 8 in `packages/types/src/index.ts` and `packages/schemas/src/index.ts`, including `RunCreateRequest`, `RunListQuery`, `RunCreateResponseData`, `RunDetailResponseData`, `runCreateRequestSchema`, and `runListQuerySchema`.
- Added a dedicated Firestore-backed run repository in `apps/api/src/repositories/run-repository.ts`.
- Added a dedicated run service in `apps/api/src/services/runs.ts` so run creation/list/get logic is no longer hidden inside the observability handler path.
- Added dedicated run handlers in `apps/api/src/handlers/run-handler.ts`.
- `apps/api/src/routes/runs.ts` now exposes:
  - `POST /api/runs`
  - `GET /api/runs`
  - `GET /api/runs/:id`
- `GET /api/runs` now supports simple shared filters for `projectId`, `status`, and `limit`.
- Initial persistence for the shared run ledger is now Firestore-backed behind a repository abstraction, not in-memory state.
- Verified `pnpm --filter @portfolio-tq/types typecheck` passes.
- Verified `pnpm --filter @portfolio-tq/types lint` passes.
- Verified `pnpm --filter @portfolio-tq/schemas typecheck` passes.
- Verified `pnpm --filter @portfolio-tq/schemas lint` passes.
- Verified `pnpm --filter @portfolio-tq/api typecheck` passes.
- Verified `pnpm --filter @portfolio-tq/api build` passes.
- Verified `pnpm --filter @portfolio-tq/api lint` passes.
- Verified `pnpm --filter @portfolio-tq/web typecheck` passes.
- Verified on temporary port `18091` with `GCP_PROJECT_ID=portfolio-tq-dev` and `FIRESTORE_DATABASE_ID=portfolio-tq-dev` that `GET /api/runs` returns Firestore-backed run records and `GET /api/projects` still returns seeded project metadata.
- Verified on temporary port `18092` with the same Firestore target that:
  - `POST /api/runs` creates a new queued run record
  - `GET /api/runs/:id` returns the created run
  - `GET /api/runs?projectId=payment-exception-review&status=queued&limit=5` returns the created run through the filtered list path
- Verified on temporary port `18093` that invalid create payloads return `invalid_request` and missing run IDs return `not_found`.

Definition of done:

- [x] the platform has a real run ledger that later demo flows can write into and the eval console can read from

---

## 9. Implement tool invocation logging foundation

Reference docs:

- `docs/specs/service-api.md`
- `docs/architecture/observability-and-dashboards.md`

- [x] Define the tool invocation record model.
- [x] Implement endpoint to create a tool invocation log entry.
- [x] Implement endpoint to list tool invocations for a run.
- [x] Include fields needed later:
  - [x] id
  - [x] runId
  - [x] toolName
  - [x] input summary
  - [x] output summary
  - [x] success
  - [x] durationMs
  - [x] createdAt
- [x] Ensure the model is generic enough for all future demos.

Suggested endpoints:

- [x] `POST /tools/invocations`
- [x] `GET /tools/invocations`
- [x] `GET /runs/:id/tools`

Verification note:

- Confirmed on `dev`.
- The shared tool invocation ledger model now lives in `packages/types/src/index.ts`, with `ToolInvocationRecord` expanded to include the generic fields section 9 needs: `inputSummary`, `outputSummary`, `success`, `durationMs`, and `createdAt`, while preserving the existing observability-friendly timing/status fields.
- Added shared request/query contracts for section 9 in `packages/types/src/index.ts` and `packages/schemas/src/index.ts`, including `ToolInvocationCreateRequest`, `ToolInvocationListQuery`, `ToolInvocationCreateResponseData`, `ToolInvocationListResponseData`, `toolInvocationCreateRequestSchema`, and `toolInvocationListQuerySchema`.
- Added a dedicated Firestore-backed tool invocation repository in `apps/api/src/repositories/tool-invocation-repository.ts`.
- Added a dedicated tool invocation service in `apps/api/src/services/tool-invocations.ts`.
- Added dedicated tool invocation handlers in `apps/api/src/handlers/tool-invocation-handler.ts`.
- `apps/api/src/routes/tools.ts` now exposes:
  - `POST /api/tools/invocations`
  - `GET /api/tools/invocations`
  - `GET /api/runs/:id/tools`
- `GET /api/tools/invocations` now supports simple shared filters for `projectId`, `runId`, `toolName`, and `limit`.
- New tool invocation writes now also update the parent run's `toolInvocationCount`, keeping the shared run ledger coherent with the trace ledger.
- Existing Firestore tool invocation records without the new section 9 fields are normalized on read in `apps/api/src/repositories/tool-invocation-repository.ts`, so the shared API can read legacy trace documents without requiring an immediate reseed.
- Updated `apps/api/src/services/demos/payment-review.ts` and `data/seed/tool-invocations/tool-invocations.json` so fresh demo writes and future reseeds use the expanded tool invocation model directly.
- Verified `pnpm --filter @portfolio-tq/types typecheck` passes.
- Verified `pnpm --filter @portfolio-tq/types lint` passes.
- Verified `pnpm --filter @portfolio-tq/schemas typecheck` passes.
- Verified `pnpm --filter @portfolio-tq/schemas lint` passes.
- Verified `pnpm --filter @portfolio-tq/api typecheck` passes.
- Verified `pnpm --filter @portfolio-tq/api build` passes.
- Verified `pnpm --filter @portfolio-tq/api lint` passes.
- Verified `pnpm --filter @portfolio-tq/web typecheck` passes.
- Verified on temporary port `18095` with `GCP_PROJECT_ID=portfolio-tq-dev` and `FIRESTORE_DATABASE_ID=portfolio-tq-dev` that:
  - `GET /api/tools/invocations?runId=...` returns existing Firestore-backed tool traces
  - `GET /api/runs/:id/tools` returns the same run-scoped trace list
  - normalized legacy records expose `inputSummary`, `outputSummary`, `success`, `durationMs`, and `createdAt`
- Verified on temporary port `18096` with the same Firestore target that:
  - `POST /api/tools/invocations` creates a new tool invocation log entry for an existing run
  - `GET /api/runs/:id/tools` returns the created tool invocation
  - `GET /api/runs/:id` reflects the incremented `toolInvocationCount`
- Verified on temporary port `18097` that invalid create payloads return `invalid_request` and missing run-scoped tool routes return `not_found`.

Definition of done:

- [x] tool activity can be logged and retrieved independently from business-specific demo logic

---

## 10. Implement evaluation record foundation

Reference docs:

- `docs/specs/service-eval-console.md`
- `docs/specs/service-api.md`
- `docs/architecture/observability-and-dashboards.md`

- [x] Define the evaluation record model.
- [x] Implement endpoint to create an evaluation record.
- [x] Implement endpoint to fetch evaluations by run.
- [x] Implement endpoint to list evaluations.
- [ ] Include fields needed later:
  - [x] id
  - [x] runId
  - [x] schemaValid
  - [x] policyPass
  - [x] fallbackTriggered
  - [x] groundednessScore placeholder
  - [x] notes
  - [x] createdAt
- [x] Ensure the evaluation model supports future extension without breaking callers.

Suggested endpoints:

- [x] `POST /evals`
- [x] `GET /evals`
- [x] `GET /runs/:id/evals`

Verification note:

- Confirmed on `dev`.
- The shared evaluation ledger model now lives in `packages/types/src/index.ts`, with `EvaluationRecord` expanded to carry the section 10 fields the eval console will need: `schemaValid`, `policyPass`, `fallbackTriggered`, `groundednessScore`, `notes`, `summary`, and timestamps.
- Added shared request/query contracts for section 10 in `packages/types/src/index.ts` and `packages/schemas/src/index.ts`, including `EvaluationCreateRequest`, `EvaluationListQuery`, `EvaluationCreateResponseData`, `evaluationCreateRequestSchema`, and `evaluationListQuerySchema`.
- Added a dedicated Firestore-backed evaluation service in `apps/api/src/services/evaluations.ts` and reused a dedicated repository in `apps/api/src/repositories/evaluation-repository.ts`.
- Added dedicated evaluation handlers in `apps/api/src/handlers/evaluation-handler.ts`.
- `apps/api/src/routes/evals.ts` now exposes:
  - `POST /api/evals`
  - `GET /api/evals`
  - `GET /api/runs/:id/evals`
- Preserved `/api/evaluations` as a compatibility alias for both list and create flows while the shared `/api/evals` namespace becomes the primary route group.
- New evaluation writes now also update the parent run's `evaluationStatus` and `fallbackTriggered` fields, keeping the shared run ledger coherent with the evaluation ledger.
- Existing Firestore evaluation records without the new section 10 fields are normalized on read in `apps/api/src/repositories/evaluation-repository.ts`, so the API can read legacy evaluation documents without requiring an immediate reseed.
- Updated `apps/api/src/services/demos/payment-review.ts` and `data/seed/evaluations/evaluations.json` so fresh demo writes and future reseeds use the expanded evaluation model directly.
- During live verification, `POST /api/runs` exposed a Firestore write issue caused by `undefined` optional fields; fixed `apps/api/src/repositories/run-repository.ts` to omit undefined values so the shared run-plus-eval flow works against Firestore cleanly.
- Verified `pnpm --filter @portfolio-tq/types typecheck` passes.
- Verified `pnpm --filter @portfolio-tq/types lint` passes.
- Verified `pnpm --filter @portfolio-tq/schemas typecheck` passes.
- Verified `pnpm --filter @portfolio-tq/schemas lint` passes.
- Verified `pnpm --filter @portfolio-tq/api typecheck` passes.
- Verified `pnpm --filter @portfolio-tq/api lint` passes.
- Verified `pnpm --filter @portfolio-tq/api build` passes.
- Verified `pnpm --filter @portfolio-tq/web typecheck` passes.
- Verified on temporary port `18110` with `GCP_PROJECT_ID=portfolio-tq-dev` and `FIRESTORE_DATABASE_ID=portfolio-tq-dev` that:
  - `POST /api/runs` creates a fresh Firestore-backed run for section 10 verification
  - `GET /api/runs/:id/evals` returns an empty list before evaluation creation and the created record afterward
  - `POST /api/evals` creates a new evaluation record with `policyPass`, `groundednessScore`, and `notes`
  - `GET /api/evals?runId=...&status=passed&limit=5` returns the created evaluation through the shared filtered list path
  - `GET /api/evals?runId=run-payment-20260412-001&limit=5` returns legacy evaluation data normalized with the new section 10 fields
  - invalid evaluation create payloads return `invalid_request`
  - missing run-scoped evaluation routes return `not_found`
  - `GET /api/runs/:id` reflects the updated `evaluationStatus` after evaluation creation

Definition of done:

- the shared evaluation backbone exists before the demos and console depend on it heavily

---

## 11. Implement seeded data access layer

Reference docs:

- `docs/specs/service-api.md`
- `docs/specs/service-web.md`

- [x] Define how seeded data will be stored for the current stage.
- [x] Implement a repository/service layer for reading seeded cases and mock documents.
- [x] Keep this layer generic and reusable.
- [x] Avoid hard-coding data directly into route files.
- [x] Support simple retrieval for:
  - [x] sample payment cases
  - [x] sample investing ops cases
  - [x] legacy intake examples
  - [x] policy documents or source docs placeholders
- [x] Return data in a format usable by frontend demo pages immediately.

Suggested endpoints:

- [x] `GET /seed/payment-cases`
- [x] `GET /seed/investing-cases`
- [x] `GET /seed/legacy-intakes`
- [x] `GET /seed/documents`

Verification note:

- Confirmed on `dev`.
- Seeded demo inputs for the current stage remain file-backed under `data/seed/` rather than being hard-coded inside handlers or moved into a second temporary storage system.
- Added shared seed response contracts in `packages/types/src/index.ts` for case and document list payloads.
- Added a dedicated file-backed seed repository in `apps/api/src/repositories/seed-repository.ts`.
- Added a dedicated seed service in `apps/api/src/services/seed-data.ts`.
- Added dedicated seed handlers in `apps/api/src/handlers/seed-handler.ts`.
- `apps/api/src/routes/seed.ts` now exposes:
  - `GET /api/seed`
  - `GET /api/seed/payment-cases`
  - `GET /api/seed/investing-cases`
  - `GET /api/seed/legacy-intakes`
  - `GET /api/seed/documents`
- The seed namespace surface now reports active routes instead of staying a placeholder-only reservation.
- Route files only wire handlers; seed file lookup, filtering, and query behavior now live in shared repository/service modules.
- Seed case routes enforce their project boundary while still supporting the shared `limit` query pattern, and the documents route supports shared `projectId`, `kind`, and `limit` filters.
- Verified `pnpm --filter @portfolio-tq/types typecheck` passes.
- Verified `pnpm --filter @portfolio-tq/types lint` passes.
- Verified `pnpm --filter @portfolio-tq/schemas typecheck` passes.
- Verified `pnpm --filter @portfolio-tq/schemas lint` passes.
- Verified `pnpm --filter @portfolio-tq/api typecheck` passes.
- Verified `pnpm --filter @portfolio-tq/api lint` passes.
- Verified `pnpm --filter @portfolio-tq/api build` passes.
- Verified `pnpm --filter @portfolio-tq/web typecheck` passes.
- Verified targeted Prettier checks on the section 11 files and this checklist.
- Verified on temporary port `18111` that:
  - `GET /api/seed` advertises the active seed routes
  - `GET /api/seed/payment-cases` returns the seeded payment exception cases
  - `GET /api/seed/payment-cases?limit=1` applies the shared list limit
  - `GET /api/seed/investing-cases` returns the seeded investing ops case set
  - `GET /api/seed/legacy-intakes` returns the seeded legacy intake example set
  - `GET /api/seed/documents?kind=policy` returns filtered policy documents
  - `GET /api/seed/documents?projectId=legacy-ai-adapter&limit=1` returns project-scoped document data
  - route/project mismatches such as `GET /api/seed/payment-cases?projectId=legacy-ai-adapter` return `invalid_request`
  - invalid document query values such as `GET /api/seed/documents?kind=unknown` return `invalid_request`

Definition of done:

- frontend demo shells can load sample inputs and reference material from the API instead of hardcoded UI constants

---

## 12. Implement mock internal tools foundation

Reference docs:

- `docs/specs/service-api.md`
- `docs/specs/service-web.md`
- `docs/specs/service-investing-ops-copilot.md`
- `docs/specs/service-payment-exception-review.md`

- [x] Define the first shared mock tools.
- [x] Implement tool handlers or service functions for:
  - [x] customer profile lookup
  - [x] transaction or payment case lookup
  - [x] account profile lookup
  - [x] policy search
  - [x] event timeline lookup
  - [x] escalation creation placeholder
- [x] Keep tools deterministic and inspectable.
- [x] Return stable typed outputs.
- [x] Do not yet add real third-party integration.

Suggested endpoints:

- [x] `POST /tools/customer-profile`
- [x] `POST /tools/payment-case`
- [x] `POST /tools/account-profile`
- [x] `POST /tools/policy-search`
- [x] `POST /tools/event-timeline`
- [x] `POST /tools/escalation`

Verification note:

- Confirmed on `dev`.
- The shared mock tool layer now exposes deterministic internal-tool style surfaces for payment and investing demo flows without adding any real third-party integration.
- Added shared tool request/response contracts in `packages/types/src/index.ts` for customer profile lookup, payment case lookup, account profile lookup, policy search, event timeline lookup, and escalation placeholder creation.
- Added shared validators in `packages/schemas/src/index.ts` for all section 12 tool request payloads.
- Expanded the shared tool catalog in `packages/tools/src/index.ts` so the rest of the monorepo reflects the active tool layer instead of the old two-entry bootstrap placeholder.
- Added file-backed mock tool data under:
  - `data/seed/customer-profiles/customer-profiles.json`
  - `data/seed/account-profiles/account-profiles.json`
  - `data/seed/event-timelines/events.json`
- Added a dedicated file-backed mock tool repository in `apps/api/src/repositories/mock-tool-repository.ts`.
- Added a dedicated mock tool service in `apps/api/src/services/mock-tools.ts`.
- Added dedicated mock tool handlers in `apps/api/src/handlers/mock-tool-handler.ts`.
- `apps/api/src/routes/tools.ts` now exposes:
  - `POST /api/tools/customer-profile`
  - `POST /api/tools/payment-case`
  - `POST /api/tools/account-profile`
  - `POST /api/tools/policy-search`
  - `POST /api/tools/event-timeline`
  - `POST /api/tools/escalation`
- The tools namespace surface now reports active routes instead of staying a placeholder-only reservation.
- Policy search is deterministic and inspectable: it searches seeded documents for the requested project and ranks matches with a simple explicit score derived from title/summary hits plus policy-kind weighting.
- Escalation creation remains a placeholder only: it validates reviewer ownership against seeded users and returns a deterministic draft preview ID instead of calling any external system.
- Verified `pnpm --filter @portfolio-tq/types typecheck` passes.
- Verified `pnpm --filter @portfolio-tq/types lint` passes.
- Verified `pnpm --filter @portfolio-tq/schemas typecheck` passes.
- Verified `pnpm --filter @portfolio-tq/schemas lint` passes.
- Verified `pnpm --filter @portfolio-tq/tools typecheck` passes.
- Verified `pnpm --filter @portfolio-tq/tools lint` passes.
- Verified `pnpm --filter @portfolio-tq/agents typecheck` passes.
- Verified `pnpm --filter @portfolio-tq/agents lint` passes.
- Verified `pnpm --filter @portfolio-tq/api typecheck` passes.
- Verified `pnpm --filter @portfolio-tq/api lint` passes.
- Verified `pnpm --filter @portfolio-tq/api build` passes.
- Verified `pnpm --filter @portfolio-tq/web typecheck` passes.
- Verified targeted Prettier checks on the section 12 files and this checklist.
- Verified on temporary port `18112` that:
  - `GET /api/tools` advertises the active mock tool routes
  - `POST /api/tools/customer-profile` returns seeded customer profile data
  - `POST /api/tools/payment-case` returns seeded payment case data
  - `POST /api/tools/account-profile` returns seeded account profile data
  - `POST /api/tools/policy-search` returns project-scoped deterministic policy matches
  - `POST /api/tools/event-timeline` returns seeded timeline events for the requested entity
  - `POST /api/tools/escalation` returns a deterministic draft escalation placeholder for the same input payload
  - invalid tool payloads return `invalid_request`
  - missing customer profiles return `not_found`
  - missing escalation owners return `not_found`

Definition of done:

- the shared mock tool layer exists and is usable by later demo logic without redesign

---

## 13. Implement API logging and observability hooks

Reference docs:

- `docs/architecture/observability-and-dashboards.md`
- `docs/specs/service-api.md`

- [x] Add structured request logging.
- [x] Add request IDs or correlation IDs.
- [x] Add basic latency measurement per request.
- [x] Log endpoint errors in a consistent format.
- [ ] Ensure logs are readable locally and in dev deployment.
- [x] Add lightweight internal logging helpers if needed.
- [x] Make sure future run/eval/tool events can be correlated from logs.

Verification note:

- Confirmed on `dev`.
- Structured request observability now lives in the shared runtime path instead of being scattered across handlers:
  - `apps/api/src/lib/http.ts` now accepts propagated `X-Request-Id` / `X-Correlation-Id` values when present, generates a UUID otherwise, records the request ID source, and returns both headers on every response.
  - `apps/api/src/services/logs.ts` now centralizes request lifecycle logging helpers, consistent error log formatting, log-level filtering, and local pretty-print vs production JSON log rendering.
  - `apps/api/src/app/server.ts` now emits shared `request.received` and `request.completed` events with method, path, status, request ID source, and latency.
  - `apps/api/src/middleware/error-handler.ts` now emits shared `request.failed` events with stable HTTP status and API error code fields.
- Added request-ID header exposure to CORS in `apps/api/src/middleware/cors.ts` so browser clients can read the propagated request IDs during local/frontend debugging.
- Added correlation-friendly write events for the shared ledgers:
  - `apps/api/src/handlers/run-handler.ts` now enriches `run.created` with request-linked status/input fields.
  - `apps/api/src/handlers/evaluation-handler.ts` now emits `evaluation.recorded`.
  - `apps/api/src/handlers/tool-invocation-handler.ts` now emits `tool.invocation.recorded`.
- Verified `pnpm --filter @portfolio-tq/api typecheck` passes.
- Verified `pnpm --filter @portfolio-tq/api lint` passes.
- Verified `pnpm --filter @portfolio-tq/api build` passes.
- Verified on temporary port `18113` with the dev Firestore target that:
  - `GET /health` echoes caller-supplied `X-Request-Id: section13-health-req` in both the response headers and shared success envelope
  - `GET /api/not-real` returns `404` plus the shared error envelope while logging `request.failed` with `errorCode: "not_found"`
  - `POST /api/runs`, `POST /api/evals`, and `POST /api/tools/invocations` succeed with caller-supplied request IDs and emit correlated `run.created`, `evaluation.recorded`, and `tool.invocation.recorded` log events for the same run ID
  - local development logs are now human-readable single-line entries that still preserve the structured fields needed for later correlation
- Verified on temporary port `18114` with `NODE_ENV=production` that the same request lifecycle emits JSON log lines suitable for Cloud Run / Cloud Logging ingestion.
- Not yet verified against the live deployed dev Cloud Run service in this section because section 16 deploy/verification has not been re-run after these observability changes. That remaining check should be completed when the updated API is deployed to `dev`.

Definition of done:

- the shared runtime exposes meaningful backend observability before demo complexity increases

---

## 14. Wire minimal frontend-dev compatibility and CORS behavior

Reference docs:

- `docs/specs/service-web.md`
- `docs/specs/service-api.md`

- [x] Configure allowed frontend origin handling for local development and dev deployment.
- [x] Confirm the web app can call the API in local development without cross-origin failure.
- [ ] Confirm the dev deployed web app can call the dev deployed API.
- [x] Keep origin configuration explicit and environment-aware.

Verification note:

- Confirmed on `dev`.
- Local web development now uses an explicit Vite proxy in `apps/web/vite.config.ts` so `/api` requests from `apps/web` can reach the local API server without browser CORS issues.
- `apps/web/src/lib/api/apiClient.ts` now supports both relative `/api` base paths and absolute deployed API URLs, so the same client works for local development and environment-specific deploys.
- `apps/web/.env.example` documents the local proxy target and the default API base path shape for developers.
- Dev and prod deploy workflows now inject `VITE_API_BASE_PATH` explicitly before building the web app, so the deployed bundle points at the correct Cloud Run API URL for each environment.
- Verified `pnpm --filter @portfolio-tq/web typecheck` passes.
- Verified `pnpm --filter @portfolio-tq/web lint` passes.
- Verified `pnpm --filter @portfolio-tq/web build` passes with `VITE_API_BASE_PATH=https://portfolio-tq-api-dev-twgxaiygta-uc.a.run.app/api`.
- Verified local proxy behavior by running the API and web dev servers together and observing a browser-facing `/api/seed` request from the web dev server reaching the API successfully.
- Not yet verified against the live deployed `dev` web app and `dev` Cloud Run API pair after these changes. That final environment check still needs a deployment pass in section 16.

Definition of done:

- frontend and backend can communicate cleanly in dev

---

## 15. Persistence decision and implementation

Reference docs:

- `docs/specs/service-api.md`
- `docs/specs/service-eval-console.md`

- [ ] Decide the persistence mode for this milestone.
- [ ] Recommended: use Firestore now for real shared runtime records.
- [ ] Implement repositories for:
  - [ ] runs
  - [ ] tool invocations
  - [ ] evaluations
  - [ ] optional seed metadata if needed
- [ ] Keep repository interfaces clean enough to swap storage strategy later if required.
- [ ] Ensure Firestore collection naming is explicit and environment-safe.

Definition of done:

- shared runtime records persist outside process memory
- dev deployment behaves like a real multi-run service, not a single-session toy

---

## 16. Deploy the API to dev and verify runtime

Reference docs:

- `docs/architecture/iac-and-cicd.md`
- `docs/checklists/build-checklist-definition-of-done.md`

- [ ] Confirm Terraform or deployment config for the API service is current.
- [ ] Build and deploy the API to the dev environment.
- [ ] Verify health endpoint from the deployed service.
- [ ] Verify at least one run creation request works against the deployed service.
- [ ] Verify at least one evaluation write/read flow works against the deployed service.
- [ ] Verify at least one seeded data endpoint works against the deployed service.
- [ ] Verify logs are visible and usable in dev.

Definition of done:

- the shared API runtime is live in dev and demonstrably functional

---

## 17. Testing and verification

Reference docs:

- `docs/checklists/build-checklist-definition-of-done.md`

- [ ] Add unit or lightweight integration coverage for core shared runtime paths.
- [ ] Test validation failures.
- [ ] Test success path for health endpoint.
- [ ] Test success path for run creation and retrieval.
- [ ] Test success path for evaluation creation and retrieval.
- [ ] Test success path for seeded data retrieval.
- [ ] Test success path for at least one mock tool.
- [ ] Confirm `pnpm lint` passes.
- [ ] Confirm `pnpm typecheck` passes.
- [ ] Confirm `pnpm test` passes.
- [ ] Confirm `pnpm build` passes.
- [ ] Confirm CI passes on pushed branch.

Definition of done:

- the shared API foundation is verified locally and in CI before later milestones depend on it

---

## 18. Documentation and handoff update

Reference docs:

- `README.md`
- `docs/specs/service-api.md`
- `docs/architecture/observability-and-dashboards.md`

- [ ] Update docs if the final route set or data model differs materially from the original spec.
- [ ] Add a short note describing the deployed shared runtime capability.
- [ ] Document any temporary bootstrap exceptions.
- [ ] Document any known limitations intentionally left for later demo milestones.

Definition of done:

- the current state of the shared runtime is legible to future agents and reviewers

---

## Final definition of done

This checklist is complete when:

- `apps/api` is structurally sound
- health/readiness endpoints exist
- shared request validation exists
- run logging exists
- tool invocation logging exists
- evaluation logging exists
- seeded data endpoints exist
- mock tool endpoints exist
- logging/observability hooks exist
- persistence is real and environment-safe
- the API is deployed and verifiable in `dev`
- local checks and CI pass
- later demo modules can now be built on top of this runtime without architectural rework
