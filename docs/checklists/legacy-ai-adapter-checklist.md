# Legacy AI Adapter Checklist

## Agent instructions before starting

Before making changes, read these documents in this order:

1. `README.md`
2. `docs/specs/technical-spec-overall.md`
3. `docs/specs/service-api.md`
4. `docs/specs/service-web.md`
5. `docs/specs/service-legacy-ai-adapter.md`
6. `docs/architecture/repo-skeleton.md`
7. `docs/architecture/observability-and-dashboards.md`
8. `docs/checklists/build-checklist-definition-of-done.md`
9. `docs/checklists/shared-api-runtime-foundation-checklist.md`
10. `docs/checklists/shared-schemas-tools-evals-checklist.md`
11. `docs/checklists/legacy-ai-adapter-checklist.md`

Agent operating rules:

- Do not invent alternate architecture unless a checklist item explicitly calls for a deviation note.
- Keep all environment names consistent with `dev` and `prod`.
- Reuse the existing shared API runtime and shared packages. Do not duplicate logic inside the demo module unless truly demo-specific.
- Keep the adapter deterministic, inspectable, and strongly typed.
- The value of this module is safe transformation of messy input into a controlled legacy-compatible structure.
- Never commit secrets, service account keys, `.tfvars`, or local env files.
- Never write sensitive values into docs, comments, examples, commits, or source files; this repository is public.
- If a manual cloud console step is unavoidable, document it in a short markdown note under `docs/architecture/adr-bootstrapping-notes.md`.

---

Purpose:
- implement the first complete live portfolio demo module end-to-end
- demonstrate how messy real-world input can be normalized, validated, transformed, and submitted through a legacy-compatible workflow
- finish with a working public project page plus a working demo route backed by the shared API runtime

Rules:
- work on `dev`
- this module should be substantial enough to stand alone as a proof piece
- prefer clarity and inspection over fake complexity
- every step in the workflow should be visible in the UI and understandable to a reviewer within minutes

---

## 1. Confirm module scope and proof objective

Reference docs:
- `docs/specs/service-legacy-ai-adapter.md`
- `docs/specs/service-web.md`
- `docs/specs/service-api.md`

- [x] Confirm the core problem statement for the module.
- [x] Confirm the module is about adapting messy real-world inputs into a structured AI-native interface that still preserves deterministic legacy compatibility.
- [x] Confirm the module should show:
  - [x] raw messy input
  - [x] structured extraction
  - [x] deterministic validation
  - [x] legacy payload transformation
  - [x] typed result
  - [x] trace visibility
  - [x] evaluation visibility
- [x] Confirm the module is not meant to simulate a full production migration platform.
- [x] Confirm the demo should feel credible and controlled, not open-ended or gimmicky.

Confirmation notes:
- Confirmed from `docs/specs/service-legacy-ai-adapter.md` that the module problem is human normalization of messy real inputs for rigid legacy services, and that the adapter value is a validated, normalized, legacy-compatible submission with a clear status.
- Confirmed from the Legacy Adapter service spec that the intended proof is a hybrid workflow: messy text or semi-structured input enters an AI-native adapter, typed fields are extracted, deterministic validation is applied, the result is transformed into a legacy payload, submitted through the mock legacy service, and returned as a typed modern response.
- Confirmed the reviewer-visible surfaces required by section 1 are consistent with the service spec's demo UX (`messy input area`, `extracted fields panel`, `validator panel`, `transformed legacy payload panel`, `legacy response panel`, and `final human-readable response`) plus the shared API/web/observability stack already established for run logging and evaluation display.
- Confirmed this is a focused proof piece rather than a full migration platform: the service spec frames it as a demonstration of migration thinking, the README calls it a portfolio proof module, and the checklist purpose explicitly emphasizes a controlled end-to-end demo rather than an open-ended platform simulation.
- Confirmed the target tone is credible and controlled, not gimmicky: the README and service specs consistently emphasize inspectability, safe control logic, typed outputs, deterministic checks, and reviewer comprehension within minutes.
- No manual execution was required to complete section 1. The only mild synthesis here is that `trace visibility` and `evaluation visibility` are confirmed by combining the module spec with the shared API/observability documents read in the required checklist prep, rather than by one exact phrase in the Legacy Adapter spec alone.

Definition of done:
- the module objective is locked before implementation deepens

---

## 2. Define the workflow and data path precisely

Reference docs:
- `docs/specs/service-legacy-ai-adapter.md`
- `docs/architecture/observability-and-dashboards.md`

- [x] Confirm the canonical workflow.
- [x] Document the exact steps the runtime will perform.
- [x] Confirm what is deterministic vs probabilistic.
- [x] Confirm where fallback or review is triggered.
- [x] Confirm what the final output of the demo is supposed to represent.

Canonical flow:
- [x] messy intake text submitted
- [x] typed extraction attempt
- [x] deterministic validation against required fields/rules
- [x] transform into legacy-compatible payload
- [x] return final normalized result
- [x] log run, tool activity if any, and evaluation record

Workflow lock notes:
- Confirmed from `docs/specs/service-legacy-ai-adapter.md` that the canonical adapter path is: accept messy text or semi-structured input, extract typed fields, run deterministic validation, transform into a legacy payload, submit that payload through the mock legacy service, return a typed modern response, and log the run plus evaluation data.
- Confirmed from `docs/specs/service-api.md` and `docs/architecture/observability-and-dashboards.md` that the runtime-level execution framing around that module flow should be: receive request, create or correlate a run, execute the project-specific workflow, log tool activity if any, validate schema/control checks, apply fallback policy if needed, persist output plus evaluation, and return the response through the shared API envelope.
- Locked exact intended runtime sequence for this module as:
  1. receive messy intake text or semi-structured form input
  2. create the workflow run context in the shared API runtime
  3. attempt typed extraction from the messy intake
  4. apply deterministic validation rules to required fields and invalid combinations
  5. if the extraction is safe enough, transform the normalized structure into the legacy-compatible payload
  6. submit the transformed payload to the mock legacy service and capture its constrained status
  7. assemble the final typed adapter response for the UI
  8. persist run, trace/tool activity if any, and evaluation data for observability surfaces
