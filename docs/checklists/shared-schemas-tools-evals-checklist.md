# Shared Schemas, Tools, and Evaluation Backbone Checklist

## Agent instructions before starting

Before making changes, read these documents in this order:

1. `README.md`
2. `docs/specs/technical-spec-overall.md`
3. `docs/specs/service-api.md`
4. `docs/specs/service-web.md`
5. `docs/specs/service-payment-exception-review.md`
6. `docs/specs/service-investing-ops-copilot.md`
7. `docs/specs/service-legacy-ai-adapter.md`
8. `docs/specs/service-eval-console.md`
9. `docs/architecture/repo-skeleton.md`
10. `docs/architecture/observability-and-dashboards.md`
11. `docs/checklists/build-checklist-definition-of-done.md`
12. `docs/checklists/shared-schemas-tools-evals-checklist.md`

Agent operating rules:

- Do not invent alternate architecture unless a checklist item explicitly calls for a deviation note.
- Keep all environment names consistent with `dev` and `prod`.
- Treat `packages/schemas`, `packages/types`, `packages/tools`, `packages/evals`, and `packages/config` as shared platform layers, not demo-specific dumping grounds.
- Prefer reusable contracts and utilities over one-off local types or ad hoc helper functions.
- Never commit secrets, service account keys, `.tfvars`, or local env files.
- Never write sensitive values into docs, comments, examples, commits, or source files; this repository is public.
- If a manual cloud console step is unavoidable, document it in a short markdown note under `docs/architecture/adr-bootstrapping-notes.md`.

---

Purpose:

- build the shared typed contract, mock tool, config, and evaluation backbone that all later demo modules depend on
- eliminate duplicate local types and ad hoc utilities before the demo implementations grow
- finish with clean shared packages that are imported by both `apps/web` and `apps/api`

Rules:

- work on `dev`
- do not bury shared logic inside `apps/web` or `apps/api` if it belongs in a package
- optimize for clarity, stable naming, and extension without breaking consumers
- this milestone should reduce future rewrite risk across all demo modules

---

## 1. Confirm shared package responsibilities

Reference docs:

- `docs/specs/technical-spec-overall.md`
- `docs/specs/service-api.md`
- `docs/specs/service-web.md`
- `docs/architecture/repo-skeleton.md`

- [x] Confirm responsibility of `packages/types`.
- [x] Confirm responsibility of `packages/schemas`.
- [x] Confirm responsibility of `packages/tools`.
- [x] Confirm responsibility of `packages/evals`.
- [x] Confirm responsibility of `packages/config`.
- [x] Confirm `packages/agents` is not the primary focus of this milestone.
- [x] Confirm no demo-specific UI components should be added in these packages.
- [x] Confirm both frontend and backend should consume shared types/schemas wherever possible.

Expected ownership:

- [x] `packages/types` = shared TS types and interfaces
- [x] `packages/schemas` = runtime validation schemas and DTO contracts
- [x] `packages/tools` = deterministic mock tool contracts and implementations
- [x] `packages/evals` = evaluation record models, scoring helpers, and flagging helpers
- [x] `packages/config` = shared config models, feature flags, prompt/version metadata, and constants

Confirmation notes:

- Confirmed from the referenced specs and repo skeleton that `packages/types`, `packages/schemas`, `packages/tools`, `packages/evals`, and `packages/config` are shared platform layers for both app surfaces, while `packages/ui` remains the place for reusable UI components.
- Confirmed `packages/agents` is adjacent orchestration/model-wrapper work and not the primary focus of this shared schemas/tools/evals/config milestone.
- Confirmed the existing workspace already has package entrypoints for the five milestone packages and shared imports from `apps/api`; `apps/web` currently consumes shared config/types, and deeper shared schema/type consumption should be handled in later implementation sections.
- Section 1 confirms ownership only; completeness of package structure, exports, implementations, tests, and build checks remains tracked in later sections.

Definition of done:

- package responsibilities are explicit before implementation expands

---

## 2. Finalize package structure and exports

Reference docs:

- `docs/architecture/repo-skeleton.md`
- `docs/specs/technical-spec-overall.md`

- [x] Confirm each shared package has a clean `src/` structure.
- [x] Confirm each shared package has a clean entrypoint/export file.
- [x] Confirm package names are stable and consistent with the existing workspace.
- [x] Confirm TypeScript build and path resolution work across packages.
- [x] Confirm `apps/web` and `apps/api` can import the shared packages cleanly.

