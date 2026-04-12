# thinkquant

A public, working portfolio and proof-of-work repository by **Daniel J.G. Oosthuyzen**.

This project is being built as a real product, not a static résumé site.

It serves two purposes at once:

1. **A live personal portfolio** that presents my work, thinking, systems, and shipped demos in a structured, explorable format.
2. **A public engineering artifact** that exposes how I design, plan, version, document, and build software in the open.

The portfolio is being developed as a serious web application with shared infrastructure, typed interfaces, documented specs, environment separation, Terraform-managed deployment, and CI/CD from the start. The repo itself is part of the portfolio.

---

## Why I built this

Most portfolios present a list of projects.

This one is meant to show something deeper:

- how I frame ambiguous problems
- how I turn disorder into structure
- how I design systems, products, and pipelines
- how I think across software, AI, analytics, finance, and execution
- how I manage real build work in a disciplined way

The governing idea behind the portfolio is simple:

> **Capture ambiguity. Process chaos. Produce ordered action.**

That doctrine reflects how I work across domains, whether the output is:
- an AI-native workflow
- a backend system
- a quantitative pipeline
- a dashboard
- a strategic paper
- a product interface
- or a decision framework

This portfolio is designed to make that operating style visible.

---

## What this portfolio contains

This repository powers a responsive web application that showcases:

- flagship portfolio projects
- live interactive demos
- AI-agent and workflow prototypes
- systems architecture case studies
- quantitative and analytical work
- internal-style observability and evaluation dashboards
- selected writings and strategic thinking
- background, philosophy, and capability material

This build is tailored toward roles involving:
- AI-native systems
- workflow redesign
- backend and full-stack engineering
- orchestration and reliability
- structured reasoning
- fintech, analytics, and operational software

---

## Featured project modules

The first major portfolio modules are built around practical AI-native transformation problems inside regulated or operationally sensitive environments.

### 1. Payment Exception Review Agent
A structured, confidence-aware review workflow for payment exception cases, combining unstructured inputs, typed outputs, tool calls, fallback logic, and escalation paths.

### 2. Intelligent Investing Operations Copilot
An internal operations copilot for wealth/investing workflows, designed to retrieve relevant policy and account context, produce grounded responses, and support safe next actions.

### 3. Legacy Workflow → AI-Native Service Adapter
A demonstration of how rigid deterministic systems can be wrapped and upgraded into structured AI-native workflows without discarding safe control logic.

### 4. Evaluation & Reliability Console
A monitoring and evaluation layer for AI workflows, exposing latency, cost, schema validity, fallbacks, confidence thresholds, and prompt/version comparisons.

These are not intended as generic demos. They are designed as portfolio proof pieces that demonstrate architecture, judgment, execution discipline, and real-world workflow redesign.

---

## Repository philosophy

This repo is public on purpose.

I want the application **and** the build process to be visible.

That means this repository is meant to show:

- project structure
- architectural thinking
- commit discipline
- documentation quality
- checklist-driven execution
- infrastructure setup
- CI/CD patterns
- branch strategy
- implementation progress over time

The repo is not just a code dump. It is part of the proof.

---

## Branch strategy and environments

This project uses separate long-lived branches and environments:

- **`main`** → stable / presentable branch
- **`dev`** → active development and integration branch

That branch model maps to separate cloud environments:

- **development**
- **production**

Infrastructure is managed with Terraform, and the repo is structured so that environment separation can be verified directly in the infrastructure configuration.

The intention is simple:

- build quickly on `dev`
- use short-lived feature branches off `dev` when a change is large or risky
- keep `main` clean and milestone-based
- maintain real environment discipline from the beginning
- make the repo readable to technical reviewers

## Commit convention

Commits should stay small, readable, and scoped to one meaningful change.

The working convention is:

- `chore:` for tooling, scaffolding, and maintenance
- `feat:` for new user-facing or system behavior
- `fix:` for bug fixes and regressions
- `infra:` for Terraform, cloud, and CI/CD changes
- `docs:` for documentation-only updates

---

## Infrastructure and deployment approach

The portfolio is being built with a proper delivery mindset from day one.

Planned/active characteristics include:

- monorepo structure
- typed frontend and backend
- shared packages for schemas, agents, tools, and evaluation logic
- Terraform-managed infrastructure
- separate dev/prod environments
- CI/CD automation
- Firebase/GCP-hosted deployment
- API-backed demos
- observability and evaluation surfaces inside the portfolio itself

This is deliberate. Even though the product is a portfolio, it is also meant to reflect how I would approach a real system build.

---

## Monorepo structure

```txt
portfolio_tq/
  apps/
    web/        # portfolio frontend
    api/        # backend/demo orchestration service
  packages/
    ui/         # shared UI components
    schemas/    # shared validation and data contracts
    agents/     # model wrappers and orchestration logic
    tools/      # internal mock tools and adapters
    evals/      # evaluation helpers and scoring logic
    types/      # shared types
    config/     # prompts, thresholds, environment config
  docs/
    specs/
    architecture/
    checklists/
  data/
    seed/
```

The core idea is one main portfolio application backed by shared services and reusable packages, rather than a scattered collection of disconnected mini-projects.

---

## How to read this repository

If you are reviewing this repo as an employer, collaborator, or technical peer, the most useful places to start are:

- `README.md` — project overview and intent
- `docs/specs/` — product and service specifications
- `docs/architecture/` — repo, infrastructure, and systems design
- `docs/checklists/` — execution tracking, build order, definition of done
- `apps/web/` — portfolio frontend
- `apps/api/` — backend and demo orchestration
- `packages/` — reusable shared logic

This repo is being built so that the reasoning, not just the result, can be examined.

---

## About me

I work at the intersection of:

- first-principles thinking
- systems architecture
- products and pipelines
- quantitative reasoning
- AI-assisted execution
- strategic framing
- practical software delivery

My path is non-traditional, but my work is grounded in applied system-building, technical ownership, and a strong bias toward turning messy realities into usable structure.

Across my work, I tend to be strongest where:
- ambiguity is high
- requirements are incomplete
- systems need to be designed, not merely implemented
- architecture and operations matter
- fast execution still requires discipline
- the output must become useful in the real world

That is what this portfolio is meant to make visible.

---

## Current status

This repository is under active development.

Early commits may include:
- skeleton structure
- technical specs
- infrastructure scaffolding
- checklist-driven setup
- placeholder project modules
- progressive implementation of live demos

That is intentional.

I would rather show a real build unfolding in the open than present a polished but untraceable result.

---

## Long-term direction

The current version is being built with a strong emphasis on:
- AI-native workflow redesign
- systems thinking
- fintech / operations relevance
- structured demos and evaluation

In the future, this portfolio may broaden to present additional work across:
- analytics
- decision systems
- automation
- quantitative finance
- product design
- architecture commentary
- strategic writing

The core discipline will stay the same even as the displayed work expands.

---

## Contact

**Daniel J.G. Oosthuyzen**  
thinkquant  
[thinkquant.co](https://thinkquant.co)

For now, the best way to understand what I build is to explore the repo, the specs, and the portfolio as it takes shape.
