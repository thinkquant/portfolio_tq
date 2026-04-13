# Demo Page Copy — Payment Exception Review Agent

## Page header

**Title**
Payment Exception Review Agent

**Subhead**
Run a case. Inspect the trace. See where the workflow completes and where it escalates.

---

## Input panel

**Section title**
Case intake

**Field labels**
- Case type
- Transaction ID
- Amount
- Merchant
- Support note
- Analyst note

**Primary button**
Run Review

**Secondary button**
Load Sample Case

---

## Output panel

**Section title**
Structured decision

**Field labels**
- Exception type
- Recommended action
- Confidence
- Human review required
- Compliance flags
- Rationale

---

## Trace panel

**Section title**
Run trace

**Empty state**
No run yet.

**Trace labels**
- Extraction
- Tool lookup
- Decision build
- Confidence check
- Final status

---

## Evaluation panel

**Section title**
Run evaluation

**Metrics**
- Schema valid
- Confidence threshold
- Fallback triggered
- Latency
- Estimated cost

---

## Escalation state

**Title**
Escalated for review

**Body**
The workflow stopped where confidence stopped.

---

## Success state

**Title**
Completed

**Body**
The case was resolved within the defined control boundary.