For each package, ensure:

- [x] explicit entrypoint
- [x] no dead scaffold files
- [x] no circular imports
- [x] clear internal module boundaries

Verification notes:

- Confirmed `packages/types`, `packages/schemas`, `packages/tools`, `packages/evals`, `packages/config`, `packages/agents`, and `packages/ui` each have a `src/` structure with an explicit `src/index.ts` entrypoint; `packages/ui` also has `src/primitives.tsx` exported through its entrypoint.
- Confirmed each package uses the stable workspace name pattern `@portfolio-tq/*` with package export maps pointing to `dist/index.js` and `dist/index.d.ts`.
- Confirmed package-level internal boundaries are currently simple and acyclic: `types` is the base dependency; `schemas`, `tools`, and `config` depend on `types`; `evals` depends on `schemas`/`types`; `agents` depends on `config`/`schemas`/`tools`/`types`; `ui` depends on `config`/`types`.
- Confirmed no dead scaffold source files in shared packages; the only `placeholder` match is the intentional escalation placeholder tool description in `packages/tools`.
- Confirmed `pnpm build` passes for the package and app workspaces, including `apps/api` TypeScript project references and `apps/web` Vite aliases for shared package imports.

Definition of done:

- package boundaries and exports are stable before real contract growth

---

## 3. Build the shared domain model map

Reference docs:

- `docs/specs/service-api.md`
- `docs/specs/service-eval-console.md`
- `docs/specs/service-payment-exception-review.md`
- `docs/specs/service-investing-ops-copilot.md`
- `docs/specs/service-legacy-ai-adapter.md`

- [x] Define the minimum shared domain entities needed now.
- [x] Confirm naming for all core records before coding.
- [x] Confirm which entities need both a TS type and a runtime schema.

Core shared entities to define:

- [x] DemoRun
- [x] ToolInvocation
- [x] EvaluationRecord
- [x] PromptVersion
- [x] EscalationRecord
- [x] SeedDocument
- [x] SeedCase
- [x] ProjectModuleSummary
- [x] ErrorResponse
- [x] SuccessEnvelope or shared response data type if used

Domain model map:

- `DemoRun` = core run lifecycle record for every demo; use `DemoRun` for the base shape and `RunRecord` for persisted/API-enriched records. Needs shared TS types and runtime schemas for create payloads, persisted records, list/detail responses, and status filters.
- `ToolInvocation` = tool trace record for deterministic mock tool calls; use `ToolInvocationRecord` for persisted/API records. Needs shared TS types and runtime schemas for create payloads, persisted records, and list/query responses.
- `EvaluationRecord` = evaluation result attached to a run, covering schema validity, policy pass/fail, fallback state, grounding score, score, notes, and summary. Needs shared TS types and runtime schemas for create payloads, persisted records, and list/query responses.
- `PromptVersion` = prompt/version metadata used by observability and eval comparison; use `PromptVersionRecord` for persisted/API records. Needs shared TS types and a runtime schema before prompt version data is written or surfaced.
- `EscalationRecord` = human-review/escalation trail for uncertain or policy-sensitive runs. Needs shared TS types and runtime schemas for persisted records and create/escalation placeholder inputs.
- `SeedDocument` = seeded policy/reference/brief source document; use `DocumentRecord` for current shared records. Needs shared TS types and runtime schemas for seed documents and seed document query responses.
- `SeedCase` = seeded demo case across payment, investing ops, and legacy adapter domains; use `CaseRecord` for current shared records. Needs shared TS types and runtime schemas for seed cases and seed case query responses.
- `ProjectModuleSummary` = shared module/project metadata for the web shell and API project feeds; current runtime analogue is `ProjectRecord`, while the module metadata shape should be finalized in `packages/config`. Needs shared TS types and a runtime schema if it is surfaced through API or used as validated shared config.
- `ErrorResponse` = shared API error envelope; use `ApiErrorPayload` and `ApiErrorEnvelope`. Needs shared TS types and a runtime schema for API/client validation alignment.
- `SuccessEnvelope` = shared API success envelope; use `ApiSuccessEnvelope<T>`. Needs shared TS types and a runtime schema or generic envelope helper for API/client validation alignment.

Verification notes:

