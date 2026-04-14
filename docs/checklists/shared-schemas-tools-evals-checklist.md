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

- [ ] Confirm each shared package has a clean `src/` structure.
- [ ] Confirm each shared package has a clean entrypoint/export file.
- [ ] Confirm package names are stable and consistent with the existing workspace.
- [ ] Confirm TypeScript build and path resolution work across packages.
- [ ] Confirm `apps/web` and `apps/api` can import the shared packages cleanly.

For each package, ensure:
- [ ] explicit entrypoint
- [ ] no dead scaffold files
- [ ] no circular imports
- [ ] clear internal module boundaries

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

- [ ] Define the minimum shared domain entities needed now.
- [ ] Confirm naming for all core records before coding.
- [ ] Confirm which entities need both a TS type and a runtime schema.

Core shared entities to define:
- [ ] DemoRun
- [ ] ToolInvocation
- [ ] EvaluationRecord
- [ ] PromptVersion
- [ ] EscalationRecord
- [ ] SeedDocument
- [ ] SeedCase
- [ ] ProjectModuleSummary
- [ ] ErrorResponse
- [ ] SuccessEnvelope or shared response data type if used

Definition of done:
- the domain map exists and later demo work can build on stable nouns instead of drifting terminology

---

## 4. Implement `packages/types`

Reference docs:
- `docs/specs/technical-spec-overall.md`
- `docs/specs/service-api.md`
- `docs/specs/service-eval-console.md`

- [ ] Create shared TS types for all core entities.
- [ ] Separate record types from request/response DTO types where helpful.
- [ ] Add explicit status unions where required.
- [ ] Add typed enums/unions for:
  - [ ] run status
  - [ ] workflow/module identifiers
  - [ ] exception type placeholders
  - [ ] issue category placeholders
  - [ ] evaluation flag types
- [ ] Add shared helper types for list responses and query filter shapes if needed.
- [ ] Keep these types implementation-agnostic where possible.

Minimum type groups:
- [ ] run types
- [ ] evaluation types
- [ ] tool invocation types
- [ ] seed data types
- [ ] shared response types
- [ ] feature/config types

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

- [ ] Create runtime validation schemas for core shared entities.
- [ ] Ensure the schemas align with the shared TS types.
- [ ] Create input schemas for API write operations.
- [ ] Create output schemas for key shared records.
- [ ] Export reusable schema fragments where repetition would otherwise appear.
- [ ] Keep demo-specific output schemas separated but colocated under the shared schema package.

Minimum schemas:
- [ ] create run payload
- [ ] run record
- [ ] create tool invocation payload
- [ ] tool invocation record
- [ ] create evaluation payload
- [ ] evaluation record
- [ ] seed case/document schemas
- [ ] shared error payload schema
- [ ] project/module metadata schema if surfaced to the frontend

Definition of done:
- API validation and frontend contract assumptions are backed by shared runtime schemas

---

## 6. Define shared identifiers, enums, and constants

Reference docs:
- `docs/specs/technical-spec-overall.md`
- `docs/specs/service-api.md`

- [ ] Create a central source for module/project identifiers.
- [ ] Create a central source for run statuses.
- [ ] Create a central source for evaluation flag names.
- [ ] Create a central source for default limits, pagination defaults, and common thresholds if known.
- [ ] Avoid magic strings being duplicated across apps and packages.

Minimum constant groups:
- [ ] project module IDs
- [ ] route-safe demo identifiers
- [ ] status labels
- [ ] evaluation result labels
- [ ] seed data category labels

Definition of done:
- the shared backbone uses controlled vocabularies instead of duplicated string literals

---

## 7. Implement `packages/config`

Reference docs:
- `docs/specs/technical-spec-overall.md`
- `docs/specs/service-api.md`
- `docs/specs/service-web.md`

- [ ] Define shared config models that both apps can consume.
- [ ] Add shared feature-flag types.
- [ ] Add shared module metadata/config shape for project cards and demo metadata.
- [ ] Add prompt version metadata model.
- [ ] Add environment-safe constants that should not live inside app code.
- [ ] Avoid putting secret-bearing config in this package.

Suggested content:
- [ ] feature flag types and defaults
- [ ] module metadata model
- [ ] prompt version metadata types
- [ ] shared label maps
- [ ] static config objects that describe project modules

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

- [ ] Create a shared module metadata object for the four core demo modules.
- [ ] Include fields useful to both the web app and API.
- [ ] Confirm naming and descriptions match the copy/spec direction.

Minimum metadata fields:
- [ ] id
- [ ] slug
- [ ] title
- [ ] short summary
- [ ] proof tags
- [ ] demo route
- [ ] project route
- [ ] status
- [ ] visibility or gated state flag

Definition of done:
- the site and runtime can reference one shared source of module truth

---

## 9. Implement `packages/tools` contract layer

Reference docs:
- `docs/specs/service-api.md`
- `docs/specs/service-payment-exception-review.md`
- `docs/specs/service-investing-ops-copilot.md`

- [ ] Define shared input/output contracts for each mock tool.
- [ ] Separate tool definition metadata from implementation.
- [ ] Keep each tool deterministic and inspectable.
- [ ] Ensure tool outputs are typed and stable.
- [ ] Ensure tools do not depend on web-only or API-only code where avoidable.

Minimum tool contracts:
- [ ] customer profile lookup
- [ ] payment case lookup
- [ ] account profile lookup
- [ ] policy search
- [ ] event timeline lookup
- [ ] escalation creation placeholder

For each tool define:
- [ ] tool ID
- [ ] tool name
- [ ] input type/schema
- [ ] output type/schema
- [ ] summary/description
- [ ] deterministic implementation contract

