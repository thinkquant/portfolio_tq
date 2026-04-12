# PRD — `portfolio-tq`

## Product name
`portfolio-tq`

## Product purpose
A public, technical portfolio web app tailored to Orion Digital's AI-Native Full Stack Engineer role. The product must prove the ability to redesign real workflows into AI-native systems, expose implementation quality publicly, and showcase engineering discipline through code, commits, infrastructure, observability, and documentation.

## Primary goals
1. Present a polished public portfolio that works well on desktop, tablet, and mobile.
2. Demonstrate four Orion-aligned portfolio projects with live demos.
3. Show AI systems engineering maturity through structured outputs, tool calling, retrieval, fallback behavior, evaluation, and observability.
4. Show production-minded engineering via IaC, CI/CD, environments, logging, dashboards, and public repository hygiene.
5. Make the codebase itself a portfolio artifact.

## Non-goals
- Real money movement
- Real financial advice
- Real regulated actions
- Full enterprise auth/RBAC
- Production-scale multi-tenancy
- Deep custom ML training pipelines unless clearly necessary

## Target audience
### Primary
- Orion hiring manager
- Orion CTO / engineering leadership
- Recruiters
- Senior engineers reviewing portfolio depth

### Secondary
- Other fintech/AI employers
- Technical peers inspecting repo quality

## Core user journeys
1. Reviewer lands on homepage and immediately understands positioning.
2. Reviewer browses projects and opens a project detail page.
3. Reviewer reads problem framing, architecture, and engineering decisions.
4. Reviewer launches demo and sees a structured workflow with traceability.
5. Reviewer opens dashboards/observability page and sees evaluation maturity.
6. Reviewer checks public repo and sees thoughtful commits, PRs/issues, CI/CD, Terraform, docs, and code comments.

## Product sections
- Home
- About / Background
- Project Index
- Key Project Detail Pages
- Live Demo Pages
- Architecture / Infra pages
- Observability / Dashboards page
- Public repo / workflow page
- Contact / call to action

## Orion alignment
The portfolio must visibly map to:
- replacing manual workflows with agents
- structured-output-first services
- tool-calling architectures
- hybrid deterministic + probabilistic systems
- evaluation frameworks
- observability
- cost-aware execution
- safe operation in regulated-like workflows

## Projects in scope
1. Payment Exception Review Agent
2. Intelligent Investing Operations Copilot
3. Legacy Workflow to AI-Native Service Adapter
4. Evaluation + Reliability Console

## Success criteria
- Public site is live and responsive
- Public repo is organized and documented
- All 4 project pages exist
- At least 3 demos are fully runnable
- Evaluation console consumes data from other demos
- Terraform provisions dev/prod baseline infra
- GitHub Actions CI/CD runs successfully on every PR and main push
- Logs, traces, and dashboards are visible in-app and partially in GCP

## Constraints
- Build speed matters
- Must stay public-safe; no private customer data
- Must avoid overbuilding infrastructure
- Base models are acceptable; proof of systems thinking matters more than exotic modeling