- Confirmed the core nouns come from the API, eval console, payment review, investing ops, and legacy adapter specs: runs, tool invocations, evaluations, escalations, prompt versions, documents, and cases are all cross-demo/shared concerns.
- Confirmed `packages/types` already includes the current record names for most of this map: `DemoRun`, `RunRecord`, `ToolInvocationRecord`, `EvaluationRecord`, `EscalationRecord`, `PromptVersionRecord`, `DocumentRecord`, `CaseRecord`, `ProjectRecord`, `ApiSuccessEnvelope`, and `ApiErrorEnvelope`.
- Confirmed `packages/schemas` currently covers several input/query contracts, including run, evaluation, tool invocation, seed case/document, policy search, timeline, and escalation placeholder inputs. Full persisted record/output envelope schemas remain implementation work for section 5.
- Confirmed `apps/web` still has local API envelope types in `apps/web/src/lib/api/apiClient.ts`; replacing that with shared imports is a later consumption task under section 14, not a blocker for the section 3 domain map.

Definition of done:

- the domain map exists and later demo work can build on stable nouns instead of drifting terminology

---

## 4. Implement `packages/types`

Reference docs:

- `docs/specs/technical-spec-overall.md`
- `docs/specs/service-api.md`
- `docs/specs/service-eval-console.md`

- [x] Create shared TS types for all core entities.
- [x] Separate record types from request/response DTO types where helpful.
- [x] Add explicit status unions where required.
- [x] Add typed enums/unions for:
  - [x] run status
  - [x] workflow/module identifiers
  - [x] exception type placeholders
  - [x] issue category placeholders
  - [x] evaluation flag types
- [x] Add shared helper types for list responses and query filter shapes if needed.
- [x] Keep these types implementation-agnostic where possible.

Minimum type groups:

- [x] run types
- [x] evaluation types
- [x] tool invocation types
- [x] seed data types
- [x] shared response types
- [x] feature/config types

Implementation notes:

- Added shared const-backed unions for project/module IDs, run statuses, project statuses, evaluation statuses, evaluation flag types, tool invocation statuses, escalation statuses, case statuses/priorities, prompt version statuses, payment exception types, payment review recommended actions, investing ops issue categories, legacy submission statuses, module visibility states, and feature flag keys.
- Added shared DTO/model types for evaluation flags, module summaries, feature flags, payment review outputs, investing ops outputs, legacy adapter outputs, seed aliases, tool/prompt aliases, generic list responses, and shared response envelope aliases.
- Preserved existing record and request/response DTO names so current `apps/api`, `apps/web`, and package consumers remain compatible.
- Verified with `pnpm typecheck`.

Definition of done:

- all later layers can import shared types instead of inventing local interfaces

---

## 5. Implement `packages/schemas`

Reference docs:

- `docs/specs/service-api.md`
- `docs/specs/service-eval-console.md`
- `docs/specs/service-payment-exception-review.md`
- `docs/specs/service-investing-ops-copilot.md`
- `docs/specs/service-legacy-ai-adapter.md`

- [x] Create runtime validation schemas for core shared entities.
- [x] Ensure the schemas align with the shared TS types.
- [x] Create input schemas for API write operations.
- [x] Create output schemas for key shared records.
- [x] Export reusable schema fragments where repetition would otherwise appear.
- [x] Keep demo-specific output schemas separated but colocated under the shared schema package.

Minimum schemas:

- [x] create run payload
- [x] run record
- [x] create tool invocation payload
- [x] tool invocation record
- [x] create evaluation payload
- [x] evaluation record
- [x] seed case/document schemas
- [x] shared error payload schema
- [x] project/module metadata schema if surfaced to the frontend

Implementation notes:

- Added shared runtime schemas for JSON values/objects, environments, project IDs, statuses, evaluation flags, shared API error envelopes, generic success envelopes, demo runs, run records, project records, project module summaries, tool invocation records, evaluation records, escalation records, prompt version records, seed documents, seed cases, customer/account profile records, timeline events, policy search matches, escalation previews, feature flags, and demo-specific output contracts.
- Kept existing API input/query schemas and parse helpers stable while switching status/project validation to shared vocabularies where appropriate.
- Added demo-specific output schemas for payment review, investing ops, and legacy adapter under `packages/schemas` alongside the shared contract schemas.
- Verified with `pnpm --filter @portfolio-tq/schemas typecheck` and `pnpm typecheck`.

Definition of done:

- API validation and frontend contract assumptions are backed by shared runtime schemas

---

## 6. Define shared identifiers, enums, and constants

