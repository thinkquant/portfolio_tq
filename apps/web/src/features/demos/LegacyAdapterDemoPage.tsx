import {
  Callout,
  Card,
  EmptyState,
  MetricTile,
  PageHeading,
  ProofTag,
  SectionHeading,
  designTokens,
} from '@portfolio-tq/ui';
import type {
  EvaluationFlag,
  JsonObject,
  LegacyAdapterDemoResponseData,
  LegacyAdapterInput,
  LegacyAdapterSampleCase,
  LegacyWorkflowType,
} from '@portfolio-tq/types';
import { startTransition, useMemo, useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';

import { shellCopy } from '@/content/sharedCopy';

import { RouteDataStateView } from '../../app/RouteDataStateView';
import {
  describeLegacyAdapterApiError,
  runLegacyAdapter,
} from './legacyAdapterApi';
import type { LegacyAdapterDemoPageData } from './legacyAdapterDemoLoaders';

type DraftState = {
  metadataText: string;
  sourceText: string;
  workflowType: LegacyWorkflowType | '';
};

type RunState =
  | {
      status: 'idle';
    }
  | {
      status: 'loading';
    }
  | {
      status: 'error';
      detail?: string;
      message: string;
      title: string;
    }
  | {
      status: 'success';
      response: LegacyAdapterDemoResponseData;
    };

const scenarioLabels: Record<LegacyAdapterSampleCase['scenario'], string> = {
  clean: 'Clean path',
  partially_messy: 'Messy but recoverable',
  missing_fields: 'Missing fields',
  ambiguous_review: 'Review required',
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function buildDraft(sample: LegacyAdapterSampleCase): DraftState {
  return {
    metadataText: sample.input.metadata
      ? JSON.stringify(sample.input.metadata, null, 2)
      : '',
    sourceText: sample.input.sourceText,
    workflowType: sample.input.workflowType ?? '',
  };
}

function formatJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function formatTokenLabel(value: string): string {
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return 'Not supplied';
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  return String(value);
}

function parseMetadata(text: string): JsonObject | undefined {
  if (!text.trim()) {
    return undefined;
  }

  const parsed = JSON.parse(text) as unknown;

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Metadata must be a JSON object when provided.');
  }

  return parsed as JsonObject;
}

function buildInputPayload(draft: DraftState): LegacyAdapterInput {
  const payload: LegacyAdapterInput = {
    sourceText: draft.sourceText.trim(),
  };

  const metadata = parseMetadata(draft.metadataText);

  if (metadata) {
    payload.metadata = metadata;
  }

  if (draft.workflowType) {
    payload.workflowType = draft.workflowType;
  }

  return payload;
}

function toneForStatus(
  status:
    | LegacyAdapterSampleCase['expectedOutput']['legacySubmissionStatus']
    | LegacyAdapterDemoResponseData['result']['legacySubmissionStatus'],
) {
  switch (status) {
    case 'accepted':
      return 'success' as const;
    case 'needs_review':
      return 'warning' as const;
    default:
      return 'danger' as const;
  }
}

function toneForEvaluationStatus(
  status: LegacyAdapterDemoResponseData['evaluation']['status'],
) {
  switch (status) {
    case 'passed':
      return 'success' as const;
    case 'failed':
      return 'danger' as const;
    default:
      return 'warning' as const;
  }
}

function toneForFlagSeverity(severity: EvaluationFlag['severity']) {
  switch (severity) {
    case 'critical':
      return 'danger' as const;
    case 'warning':
      return 'warning' as const;
    default:
      return 'neutral' as const;
  }
}

function PreviewFieldList({
  fields,
}: {
  fields: Array<{ label: string; value: string }>;
}) {
  return (
    <dl className="grid gap-3">
      {fields.map((field) => (
        <div
          className="grid gap-1 rounded-[var(--radius)] border border-border/70 bg-background/55 p-4"
          key={field.label}
        >
          <dt className={designTokens.label}>{field.label}</dt>
          <dd className="text-base leading-7 text-foreground whitespace-pre-wrap break-words">
            {field.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function EvaluationFlagList({ flags }: { flags: EvaluationFlag[] }) {
  if (flags.length === 0) {
    return (
      <EmptyState
        message="This run did not emit any module-specific review flags."
        title="No flagged conditions"
      />
    );
  }

  return (
    <div className="grid gap-3">
      {flags.map((flag, index) => (
        <div
          className="grid gap-3 rounded-[var(--radius)] border border-border/75 bg-background/60 p-4"
          key={`${flag.type}-${index}`}
        >
          <div className="flex flex-wrap items-center gap-2">
            <ProofTag tone={toneForFlagSeverity(flag.severity)}>
              {formatTokenLabel(flag.type)}
            </ProofTag>
            <ProofTag tone="neutral">{formatTokenLabel(flag.severity)}</ProofTag>
          </div>
          <p className="text-sm leading-6 text-foreground">
            {flag.message ?? 'No message recorded for this flag.'}
          </p>
        </div>
      ))}
    </div>
  );
}

function ResultPanel({
  content,
  project,
  samples,
}: Extract<LegacyAdapterDemoPageData, { status: 'success' }>['data']) {
  const [selectedSampleId, setSelectedSampleId] = useState(samples[0]?.id ?? '');
  const [draft, setDraft] = useState(() => buildDraft(samples[0]));
  const [runState, setRunState] = useState<RunState>({ status: 'idle' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedSample =
    samples.find((sample) => sample.id === selectedSampleId) ?? samples[0];
  const response = runState.status === 'success' ? runState.response : null;
  const evaluationFlags = response?.evaluation.flags ?? [];

  const extractionFields = useMemo(() => {
    if (!response) {
      return [];
    }

    return [
      {
        label: 'Normalized structure',
        value: formatJson(response.result.normalizedInput),
      },
      {
        label: 'Recovered fields',
        value: response.trace.extraction.recoveredFields.join(', ') || 'None',
      },
      {
        label: 'Workflow hints',
        value: response.trace.extraction.workflowHints.join(', ') || 'None',
      },
      {
        label: 'Account candidates',
        value: response.trace.extraction.accountCandidates.join(', ') || 'None',
      },
    ];
  }, [response]);

  const validationFields = useMemo(() => {
    if (!response) {
      return [];
    }

    return [
      {
        label: 'Validation outcome',
        value: formatTokenLabel(response.trace.validation.outcome),
      },
      {
        label: 'Missing fields',
        value: response.trace.validation.missingFields.join(', ') || 'None',
      },
      {
        label: 'Validation issues',
        value: response.result.validationIssues.join('\n') || 'None',
      },
      {
        label: 'Blocking issue codes',
        value: response.trace.validation.blockingIssueCodes.join(', ') || 'None',
      },
      {
        label: 'Warning issue codes',
        value: response.trace.validation.warningIssueCodes.join(', ') || 'None',
      },
    ];
  }, [response]);

  const finalFields = useMemo(() => {
    if (!response) {
      return [];
    }

    return [
      {
        label: content.finalResultFields[0] ?? 'Submission status',
        value: formatTokenLabel(response.result.legacySubmissionStatus),
      },
      {
        label: content.finalResultFields[1] ?? 'Suggested next step',
        value: response.result.suggestedNextStep,
      },
      {
        label: content.finalResultFields[2] ?? 'Review required',
        value: formatValue(response.result.humanReviewRequired),
      },
      {
        label: 'Run summary',
        value: response.run.summary,
      },
    ];
  }, [content.finalResultFields, response]);

  const evaluationMetrics = useMemo(() => {
    if (!response) {
      return [];
    }

    return [
      {
        label: content.evaluationMetrics[0] ?? 'Schema valid',
        value: response.evaluation.schemaValid ? 'Yes' : 'No',
        detail: response.evaluation.schemaValid
          ? 'The run completed with a structured output that stayed inside the shared runtime contract.'
          : 'The normalized structure remained incompatible with downstream requirements.',
        tone: response.evaluation.schemaValid ? 'success' : 'danger',
      },
      {
        label: content.evaluationMetrics[1] ?? 'Validation pass',
        value: formatTokenLabel(response.evaluation.status),
        detail:
          response.trace.validation.outcome === 'trigger_review'
            ? 'The validator routed the run to reviewer follow-up.'
            : response.trace.validation.outcome === 'stop_workflow'
              ? 'Deterministic checks blocked transformation before a legacy payload was produced.'
              : response.trace.validation.outcome === 'continue_with_warnings'
                ? 'The run remained transformable, but reviewer-visible warnings were recorded.'
                : 'The run passed the deterministic control layer cleanly.',
        tone: toneForEvaluationStatus(response.evaluation.status),
      },
      {
        label: content.evaluationMetrics[2] ?? 'Fallback triggered',
        value: response.evaluation.fallbackTriggered ? 'Yes' : 'No',
        detail: response.evaluation.fallbackTriggered
          ? 'Fallback or reviewer routing was triggered and persisted with the run.'
          : 'The run stayed on the direct transformation path.',
        tone: response.evaluation.fallbackTriggered ? 'warning' : 'neutral',
      },
      {
        label: content.evaluationMetrics[3] ?? 'Latency',
        value:
          response.run.latencyMs !== null && response.run.latencyMs !== undefined
            ? `${response.run.latencyMs} ms`
            : 'Not recorded',
        detail: `Run ID ${response.run.id} with ${response.toolInvocations.length} persisted stage traces.`,
        tone: 'neutral',
      },
    ] as const;
  }, [content.evaluationMetrics, response]);

  function handleLoadSample() {
    if (!selectedSample) {
      return;
    }

    startTransition(() => {
      setDraft(buildDraft(selectedSample));
      setRunState({ status: 'idle' });
    });
  }

  async function handleTransform() {
    if (!draft.sourceText.trim()) {
      setRunState({
        status: 'error',
        title: 'Source text is required.',
        message:
          'Provide raw intake text before the live adapter run can be submitted.',
      });
      return;
    }

    let payload: LegacyAdapterInput;

    try {
      payload = buildInputPayload(draft);
    } catch (error) {
      setRunState({
        status: 'error',
        title: 'Metadata needs a valid request shape.',
        message:
          error instanceof Error
            ? error.message
            : 'Metadata must be valid JSON before the live run can continue.',
      });
      return;
    }

    setIsSubmitting(true);
    setRunState({ status: 'loading' });

    try {
      const liveResponse = await runLegacyAdapter(payload);

      startTransition(() => {
        setRunState({
          status: 'success',
          response: liveResponse,
        });
      });
    } catch (error) {
      const apiError = describeLegacyAdapterApiError(error);

      setRunState({
        status: 'error',
        title: 'The live adapter run did not complete.',
        message: apiError.message,
        detail: apiError.detail,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-10 lg:gap-12">
      <PageHeading
        actions={
          <>
            {project.filterTags.map((tag) => (
              <ProofTag key={tag}>{tag}</ProofTag>
            ))}
            <ProofTag tone="accent">Live shared API</ProofTag>
          </>
        }
        eyebrow="Demo"
        lead={content.subhead}
        title={content.title}
      />

      <Callout title="Live execution" tone="accent">
        This page now loads seeded cases from the shared API and submits real
        legacy adapter runs. Each run returns typed output, evaluation state,
        and persisted stage trace data for reviewer inspection.
      </Callout>

      <section className="grid gap-6 lg:grid-cols-[minmax(18rem,0.92fr)_minmax(0,1.08fr)] lg:gap-8">
        <Card className="grid gap-5 p-6 sm:p-8">
          <SectionHeading
            eyebrow="Samples"
            lead="Choose a seeded intake to inspect a clean path, a messy-but-safe path, a rejection path, or a review-required path."
            title="API-backed sample cases"
          />
          <div className="grid gap-3">
            {samples.map((sample) => (
              <button
                className={cx(
                  'grid gap-2 rounded-[var(--radius)] border p-4 text-left transition',
                  sample.id === selectedSampleId
                    ? 'border-primary bg-accent/70 text-foreground'
                    : 'border-border/80 bg-background/55 text-foreground hover:border-primary/40 hover:bg-accent/35',
                )}
                key={sample.id}
                onClick={() => setSelectedSampleId(sample.id)}
                type="button"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-serif text-[1.15rem] font-semibold leading-tight">
                    {sample.title}
                  </p>
                  <ProofTag tone={toneForStatus(sample.expectedOutput.legacySubmissionStatus)}>
                    {scenarioLabels[sample.scenario]}
                  </ProofTag>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {sample.summary}
                </p>
              </button>
            ))}
          </div>
        </Card>

        <Card className="grid gap-5 p-6 sm:p-8">
          <SectionHeading
            eyebrow="Input"
            lead="The raw intake stays editable so the reviewer can see what the adapter is working from before anything is transformed."
            title={content.inputTitle}
          />

          <label className="grid gap-2 text-sm font-semibold text-foreground">
            {content.inputFields[0]}
            <textarea
              className="min-h-44 rounded-[var(--radius)] border border-border/80 bg-background px-4 py-3 text-sm leading-6 text-foreground"
              id="legacy-adapter-source-text"
              name="legacy-adapter-source-text"
              onChange={(event) =>
                setDraft((currentDraft) => ({
                  ...currentDraft,
                  sourceText: event.target.value,
                }))
              }
              value={draft.sourceText}
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-foreground">
              {content.inputFields[1]}
              <textarea
                className="min-h-32 rounded-[var(--radius)] border border-border/80 bg-background px-4 py-3 text-sm leading-6 text-foreground"
                id="legacy-adapter-metadata"
                name="legacy-adapter-metadata"
                onChange={(event) =>
                  setDraft((currentDraft) => ({
                    ...currentDraft,
                    metadataText: event.target.value,
                  }))
                }
                placeholder='{"sourceChannel":"ops_portal"}'
                value={draft.metadataText}
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-foreground">
              {content.inputFields[2]}
              <select
                className="min-h-11 rounded-[var(--radius)] border border-border/80 bg-background px-4 py-2 text-sm text-foreground"
                id="legacy-adapter-workflow-type"
                name="legacy-adapter-workflow-type"
                onChange={(event) =>
                  setDraft((currentDraft) => ({
                    ...currentDraft,
                    workflowType: event.target.value as LegacyWorkflowType | '',
                  }))
                }
                value={draft.workflowType}
              >
                <option value="">Unspecified</option>
                <option value="beneficiary_change">Beneficiary change</option>
                <option value="distribution_change">Distribution change</option>
                <option value="document_reissue">Document reissue</option>
                <option value="profile_update">Profile update</option>
              </select>
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              className={designTokens.buttonPrimary}
              disabled={isSubmitting}
              onClick={() => {
                void handleTransform();
              }}
              type="button"
            >
              {isSubmitting ? 'Submitting live run...' : content.primaryAction}
            </button>
            <button
              className={designTokens.buttonSecondary}
              onClick={handleLoadSample}
              type="button"
            >
              {content.secondaryAction}
            </button>
          </div>
        </Card>
      </section>

      <section className="grid gap-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <Card className="grid gap-5 p-6 sm:p-8">
            <SectionHeading eyebrow="Extraction" title={content.extractionTitle} />

            {runState.status === 'success' && response ? (
              <div className="grid gap-5">
                <PreviewFieldList fields={[extractionFields[0] ?? { label: 'Normalized structure', value: 'Unavailable' }]} />
                <PreviewFieldList fields={extractionFields.slice(1)} />
              </div>
            ) : runState.status === 'loading' ? (
              <div className="grid gap-3" role="status">
                <div className="h-3 rounded-[var(--radius)] bg-border/80" />
                <div className="h-24 rounded-[var(--radius)] bg-background/65" />
                <div className="h-20 rounded-[var(--radius)] bg-background/65" />
              </div>
            ) : runState.status === 'error' ? (
              <Callout title={runState.title} tone="danger">
                <p>{runState.message}</p>
                {runState.detail ? <p>{runState.detail}</p> : null}
              </Callout>
            ) : (
              <EmptyState
                message="Load a seeded case or enter your own intake, then submit the live run to inspect the recovered structure."
                title={shellCopy.states.noDataTitle}
              />
            )}
          </Card>

          <Card className="grid gap-5 p-6 sm:p-8">
            <SectionHeading eyebrow="Validation" title="Deterministic control layer" />

            {runState.status === 'success' && response ? (
              <div className="grid gap-4">
                <div className="flex flex-wrap gap-2">
                  <ProofTag tone={toneForEvaluationStatus(response.evaluation.status)}>
                    {formatTokenLabel(response.evaluation.status)}
                  </ProofTag>
                  <ProofTag
                    tone={
                      response.trace.validation.outcome === 'proceed'
                        ? 'success'
                        : response.trace.validation.outcome === 'continue_with_warnings'
                          ? 'warning'
                          : response.trace.validation.outcome === 'trigger_review'
                            ? 'warning'
                            : 'danger'
                    }
                  >
                    {formatTokenLabel(response.trace.validation.outcome)}
                  </ProofTag>
                  <ProofTag tone={toneForStatus(response.result.legacySubmissionStatus)}>
                    {formatTokenLabel(response.result.legacySubmissionStatus)}
                  </ProofTag>
                </div>

                <PreviewFieldList fields={validationFields} />

                {evaluationFlags.length > 0 ? (
                  <Callout title="Flagged run conditions" tone="warning">
                    {evaluationFlags.length} persisted evaluation flag
                    {evaluationFlags.length > 1 ? 's were' : ' was'} recorded for
                    this run.
                  </Callout>
                ) : null}
              </div>
            ) : runState.status === 'loading' ? (
              <div className="grid gap-3" role="status">
                <div className="h-3 w-32 rounded-[var(--radius)] bg-border/80" />
                <div className="h-20 rounded-[var(--radius)] bg-background/65" />
                <div className="h-20 rounded-[var(--radius)] bg-background/65" />
              </div>
            ) : (
              <EmptyState
                message="Validation findings will appear here after the live run completes."
                title={shellCopy.states.noDataTitle}
              />
            )}
          </Card>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Card className="grid gap-5 p-6 sm:p-8">
            <SectionHeading
              eyebrow="Payload"
              lead={content.legacyPayloadBody}
              title={content.legacyPayloadTitle}
            />

            {runState.status === 'success' && response ? (
              response.result.legacyPayload ? (
                <div className="grid gap-4">
                  <pre className="overflow-x-auto rounded-[var(--radius)] border border-border/75 bg-background/70 p-4 text-sm leading-6 text-foreground">
                    <code>{formatJson(response.result.legacyPayload)}</code>
                  </pre>
                  <PreviewFieldList
                    fields={[
                      {
                        label: 'Transformation status',
                        value: response.trace.transformation.transformSkipped
                          ? 'Skipped'
                          : 'Produced',
                      },
                      {
                        label: 'Legacy workflow code',
                        value:
                          response.trace.transformation.legacyWorkflowCode ??
                          'Not produced',
                      },
                      {
                        label: 'Review code',
                        value: formatTokenLabel(response.trace.transformation.reviewCode),
                      },
                    ]}
                  />
                </div>
              ) : (
                <EmptyState
                  message={
                    response.trace.transformation.skipReason ??
                    'Validation blocked downstream submission, so no legacy payload was produced.'
                  }
                  title="No legacy payload produced"
                />
              )
            ) : runState.status === 'loading' ? (
              <div className="h-56 rounded-[var(--radius)] bg-background/65" />
            ) : (
              <EmptyState
                message="The transformed legacy shape will render here after a live run."
                title={shellCopy.states.noDataTitle}
              />
            )}
          </Card>

          <div className="grid gap-4">
            <Card className="grid gap-5 p-6 sm:p-8">
              <SectionHeading eyebrow="Final result" title={content.finalResultTitle} />

              {runState.status === 'success' && response ? (
                <div className="grid gap-4">
                  <div className="flex flex-wrap gap-2">
                    <ProofTag tone={toneForStatus(response.result.legacySubmissionStatus)}>
                      {formatTokenLabel(response.result.legacySubmissionStatus)}
                    </ProofTag>
                    <ProofTag tone={toneForEvaluationStatus(response.evaluation.status)}>
                      Evaluation {formatTokenLabel(response.evaluation.status)}
                    </ProofTag>
                    {response.result.humanReviewRequired ? (
                      <ProofTag tone="warning">Review required</ProofTag>
                    ) : (
                      <ProofTag tone="neutral">Direct path</ProofTag>
                    )}
                  </div>

                  <PreviewFieldList fields={finalFields} />
                </div>
              ) : runState.status === 'loading' ? (
                <div className="grid gap-3">
                  <div className="h-3 w-28 rounded-[var(--radius)] bg-border/80" />
                  <div className="h-20 rounded-[var(--radius)] bg-background/65" />
                </div>
              ) : (
                <EmptyState
                  message="The reviewer-facing result will appear here after a live run."
                  title={shellCopy.states.noDataTitle}
                />
              )}
            </Card>

            <section className="grid gap-4 sm:grid-cols-2">
              {evaluationMetrics.length > 0
                ? evaluationMetrics.map((metric) => (
                    <MetricTile
                      className="min-h-[12rem]"
                      detail={metric.detail}
                      key={metric.label}
                      label={metric.label}
                      tone={metric.tone}
                      value={metric.value}
                    />
                  ))
                : content.evaluationMetrics.map((metric) => (
                    <MetricTile
                      className="min-h-[12rem]"
                      detail="Submit a live run to surface the reviewer-visible evaluation signals."
                      key={metric}
                      label={metric}
                      tone="neutral"
                      value="Pending"
                    />
                  ))}
            </section>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
        <Card className="grid gap-5 p-6 sm:p-8">
          <SectionHeading
            eyebrow="Evaluation flags"
            lead="Module-specific review logic now lands in the same shared evaluation vocabulary used by the wider platform."
            title={content.evaluationTitle}
          />

          {runState.status === 'success' && response ? (
            <EvaluationFlagList flags={evaluationFlags} />
          ) : (
            <EmptyState
              message="Evaluation flags will appear here after the live run is recorded."
              title={shellCopy.states.noDataTitle}
            />
          )}
        </Card>

        <Card className="grid gap-5 p-6 sm:p-8">
          <SectionHeading
            eyebrow="Trace"
            lead="Each live run returns enough execution detail to connect the UI view back to the persisted observability model."
            title="Run trace summary"
          />

          {runState.status === 'success' && response ? (
            <PreviewFieldList
              fields={[
                {
                  label: 'Run ID',
                  value: response.run.id,
                },
                {
                  label: 'Tool stages recorded',
                  value: response.toolInvocations
                    .map((toolInvocation) => toolInvocation.toolName)
                    .join(', '),
                },
                {
                  label: 'Transformation skip reason',
                  value:
                    response.trace.transformation.skipReason ?? 'No skip recorded',
                },
                {
                  label: 'Escalation',
                  value: response.escalation
                    ? `${response.escalation.status} -> ${response.escalation.reason}`
                    : 'No escalation record created',
                },
              ]}
            />
          ) : (
            <EmptyState
              message="Run linkage, stage traces, and escalation details will appear here after execution."
              title={shellCopy.states.noDataTitle}
            />
          )}
        </Card>
      </section>

      <section className="flex flex-wrap gap-3 border-t border-border/80 pt-6">
        <Link className={designTokens.buttonSecondary} to="/demo">
          Back to Demos
        </Link>
        <Link className={designTokens.buttonPrimary} to={project.href}>
          Open Project Page
        </Link>
      </section>
    </div>
  );
}

export function LegacyAdapterDemoPage() {
  const state = useLoaderData() as LegacyAdapterDemoPageData;

  return (
    <RouteDataStateView state={state}>
      {(data) => <ResultPanel {...data} />}
    </RouteDataStateView>
  );
}
