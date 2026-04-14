/**
 * Project and work-detail copy for the work and project routes.
 */

import type { ProjectId } from '@portfolio-tq/types';

import projectEvalRaw from '../../../../docs/design/text-copy/09-project-eval-console.md?raw';
import projectInvestingRaw from '../../../../docs/design/text-copy/07-project-investing-ops-copilot.md?raw';
import projectLegacyRaw from '../../../../docs/design/text-copy/08-project-legacy-ai-adapter.md?raw';
import projectPaymentRaw from '../../../../docs/design/text-copy/06-project-payment-exception-review.md?raw';
import workRaw from '../../../../docs/design/text-copy/02-work.md?raw';

import {
  getCodeLines,
  getList,
  getOptionalSection,
  getSection,
  getText,
} from './copyParsers';

export type ProjectCopy = {
  cta: string;
  demoBody: string;
  demoTitle: string;
  detailEyebrow: string;
  howItWorksFlow: string[];
  howItWorksTitle: string;
  problemBody: string;
  problemTitle: string;
  summary: string;
  title: string;
  whyItMattersBody: string;
  whyItMattersTitle: string;
  workCardProblem: string;
  workCardProves: string[];
  workCardSummary: string;
  whatThisProves: string[];
  whatThisProvesTitle: string;
  controls: string[];
  controlsTitle: string;
  href: string;
  demoHref: string;
  filterTags: string[];
};

const projectDefinitions = [
  {
    key: 'payment-exception-review' as const,
    raw: projectPaymentRaw,
    workSection: getSection(workRaw, 'Project card 1'),
    href: '/projects/payment-exception-review',
    demoHref: '/demo/payment-exception-review',
    filterTags: ['All', 'AI Workflows', 'Reliability', 'Backend'],
  },
  {
    key: 'investing-ops-copilot' as const,
    raw: projectInvestingRaw,
    workSection: getSection(workRaw, 'Project card 2'),
    href: '/projects/investing-ops-copilot',
    demoHref: '/demo/investing-ops-copilot',
    filterTags: ['All', 'AI Workflows', 'Backend', 'Product Thinking'],
  },
  {
    key: 'legacy-ai-adapter' as const,
    raw: projectLegacyRaw,
    workSection: getSection(workRaw, 'Project card 3'),
    href: '/projects/legacy-ai-adapter',
    demoHref: '/demo/legacy-ai-adapter',
    filterTags: ['All', 'Systems Architecture', 'AI Workflows', 'Backend'],
  },
  {
    key: 'eval-console' as const,
    raw: projectEvalRaw,
    workSection: getSection(workRaw, 'Project card 4'),
    href: '/projects/eval-console',
    demoHref: '/demo/eval-console',
    filterTags: [
      'All',
      'Reliability',
      'Systems Architecture',
      'Product Thinking',
    ],
  },
] as const;

export const projectCopyById = {} as Record<ProjectId, ProjectCopy>;

for (const definition of projectDefinitions) {
  const header = getSection(definition.raw, 'Header');
  const problem = getSection(definition.raw, 'Problem');
  const whyItMatters = getSection(definition.raw, 'Why it matters');
  const howItWorks = getSection(definition.raw, 'How it works');
  const controls =
    getOptionalSection(definition.raw, 'Controls') ??
    getSection(definition.raw, 'Signals shown');
  const proves = getSection(definition.raw, 'What this proves');
  const demo = getSection(definition.raw, 'Demo prompt');

  projectCopyById[definition.key] = {
    cta: getText(definition.workSection, 'CTA'),
    demoBody: getText(demo, 'Body'),
    demoTitle: getText(demo, 'Section title'),
    detailEyebrow: getText(header, 'Eyebrow'),
    howItWorksFlow: getCodeLines(howItWorks, 'Flow'),
    howItWorksTitle: getText(howItWorks, 'Section title'),
    problemBody: getText(problem, 'Body'),
    problemTitle: getText(problem, 'Section title'),
    summary: getText(header, 'One-line summary'),
    title: getText(header, 'Title'),
    whyItMattersBody: getText(whyItMatters, 'Body'),
    whyItMattersTitle: getText(whyItMatters, 'Section title'),
    workCardProblem: getText(definition.workSection, 'Problem'),
    workCardProves: getText(definition.workSection, 'What this proves')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
    workCardSummary: getText(definition.workSection, 'One-line summary'),
    whatThisProves: getList(proves, 'Bullets'),
    whatThisProvesTitle: getText(proves, 'Section title'),
    controls: getList(controls, 'Bullets'),
    controlsTitle: getText(controls, 'Section title'),
    href: definition.href,
    demoHref: definition.demoHref,
    filterTags: definition.filterTags.filter((tag) => tag !== 'All'),
  };
}
