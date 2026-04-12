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
  normalizedInput: Record<string, unknown>;
  legacySubmissionStatus: "accepted" | "rejected" | "needs_review";
  validationIssues: string[];
  suggestedNextStep: string;
  confidence: number;
};
```

## Flow
1. accept messy text or semi-structured form
2. extract typed fields
3. run deterministic validation
4. transform into legacy payload
5. submit to mock legacy service
6. return typed, modern response
7. log run and eval

## Demo UX
- messy input area
- extracted fields panel
- validator panel
- transformed legacy payload panel
- legacy response panel
- final human-readable response

## Seed data
- ~15 intake examples
- small legacy schema catalog
- validation rules set

## Definition of done
- before/after contrast is obvious
- deterministic checks are visible
- legacy translation is visible
- failure path is demonstrable