- Confirmed the probabilistic vs deterministic split from the service spec and project copy:
  - the extraction step is the probabilistic or hybrid part because it recovers typed structure from messy input
  - the validation layer, legacy payload transformation, status mapping, and final response contract are deterministic and must remain inspectable
- Confirmed the fallback/review boundary at the design level: review is triggered when extraction plus deterministic checks do not support a clean legacy-compatible handoff, which should surface as validation issues and a review-oriented final state such as `needs_review`; fallback is therefore downstream of extraction and validation, not a substitute for them.
- Confirmed the final output is not meant to be raw model output; it represents the controlled, reviewer-readable result of the adapter workflow: normalized input, legacy submission status, validation issues, suggested next step, confidence, and later the review flag called for in subsequent sections.
- Current implementation boundary: the shared runtime already supports runs, tool traces, evaluations, seed loading, and observability, but there is not yet a live `POST /api/demo/legacy-ai-adapter/run` route or legacy adapter orchestrator in `apps/api`. Section 2 is therefore locked from the specs, shared contracts, seeded records, and shared runtime conventions rather than from a live end-to-end execution of this module.
- No manual execution was required to complete section 2. The only non-literal synthesis is the precise review/fallback trigger wording, which is derived by combining the module spec, output status vocabulary, demo copy, and shared API fallback/observability conventions.

Definition of done:
- no ambiguity remains around the exact demo flow

---

## 3. Lock the domain vocabulary for this module

Reference docs:
- `docs/specs/service-legacy-ai-adapter.md`
- `docs/checklists/shared-schemas-tools-evals-checklist.md`

- [x] Confirm the names of the key objects in this module.
- [x] Confirm the raw intake type name.
- [x] Confirm the structured extraction type name.
- [x] Confirm the validation result type name.
- [x] Confirm the legacy payload type name.
- [x] Confirm the final response type name.
- [x] Confirm the issue/review status vocabulary.

Suggested vocabulary:
- [x] LegacyAdapterInput
- [x] LegacyAdapterExtraction
- [x] LegacyAdapterValidationResult
- [x] LegacyAdapterPayload
- [x] LegacyAdapterOutput

Vocabulary lock notes:
- Confirmed the module should use one coherent `LegacyAdapter*` family for the code-facing nouns because that aligns with the service spec name (`Legacy Workflow to AI-Native Service Adapter`), the shared package convention used by other demo outputs, and the need for later UI/API/eval work to share stable terms.
- Locked the type names as:
  - `LegacyAdapterInput` = the raw operator submission entering the adapter workflow
  - `LegacyAdapterExtraction` = the typed structure recovered from messy intake before control checks finalize the handoff
  - `LegacyAdapterValidationResult` = the deterministic control-layer result, including whether required fields/rules passed and which issues remain
  - `LegacyAdapterPayload` = the transformed legacy-compatible submission shape sent to the mock legacy service
  - `LegacyAdapterOutput` = the final typed response returned to the frontend and later surfaced in runs/evaluations
- Confirmed these names are the best synthesis of the module spec and the text copy:
  - the service spec uses `messy text or semi-structured form`, `extract typed fields`, `deterministic validation`, `transform into legacy payload`, and `return typed, modern response`
  - the project copy uses `Messy input -> schema extraction -> deterministic validation -> legacy payload transform -> typed response`
  - the demo copy uses the reviewer-facing labels `Raw intake`, `Normalized structure`, `Legacy payload`, and `Final result`
- Locked the communication mapping between code-facing and reviewer-facing language so the portfolio piece stays clear:
  - `LegacyAdapterInput` should be shown in the UI as `Raw intake`
  - `LegacyAdapterExtraction` should be shown in the UI as `Normalized structure`
  - `LegacyAdapterValidationResult` should be shown in the UI as the validation/controls layer, with reviewer-visible fields such as `Missing fields` and `Validation issues`
  - `LegacyAdapterPayload` should be shown in the UI as `Legacy payload`
  - `LegacyAdapterOutput` should be shown in the UI as `Final result`
- Confirmed the issue/review vocabulary should stay small and explicit:
  - `validationIssues` = the stable list of deterministic problems or warnings that a reviewer can inspect
  - `legacySubmissionStatus` = `accepted` | `rejected` | `needs_review`
  - `humanReviewRequired` = explicit boolean flag used for final UI display and evaluation integration
  - shared review/evaluation vocabulary should continue to reuse the broader platform terms where applicable, especially `schema_invalid`, `fallback_triggered`, and `policy_review_required`
- Confirmed the current shared output contract already preserves one of the locked names, `LegacyAdapterOutput`, plus `legacySubmissionStatus`, `validationIssues`, `suggestedNextStep`, and `confidence`, so section 3 is extending an existing shared convention rather than inventing a disconnected naming scheme.
- Current drift note: `packages/types` and `packages/schemas` already define `LegacyAdapterOutput`, but they do not yet define the companion `LegacyAdapterInput`, `LegacyAdapterExtraction`, `LegacyAdapterValidationResult`, or `LegacyAdapterPayload` types, and the current `LegacyAdapterOutput` does not yet include `humanReviewRequired` even though the demo copy (`Review required`) and later checklist sections clearly imply it should. That is an implementation follow-up for section 4, not a blocker to locking the vocabulary here.
- No manual execution was required to complete section 3. The vocabulary is a careful synthesis from the module spec, shared output/status conventions, `docs/design/text-copy/08-project-legacy-ai-adapter.md`, `docs/design/text-copy/12-demo-legacy-ai-adapter.md`, and the existing shared package naming style.

