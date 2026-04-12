# Service Spec — `apps/web`

## Purpose
The primary public interface for the portfolio.

## Responsibilities
- render portfolio content
- render project detail pages
- render demos and dashboards
- expose architecture, infra, and workflow pages
- provide smooth navigation across all projects

## Core routes
- `/`
- `/about`
- `/projects`
- `/projects/payment-exception-review`
- `/projects/investing-ops-copilot`
- `/projects/legacy-ai-adapter`
- `/projects/eval-console`
- `/architecture`
- `/observability`
- `/repo-workflow`
- `/demo/payment-exception-review`
- `/demo/investing-ops-copilot`
- `/demo/legacy-ai-adapter`
- `/demo/eval-console`

## Key pages
### Home
Must communicate:
- who you are
- what the portfolio is for
- why these projects exist
- quick links to flagship demos and repo

### Project detail pages
Must include:
- problem
- why it matters for Orion
- architecture
- workflow
- stack
- observability/eval considerations
- demo launcher

### Observability page
Must show:
- aggregate run counts
- pass/fail by project
- latency charts
- fallback rate
- confidence distribution
- latest flagged runs

### Repo workflow page
Must show:
- monorepo structure
- CI/CD pipeline summary
- Terraform overview
- branch strategy
- public workflow rationale

## UI components
- `ProjectCard`
- `ArchitecturePanel`
- `DemoLauncher`
- `TraceTimeline`
- `ToolInvocationTable`
- `SchemaOutputCard`
- `MetricCard`
- `ChartPanel`
- `EvalStatusBadge`
- `AlertBanner`

## State management
Keep simple:
- React Query or equivalent for server state
- local component state for UI interactions
- minimal global state

## Definition of done
- all primary routes implemented
- responsive across desktop/tablet/mobile
- lighthouse-style basic quality acceptable
- project pages feel coherent, not template-bare
- no broken empty states
