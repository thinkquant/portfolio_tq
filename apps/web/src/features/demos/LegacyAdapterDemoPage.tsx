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
import { X } from 'lucide-react';
import { startTransition, useEffect, useMemo, useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { shellCopy } from '@/content/sharedCopy';

import { RouteDataStateView } from '../../app/RouteDataStateView';
import {
  describeLegacyAdapterApiError,
  runLegacyAdapter,
} from './legacyAdapterApi';
import type { LegacyAdapterDemoPageData } from './legacyAdapterDemoLoaders';

type LegacyAdapterDemoContent = Extract<
  LegacyAdapterDemoPageData,
  { status: 'success' }
>['data']['content'];

type HowItWorksTabCopy = LegacyAdapterDemoContent['tabs']['howItWorks'];

type WhyTabCopy = LegacyAdapterDemoContent['tabs']['why'];

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
        message="Nothing in this intake needs extra review."
        title="No review flags"
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
            <ProofTag tone="neutral">
              {formatTokenLabel(flag.severity)}
            </ProofTag>
          </div>
          <p className="text-sm leading-6 text-foreground">
            {flag.message ?? 'This flag needs review before submission.'}
          </p>
        </div>
      ))}
    </div>
  );
}

function formatStageName(toolName: string): string {
  switch (toolName) {
    case 'legacy-extraction-stage':
      return 'Parsed intake';
    case 'legacy-validation-stage':
      return 'Checked required fields';
    case 'legacy-payload-transformation-stage':
      return 'Built legacy payload';
    case 'legacy-final-output-stage':
      return 'Prepared final decision';
    default:
      return formatTokenLabel(toolName);
  }
}

function WhyMadeThisTab({ content }: { content: WhyTabCopy }) {
  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.72fr)] lg:gap-8">
      <Card className="grid content-start gap-5 p-6 sm:p-8">
        <SectionHeading eyebrow="Why I made this" title={content.title} />
        <div className="grid gap-4 text-base leading-8 text-muted-foreground">
          {content.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Card>

      <Card className="grid content-start gap-5 p-6 sm:p-8">
        <SectionHeading eyebrow="What this proves" title={content.proofTitle} />
        <div className="grid gap-3">
          {content.proofBullets.map((proof, index) => (
            <article
              className="grid gap-3 rounded-[var(--radius)] border border-border/75 bg-background/60 p-4"
              key={proof}
            >
              <ProofTag tone="accent">
                {String(index + 1).padStart(2, '0')}
              </ProofTag>
              <p className="text-base leading-7 text-foreground">{proof}</p>
            </article>
          ))}
        </div>
      </Card>
    </section>
  );
}

