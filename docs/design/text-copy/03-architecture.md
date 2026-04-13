# Architecture Page Copy

## Page header

**Eyebrow**
Architecture

**Title**
How the system is put together

**Body**
This portfolio is structured like a real product: one web application, one backend runtime, shared packages, separate environments, Terraform-managed infrastructure, and CI/CD from the start.

---

## Section: System shape

**Section title**
System shape

**Body**
The portfolio is one product surface supported by shared runtime layers, not a loose stack of disconnected mini-apps.

**Structure block**
- apps/web
- apps/api
- packages/ui
- packages/schemas
- packages/agents
- packages/tools
- packages/evals
- packages/types
- packages/config

---

## Section: Environment model

**Section title**
Environment model

**Body**
Development and production are separated on purpose. The branch model mirrors the cloud model.

**Mapping**
- dev branch → dev project
- main branch → prod project

**Supporting line**
The repo is public. The workflow still stays disciplined.

---

## Section: Delivery model

**Section title**
Delivery model

**Body**
Infrastructure is codified. Verification is automated. The repo is part of the proof.

**Flow**
```text
Code change
  -> local checks
  -> GitHub Actions
  -> Terraform plan
  -> deploy to dev
  -> milestone merge
  -> deploy to prod
```

---

## Section: Why this matters

**Section title**
Why this matters

**Body**
A portfolio can be decorative, or it can reveal how someone actually works. This one is designed to reveal the operating method.

---

## Section: What to inspect

**Section title**
Where to inspect the build

**List**
- repo structure
- checklists
- technical specs
- Terraform
- workflow files
- demo surfaces
- evaluation surfaces

**CTA**
Inspect the Build
