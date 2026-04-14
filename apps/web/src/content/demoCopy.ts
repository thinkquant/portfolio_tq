/**
 * Demo-route and eval-console copy.
 */

import demoEvalConsoleRaw from '../../../../docs/design/text-copy/13-demo-eval-console.md?raw';
import demoIndexRaw from '../../../../docs/design/text-copy/05-demo-index.md?raw';
import demoInvestingRaw from '../../../../docs/design/text-copy/11-demo-investing-ops-copilot.md?raw';
import demoLegacyRaw from '../../../../docs/design/text-copy/12-demo-legacy-ai-adapter.md?raw';
import demoPaymentRaw from '../../../../docs/design/text-copy/10-demo-payment-exception-review.md?raw';

import { getList, getSection, getText } from './copyParsers';
import { shellCopy } from './sharedCopy';

export type DemoPanelContent = {
  detailLabels?: string[];
  detailPanelTitle?: string;
  emptyState?: string;
  evaluationMetrics: string[];
  evaluationTitle: string;
  inputFields: string[];
  inputTitle: string;
  noteBody?: string;
  noteTitle?: string;
  outputFields: string[];
  outputTitle: string;
  primaryAction: string;
  secondaryAction: string;
  stateBody?: string;
  stateTitle?: string;
  subhead: string;
  successBody?: string;
  successTitle?: string;
  title: string;
};

export type EvalConsoleDemoCopy = {
  title: string;
  subhead: string;
  metricLabels: string[];
  recentRunsTitle: string;
  recentRunsColumns: string[];
  recentRunsEmpty: string;
  flaggedRunsTitle: string;
  flaggedRunsBody: string;
  runDetailTitle: string;
  runDetailFields: string[];
  comparisonTitle: string;
  comparisonBody: string;
  footerNote: string;
};

const demoIndexHeader = getSection(demoIndexRaw, 'Page header');
const demoIndexAccess = getSection(demoIndexRaw, 'Access note');

export const demoIndexCopy = {
  eyebrow: getText(demoIndexHeader, 'Eyebrow'),
  title: getText(demoIndexHeader, 'Title'),
  body: getText(demoIndexHeader, 'Body'),
  accessTitle: getText(demoIndexAccess, 'Title'),
  accessBody: getText(demoIndexAccess, 'Body'),
  cards: ['Demo card 1', 'Demo card 2', 'Demo card 3', 'Demo card 4'].map(
    (cardName) => {
      const card = getSection(demoIndexRaw, cardName);

      return {
        title: getText(card, 'Title'),
        body: getText(card, 'Body'),
        cta: getText(card, 'CTA'),
      };
    },
  ),
};

const demoPaymentHeader = getSection(demoPaymentRaw, 'Page header');
const demoPaymentInput = getSection(demoPaymentRaw, 'Input panel');
const demoPaymentOutput = getSection(demoPaymentRaw, 'Output panel');
const demoPaymentTrace = getSection(demoPaymentRaw, 'Trace panel');
const demoPaymentEval = getSection(demoPaymentRaw, 'Evaluation panel');
const demoPaymentEscalation = getSection(demoPaymentRaw, 'Escalation state');
const demoPaymentSuccess = getSection(demoPaymentRaw, 'Success state');

const paymentExceptionReviewDemoCopy: DemoPanelContent = {
  title: getText(demoPaymentHeader, 'Title'),
  subhead: getText(demoPaymentHeader, 'Subhead'),
  inputTitle: getText(demoPaymentInput, 'Section title'),
  inputFields: getList(demoPaymentInput, 'Field labels'),
  primaryAction: getText(demoPaymentInput, 'Primary button'),
  secondaryAction: getText(demoPaymentInput, 'Secondary button'),
  outputTitle: getText(demoPaymentOutput, 'Section title'),
  outputFields: getList(demoPaymentOutput, 'Field labels'),
  detailPanelTitle: getText(demoPaymentTrace, 'Section title'),
  detailLabels: getList(demoPaymentTrace, 'Trace labels'),
  emptyState: getText(demoPaymentTrace, 'Empty state'),
  evaluationTitle: getText(demoPaymentEval, 'Section title'),
  evaluationMetrics: getList(demoPaymentEval, 'Metrics'),
  stateTitle: getText(demoPaymentEscalation, 'Title'),
  stateBody: getText(demoPaymentEscalation, 'Body'),
  successTitle: getText(demoPaymentSuccess, 'Title'),
  successBody: getText(demoPaymentSuccess, 'Body'),
};

const demoInvestingHeader = getSection(demoInvestingRaw, 'Page header');
const demoInvestingInput = getSection(demoInvestingRaw, 'Input panel');
const demoInvestingOutput = getSection(demoInvestingRaw, 'Output panel');
const demoInvestingGrounding = getSection(demoInvestingRaw, 'Retrieval panel');
const demoInvestingEval = getSection(demoInvestingRaw, 'Evaluation panel');
const demoInvestingSafety = getSection(demoInvestingRaw, 'Safety note');

