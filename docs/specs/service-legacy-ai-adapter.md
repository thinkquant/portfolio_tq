# Service Spec — Legacy Workflow to AI-Native Service Adapter

## Purpose
Demonstrate migration thinking: wrapping a rigid deterministic workflow with an AI-native, structured-output-first interface.

## Orion alignment
Directly mirrors the posting's emphasis on legacy system redesign and hybrid deterministic/probabilistic architectures.

## Problem statement
Legacy services require strict inputs and expose awkward statuses. Humans currently normalize messy real inputs manually.

## User story
As an internal operator, I want to submit messy input and receive a validated, normalized, legacy-compatible submission plus a clear status so I can work faster without breaking the old system.

## Components
### Mock legacy service
- strict payload schema
- limited status codes
- rigid validation
- intentionally awkward UX contract

### AI-native adapter
- intake parser
- schema extractor
- deterministic validator
- payload transformer
- user-friendly result formatter

## Output schema
```ts
type LegacyAdapterOutput = {
  normalizedInput: LegacyAdapterExtraction;
  legacyPayload: LegacyAdapterPayload | null;
  legacySubmissionStatus: "accepted" | "rejected" | "needs_review";
  validationIssues: string[];
  suggestedNextStep: string;
  confidence: number;
  humanReviewRequired: boolean;
};
```

The live demo response also returns:
- persisted run metadata
- evaluation record data
- stage trace data for extraction, validation, transformation, and final status
- optional escalation data when review is required

## Flow
1. accept messy text or semi-structured form
2. extract typed fields
3. run deterministic validation
4. transform into legacy payload
5. map deterministic status to accepted, rejected, or needs_review
6. return typed, modern response plus reviewer-visible trace/evaluation data
7. persist run, eval, tool trace, and escalation data through the shared runtime

## Demo UX
- messy input area
- extracted fields panel
- validator panel
- transformed legacy payload panel
- final human-readable response
- evaluation flags / metrics panel
- trace summary panel

## Seed data
- a compact seeded case set covering:
  - one clean path
  - one messy-but-recoverable path
  - one missing-fields rejection path
  - one ambiguous review-required path
- deterministic validation rules for required-field and conflict handling

## Definition of done
- before/after contrast is obvious
- deterministic checks are visible
- legacy translation is visible
- failure path is demonstrable
- review and flagged-run paths are visible