Reference docs:

- `docs/specs/technical-spec-overall.md`
- `docs/specs/service-api.md`

- [x] Create a central source for module/project identifiers.
- [x] Create a central source for run statuses.
- [x] Create a central source for evaluation flag names.
- [x] Create a central source for default limits, pagination defaults, and common thresholds if known.
- [x] Avoid magic strings being duplicated across apps and packages.

Minimum constant groups:

- [x] project module IDs
- [x] route-safe demo identifiers
- [x] status labels
- [x] evaluation result labels
- [x] seed data category labels

Implementation notes:

- Centralized module/project IDs, route-safe IDs, run statuses, evaluation statuses, and evaluation flag types in `packages/types`, then exposed config-facing copies from `packages/config`.
- Added shared project/demo route maps, run status labels, evaluation status labels, evaluation flag labels, seed data category labels, pagination defaults, and initial review thresholds in `packages/config`.
- Used documented targets where available, including the 8s demo API median latency target from the overall technical spec.
- No manual cloud console or secret-bearing step was required.

Definition of done:

- the shared backbone uses controlled vocabularies instead of duplicated string literals

---

## 7. Implement `packages/config`

Reference docs:

- `docs/specs/technical-spec-overall.md`
- `docs/specs/service-api.md`
- `docs/specs/service-web.md`

- [x] Define shared config models that both apps can consume.
- [x] Add shared feature-flag types.
- [x] Add shared module metadata/config shape for project cards and demo metadata.
- [x] Add prompt version metadata model.
- [x] Add environment-safe constants that should not live inside app code.
- [x] Avoid putting secret-bearing config in this package.

Suggested content:

- [x] feature flag types and defaults
- [x] module metadata model
- [x] prompt version metadata types
- [x] shared label maps
- [x] static config objects that describe project modules

Implementation notes:

- Expanded `packages/config` with shared feature flag defaults, project module metadata, prompt version metadata, route maps, environment labels, status labels, evaluation flag labels, seed category labels, pagination defaults, and evaluation thresholds.
- Kept the config package environment-safe: it contains public routes, labels, IDs, thresholds, synthetic prompt metadata, and non-secret defaults only.
- Verified with `pnpm --filter @portfolio-tq/config typecheck`, `pnpm --filter @portfolio-tq/config lint`, and `pnpm typecheck`.
- No manual execution was required for section 7.

Definition of done:

- shared config and metadata are centralized and reusable across the portfolio

---

## 8. Build project module metadata as shared config

Reference docs:

- `docs/specs/service-web.md`
- `docs/specs/service-payment-exception-review.md`
- `docs/specs/service-investing-ops-copilot.md`
- `docs/specs/service-legacy-ai-adapter.md`
- `docs/specs/service-eval-console.md`

- [x] Create a shared module metadata object for the four core demo modules.
- [x] Include fields useful to both the web app and API.
- [x] Confirm naming and descriptions match the copy/spec direction.

Minimum metadata fields:

- [x] id
- [x] slug
- [x] title
- [x] short summary
- [x] proof tags
- [x] demo route
- [x] project route
- [x] status
- [x] visibility or gated state flag

Implementation note:

- Confirmed in `packages/config/src/index.ts` via `projectModuleMetadata`, `projectModuleMetadataById`, shared route maps, title/summary/proof-tag maps, status, and visibility fields.

Definition of done:

- the site and runtime can reference one shared source of module truth

---

## 9. Implement `packages/tools` contract layer

Reference docs:

- `docs/specs/service-api.md`
- `docs/specs/service-payment-exception-review.md`
- `docs/specs/service-investing-ops-copilot.md`

- [x] Define shared input/output contracts for each mock tool.
- [x] Separate tool definition metadata from implementation.
- [x] Keep each tool deterministic and inspectable.
- [x] Ensure tool outputs are typed and stable.
- [x] Ensure tools do not depend on web-only or API-only code where avoidable.

Minimum tool contracts:

- [x] customer profile lookup
- [x] payment case lookup
- [x] account profile lookup
- [x] policy search
- [x] event timeline lookup
- [x] escalation creation placeholder

For each tool define:

- [x] tool ID
- [x] tool name
- [x] input type/schema
- [x] output type/schema
- [x] summary/description
- [x] deterministic implementation contract

Implementation note:

- Added `toolContracts`, `toolContractsById`, typed response schemas, deterministic implementation metadata, and a compatibility `toolCatalog` export in `packages/tools/src/index.ts`.

