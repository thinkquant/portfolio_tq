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

- [ ] Confirm the core problem statement for the module.
- [ ] Confirm the module is about adapting messy real-world inputs into a structured AI-native interface that still preserves deterministic legacy compatibility.
- [ ] Confirm the module should show:
  - [ ] raw messy input
  - [ ] structured extraction
  - [ ] deterministic validation
  - [ ] legacy payload transformation
  - [ ] typed result
  - [ ] trace visibility
  - [ ] evaluation visibility
- [ ] Confirm the module is not meant to simulate a full production migration platform.
- [ ] Confirm the demo should feel credible and controlled, not open-ended or gimmicky.

Definition of done:
- the module objective is locked before implementation deepens

---

## 2. Define the workflow and data path precisely

Reference docs:
- `docs/specs/service-legacy-ai-adapter.md`
- `docs/architecture/observability-and-dashboards.md`

- [ ] Confirm the canonical workflow.
- [ ] Document the exact steps the runtime will perform.
- [ ] Confirm what is deterministic vs probabilistic.
- [ ] Confirm where fallback or review is triggered.
- [ ] Confirm what the final output of the demo is supposed to represent.

Canonical flow:
- [ ] messy intake text submitted
- [ ] typed extraction attempt
- [ ] deterministic validation against required fields/rules
- [ ] transform into legacy-compatible payload
- [ ] return final normalized result
- [ ] log run, tool activity if any, and evaluation record

Definition of done:
- no ambiguity remains around the exact demo flow

---

## 3. Lock the domain vocabulary for this module

Reference docs:
- `docs/specs/service-legacy-ai-adapter.md`
- `docs/checklists/shared-schemas-tools-evals-checklist.md`

- [ ] Confirm the names of the key objects in this module.
- [ ] Confirm the raw intake type name.
- [ ] Confirm the structured extraction type name.
- [ ] Confirm the validation result type name.
- [ ] Confirm the legacy payload type name.
- [ ] Confirm the final response type name.
- [ ] Confirm the issue/review status vocabulary.

Suggested vocabulary:
- [ ] LegacyAdapterInput
- [ ] LegacyAdapterExtraction
- [ ] LegacyAdapterValidationResult
- [ ] LegacyAdapterPayload
- [ ] LegacyAdapterOutput

Definition of done:
- later UI, API, and evaluation work all use the same vocabulary

---

## 4. Implement shared schemas and types specific to this module

Reference docs:
- `docs/specs/service-legacy-ai-adapter.md`
- `docs/checklists/shared-schemas-tools-evals-checklist.md`

- [ ] Add module-specific types to shared packages where appropriate.
- [ ] Add module-specific runtime schemas to shared packages where appropriate.
- [ ] Avoid local one-off types inside `apps/web` or `apps/api` if they belong in the shared backbone.
- [ ] Define:
  - [ ] input schema
  - [ ] extraction schema
  - [ ] validation schema
  - [ ] legacy payload schema
  - [ ] final output schema

Minimum output fields:
- [ ] normalizedInput
- [ ] legacySubmissionStatus
- [ ] validationIssues
- [ ] suggestedNextStep
- [ ] confidence
- [ ] humanReviewRequired

Definition of done:
- the module contracts are strongly typed and reusable across UI and API layers

---

## 5. Create seeded demo inputs and expected cases

Reference docs:
- `docs/specs/service-legacy-ai-adapter.md`
- `docs/specs/service-web.md`
- `docs/specs/service-api.md`

- [ ] Create a small but strong set of seeded raw-intake examples.
- [ ] Include enough variation to show the adapter is doing real work.
- [ ] Ensure examples are concise and review-friendly.
- [ ] Define at least:
  - [ ] one clean case
  - [ ] one partially messy case
  - [ ] one missing-fields case
  - [ ] one ambiguous case requiring review
- [ ] Add expected outcomes for each case where useful for testing.

Definition of done:
- the demo can be shown with realistic sample inputs immediately

---

## 6. Implement the extraction stage

Reference docs:
- `docs/specs/service-legacy-ai-adapter.md`
- `docs/specs/service-api.md`

- [ ] Build the extraction step in the API/runtime.
- [ ] Decide whether this first pass uses:
  - [ ] deterministic parsing only
  - [ ] model-backed extraction
  - [ ] hybrid extraction
- [ ] Ensure extraction output conforms to the shared schema.
- [ ] Ensure extraction can fail cleanly.
- [ ] Log enough intermediate information for trace visibility.

Important rule:
- the extraction stage must be inspectable
- reviewers should be able to see what was recovered from messy input

Definition of done:
- the runtime can turn raw intake text into a typed extraction object

---

## 7. Implement deterministic validation stage

Reference docs:
- `docs/specs/service-legacy-ai-adapter.md`
- `docs/specs/service-api.md`

- [ ] Build deterministic validation rules for the extracted structure.
- [ ] Mark missing required fields.
- [ ] Mark invalid combinations.
- [ ] Produce a stable validation result object.
- [ ] Determine when validation failure should:
  - [ ] continue with warnings
  - [ ] stop the workflow
  - [ ] trigger review
- [ ] Ensure validation is obvious and reviewable in the UI.

