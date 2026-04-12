# Service Spec — Intelligent Investing Operations Copilot

## Purpose
Demonstrate AI-native support for wealth/investing operations inside a regulated-like environment.

## Orion alignment
Matches Orion's intelligent investing business and the role's emphasis on embedding intelligence into real systems without unsafe autonomy.

## Problem statement
Internal ops/support teams answer repeated account-state and workflow questions using scattered internal records and policy docs.

## User story
As an investing operations user, I want fast, policy-aware summaries and next-step suggestions tied to account context so I can handle operational work faster and more consistently.

## Inputs
- account profile
- onboarding checklist status
- suitability flags
- account event timeline
- internal notes
- policy docs

## Tools
- `lookupAccountProfile`
- `lookupSuitabilityFlags`
- `lookupOnboardingChecklist`
- `lookupAccountTimeline`
- `searchPolicyDocuments`

## Output schema
```ts
type InvestingOpsOutput = {
  accountSummary: string;
  issueCategory:
    | "missing_documents"
    | "suitability_review"
    | "allocation_question"
    | "pending_verification"
    | "general_ops";
  recommendedNextActions: string[];
  citedSources: string[];
  confidence: number;
  humanReviewRequired: boolean;
  internalCaseNote: string;
};
```

## Safety rules
- no live trading or investment advice
- no autonomous restricted action
- cite internal sources
- escalate ambiguous policy cases

## Retrieval pattern
Simple RAG over small policy corpus + tool calling for live account context.

## Demo UX
- choose account
- ask ops question
- see account snapshot
- see answer with citations
- retrieval trace
- tool trace
- confidence and escalation status

## Seed data
- ~10 accounts
- ~10-15 policy docs
- ~5 common ops question types

## Definition of done
- answer includes cited sources
- tool + retrieval traces visible
- policy-sensitive case can escalate
- run appears in eval console