function MermaidDiagram({
  chart,
  variant = 'compact',
}: {
  chart: string[];
  variant?: 'compact' | 'expanded';
}) {
  const [renderedSvg, setRenderedSvg] = useState('');
  const [renderError, setRenderError] = useState<string | null>(null);
  const definition = useMemo(() => chart.join('\n'), [chart]);
  const isExpanded = variant === 'expanded';

  useEffect(() => {
    let isCurrent = true;
    const diagramId = `legacy-adapter-mermaid-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`;

    setRenderedSvg('');
    setRenderError(null);

    void (async () => {
      try {
        const { default: mermaid } = await import('mermaid');

        mermaid.initialize({
          flowchart: {
            curve: 'basis',
            htmlLabels: true,
            nodeSpacing: 28,
            padding: 14,
            rankSpacing: 42,
          },
          securityLevel: 'strict',
          startOnLoad: false,
          theme: 'base',
          themeCSS: `
            .node rect,
            .node polygon {
              filter: drop-shadow(0 10px 22px rgba(0, 0, 0, 0.24));
              rx: 6px;
              ry: 6px;
            }

            .edgeLabel {
              border-radius: 999px;
              padding: 2px 6px;
            }

            .edgeLabel p,
            .label p {
              line-height: 1.35;
            }

            .nodeLabel {
              font-size: 13.5px;
              font-weight: 500;
              line-height: 1.35;
            }
          `,
          themeVariables: {
            background: 'transparent',
            clusterBkg: '#171717',
            clusterBorder: '#404040',
            darkMode: true,
            edgeLabelBackground: '#171717',
            fontSize: '13.5px',
            fontFamily: 'Inter, sans-serif',
            lineColor: '#60a5fa',
            mainBkg: '#262626',
            nodeBorder: '#60a5fa',
            primaryBorderColor: '#60a5fa',
            primaryColor: '#262626',
            primaryTextColor: '#e5e5e5',
            secondaryBorderColor: '#404040',
            secondaryColor: '#171717',
            secondaryTextColor: '#e5e5e5',
            tertiaryBorderColor: '#3b82f6',
            tertiaryColor: '#1e3a8a',
            tertiaryTextColor: '#bfdbfe',
          },
        });

        const { svg } = await mermaid.render(diagramId, definition);

        if (isCurrent) {
          setRenderedSvg(svg);
        }
      } catch (error: unknown) {
        if (isCurrent) {
          setRenderError(
            error instanceof Error
              ? error.message
              : 'The Mermaid diagram could not be rendered.',
          );
        }
      }
    })();

    return () => {
      isCurrent = false;
    };
  }, [definition]);

  if (renderError) {
    return (
      <Callout title="Diagram could not render" tone="warning">
        {renderError}
      </Callout>
    );
  }

  if (!renderedSvg) {
    return (
      <div
        aria-label="Rendering Mermaid diagram"
        className={cx(
          'mx-auto grid w-full place-items-center rounded-[var(--radius)] border border-border/60 bg-background/45',
          isExpanded ? 'min-h-[32rem]' : 'min-h-[22rem] max-w-5xl',
        )}
        role="status"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.11em] text-muted-foreground">
          Rendering workflow diagram
        </p>
      </div>
    );
  }

  return (
    <span
      aria-label="Legacy adapter workflow diagram"
      className={cx(
        'mx-auto grid w-full place-items-center rounded-[calc(var(--radius)*1.2)] border border-border/70 bg-background/55 shadow-inner shadow-black/20 [&_.edgeLabel]:font-mono [&_svg]:mx-auto [&_svg]:h-auto',
        isExpanded
          ? 'h-full min-h-0 overflow-hidden px-2 py-3 sm:px-4 sm:py-4 [&_.edgeLabel]:text-[0.74rem] [&_svg]:max-h-[calc(100svh-8rem)] [&_svg]:max-w-full [&_svg]:min-w-0 [&_svg]:w-full'
          : 'min-h-[28rem] overflow-x-auto px-3 py-4 [scrollbar-width:thin] sm:px-4 sm:py-5 [&_.edgeLabel]:text-[0.66rem] [&_svg]:max-h-[34rem] [&_svg]:max-w-none [&_svg]:min-w-[34rem] xl:[&_svg]:min-w-0 xl:[&_svg]:w-full',
      )}
      dangerouslySetInnerHTML={{ __html: renderedSvg }}
      role="img"
    />
  );
}

function DiagramExpandControl() {
  return (
    <DialogTrigger asChild>
      <button
        className="inline-flex h-5 items-center rounded-[var(--radius)] border border-border bg-muted px-1.5 !text-[0.58rem] font-semibold uppercase leading-none !tracking-[0.04em] text-muted-foreground transition hover:border-primary/60 hover:bg-primary/10 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70"
        type="button"
      >
        Click to expand
      </button>
    </DialogTrigger>
  );
}

function ExpandedDiagramModal({ content }: { content: HowItWorksTabCopy }) {
  return (
    <DialogContent className="h-[calc(100svh-1.5rem)] bg-card/95 p-2 sm:h-[calc(100svh-3rem)] sm:p-3">
      <DialogTitle className="sr-only">Adapter control path</DialogTitle>
      <div className="relative h-full min-h-0 rounded-[calc(var(--radius)*1.35)] bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.035),transparent_42%)] p-2 sm:p-3">
        <MermaidDiagram chart={content.mermaid} variant="expanded" />
        <DialogClose
          aria-label="Close expanded diagram"
          className="absolute right-4 top-4 z-10 inline-flex size-10 items-center justify-center rounded-full border border-border bg-background/85 text-muted-foreground shadow-lg shadow-black/20 transition hover:border-primary/60 hover:bg-background hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70"
          type="button"
        >
          <X aria-hidden="true" className="size-4" />
        </DialogClose>
      </div>
    </DialogContent>
  );
}