const investingOpsCopilotDemoCopy: DemoPanelContent = {
  title: getText(demoInvestingHeader, 'Title'),
  subhead: getText(demoInvestingHeader, 'Subhead'),
  inputTitle: getText(demoInvestingInput, 'Section title'),
  inputFields: getList(demoInvestingInput, 'Field labels'),
  primaryAction: getText(demoInvestingInput, 'Primary button'),
  secondaryAction: getText(demoInvestingInput, 'Secondary button'),
  outputTitle: getText(demoInvestingOutput, 'Section title'),
  outputFields: getList(demoInvestingOutput, 'Field labels'),
  detailPanelTitle: getText(demoInvestingGrounding, 'Section title'),
  detailLabels: getList(demoInvestingGrounding, 'Labels'),
  emptyState: shellCopy.states.noDataBody,
  evaluationTitle: getText(demoInvestingEval, 'Section title'),
  evaluationMetrics: getList(demoInvestingEval, 'Metrics'),
  noteTitle: getText(demoInvestingSafety, 'Title'),
  noteBody: getText(demoInvestingSafety, 'Body'),
};

const demoLegacyHeader = getSection(demoLegacyRaw, 'Page header');
const demoLegacyInput = getSection(demoLegacyRaw, 'Input panel');
const demoLegacyExtraction = getSection(demoLegacyRaw, 'Extraction panel');
const demoLegacyPayload = getSection(demoLegacyRaw, 'Legacy payload panel');
const demoLegacyFinal = getSection(demoLegacyRaw, 'Final result panel');
const demoLegacyEval = getSection(demoLegacyRaw, 'Evaluation panel');

export const legacyAiAdapterDemoCopy = {
  title: getText(demoLegacyHeader, 'Title'),
  subhead: getText(demoLegacyHeader, 'Subhead'),
  inputTitle: getText(demoLegacyInput, 'Section title'),
  inputFields: getList(demoLegacyInput, 'Field labels'),
  primaryAction: getText(demoLegacyInput, 'Primary button'),
  secondaryAction: getText(demoLegacyInput, 'Secondary button'),
  extractionTitle: getText(demoLegacyExtraction, 'Section title'),
  extractionFields: getList(demoLegacyExtraction, 'Field labels'),
  legacyPayloadTitle: getText(demoLegacyPayload, 'Section title'),
  legacyPayloadBody: getText(demoLegacyPayload, 'Body'),
  finalResultTitle: getText(demoLegacyFinal, 'Section title'),
  finalResultFields: getList(demoLegacyFinal, 'Field labels'),
  evaluationTitle: getText(demoLegacyEval, 'Section title'),
  evaluationMetrics: getList(demoLegacyEval, 'Metrics'),
};

const demoEvalHeader = getSection(demoEvalConsoleRaw, 'Page header');
const demoEvalMetrics = getSection(demoEvalConsoleRaw, 'Top metrics row');
const demoEvalRuns = getSection(demoEvalConsoleRaw, 'Run list panel');
const demoEvalFlagged = getSection(demoEvalConsoleRaw, 'Flagged panel');
const demoEvalDetail = getSection(demoEvalConsoleRaw, 'Run detail panel');
const demoEvalComparison = getSection(demoEvalConsoleRaw, 'Comparison panel');
const demoEvalFooter = getSection(demoEvalConsoleRaw, 'Footer note');

export const evalConsoleDemoCopy: EvalConsoleDemoCopy = {
  title: getText(demoEvalHeader, 'Title'),
  subhead: getText(demoEvalHeader, 'Subhead'),
  metricLabels: getList(demoEvalMetrics, 'Metric labels'),
  recentRunsTitle: getText(demoEvalRuns, 'Section title'),
  recentRunsColumns: getList(demoEvalRuns, 'Column labels'),
  recentRunsEmpty: getText(demoEvalRuns, 'Empty state'),
  flaggedRunsTitle: getText(demoEvalFlagged, 'Section title'),
  flaggedRunsBody: getText(demoEvalFlagged, 'Body'),
  runDetailTitle: getText(demoEvalDetail, 'Section title'),
  runDetailFields: getList(demoEvalDetail, 'Field labels'),
  comparisonTitle: getText(demoEvalComparison, 'Section title'),
  comparisonBody: getText(demoEvalComparison, 'Body'),
  footerNote: getText(demoEvalFooter, 'Body'),
};

export const demoShellContentByHref: Record<string, DemoPanelContent> = {
  '/demo/payment-exception-review': paymentExceptionReviewDemoCopy,
  '/demo/investing-ops-copilot': investingOpsCopilotDemoCopy,
  '/demo/legacy-ai-adapter': {
    detailLabels: legacyAiAdapterDemoCopy.extractionFields,
    detailPanelTitle: legacyAiAdapterDemoCopy.extractionTitle,
    evaluationMetrics: legacyAiAdapterDemoCopy.evaluationMetrics,
    evaluationTitle: legacyAiAdapterDemoCopy.evaluationTitle,
    inputFields: legacyAiAdapterDemoCopy.inputFields,
    inputTitle: legacyAiAdapterDemoCopy.inputTitle,
    noteBody: legacyAiAdapterDemoCopy.legacyPayloadBody,
    noteTitle: legacyAiAdapterDemoCopy.legacyPayloadTitle,
    outputFields: legacyAiAdapterDemoCopy.finalResultFields,
    outputTitle: legacyAiAdapterDemoCopy.finalResultTitle,
    primaryAction: legacyAiAdapterDemoCopy.primaryAction,
    secondaryAction: legacyAiAdapterDemoCopy.secondaryAction,
    subhead: legacyAiAdapterDemoCopy.subhead,
    title: legacyAiAdapterDemoCopy.title,
  },
};