Definition of done:
- later UI, API, and evaluation work all use the same vocabulary

---

## 4. Implement shared schemas and types specific to this module

Reference docs:
- `docs/specs/service-legacy-ai-adapter.md`
- `docs/checklists/shared-schemas-tools-evals-checklist.md`

- [x] Add module-specific types to shared packages where appropriate.
- [x] Add module-specific runtime schemas to shared packages where appropriate.
- [x] Avoid local one-off types inside `apps/web` or `apps/api` if they belong in the shared backbone.
- [x] Define:
  - [x] input schema
  - [x] extraction schema
  - [x] validation schema
  - [x] legacy payload schema
  - [x] final output schema

Minimum output fields:
- [x] normalizedInput
- [x] legacySubmissionStatus
- [x] validationIssues
- [x] suggestedNextStep
- [x] confidence
- [x] humanReviewRequired

Implementation notes:
- Added the locked module contracts to `packages/types/src/index.ts`: `LegacyAdapterInput`, `LegacyAdapterExtraction`, `LegacyAdapterValidationIssue`, `LegacyAdapterValidationResult`, `LegacyAdapterPayload`, `LegacyAdapterOutput`, and the sample-case support type `LegacyAdapterSampleCase`.
- Strengthened the shared legacy adapter vocabulary instead of creating app-local one-offs in `apps/web` or `apps/api`. The final output contract now includes `humanReviewRequired` and a nullable `legacyPayload`, which keeps the later UI/result work aligned with the demo copy and the checklist's required visibility.
- Added runtime schemas in `packages/schemas/src/index.ts` for every module-specific contract needed at this stage: input, extraction, validation issue/result, legacy payload, final output, and sample-case schema support.
- Added parser helpers for the new legacy adapter input and sample-case schemas so later API/runtime work can reuse the shared validation path instead of reintroducing local parsing.
- The shared final output contract is now intentionally richer than the original minimal snippet in `docs/specs/service-legacy-ai-adapter.md`: it still includes the required spec fields, but it also carries `legacyPayload` and `humanReviewRequired` so the eventual demo can surface the transformation and review state explicitly.
- Verified the shared contract changes with `pnpm --filter @portfolio-tq/types typecheck`, `pnpm --filter @portfolio-tq/types lint`, `pnpm --filter @portfolio-tq/schemas typecheck`, `pnpm --filter @portfolio-tq/schemas lint`, `pnpm --filter @portfolio-tq/types build`, `pnpm --filter @portfolio-tq/schemas build`, `pnpm --filter @portfolio-tq/schemas test`, and workspace `pnpm typecheck`.

Definition of done:
- the module contracts are strongly typed and reusable across UI and API layers

---

## 5. Create seeded demo inputs and expected cases

Reference docs:
- `docs/specs/service-legacy-ai-adapter.md`
- `docs/specs/service-web.md`
- `docs/specs/service-api.md`

- [x] Create a small but strong set of seeded raw-intake examples.
- [x] Include enough variation to show the adapter is doing real work.
- [x] Ensure examples are concise and review-friendly.
- [x] Define at least:
  - [x] one clean case
  - [x] one partially messy case
  - [x] one missing-fields case
  - [x] one ambiguous case requiring review
- [x] Add expected outcomes for each case where useful for testing.

Seed notes:
- Refreshed `data/seed/legacy-cases/cases.json` so the existing shared legacy-intake seed feed now contains four concise metadata records aligned to the demo scenarios instead of one generic placeholder.
- Added rich module-specific sample fixtures in `data/seed/legacy-cases/intake-examples.json` with four scenarios:
  - clean beneficiary change
  - messy but recoverable document request
  - missing required account details
  - conflicting request details requiring review
- Each rich sample includes the raw intake (`LegacyAdapterInput`) plus expected extraction, validation result, payload, and final output so the data is useful for later UI work, API sample routes, and tests.
- The expected outcomes intentionally cover all three final status states now present in the shared vocabulary: `accepted`, `rejected`, and `needs_review`.
- Verified the rich sample fixture file against the shared runtime contract with the added `packages/schemas/test/contracts.test.ts` coverage; the new test reads `data/seed/legacy-cases/intake-examples.json` and validates every record with `legacyAdapterSampleCaseSchema`.
- Current limitation: the rich `intake-examples.json` fixture is not yet exposed through a dedicated module samples endpoint. The existing shared `/api/seed/legacy-intakes` route still returns the generic `CaseRecord` list from `cases.json`, and wiring a module-specific `/demo/legacy-ai-adapter/samples` API surface remains later work under section 10.
- No manual execution was required for section 5, and no manual blocker was encountered during sections 4 or 5.

Definition of done:
- the demo can be shown with realistic sample inputs immediately

---

## 6. Implement the extraction stage

Reference docs:
- `docs/specs/service-legacy-ai-adapter.md`
- `docs/specs/service-api.md`

- [x] Build the extraction step in the API/runtime.
- [x] Decide whether this first pass uses:
  - [x] deterministic parsing only
  - [ ] model-backed extraction
  - [ ] hybrid extraction
- [x] Ensure extraction output conforms to the shared schema.
- [x] Ensure extraction can fail cleanly.
- [x] Log enough intermediate information for trace visibility.

