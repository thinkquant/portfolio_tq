# Service Spec — `apps/api`

## Purpose
Backend execution layer for demos, orchestration, retrieval, evaluation, and logs.

## Responsibilities
- execute AI demo workflows
- wrap Vertex AI calls
- expose mock internal tools
- validate structured outputs
- handle retries/fallbacks/escalations
- persist runs and evaluations
- feed frontend dashboard pages

## Internal modules
- `routes`
- `services/agents`
- `services/tools`
- `services/retrieval`
- `services/evals`
- `services/logs`
- `services/orchestrators`
- `middleware`

## Shared execution flow
1. receive request
2. create run record
3. gather project-specific inputs
4. call orchestrator
5. log tool invocations
6. validate schema
7. apply fallback policy if needed
8. persist output + evaluation
9. return response

## Observability requirements
- request logs
- run lifecycle logs
- tool invocation logs
- model latency + estimated cost
- error logs with project tag
- metrics exportable to dashboards

## Definition of done
- health endpoint
- all demo endpoints working
- structured logs emitted consistently
- run/eval persistence working
- no project bypasses shared wrappers for model calls
