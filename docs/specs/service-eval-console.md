# Service Spec — Evaluation + Reliability Console

## Purpose
Demonstrate production-minded AI quality control, observability, and iterative safety.

## Orion alignment
Matches the posting's emphasis on evaluation frameworks, observability, latency, cost, hallucination risk, drift, and reliability.

## Problem statement
AI demos are easy to show; trustworthy systems require run history, metrics, failure visibility, and evaluation standards.

## Inputs
Consumes run and eval data from:
- Payment Exception Review Agent
- Intelligent Investing Operations Copilot
- Legacy AI Adapter

## Required views
1. run table
2. run detail
3. pass/fail summary
4. latency chart
5. estimated cost chart
6. fallback rate
7. low-confidence rate
8. prompt version comparison
9. flagged run explorer

## Evaluation dimensions
- schema valid
- confidence threshold pass
- citation presence
- policy pass/fail
- fallback triggered
- escalation triggered
- latency threshold pass/fail
- unsupported claim flag

## Dashboard metrics
- runs by project
- success rate
- escalation rate
- fallback rate
- median latency
- estimated cost total / per project
- latest errors

## Demo UX
- filters by project/status/date
- charts
- flagged runs
- run detail modal/page with traces
- prompt version selector

## Definition of done
- data from other demos appears automatically
- at least 6 meaningful charts/cards
- run detail page helps explain failures, not just success