Important rule:
- the extraction stage must be inspectable
- reviewers should be able to see what was recovered from messy input

Extraction notes:
- Added a real runtime extraction service in `apps/api/src/services/demos/legacy-adapter.ts` instead of leaving section 6 at the spec-only stage. The first pass is intentionally `deterministic_parsing` so the adapter stays inspectable, stable, and consistent with the portfolio's control-first framing.
- Implemented deterministic extraction for the currently seeded workflows by recovering:
  - workflow hints from raw text
  - normalized account IDs
  - requester names
  - effective dates
  - optional dollar amounts
  - target entities
  - source channel context
  - request summaries
- The extraction result is parsed through `legacyAdapterExtractionSchema`, so the runtime is forced back onto the shared contract rather than emitting app-local shapes.
- Extraction failure now degrades cleanly: if no supported signals are recovered, the service returns a schema-valid extraction object with null fields plus an explicit `failureReason` in the stage trace instead of throwing an opaque parsing error.
- Added inspectable trace metadata for this stage: `strategy`, `normalizedText`, `recoveredFields`, `workflowHints`, `accountCandidates`, `conflictSignals`, and extraction failure state. The service also emits `legacy_adapter.extraction.completed` structured logs when a logger context is supplied, which is enough to support later trace rendering without inventing a second trace format.
- Added API tests in `apps/api/test/legacy-adapter.test.ts` that run the extractor against every seeded fixture in `data/seed/legacy-cases/intake-examples.json` and assert the extracted structure matches the expected module examples exactly.
- Verification completed with `pnpm --filter @portfolio-tq/api typecheck`, `pnpm --filter @portfolio-tq/api lint`, `pnpm --filter @portfolio-tq/api test`, and workspace `pnpm typecheck`.
- Current boundary note: the extraction stage now exists in the runtime/service layer, but it is not yet exercised through a live `POST /api/demo/legacy-ai-adapter/run` route. HTTP invocation and persisted run/evaluation linkage remain later work under sections 10 and 11, not a manual blocker for section 6.

Definition of done:
- the runtime can turn raw intake text into a typed extraction object

---

## 7. Implement deterministic validation stage

Reference docs:
- `docs/specs/service-legacy-ai-adapter.md`
- `docs/specs/service-api.md`

- [x] Build deterministic validation rules for the extracted structure.
- [x] Mark missing required fields.
- [x] Mark invalid combinations.
- [x] Produce a stable validation result object.
- [x] Determine when validation failure should:
  - [x] continue with warnings
  - [x] stop the workflow
  - [x] trigger review
- [ ] Ensure validation is obvious and reviewable in the UI.

Validation notes:
- Added a deterministic validation stage in `apps/api/src/services/demos/legacy-adapter.ts` that consumes the typed extraction plus extraction trace rather than trying to infer control decisions from raw text again.
- Locked workflow-specific required field sets and stable missing-field behavior for the current supported workflow types:
  - beneficiary change
  - distribution change
  - document reissue
  - profile update
- Implemented deterministic blocking behavior for:
  - missing required fields
  - conflicting workflow interpretations
  - multiple conflicting account identifiers
  - ambiguous requests that should be routed to review before any legacy payload is produced
- Implemented deterministic non-blocking warning behavior so validation can explicitly `continue_with_warnings` when the extraction is usable but includes optional fields that do not belong to the chosen legacy workflow.
- The validation stage now returns a stable `LegacyAdapterValidationResult` object with `isValid`, `missingFields`, `issues`, `humanReviewRequired`, and `canTransformPayload`, and it is parsed through `legacyAdapterValidationResultSchema` before leaving the service.
- Added seeded-case validation coverage in `apps/api/test/legacy-adapter.test.ts` so every rich fixture now proves the expected validation outcome, and added a separate warning-path test to verify the `continue_with_warnings` branch.
- The current decision mapping is explicit and inspectable:
  - warning-only issues -> continue with warnings
  - blocking deterministic failures -> stop workflow
  - conflicting or ambiguous signals -> trigger review
- The reviewability data the UI needs now exists in the runtime contract and demo copy vocabulary (`Missing fields`, `Validation issues`, `Confidence`, `Review required`), but the live legacy adapter demo UI is still only a shell and is not yet wired to this runtime stage. I therefore left the UI-specific checkbox open until sections 10-12 connect the API and the page for real.
- Verification completed with `pnpm --filter @portfolio-tq/api typecheck`, `pnpm --filter @portfolio-tq/api lint`, `pnpm --filter @portfolio-tq/api test`, and workspace `pnpm typecheck`.
- No manual execution was required for sections 6 or 7, and no manual blocker was encountered.

Definition of done:
- the module has a real deterministic control layer, not just extraction and hope

---

## 8. Implement legacy payload transformation

Reference docs:
- `docs/specs/service-legacy-ai-adapter.md`
- `docs/specs/service-api.md`

- [x] Define the legacy-compatible payload shape.
- [x] Implement transformation logic from validated extraction to legacy payload.
- [x] Keep the transformation deterministic.
- [ ] Ensure the payload is visible in the UI.
- [x] Add stable status mapping for:
  - [x] accepted
  - [x] rejected
  - [x] needs_review

Transformation notes:
- Added a dedicated transformation stage in `apps/api/src/services/demos/legacy-adapter.ts` so payload construction is no longer implicit in seed data. The runtime now has a real `runLegacyAdapterTransformationStage(...)` step that accepts the typed extraction plus validation result and returns a deterministic `LegacyAdapterPayload | null`.
- Locked the legacy-compatible payload shape to the shared schema already introduced in section 4 and now enforced at runtime through `legacyAdapterPayloadSchema`. The payload includes:
  - `legacyWorkflowCode`
  - `legacyAccountId`
  - `operatorDisplayName`
  - `normalizedSummary`
  - `effectiveDate`
  - `amountCents`
  - `reviewCode`