Definition of done:

- both API runtime and future agent/orchestration logic can use one shared tool contract layer

---

## 10. Implement deterministic mock tool logic

Reference docs:

- `docs/specs/service-api.md`
- `docs/specs/service-payment-exception-review.md`
- `docs/specs/service-investing-ops-copilot.md`
- `docs/specs/service-legacy-ai-adapter.md`

- [x] Implement the deterministic mock tool functions in `packages/tools`.
- [x] Back the tools with seeded data inputs or deterministic mock logic.
- [x] Make sure outputs are repeatable for the same inputs.
- [x] Ensure the tools are easy to log and inspect.
- [x] Avoid hidden randomness.

Implementation note:

- Added pure deterministic tool functions in `packages/tools/src/index.ts` for customer profile lookup, payment case lookup, account profile lookup, policy search, event timeline lookup, and escalation placeholder creation. The API now passes seeded records into these shared helpers from app-local loaders and keeps API-specific not-found errors in `apps/api`.

Definition of done:

- the API can call shared tool implementations directly without duplicating tool logic locally

---

## 11. Implement `packages/evals` models and helpers

Reference docs:

- `docs/specs/service-eval-console.md`
- `docs/architecture/observability-and-dashboards.md`
- `docs/specs/service-api.md`

- [x] Define shared evaluation result models.
- [x] Define evaluation helper input/output contracts.
- [x] Create helpers for common checks.
- [x] Keep the helpers generic so they can be used by all later demo modules.

Minimum helpers:

- [x] schema validity evaluation helper
- [x] confidence threshold evaluation helper
- [x] fallback triggered helper
- [x] flag aggregation helper
- [x] run summary helper for dashboard consumption

Optional now if low cost:

- [x] grounding/citation presence helper
- [x] latency threshold helper
- [x] estimated cost banding helper

Implementation note:

- Expanded `packages/evals/src/index.ts` with reusable check result models, dashboard summary models, threshold defaults, schema validity checks, confidence checks, fallback checks, flag aggregation, run dashboard summaries, grounding/citation checks, latency checks, estimated cost banding, and derived evaluation status helpers.

Definition of done:

- the API and later console can use one shared evaluation language and helper layer

---

## 12. Define flagging and review logic vocabulary

Reference docs:

- `docs/specs/service-eval-console.md`
- `docs/architecture/observability-and-dashboards.md`

- [x] Define what counts as a flagged run.
- [x] Define the first set of shared review/flag categories.
- [x] Define what data is needed to render a useful flagged-run summary.
- [x] Keep the categories limited and meaningful.

Suggested initial flags:

- [x] low_confidence
- [x] schema_invalid
- [x] fallback_triggered
- [x] policy_review_required
- [x] missing_sources
- [x] latency_exceeded

Implementation note:

- Added shared flagged-run summary typing in `packages/types/src/index.ts` and review flag category metadata plus `isFlaggedRun`/`summarizeFlaggedRun` helpers in `packages/evals/src/index.ts`.

Definition of done:

- later console work can render stable review states without inventing a new vocabulary

---

## 13. Create shared seed data typing and loader contracts

Reference docs:

- `docs/specs/service-api.md`
- `docs/specs/service-web.md`

- [x] Define the shape of seeded cases and documents.
- [x] Define the shared loader contract that the API layer will use.
- [x] Keep file-based seed loading and Firestore-based runtime records separate conceptually.
- [x] Ensure the web app can depend on the same seed types for UI assumptions.

Seed data groups:

- [x] payment cases
- [x] investing ops cases
- [x] legacy intake examples
- [x] policy/source documents

Implementation note:

- Added shared seed group IDs, case group IDs, seed data group descriptors, and the file-seed loader contract in `packages/types/src/index.ts`; added runtime descriptor schema support in `packages/schemas/src/index.ts`; added shared descriptors in `packages/config/src/index.ts`; and wired the API seed repository/service to the shared file-seed loader contract.

Definition of done:

- seed data structure is typed and reusable before more demo logic lands

---

## 14. Wire package exports and consumption into apps

Reference docs:

- `docs/specs/service-api.md`
- `docs/specs/service-web.md`
- `docs/architecture/repo-skeleton.md`