Definition of done:
- both API runtime and future agent/orchestration logic can use one shared tool contract layer

---

## 10. Implement deterministic mock tool logic

Reference docs:
- `docs/specs/service-api.md`
- `docs/specs/service-payment-exception-review.md`
- `docs/specs/service-investing-ops-copilot.md`
- `docs/specs/service-legacy-ai-adapter.md`

- [ ] Implement the deterministic mock tool functions in `packages/tools`.
- [ ] Back the tools with seeded data inputs or deterministic mock logic.
- [ ] Make sure outputs are repeatable for the same inputs.
- [ ] Ensure the tools are easy to log and inspect.
- [ ] Avoid hidden randomness.

Definition of done:
- the API can call shared tool implementations directly without duplicating tool logic locally

---

## 11. Implement `packages/evals` models and helpers

Reference docs:
- `docs/specs/service-eval-console.md`
- `docs/architecture/observability-and-dashboards.md`
- `docs/specs/service-api.md`

- [ ] Define shared evaluation result models.
- [ ] Define evaluation helper input/output contracts.
- [ ] Create helpers for common checks.
- [ ] Keep the helpers generic so they can be used by all later demo modules.

Minimum helpers:
- [ ] schema validity evaluation helper
- [ ] confidence threshold evaluation helper
- [ ] fallback triggered helper
- [ ] flag aggregation helper
- [ ] run summary helper for dashboard consumption

Optional now if low cost:
- [ ] grounding/citation presence helper
- [ ] latency threshold helper
- [ ] estimated cost banding helper

Definition of done:
- the API and later console can use one shared evaluation language and helper layer

---

## 12. Define flagging and review logic vocabulary

Reference docs:
- `docs/specs/service-eval-console.md`
- `docs/architecture/observability-and-dashboards.md`

- [ ] Define what counts as a flagged run.
- [ ] Define the first set of shared review/flag categories.
- [ ] Define what data is needed to render a useful flagged-run summary.
- [ ] Keep the categories limited and meaningful.

Suggested initial flags:
- [ ] low_confidence
- [ ] schema_invalid
- [ ] fallback_triggered
- [ ] policy_review_required
- [ ] missing_sources
- [ ] latency_exceeded

Definition of done:
- later console work can render stable review states without inventing a new vocabulary

---

## 13. Create shared seed data typing and loader contracts

Reference docs:
- `docs/specs/service-api.md`
- `docs/specs/service-web.md`

- [ ] Define the shape of seeded cases and documents.
- [ ] Define the shared loader contract that the API layer will use.
- [ ] Keep file-based seed loading and Firestore-based runtime records separate conceptually.
- [ ] Ensure the web app can depend on the same seed types for UI assumptions.

Seed data groups:
- [ ] payment cases
- [ ] investing ops cases
- [ ] legacy intake examples
- [ ] policy/source documents

Definition of done:
- seed data structure is typed and reusable before more demo logic lands

---

## 14. Wire package exports and consumption into apps

Reference docs:
- `docs/specs/service-api.md`
- `docs/specs/service-web.md`
- `docs/architecture/repo-skeleton.md`

- [ ] Update package exports so consumers import from stable entrypoints.
- [ ] Replace duplicated local types in `apps/api` with shared imports where appropriate.
- [ ] Replace duplicated local metadata or constants in `apps/web` with shared imports where appropriate.
- [ ] Confirm build still succeeds after shifting logic into packages.
- [ ] Avoid giant barrel files that blur package boundaries.

Definition of done:
- shared packages are not theoretical; they are actively consumed by both apps where appropriate

---

## 15. Add tests for shared packages

Reference docs:
- `docs/checklists/build-checklist-definition-of-done.md`

- [ ] Add tests for critical schemas.
- [ ] Add tests for deterministic mock tools.
- [ ] Add tests for evaluation helpers.
- [ ] Add tests for config/module metadata if non-trivial.
- [ ] Add tests for shared constants or vocabulary only if they encode logic worth protecting.

Definition of done:
- the most important shared contracts are protected before later milestones depend on them

---

## 16. Validate naming, drift, and package hygiene

Reference docs:
- `README.md`
- `docs/specs/technical-spec-overall.md`

- [ ] Check for duplicated local interfaces that should be removed.
- [ ] Check for inconsistent naming between specs and package exports.
- [ ] Check for circular imports across packages.
- [ ] Check for dead code created during scaffolding.
- [ ] Check that package README/docs comments are concise and accurate where useful.

Definition of done:
- the shared backbone is clean enough to survive multiple later milestones

---

## 17. Build verification and CI

Reference docs:
- `docs/checklists/build-checklist-definition-of-done.md`

- [ ] Confirm `pnpm lint` passes.
- [ ] Confirm `pnpm typecheck` passes.
- [ ] Confirm `pnpm test` passes.
- [ ] Confirm `pnpm build` passes.
- [ ] Confirm CI passes on pushed branch.
- [ ] Confirm changes do not break the existing web shell or shared API runtime foundation.

Definition of done:
- the shared backbone is technically stable and safe to build on

---

## 18. Documentation and handoff update

Reference docs:
- `README.md`
- `docs/specs/technical-spec-overall.md`
- `docs/specs/service-api.md`
- `docs/specs/service-web.md`

- [ ] Update docs if shared package responsibilities changed materially.
- [ ] Add short notes if any intentional shortcuts remain.
- [ ] Document any unresolved gaps that later demo milestones must close.
- [ ] Ensure future agents can see where to add new schemas, tools, and eval helpers without guessing.

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