- Implemented stable workflow-to-legacy-code mapping:
  - `beneficiary_change` -> `BENE_CHG`
  - `distribution_change` -> `DIST_CHG`
  - `document_reissue` -> `DOC_REISSUE`
  - `profile_update` -> `PROF_UPD`
- Implemented deterministic transformation rules rather than free-form payload assembly:
  - payload creation only proceeds when validation explicitly allows transformation
  - currency is normalized to integer cents
  - document reissue payloads null out `effectiveDate`
  - review and reject states skip payload generation cleanly and record a structured skip reason
- Added stable submission-status mapping inside the transformation layer:
  - validation allows transformation -> `accepted`
  - blocking validation failure without review -> `rejected`
  - review-required validation result -> `needs_review`
- Added seeded-case payload coverage in `apps/api/test/legacy-adapter.test.ts`, and every rich fixture in `data/seed/legacy-cases/intake-examples.json` now proves both the expected payload shape and the expected final submission status.
- Added stage-level trace/log metadata for transformation, including legacy workflow code, review code, whether transformation was skipped, and why.
- Verification completed with `pnpm --filter @portfolio-tq/api typecheck`, `pnpm --filter @portfolio-tq/api lint`, `pnpm --filter @portfolio-tq/api test`, and workspace `pnpm typecheck`.
- Current boundary note: the payload exists in the runtime and final output contracts, but it is not yet rendered by a live legacy adapter demo page. I left the UI-visibility checkbox open until sections 10-12 wire the API response into the real frontend.

Definition of done:
- the adapter produces a credible legacy-shaped payload from the normalized structure

---

## 9. Implement final module output and next-step logic

Reference docs:
- `docs/specs/service-legacy-ai-adapter.md`
- `docs/specs/service-api.md`

- [x] Build the final output object returned to the frontend.
- [x] Ensure it includes:
  - [x] normalized input
  - [x] validation issues
  - [x] transformed payload
  - [x] status
  - [x] suggested next step
  - [x] confidence
  - [x] human review required flag
- [x] Keep next-step logic explicit and readable.

Final output notes:
- Added a final output builder in `apps/api/src/services/demos/legacy-adapter.ts` so the adapter now has an explicit `buildLegacyAdapterFinalOutput(...)` stage instead of relying on fixture-only expected outputs.
- The runtime final result is validated against `legacyAdapterOutputSchema` before it leaves the service, so the final module output remains tied to the shared contract rather than becoming an app-local formatter.
- The output now deterministically includes the full reviewer-facing result shape expected by the demo copy and earlier vocabulary lock:
  - `normalizedInput`
  - `legacyPayload`
  - `legacySubmissionStatus`
  - `validationIssues`
  - `suggestedNextStep`
  - `confidence`
  - `humanReviewRequired`
- Implemented explicit next-step logic that stays readable rather than hiding business logic in score thresholds:
  - accepted beneficiary change -> submit directly to the beneficiary change queue
  - accepted document reissue -> submit to the document request queue and return typed confirmation
  - warning-only accepted paths -> submit while noting ignored optional fields
  - rejected paths -> collect the missing deterministic inputs and retry
  - review paths -> route to human review to resolve conflicting workflow/account references
- Implemented deterministic confidence mapping so the final output communicates certainty in a stable, reviewer-readable way:
  - clean accepted path -> high confidence
  - messy but recoverable accepted path -> lower but still acceptable confidence
  - rejected path -> low confidence
  - review path -> mid-band confidence with review required
- Added seeded-case final-output coverage in `apps/api/test/legacy-adapter.test.ts`, and every rich fixture now proves the runtime final output matches the expected result exactly. The warning-path test also verifies that the explicit next-step logic remains readable when validation continues with warnings.
- Verification completed with `pnpm --filter @portfolio-tq/api typecheck`, `pnpm --filter @portfolio-tq/api lint`, `pnpm --filter @portfolio-tq/api test`, and workspace `pnpm typecheck`.
- Current boundary note: the final output object now exists in the runtime/service layer and is ready to be returned by the eventual legacy adapter route, but there is still no live `POST /api/demo/legacy-ai-adapter/run` endpoint. Section 9 is therefore complete at the workflow/runtime layer, while route delivery remains section 10 work.
- No manual execution was required for sections 8 or 9, and no manual blocker was encountered.

Definition of done:
- the final output is useful, typed, and interpretable by a reviewer without extra explanation

---

## 10. Implement API routes for the module

Reference docs:
- `docs/specs/service-api.md`
- `docs/specs/service-legacy-ai-adapter.md`

- [x] Add route(s) for the Legacy Adapter module to the shared API.
- [x] Add request validation.
- [x] Log a `DemoRun`.
- [x] Log evaluation results.
- [x] Return stable error shapes.
- [x] Return stable success envelope shape consistent with the rest of the API.

Suggested endpoints:
- [x] `POST /demo/legacy-ai-adapter/run`
- [x] `GET /demo/legacy-ai-adapter/samples`
- [x] `GET /runs/:id` should already expose run linkage to this workflow

API route notes:
- Added real shared API handlers in `apps/api/src/handlers/demo-handler.ts` for:
  - `POST /api/demo/legacy-ai-adapter/run`
  - `GET /api/demo/legacy-ai-adapter/samples`
