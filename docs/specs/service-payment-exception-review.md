# Service Spec — Payment Exception Review Agent

## Purpose
Demonstrate replacement of a manual payments review workflow with a structured, safe, explainable AI agent.

## Orion alignment
Best-fit for Orion's payments infrastructure business and posting emphasis on manual workflow replacement, structured outputs, tool calling, fallback behavior, and regulated-like safety.

## Problem statement
Ops teams often review payment exception cases manually using mixed structured case metadata and unstructured notes. The workflow is slow, inconsistent, and hard to audit.

## User story
As an operations reviewer, I want the system to classify a payment exception, gather relevant case context, recommend next action, and escalate uncertain cases so I can reduce manual effort without losing control.

## Inputs
### Structured
- transaction ID
- amount
- merchant
- timestamps
- settlement status
- dispute status
- exception code

### Unstructured
- customer email
- analyst note
- processor note
- support transcript snippet

## Tools
- `lookupTransactionDetails`
- `lookupCustomerProfile`
- `lookupPriorDisputes`
- `searchPaymentPolicy`
- `createEscalation`

## Output schema
```ts
type PaymentReviewOutput = {
  caseSummary: string;
  exceptionType:
    | "settlement_mismatch"
    | "duplicate_charge"
    | "refund_delay"
    | "authorization_dispute"
    | "unknown";
  recommendedAction:
    | "approve_adjustment"
    | "request_more_info"
    | "escalate_to_human"
    | "close_case_no_action";
  rationale: string[];
  confidence: number;
  complianceFlags: string[];
  humanReviewRequired: boolean;
};
```

## Orchestration
1. normalize intake
2. model extracts candidate structured facts
3. tool calls gather context
4. model composes structured decision
5. schema validation
6. fallback/escalation checks
7. persist trace/eval

## Fallback policy
- parse failure -> retry once
- low confidence -> escalate
- policy conflict -> escalate
- missing fields -> request more info

## Demo UX
- case selector
- free-text note area
- execute button
- structured result card
- confidence + escalation indicator
- tool trace
- evaluation result

## Seed data
- ~20 cases
- 4-5 exception categories
- small synthetic policy corpus

## Definition of done
- mixed structured/unstructured input works
- trace shows tool calls
- low-confidence path demonstrable
- output schema visible
- run appears in eval console