function HowItWorksTab({ content }: { content: HowItWorksTabCopy }) {
  return (
    <section className="grid gap-10 lg:gap-12">
      <div className="grid max-w-3xl gap-4">
        <SectionHeading eyebrow="How it works" title={content.flowLead} />
        <p className="text-base leading-8 text-muted-foreground sm:text-[1.03rem]">
          This workflow takes messy intake, recovers the structure the old
          system needs, applies deterministic control, and only then transforms
          the request into a legacy-compatible result.
        </p>
      </div>

      <Dialog>
        <article className="grid overflow-hidden rounded-[calc(var(--radius)*1.6)] border border-border bg-card shadow-2xl shadow-black/20 xl:grid-cols-[minmax(0,0.58fr)_minmax(22rem,0.42fr)]">
          <figure className="grid content-start gap-4 border-b border-border/80 p-4 sm:p-5 lg:p-6 xl:border-b-0 xl:border-r">
            <div className="grid min-h-[3.875rem] grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="grid gap-2">
                <p className={designTokens.label}>Workflow figure</p>
                <h3 className="font-serif text-[1.45rem] font-semibold leading-tight text-foreground">
                  Adapter control path
                </h3>
              </div>
              <div className="justify-self-end pt-0.5">
                <DiagramExpandControl />
              </div>
            </div>

            <div className="relative rounded-[calc(var(--radius)*1.25)] bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.035),transparent_42%)] p-2">
              <MermaidDiagram chart={content.mermaid} />
              <DialogTrigger asChild>
                <button
                  aria-label="Expand workflow diagram"
                  className="absolute inset-2 cursor-zoom-in rounded-[calc(var(--radius)*1.1)] transition hover:bg-primary/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70"
                  type="button"
                />
              </DialogTrigger>
            </div>

            <figcaption className="grid gap-2 rounded-[calc(var(--radius)*1.1)] border border-border/75 bg-background/45 p-3 text-sm leading-6 text-muted-foreground">
              {content.keyDesignChoice.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </figcaption>
          </figure>

          <aside className="grid content-start gap-4 p-4 sm:p-5 lg:p-6">
            <div className="grid min-h-[3.875rem] content-start gap-2">
              <p className={designTokens.label}>Decision logic</p>
              <h3 className="font-serif text-[1.45rem] font-semibold leading-tight text-foreground">
                {content.stepsTitle}
              </h3>
            </div>
            <ol className="grid overflow-hidden rounded-[calc(var(--radius)*1.2)] border border-border/80 bg-background/45">
              {content.steps.map((step, index) => (
                <li
                  className="grid gap-3 border-t border-border/75 p-4 first:border-t-0 sm:grid-cols-[2.75rem_minmax(0,1fr)] sm:gap-4"
                  key={step.title}
                >
                  <span className="flex size-9 items-center justify-center rounded-full border border-primary/45 bg-primary/10 font-mono text-[0.8rem] font-semibold text-primary">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="grid gap-1.5">
                    <h3 className="font-serif text-[1.08rem] font-semibold leading-tight text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </aside>
        </article>

        <ExpandedDiagramModal content={content} />
      </Dialog>
    </section>
  );
}

function ResultPanel({
  content,
  project,
  samples,
}: Extract<LegacyAdapterDemoPageData, { status: 'success' }>['data']) {
  const [selectedSampleId, setSelectedSampleId] = useState(
    samples[0]?.id ?? '',
  );
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
        label: 'Parsed request',
        value: formatJson(response.result.normalizedInput),
      },
      {
        label: 'Fields found',
        value: response.trace.extraction.recoveredFields.join(', ') || 'None',
      },
      {
        label: 'Workflow signals',
        value: response.trace.extraction.workflowHints.join(', ') || 'None',
      },
      {
        label: 'Account IDs found',
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
        label: 'Decision',
        value: formatTokenLabel(response.trace.validation.outcome),
      },
      {
        label: 'Missing information',
        value: response.trace.validation.missingFields.join(', ') || 'None',
      },
      {
        label: 'Issues to resolve',
        value: response.result.validationIssues.join('\n') || 'None',
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
        label: 'Decision summary',
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
          ? 'The result has the fields the UI and API expect.'
          : 'The result is missing fields the API needs.',
        tone: response.evaluation.schemaValid ? 'success' : 'danger',
      },
      {
        label: content.evaluationMetrics[1] ?? 'Validation pass',
        value: formatTokenLabel(response.evaluation.status),
        detail:
          response.trace.validation.outcome === 'trigger_review'
            ? 'The intake needs a person to resolve conflicting details.'
            : response.trace.validation.outcome === 'stop_workflow'
              ? 'The adapter stopped before building a legacy payload.'
              : response.trace.validation.outcome === 'continue_with_warnings'
                ? 'The request can move forward, with warnings shown here.'
                : 'The request passed the required checks.',
        tone: toneForEvaluationStatus(response.evaluation.status),
      },
      {
        label: content.evaluationMetrics[2] ?? 'Fallback triggered',
        value: response.evaluation.fallbackTriggered ? 'Yes' : 'No',
        detail: response.evaluation.fallbackTriggered
          ? 'The case was routed to review instead of being submitted.'
          : 'No manual review route was needed.',
        tone: response.evaluation.fallbackTriggered ? 'warning' : 'neutral',
      },
      {
        label: content.evaluationMetrics[3] ?? 'Latency',
        value:
          response.run.latencyMs !== null &&
          response.run.latencyMs !== undefined
            ? `${response.run.latencyMs} ms`
            : 'Not recorded',
        detail: `${response.toolInvocations.length} checks completed for run ${response.run.id}.`,
        tone: 'neutral',
      },
    ] as const;
  }, [content.evaluationMetrics, response]);

  function loadSample(sample: LegacyAdapterSampleCase | undefined) {
    if (!sample) {
      return;
    }

    startTransition(() => {
      setSelectedSampleId(sample.id);
      setDraft(buildDraft(sample));
      setRunState({ status: 'idle' });
    });
  }

  function handleLoadSample() {
    loadSample(selectedSample);
  }

  async function handleTransform() {
    if (!draft.sourceText.trim()) {
      setRunState({
        status: 'error',
        title: 'Source text is required.',
        message: 'Add the intake note first, then run the adapter.',
      });
      return;
    }

    let payload: LegacyAdapterInput;

    try {
      payload = buildInputPayload(draft);
    } catch (error) {
      setRunState({
        status: 'error',
        title: 'Metadata needs valid JSON.',
        message:
          error instanceof Error
            ? error.message
            : 'Use a JSON object such as {"sourceChannel":"ops_portal"}.',
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
        title: 'The adapter could not finish this run.',
        message: apiError.message,
        detail: apiError.detail,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Tabs className="grid gap-10 lg:gap-12" defaultValue="demo">
      <TabsList className="h-auto w-full justify-start overflow-x-auto rounded-none border-b border-border bg-transparent p-0">
        {[
          { label: 'Try the demo.', value: 'demo' },
          { label: 'Why I made this.', value: 'why' },
          { label: 'How it works.', value: 'how-it-works' },
        ].map((tab) => (
          <TabsTrigger
            className="relative rounded-none px-1 py-3 text-sm after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary sm:px-4"
            key={tab.value}
            value={tab.value}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent className="mt-0 grid gap-10 lg:gap-12" value="demo">
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
          Pick an intake note and run it through the adapter. The page shows the
          cleaned-up request, the safety checks, and the exact legacy payload
          only when the case is safe to submit.
        </Callout>

        <section className="grid gap-6 lg:grid-cols-[minmax(18rem,0.92fr)_minmax(0,1.08fr)] lg:gap-8">
          <Card className="grid gap-5 p-6 sm:p-8">
            <SectionHeading
              eyebrow="Samples"
              lead="Each case is designed to show a different decision: submit, recover from messy text, stop for missing details, or route to review."
              title="Pick an intake scenario"
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
                  onClick={() => loadSample(sample)}
                  type="button"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-serif text-[1.15rem] font-semibold leading-tight">
                      {sample.title}
                    </p>
                    <ProofTag
                      tone={toneForStatus(
                        sample.expectedOutput.legacySubmissionStatus,
                      )}
                    >
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
              lead="Start with the operator note. Edit it if you want to test how the adapter reacts."
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
                      workflowType: event.target.value as
                        | LegacyWorkflowType
                        | '',
                    }))
                  }
                  value={draft.workflowType}
                >
                  <option value="">Unspecified</option>
                  <option value="beneficiary_change">Beneficiary change</option>
                  <option value="distribution_change">
                    Distribution change
                  </option>
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
                {isSubmitting ? 'Running adapter...' : content.primaryAction}
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
              <SectionHeading
                eyebrow="Extraction"
                title={content.extractionTitle}
              />

              {runState.status === 'success' && response ? (
                <div className="grid gap-5">
                  <PreviewFieldList
                    fields={[
                      extractionFields[0] ?? {
                        label: 'Parsed request',
                        value: 'Unavailable',
                      },
                    ]}
                  />
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
                  message="Choose a scenario or edit the intake, then run the adapter to see what it extracts."
                  title={shellCopy.states.noDataTitle}
                />
              )}
            </Card>

            <Card className="grid gap-5 p-6 sm:p-8">
              <SectionHeading
                eyebrow="Validation"
                title="What the checks decided"
              />

              {runState.status === 'success' && response ? (
                <div className="grid gap-4">
                  <div className="flex flex-wrap gap-2">
                    <ProofTag
                      tone={toneForEvaluationStatus(response.evaluation.status)}
                    >
                      {formatTokenLabel(response.evaluation.status)}
                    </ProofTag>
                    <ProofTag
                      tone={
                        response.trace.validation.outcome === 'proceed'
                          ? 'success'
                          : response.trace.validation.outcome ===
                              'continue_with_warnings'
                            ? 'warning'
                            : response.trace.validation.outcome ===
                                'trigger_review'
                              ? 'warning'
                              : 'danger'
                      }
                    >
                      {formatTokenLabel(response.trace.validation.outcome)}
                    </ProofTag>
                    <ProofTag
                      tone={toneForStatus(
                        response.result.legacySubmissionStatus,
                      )}
                    >
                      {formatTokenLabel(response.result.legacySubmissionStatus)}
                    </ProofTag>
                  </div>

                  <PreviewFieldList fields={validationFields} />

                  {evaluationFlags.length > 0 ? (
                    <Callout title="Review flags" tone="warning">
                      {evaluationFlags.length} issue
                      {evaluationFlags.length > 1 ? 's need' : ' needs'}{' '}
                      attention before this request moves forward.
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
                  message="The required-field and conflict checks will appear here after the run."
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
                          label: 'Legacy queue code',
                          value:
                            response.trace.transformation.legacyWorkflowCode ??
                            'Not produced',
                        },
                        {
                          label: 'Handling',
                          value: formatTokenLabel(
                            response.trace.transformation.reviewCode,
                          ),
                        },
                      ]}
                    />
                  </div>
                ) : (
                  <EmptyState
                    message={
                      response.trace.transformation.skipReason ??
                      'Validation stopped the request before a legacy payload was produced.'
                    }
                    title="No legacy payload produced"
                  />
                )
              ) : runState.status === 'loading' ? (
                <div className="h-56 rounded-[var(--radius)] bg-background/65" />
              ) : (
                <EmptyState
                  message="When the request is safe, the legacy payload appears here."
                  title={shellCopy.states.noDataTitle}
                />
              )}
            </Card>

            <div className="grid gap-4">
              <Card className="grid gap-5 p-6 sm:p-8">
                <SectionHeading
                  eyebrow="Final result"
                  title={content.finalResultTitle}
                />

                {runState.status === 'success' && response ? (
                  <div className="grid gap-4">
                    <div className="flex flex-wrap gap-2">
                      <ProofTag
                        tone={toneForStatus(
                          response.result.legacySubmissionStatus,
                        )}
                      >
                        {formatTokenLabel(
                          response.result.legacySubmissionStatus,
                        )}
                      </ProofTag>
                      <ProofTag
                        tone={toneForEvaluationStatus(
                          response.evaluation.status,
                        )}
                      >
                        Checks {formatTokenLabel(response.evaluation.status)}
                      </ProofTag>
                      {response.result.humanReviewRequired ? (
                        <ProofTag tone="warning">Review required</ProofTag>
                      ) : (
                        <ProofTag tone="neutral">No review needed</ProofTag>
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
                    message="The final decision and next step appear here after the run."
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
                        detail="Run an intake to see the decision checks."
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
              lead="If the adapter stops or asks for review, this panel explains why in plain language."
              title={content.evaluationTitle}
            />

            {runState.status === 'success' && response ? (
              <EvaluationFlagList flags={evaluationFlags} />
            ) : (
              <EmptyState
                message="Review flags appear here when the intake needs attention."
                title={shellCopy.states.noDataTitle}
              />
            )}
          </Card>

          <Card className="grid gap-5 p-6 sm:p-8">
            <SectionHeading
              eyebrow="Audit trail"
              lead="A compact proof trail links the visible decision back to the checks that produced it."
              title="Run proof"
            />

            {runState.status === 'success' && response ? (
              <PreviewFieldList
                fields={[
                  {
                    label: 'Run ID',
                    value: response.run.id,
                  },
                  {
                    label: 'Checks completed',
                    value: response.toolInvocations
                      .map((toolInvocation) => toolInvocation.toolName)
                      .map(formatStageName)
                      .join(', '),
                  },
                  {
                    label: 'Payload status',
                    value:
                      response.trace.transformation.skipReason ??
                      'Payload was produced.',
                  },
                  {
                    label: 'Review handoff',
                    value: response.escalation
                      ? `${response.escalation.status} -> ${response.escalation.reason}`
                      : 'No reviewer handoff needed.',
                  },
                ]}
              />
            ) : (
              <EmptyState
                message="Run ID and check details appear here after execution."
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
      </TabsContent>

      <TabsContent className="mt-0 min-h-[18rem]" value="why">
        <WhyMadeThisTab content={content.tabs.why} />
      </TabsContent>
      <TabsContent className="mt-0 min-h-[18rem]" value="how-it-works">
        <HowItWorksTab content={content.tabs.howItWorks} />
      </TabsContent>
    </Tabs>
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