- Registered both endpoints in `apps/api/src/routes/demo.ts` and added them to the root API route index in `apps/api/src/handlers/system-handler.ts`, so the legacy adapter now participates in the same route registry as the other demo modules.
- Reused the shared request-validation path rather than introducing demo-local parsing:
  - `POST /api/demo/legacy-ai-adapter/run` validates the request body with `parseLegacyAdapterInput`
  - `GET /api/demo/legacy-ai-adapter/samples` returns the rich module fixtures already validated against the shared sample-case schema
- Added shared response contracts in `packages/types/src/index.ts` so the HTTP layer now returns a stable typed demo payload for this module, including `run`, `evaluation`, `escalation`, `toolInvocations`, `result`, and reviewer-consumable `trace` data.
- The success path now uses the same shared envelope as the rest of the API via `sendSuccess(...)`, and invalid requests return the same shared error envelope via the existing validation/error middleware.
- Added error-path project mapping in `apps/api/src/middleware/error-handler.ts` so failed legacy adapter executions emit a `run.failed` lifecycle event with the correct `projectId`.
- Confirmed `GET /api/runs/:id` already exposes linkage to this workflow through the shared run route because legacy adapter executions now create standard `RunRecord` entries with project id `legacy-ai-adapter`.
- Verified the new HTTP surfaces directly in `apps/api/test/legacy-adapter.test.ts`:
  - `GET /api/demo/legacy-ai-adapter/samples` returns a stable success envelope and the rich sample list
  - `POST /api/demo/legacy-ai-adapter/run` returns a stable success envelope with the typed result and stage trace
  - invalid `POST` requests return the shared error envelope with `ok: false`, `error`, and `requestId`
- Verification completed with `pnpm --filter @portfolio-tq/types build`, `pnpm --filter @portfolio-tq/api typecheck`, `pnpm --filter @portfolio-tq/api lint`, `pnpm --filter @portfolio-tq/api test`, and workspace `pnpm typecheck`.

Definition of done:
- the module can be invoked from the frontend through the shared API

---

## 11. Wire run logging, evaluation, and trace capture

Reference docs:
- `docs/architecture/observability-and-dashboards.md`
- `docs/specs/service-eval-console.md`
- `docs/specs/service-api.md`

- [x] Ensure each execution creates a run record.
- [x] Ensure evaluation records are written.
- [x] Ensure validation failures and review triggers are captured in the run/eval data.
- [x] Ensure enough trace information is captured to render:
  - [x] extraction stage
  - [x] validation stage
  - [x] payload transformation stage
  - [x] final status
- [x] Ensure the module’s runs can later be consumed by the Evaluation Console.

Observability notes:
- Added a real legacy adapter demo orchestrator in `apps/api/src/services/demos/legacy-adapter.ts` with `runLegacyAdapterDemo(...)`, so section 11 is no longer hypothetical. Each execution now assembles a standard `RunRecord`, `EvaluationRecord`, optional `EscalationRecord`, and stage-level `ToolInvocationRecord[]`.
- Ensured each run uses the shared observability persistence path through `persistDemoRun(...)`, which writes:
  - the run record
  - the evaluation record
  - the stage trace records as tool invocations
  - the escalation record when review is required
- Captured validation failures and review triggers in durable run/evaluation data rather than only in the HTTP response:
  - run-level `fallbackTriggered`, `escalated`, `evaluationStatus`, and summary text
  - evaluation-level `status`, `fallbackTriggered`, `policyPass`, `score`, `notes`, `summary`, and shared evaluation flags
  - shared flags including `schema_invalid`, `fallback_triggered`, `policy_review_required`, and `low_confidence` where appropriate
- Captured enough stage trace information to support later UI rendering and observability inspection in two places:
  - response `trace` data for extraction, validation, transformation, and final status
  - persisted `ToolInvocationRecord`s for:
    - `legacy-extraction-stage`
    - `legacy-validation-stage`
    - `legacy-payload-transformation-stage`
    - `legacy-final-output-stage`
- Added structured lifecycle logging for the module's run path using the existing shared logger:
  - `run.created`
  - `run.started`
  - `tool.called`
  - `tool.completed`
  - `schema.validated`
  - `fallback.triggered` when review is required
  - `escalation.created` when review is required
  - `run.completed`
- Verified persistence and trace capture in `apps/api/test/legacy-adapter.test.ts` with an in-memory Firestore implementation. The test confirms a review-required run writes:
  - one run
  - one evaluation
  - four stage tool invocations
  - one escalation
- Because the module now emits the same `RunRecord`, `EvaluationRecord`, and `ToolInvocationRecord` shapes used everywhere else, its executions can be consumed later by the Evaluation Console without inventing a project-specific observability path.
- Current boundary note: the data is now captured and persisted in the shared observability model, but the legacy adapter frontend pages still do not render those live traces yet. That is a later UI integration task, not a blocker to section 11.
- No manual execution was required for sections 10 or 11, and no manual blocker was encountered.

Definition of done:
- the demo is not just returning output; it is participating in the broader observability model

---

## 12. Build the project page for the module

Reference docs:
- `docs/specs/service-web.md`
- `docs/specs/service-legacy-ai-adapter.md`
- `docs/copy/08-project-legacy-ai-adapter.md`

- [x] Implement or refine `/projects/legacy-ai-adapter`.
- [x] Use the copy pack as the content source.
- [x] Ensure the page clearly explains:
  - [x] the problem
  - [x] why it matters
  - [x] the workflow
  - [x] the controls
  - [x] what this proves
- [x] Add the workflow diagram or equivalent structural visual.
- [x] Add CTA into the live demo.