- [x] Update package exports so consumers import from stable entrypoints.
- [x] Replace duplicated local types in `apps/api` with shared imports where appropriate.
- [x] Replace duplicated local metadata or constants in `apps/web` with shared imports where appropriate.
- [x] Confirm build still succeeds after shifting logic into packages.
- [x] Avoid giant barrel files that blur package boundaries.

Implementation note:

- Confirmed the shared packages continue to export through stable package entrypoints; the API now consumes shared `@portfolio-tq/tools` helpers and shared seed loader contracts, and the web app now consumes shared API envelope types plus shared project module metadata for route-safe project/demo paths. No new cross-package mega-barrel was added.

Definition of done:

- shared packages are not theoretical; they are actively consumed by both apps where appropriate

---

## 15. Add tests for shared packages

Reference docs:

- `docs/checklists/build-checklist-definition-of-done.md`

- [x] Add tests for critical schemas.
- [x] Add tests for deterministic mock tools.
- [x] Add tests for evaluation helpers.
- [x] Add tests for config/module metadata if non-trivial.
- [x] Add tests for shared constants or vocabulary only if they encode logic worth protecting.

Implementation note:

- Added `node:test` coverage for schema contracts, deterministic mock tools, evaluation helpers/flag vocabulary, and config/module metadata. Updated the relevant package `test` scripts for `@portfolio-tq/schemas`, `@portfolio-tq/tools`, `@portfolio-tq/evals`, and `@portfolio-tq/config`.

Definition of done:

- the most important shared contracts are protected before later milestones depend on them

---

## 16. Validate naming, drift, and package hygiene

Reference docs:

- `README.md`
- `docs/specs/technical-spec-overall.md`

- [x] Check for duplicated local interfaces that should be removed.
- [x] Check for inconsistent naming between specs and package exports.
- [x] Check for circular imports across packages.
- [x] Check for dead code created during scaffolding.
- [x] Check that package README/docs comments are concise and accurate where useful.

Verification note:

- Removed the duplicated local API success envelope from `apps/web` in section 14, aligned shared package descriptions in `README.md`, `docs/specs/technical-spec-overall.md`, and `docs/architecture/repo-skeleton.md`, confirmed the tracked package import graph remains acyclic, and removed unused generated scaffold files under `apps/web/@portfolio-tq/...`.

Definition of done:

- the shared backbone is clean enough to survive multiple later milestones

---

## 17. Build verification and CI

Reference docs:

- `docs/checklists/build-checklist-definition-of-done.md`

- [x] Confirm `pnpm lint` passes.
- [x] Confirm `pnpm typecheck` passes.
- [x] Confirm `pnpm test` passes.
- [x] Confirm `pnpm build` passes.
- [x] Confirm CI passes on pushed branch.
- [x] Confirm changes do not break the existing web shell or shared API runtime foundation.

Verification note:

- Verified locally with `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`. `gh run list --branch dev --limit 5` showed the latest pushed `dev` CI runs were successful, but the current local working tree is still uncommitted/unpushed and will need CI to run again after push to verify these exact edits.

Definition of done:

- the shared backbone is technically stable and safe to build on

---

## 18. Documentation and handoff update

Reference docs:

- `README.md`
- `docs/specs/technical-spec-overall.md`
- `docs/specs/service-api.md`
- `docs/specs/service-web.md`

- [x] Update docs if shared package responsibilities changed materially.
- [x] Add short notes if any intentional shortcuts remain.
- [x] Document any unresolved gaps that later demo milestones must close.
- [x] Ensure future agents can see where to add new schemas, tools, and eval helpers without guessing.

Handoff note:

- Updated `README.md`, `docs/specs/technical-spec-overall.md`, and `docs/architecture/repo-skeleton.md` with the current shared package responsibilities and a short package handoff map. Remaining follow-up gaps: current local edits need CI after push, and the web bundle still emits a non-failing Vite chunk-size warning.

Definition of done:

- the package backbone is understandable to future contributors and agents

---

## Final definition of done

This checklist is complete when:

- shared package responsibilities are explicit
- stable types exist in `packages/types`
- runtime schemas exist in `packages/schemas`
- shared module/config metadata exists in `packages/config`
- deterministic mock tools exist in `packages/tools`
- shared evaluation models and helpers exist in `packages/evals`
- seeded data types and loader contracts are defined
- both `apps/web` and `apps/api` consume the shared packages appropriately
- tests cover critical shared contracts
- local checks and CI pass
- later demo milestones can build on this backbone without architectural drift
