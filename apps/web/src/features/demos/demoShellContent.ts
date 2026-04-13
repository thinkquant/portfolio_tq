import { siteCopy } from '@/content/textCopy';

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

export const demoShellContentByHref: Record<string, DemoPanelContent> = {
  '/demo/payment-exception-review': siteCopy.demos.paymentExceptionReview,
  '/demo/investing-ops-copilot': siteCopy.demos.investingOpsCopilot,
  '/demo/legacy-ai-adapter': {
    detailLabels: siteCopy.demos.legacyAiAdapter.extractionFields,
    detailPanelTitle: siteCopy.demos.legacyAiAdapter.extractionTitle,
    evaluationMetrics: siteCopy.demos.legacyAiAdapter.evaluationMetrics,
    evaluationTitle: siteCopy.demos.legacyAiAdapter.evaluationTitle,
    inputFields: siteCopy.demos.legacyAiAdapter.inputFields,
    inputTitle: siteCopy.demos.legacyAiAdapter.inputTitle,
    noteBody: siteCopy.demos.legacyAiAdapter.legacyPayloadBody,
    noteTitle: siteCopy.demos.legacyAiAdapter.legacyPayloadTitle,
    outputFields: siteCopy.demos.legacyAiAdapter.finalResultFields,
    outputTitle: siteCopy.demos.legacyAiAdapter.finalResultTitle,
    primaryAction: siteCopy.demos.legacyAiAdapter.primaryAction,
    secondaryAction: siteCopy.demos.legacyAiAdapter.secondaryAction,
    subhead: siteCopy.demos.legacyAiAdapter.subhead,
    title: siteCopy.demos.legacyAiAdapter.title,
  },
};