Definition of done:
- the module has a real deterministic control layer, not just extraction and hope

---

## 8. Implement legacy payload transformation

Reference docs:
- `docs/specs/service-legacy-ai-adapter.md`
- `docs/specs/service-api.md`

- [ ] Define the legacy-compatible payload shape.
- [ ] Implement transformation logic from validated extraction to legacy payload.
- [ ] Keep the transformation deterministic.
- [ ] Ensure the payload is visible in the UI.
- [ ] Add stable status mapping for:
  - [ ] accepted
  - [ ] rejected
  - [ ] needs_review

Definition of done:
- the adapter produces a credible legacy-shaped payload from the normalized structure

---

## 9. Implement final module output and next-step logic

Reference docs:
- `docs/specs/service-legacy-ai-adapter.md`
- `docs/specs/service-api.md`

- [ ] Build the final output object returned to the frontend.
- [ ] Ensure it includes:
  - [ ] normalized input
  - [ ] validation issues
  - [ ] transformed payload
  - [ ] status
  - [ ] suggested next step
  - [ ] confidence
  - [ ] human review required flag
- [ ] Keep next-step logic explicit and readable.

Definition of done:
- the final output is useful, typed, and interpretable by a reviewer without extra explanation

---

## 10. Implement API routes for the module

Reference docs:
- `docs/specs/service-api.md`
- `docs/specs/service-legacy-ai-adapter.md`

- [ ] Add route(s) for the Legacy Adapter module to the shared API.
- [ ] Add request validation.
- [ ] Log a `DemoRun`.
- [ ] Log evaluation results.
- [ ] Return stable error shapes.
- [ ] Return stable success envelope shape consistent with the rest of the API.

Suggested endpoints:
- [ ] `POST /demo/legacy-ai-adapter/run`
- [ ] `GET /demo/legacy-ai-adapter/samples`
- [ ] `GET /runs/:id` should already expose run linkage to this workflow

Definition of done:
- the module can be invoked from the frontend through the shared API

---

## 11. Wire run logging, evaluation, and trace capture

Reference docs:
- `docs/architecture/observability-and-dashboards.md`
- `docs/specs/service-eval-console.md`
- `docs/specs/service-api.md`

- [ ] Ensure each execution creates a run record.
- [ ] Ensure evaluation records are written.
- [ ] Ensure validation failures and review triggers are captured in the run/eval data.
- [ ] Ensure enough trace information is captured to render:
  - [ ] extraction stage
  - [ ] validation stage
  - [ ] payload transformation stage
  - [ ] final status
- [ ] Ensure the module’s runs can later be consumed by the Evaluation Console.

Definition of done:
- the demo is not just returning output; it is participating in the broader observability model

---

## 12. Build the project page for the module

Reference docs:
- `docs/specs/service-web.md`
- `docs/specs/service-legacy-ai-adapter.md`
- `docs/copy/08-project-legacy-ai-adapter.md`

- [ ] Implement or refine `/projects/legacy-ai-adapter`.
- [ ] Use the copy pack as the content source.
- [ ] Ensure the page clearly explains:
  - [ ] the problem
  - [ ] why it matters
  - [ ] the workflow
  - [ ] the controls
  - [ ] what this proves
- [ ] Add the workflow diagram or equivalent structural visual.
- [ ] Add CTA into the live demo.

Definition of done:
- the project page stands on its own as a credible portfolio proof piece

---

## 13. Build the demo page UI for the module

Reference docs:
- `docs/specs/service-web.md`
- `docs/specs/service-legacy-ai-adapter.md`
- `docs/copy/12-demo-legacy-ai-adapter.md`

- [ ] Implement or refine `/demo/legacy-ai-adapter`.
- [ ] Build the input panel.
- [ ] Build the extraction/normalized structure panel.
- [ ] Build the validation panel.
- [ ] Build the legacy payload panel.
- [ ] Build the final result panel.
- [ ] Build loading, empty, error, and success states.
- [ ] Keep the layout inspectable and easy to understand.
- [ ] Ensure the page works on desktop, tablet, and mobile.

Definition of done:
- a reviewer can run the demo and understand the workflow visually without explanation from you

---

## 14. Connect frontend to the API

Reference docs:
- `docs/specs/service-web.md`
- `docs/specs/service-api.md`

- [ ] Wire the frontend demo route to the shared API endpoint.
- [ ] Use the explicit API base URL pattern already established in the web app.
- [ ] Load sample cases from the API.
- [ ] Submit real runs to the API.
- [ ] Render the returned structured output.
- [ ] Render validation issues.
- [ ] Render transformed payload.
- [ ] Render status and next-step guidance.

Definition of done:
- the demo is fully connected, not just visually mocked

---

## 15. Add module-specific evaluation and review logic

Reference docs:
- `docs/specs/service-eval-console.md`
- `docs/checklists/shared-schemas-tools-evals-checklist.md`

- [ ] Define what counts as a flagged run for this module.
- [ ] Use shared evaluation helpers where appropriate.
- [ ] At minimum, flag:
  - [ ] missing required fields
  - [ ] invalid schema after extraction
  - [ ] review required
  - [ ] transformation failure
- [ ] Ensure these show up in the module output and in evaluation records.

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