Project page notes:
- Replaced the generic shell for `/projects/legacy-ai-adapter` with a dedicated page component in `apps/web/src/features/projects/LegacyAdapterProjectPage.tsx` so the module can read as a real proof piece instead of another template instance.
- Kept the page grounded in the existing site language and copy system by sourcing the content from `projectCopyById['legacy-ai-adapter']`, which is already parsed from `docs/design/text-copy/08-project-legacy-ai-adapter.md`.
- Added a clearer problem framing section that contrasts the legacy system expectation with messy intake reality, so the module’s purpose is understandable within seconds.
- Added a reviewer-facing workflow diagram equivalent: a five-stage visual sequence covering messy intake, schema extraction, deterministic validation, legacy transform, and typed response.
- Added a dedicated `What the reviewer can see` section so the page explicitly previews the same surfaces the demo will later expose:
  - raw intake
  - normalized structure
  - deterministic validation
  - legacy payload
  - final result
- Preserved the controls and proof sections, but made them more explicit for this module so the page clearly communicates compatibility safeguards and what the project demonstrates.
- Added a direct CTA into the demo from the hero and the close-out panel, satisfying the project-page handoff into the live demo surface.
- Verified the page implementation with `pnpm --filter @portfolio-tq/web typecheck`, `pnpm --filter @portfolio-tq/web lint`, `pnpm --filter @portfolio-tq/web build`, and workspace `pnpm typecheck`.

Definition of done:
- the project page stands on its own as a credible portfolio proof piece

---

## 13. Build the demo page UI for the module

Reference docs:
- `docs/specs/service-web.md`
- `docs/specs/service-legacy-ai-adapter.md`
- `docs/copy/12-demo-legacy-ai-adapter.md`

- [x] Implement or refine `/demo/legacy-ai-adapter`.
- [x] Build the input panel.
- [x] Build the extraction/normalized structure panel.
- [x] Build the validation panel.
- [x] Build the legacy payload panel.
- [x] Build the final result panel.
- [x] Build loading, empty, error, and success states.
- [x] Keep the layout inspectable and easy to understand.
- [x] Ensure the page works on desktop, tablet, and mobile.

Demo page notes:
- Replaced the old generic demo shell for `/demo/legacy-ai-adapter` with a dedicated interactive page in `apps/web/src/features/demos/LegacyAdapterDemoPage.tsx`.
- Added a route-specific loader in `apps/web/src/features/demos/legacyAdapterDemoLoaders.ts` that pulls in the rich seeded cases from `data/seed/legacy-cases/intake-examples.json` for a local preview mode until section 14 wires the live API.
- Kept the page content sourced from the existing demo copy pack by reusing the parsed `legacyAiAdapterDemoCopy` structure from `apps/web/src/content/demoCopy.ts`.
- Built a real input panel with:
  - seeded sample selection
  - editable raw intake text
  - optional metadata JSON
  - legacy workflow type selection
  - `Transform Input` and `Load Sample Intake` actions
- Built separate reviewer-visible panels for:
  - normalized structure / extraction output
  - deterministic validation findings
  - transformed legacy payload
  - final result status and next-step guidance
  - evaluation metrics
- Implemented loading, empty, error, and success states inside the page rather than leaving those states to the generic route wrapper. The local preview intentionally errors when the edited input no longer matches a seeded case, which keeps the pre-API UI honest instead of pretending arbitrary freeform input is already live.
- The layout now uses responsive multi-column sections that collapse cleanly for smaller widths, so desktop, tablet, and mobile all have an inspectable reading order instead of a compressed shell placeholder.
- Current boundary note: the demo UI is now complete as a seeded local preview, but it is not yet connected to the shared API. That is intentional and belongs to section 14, not a blocker to section 13.
- Verification completed with `pnpm --filter @portfolio-tq/web typecheck`, `pnpm --filter @portfolio-tq/web lint`, `pnpm --filter @portfolio-tq/web build`, and workspace `pnpm typecheck`.
- No manual execution was required for sections 12 or 13, and no manual blocker was encountered. I did not run a manual browser/device smoke pass in this turn, so the responsive verification here is based on the implemented responsive layouts plus successful typecheck/lint/build.

Definition of done:
- a reviewer can run the demo and understand the workflow visually without explanation from you

---

## 14. Connect frontend to the API

Reference docs:
- `docs/specs/service-web.md`
- `docs/specs/service-api.md`

- [x] Wire the frontend demo route to the shared API endpoint.
- [x] Use the explicit API base URL pattern already established in the web app.
- [x] Load sample cases from the API.
- [x] Submit real runs to the API.
- [x] Render the returned structured output.
- [x] Render validation issues.
- [x] Render transformed payload.
- [x] Render status and next-step guidance.

Frontend API notes:
- Replaced the section 13 local-preview sample loading path with a real API-backed loader in `apps/web/src/features/demos/legacyAdapterDemoLoaders.ts`, so `/demo/legacy-ai-adapter` now prepares itself from the shared backend instead of importing local JSON directly.
- Added a small feature-local API client in `apps/web/src/features/demos/legacyAdapterApi.ts` and extended `apps/web/src/lib/api/apiClient.ts` with `demoSamples(...)`, keeping the route wiring aligned with the existing explicit base-path pattern rather than hardcoding fetch URLs inside the page.
- Updated `apps/web/src/features/demos/LegacyAdapterDemoPage.tsx` so the input panel now submits real `POST /api/demo/legacy-ai-adapter/run` requests, not seeded preview matching.
- The demo now renders live:
  - structured normalized output
  - deterministic validation issues and outcome
  - transformed legacy payload or explicit skip reason
  - final status, next-step guidance, and review flag
  - persisted evaluation flags and run-trace summary
- The sample chooser still exists, but it now loads seeded cases that come from the API's sample endpoint instead of the local fixture import path.
- Verification completed with `pnpm --filter @portfolio-tq/web typecheck`, `pnpm --filter @portfolio-tq/web lint`, `pnpm --filter @portfolio-tq/web build`, and workspace `pnpm typecheck`.

Definition of done:
- the demo is fully connected, not just visually mocked

---

## 15. Add module-specific evaluation and review logic

Reference docs:
- `docs/specs/service-eval-console.md`
- `docs/checklists/shared-schemas-tools-evals-checklist.md`

- [x] Define what counts as a flagged run for this module.
- [x] Use shared evaluation helpers where appropriate.
- [x] At minimum, flag:
  - [x] missing required fields
  - [x] invalid schema after extraction
  - [x] review required
  - [x] transformation failure
- [x] Ensure these show up in the module output and in evaluation records.

Evaluation/review notes:
- Tightened the module-specific flagged-run rules inside `apps/api/src/services/demos/legacy-adapter.ts` so section 15 is now explicit instead of implied by a few status strings.
- Reused the shared evaluation helper layer from `@portfolio-tq/evals`:
  - `evaluateConfidenceThreshold(...)`
  - `evaluateFallbackTriggered(...)`
  - `aggregateEvaluationFlags(...)`
  - `deriveEvaluationStatus(...)`
- Kept the shared flag vocabulary intentionally small by mapping the module-specific review conditions onto shared categories rather than inventing legacy-only flag names:
  - missing required fields -> `schema_invalid`
  - invalid extracted structure -> `schema_invalid`
  - review required -> `policy_review_required`
  - transformation stopped/skipped -> `schema_invalid` or `fallback_triggered` depending on whether the stop was a hard rejection or a review fallback path
  - low confidence continues to reuse `low_confidence`
- The module now records stronger evaluation semantics:
  - clean accepted runs can evaluate to `passed`
  - review-required runs evaluate to `warning`
  - rejected runs with schema-invalid extraction/required-field gaps evaluate to `failed`
- The frontend now surfaces those persisted evaluation flags directly in `/demo/legacy-ai-adapter`, so the module output and the stored evaluation record tell the same story to a reviewer.
- Added route/runtime verification in `apps/api/test/legacy-adapter.test.ts` for:
  - review-required runs staying flagged and warning-level
  - missing-field rejected runs producing `schema_invalid` flags and `failed` evaluation status
  - accepted route runs returning `passed` evaluation status
- Verification completed with `pnpm --filter @portfolio-tq/api typecheck`, `pnpm --filter @portfolio-tq/api lint`, `pnpm --filter @portfolio-tq/api test`, plus the web checks noted in section 14 and workspace `pnpm typecheck`.
- No manual execution was required for sections 14 or 15, and no manual blocker was encountered. I did not run a manual browser smoke pass or deploy-to-dev verification in this turn, so this completion is based on local API tests plus successful web typecheck/lint/build rather than a deployed end-to-end verification.

Definition of done:
- this module contributes meaningful flagged-run data to the wider platform

---

## 16. Add tests for the module

Reference docs:
- `docs/checklists/build-checklist-definition-of-done.md`

- [ ] Add tests for extraction logic.
- [ ] Add tests for validation rules.
- [ ] Add tests for payload transformation.
- [ ] Add tests for final status/next-step logic.
- [ ] Add at least one route-level success test.
- [ ] Add at least one route-level failure/review test.

Definition of done:
- the first demo module is protected by real tests before later modules copy its patterns

---

## 17. Deploy to dev and verify end-to-end

Reference docs:
- `docs/architecture/iac-and-cicd.md`
- `docs/checklists/build-checklist-definition-of-done.md`

- [ ] Deploy updated API to dev.
- [ ] Deploy updated web app to dev.
- [ ] Verify `/projects/legacy-ai-adapter` renders correctly in dev.
- [ ] Verify `/demo/legacy-ai-adapter` renders correctly in dev.
- [ ] Verify sample loading works.
- [ ] Verify run execution works.
- [ ] Verify output rendering works.
- [ ] Verify evaluation/run logging works.
- [ ] Verify the dev surface is stable and reviewable.

Definition of done:
- the first complete demo module is live in dev end-to-end

---

## 18. Final polish, docs, and milestone closure

Reference docs:
- `README.md`
- `docs/specs/service-legacy-ai-adapter.md`
- `docs/checklists/build-checklist-definition-of-done.md`

- [ ] Confirm copy is concise and strong.
- [ ] Confirm no redundant or confusing UI labels remain.
- [ ] Confirm code/comments/docs use the final module vocabulary consistently.
- [ ] Update any spec/docs that diverged materially from the final implementation.
- [ ] Confirm `pnpm lint` passes.
- [ ] Confirm `pnpm typecheck` passes.
- [ ] Confirm `pnpm test` passes.
- [ ] Confirm `pnpm build` passes.
- [ ] Confirm CI passes on pushed branch.
- [ ] Write a clean milestone commit message.

Definition of done:
- the module is complete, documented, verified, and ready to stand as the first major proof piece in the portfolio

---

## Final definition of done

This checklist is complete when:
- the Legacy AI Adapter module is implemented end-to-end
- typed schemas and validation are in place
- messy input becomes structured extraction
- deterministic validation is visible
- legacy payload transformation is visible
- final typed output is useful and controlled
- run/evaluation data are logged
- the project page is credible
- the demo page is usable
- the module is deployed and verifiable in `dev`
- local checks and CI pass
- the portfolio now contains one fully working flagship proof module
