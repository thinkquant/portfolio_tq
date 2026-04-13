import aboutRaw from '../../../../docs/design/text-copy/04-about.md?raw';
import architectureRaw from '../../../../docs/design/text-copy/03-architecture.md?raw';
import demoEvalConsoleRaw from '../../../../docs/design/text-copy/13-demo-eval-console.md?raw';
import demoIndexRaw from '../../../../docs/design/text-copy/05-demo-index.md?raw';
import demoInvestingRaw from '../../../../docs/design/text-copy/11-demo-investing-ops-copilot.md?raw';
import demoLegacyRaw from '../../../../docs/design/text-copy/12-demo-legacy-ai-adapter.md?raw';
import demoPaymentRaw from '../../../../docs/design/text-copy/10-demo-payment-exception-review.md?raw';
import homeRaw from '../../../../docs/design/text-copy/01-home.md?raw';
import persistentRaw from '../../../../docs/design/text-copy/00-persistent-components.md?raw';
import projectEvalRaw from '../../../../docs/design/text-copy/09-project-eval-console.md?raw';
import projectInvestingRaw from '../../../../docs/design/text-copy/07-project-investing-ops-copilot.md?raw';
import projectLegacyRaw from '../../../../docs/design/text-copy/08-project-legacy-ai-adapter.md?raw';
import projectPaymentRaw from '../../../../docs/design/text-copy/06-project-payment-exception-review.md?raw';
import workRaw from '../../../../docs/design/text-copy/02-work.md?raw';

type NamedLink = {
  href: string;
  label: string;
};

type ProjectCopy = {
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

type StructuredDemoCopy = {
  primaryAction: string;
  secondaryAction: string;
  title: string;
  subhead: string;
  inputTitle: string;
  inputFields: string[];
  outputTitle: string;
  outputFields: string[];
  evaluationTitle: string;
  evaluationMetrics: string[];
};

type TimelineDemoCopy = StructuredDemoCopy & {
  detailPanelTitle: string;
  detailLabels: string[];
  emptyState: string;
  noteBody?: string;
  noteTitle?: string;
  stateBody?: string;
  stateTitle?: string;
  successBody?: string;
  successTitle?: string;
};

type LegacyAdapterDemoCopy = {
  title: string;
  subhead: string;
  inputTitle: string;
  inputFields: string[];
  primaryAction: string;
  secondaryAction: string;
  extractionTitle: string;
  extractionFields: string[];
  legacyPayloadTitle: string;
  legacyPayloadBody: string;
  finalResultTitle: string;
  finalResultFields: string[];
  evaluationTitle: string;
  evaluationMetrics: string[];
};

type EvalConsoleDemoCopy = {
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

function normalize(raw: string): string {
  return raw.replace(/\r/g, '').trim();
}

function splitByHeading(raw: string, level: 2 | 3): Record<string, string> {
  const lines = normalize(raw).split('\n');
  const sections: Record<string, string> = {};
  const prefix = `${'#'.repeat(level)} `;
  let currentKey: string | null = null;

  for (const line of lines) {
    if (line.startsWith(prefix)) {
      currentKey = line.slice(prefix.length).trim();
      sections[currentKey] = '';
      continue;
    }

    if (currentKey) {
      sections[currentKey] += `${line}\n`;
    }
  }

  return Object.fromEntries(
    Object.entries(sections).map(([key, value]) => [key, value.trim()]),
  );
}

function getSection(raw: string, title: string): string {
  const section = splitByHeading(raw, 2)[title];

  if (!section) {
    throw new Error(`Missing section "${title}".`);
  }

  return section;
}

function getOptionalSection(raw: string, title: string): string | undefined {
  return splitByHeading(raw, 2)[title];
}

function getSubsection(raw: string, title: string): string {
  const section = splitByHeading(raw, 3)[title];

  if (!section) {
    throw new Error(`Missing subsection "${title}".`);
  }

  return section;
}

function getLabelBlock(raw: string, label: string): string {
  const lines = normalize(raw).split('\n');
  const marker = `**${label}**`;
  const start = lines.findIndex((line) => line.trim() === marker);

  if (start === -1) {
    throw new Error(`Missing label "${label}".`);
  }

  const collected: string[] = [];

  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (trimmed.startsWith('**') || trimmed.startsWith('## ') || trimmed.startsWith('### ') || trimmed === '---') {
      break;
    }

    collected.push(line);
  }

  return collected.join('\n').trim();
}

function getText(raw: string, label: string): string {
  return getLabelBlock(raw, label).replace(/\n+/g, ' ').trim();
}

function getList(raw: string, label: string): string[] {
  return getLabelBlock(raw, label)
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim());
}

function getDirectList(raw: string): string[] {
  return normalize(raw)
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim());
}

function getCodeLines(raw: string, label: string): string[] {
  const match = getLabelBlock(raw, label).match(/```(?:\w+)?\n([\s\S]*?)```/);

  if (!match) {
    throw new Error(`Missing code block for "${label}".`);
  }

  return match[1]
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line) => line.length > 0);
}

const repoHref = 'https://github.com/thinkquant/portfolio_tq';
const linkedInHref = 'https://www.linkedin.com/in/daniel-oosthuyzen';

const persistentHeader = getSection(persistentRaw, 'Header / Brand block');
const persistentNav = getSection(persistentRaw, 'Primary navigation');
const persistentUtility = getSection(persistentRaw, 'Header utility text');
const persistentAnnouncement = getSection(persistentRaw, 'Global announcement bar');
const persistentFooter = getSection(persistentRaw, 'Footer');
const persistentProofTags = getSection(persistentRaw, 'Shared proof tags');
const persistentCtas = getSection(persistentRaw, 'Shared CTA labels');
const persistentDemoStates = getSection(persistentRaw, 'Shared demo states');
const persistentContactPrompt = getSection(persistentRaw, 'Shared contact prompt');

export const siteCopy = {
  shell: {
    brand: getText(persistentHeader, 'Brand'),
    primaryLockup: getText(persistentHeader, 'Primary lockup'),
    secondaryLine: getText(persistentHeader, 'Secondary line'),
    navigation: getDirectList(persistentNav).map((label) => ({
      href:
        label === 'Home'
          ? '/'
          : label === 'Work'
            ? '/work'
            : label === 'Architecture'
              ? '/architecture'
              : label === 'About'
                ? '/about'
                : '/demo',
      label,
    })),
    repoLinkLabel: getText(persistentUtility, 'Repo link label'),
    utilityLine: getText(persistentUtility, 'Optional small utility line'),
    announcement: getText(persistentAnnouncement, 'Version A'),
    footer: {
      line1: getText(persistentFooter, 'Footer line 1'),
      line2: getText(persistentFooter, 'Footer line 2'),
      navigation: [
        { label: 'Work', href: '/work' },
        { label: 'Architecture', href: '/architecture' },
        { label: 'About', href: '/about' },
        { label: 'Demos', href: '/demo' },
        { label: 'Repo', href: repoHref },
      ] satisfies NamedLink[],
      contacts: [
        { label: 'daniel@thinkquant.co', href: 'mailto:daniel@thinkquant.co' },
        { label: 'LinkedIn', href: linkedInHref },
        { label: 'GitHub', href: repoHref },
      ],
      note: getText(persistentFooter, 'Footer note'),
    },
    sharedProofTags: getDirectList(persistentProofTags),
    ctas: {
      primary: getText(persistentCtas, 'Primary CTA'),
      secondary: getText(persistentCtas, 'Secondary CTA'),
      tertiary: getText(persistentCtas, 'Tertiary CTA'),
      repo: getText(persistentCtas, 'Repo CTA'),
    },
    states: {
      lockedTitle: getText(persistentDemoStates, 'Locked state title'),
      lockedBody: getText(persistentDemoStates, 'Locked state body'),
      comingSoonTitle: getText(persistentDemoStates, 'Coming soon title'),
      comingSoonBody: getText(persistentDemoStates, 'Coming soon body'),
      noDataTitle: getText(persistentDemoStates, 'No data title'),
      noDataBody: getText(persistentDemoStates, 'No data body'),
      errorTitle: getText(persistentDemoStates, 'Error title'),
      errorBody: getText(persistentDemoStates, 'Error body'),
      loadingLabel: getText(persistentDemoStates, 'Loading label'),
      successLabel: getText(persistentDemoStates, 'Success label'),
      flaggedLabel: getText(persistentDemoStates, 'Flagged label'),
    },
    contactPrompt: {
      short: getText(persistentContactPrompt, 'Short form'),
      long: getText(persistentContactPrompt, 'Long form'),
    },
  },
  home: (() => {
    const hero = getSection(homeRaw, 'Hero');
    const whatThisIs = getSection(homeRaw, 'Section: What this is');
    const doctrine = getSection(homeRaw, 'Section: Core doctrine');
    const featured = getSection(homeRaw, 'Section: Featured surfaces');
    const proofPieces = getSection(homeRaw, 'Section: Current proof pieces');
    const publicBuildNote = getSection(homeRaw, 'Section: Public build note');
    const closing = getSection(homeRaw, 'Section: Closing prompt');

    return {
      hero: {
        eyebrow: getText(hero, 'Eyebrow'),
        headline: getText(hero, 'Headline'),
        subhead: getText(hero, 'Subhead'),
        primaryCta: getText(hero, 'Primary CTA'),
        secondaryCta: getText(hero, 'Secondary CTA'),
        tertiaryCta: getText(hero, 'Tertiary CTA'),
      },
      heroProofStrip: getDirectList(getSection(homeRaw, 'Hero proof strip')),
      whatThisIs: {
        title: getText(whatThisIs, 'Section title'),
        body: getText(whatThisIs, 'Body'),
      },
      doctrine: {
        title: getText(doctrine, 'Section title'),
        steps: getList(doctrine, 'Three-part doctrine'),
        supportingLine: getText(doctrine, 'Supporting line'),
      },
      featuredSurfaces: {
        title: getText(featured, 'Section title'),
        tiles: ['Tile 1', 'Tile 2', 'Tile 3', 'Tile 4'].map((tileName, index) => {
          const tile = getSubsection(featured, tileName);
          const hrefs = ['/work', '/architecture', '/demo', '/about'];

          return {
            title: getText(tile, 'Title'),
            body: getText(tile, 'Body'),
            cta: getText(tile, 'CTA'),
            href: hrefs[index],
          };
        }),
      },
      proofPieces: {
        title: getText(proofPieces, 'Section title'),
        items: ['Project 1', 'Project 2', 'Project 3', 'Project 4'].map(
          (projectName) => {
            const project = getSubsection(proofPieces, projectName);

            return {
              title: getText(project, 'Title'),
              body: getText(project, 'Body'),
            };
          },
        ),
      },
      publicBuildNote: {
        title: getText(publicBuildNote, 'Section title'),
        body: getText(publicBuildNote, 'Body'),
        cta: getText(publicBuildNote, 'CTA'),
      },
      closing: {
        title: getText(closing, 'Section title'),
        body: getText(closing, 'Body'),
        primaryCta: getText(closing, 'Primary CTA'),
      },
    };
  })(),
  work: (() => {
    const header = getSection(workRaw, 'Page header');
    const filters = getSection(workRaw, 'Intro filter line');
    const bottom = getSection(workRaw, 'Bottom note');

    return {
      eyebrow: getText(header, 'Eyebrow'),
      title: getText(header, 'Title'),
      body: getText(header, 'Body'),
      filterLabel: getText(filters, 'Label'),
      filterOptions: getList(filters, 'Filter options'),
      bottomTitle: getText(bottom, 'Title'),
      bottomBody: getText(bottom, 'Body'),
    };
  })(),
  architecture: (() => {
    const header = getSection(architectureRaw, 'Page header');
    const systemShape = getSection(architectureRaw, 'Section: System shape');
    const environmentModel = getSection(architectureRaw, 'Section: Environment model');
    const deliveryModel = getSection(architectureRaw, 'Section: Delivery model');
    const whyItMatters = getSection(architectureRaw, 'Section: Why this matters');
    const inspect = getSection(architectureRaw, 'Section: What to inspect');

    return {
      eyebrow: getText(header, 'Eyebrow'),
      title: getText(header, 'Title'),
      body: getText(header, 'Body'),
      systemShape: {
        title: getText(systemShape, 'Section title'),
        body: getText(systemShape, 'Body'),
        structure: getList(systemShape, 'Structure block'),
      },
      environmentModel: {
        title: getText(environmentModel, 'Section title'),
        body: getText(environmentModel, 'Body'),
        mapping: getList(environmentModel, 'Mapping'),
        supportingLine: getText(environmentModel, 'Supporting line'),
      },
      deliveryModel: {
        title: getText(deliveryModel, 'Section title'),
        body: getText(deliveryModel, 'Body'),
        flow: getCodeLines(deliveryModel, 'Flow'),
      },
      whyItMatters: {
        title: getText(whyItMatters, 'Section title'),
        body: getText(whyItMatters, 'Body'),
      },
      inspect: {
        title: getText(inspect, 'Section title'),
        list: getList(inspect, 'List'),
        cta: getText(inspect, 'CTA'),
      },
    };
  })(),
  about: (() => {
    const header = getSection(aboutRaw, 'Page header');
    const positioning = getSection(aboutRaw, 'Section: Positioning');
    const strengths = getSection(aboutRaw, 'Section: Strengths');
    const domains = getSection(aboutRaw, 'Section: Working domains');
    const background = getSection(aboutRaw, 'Section: Background note');
    const closing = getSection(aboutRaw, 'Section: Closing line');

    return {
      eyebrow: getText(header, 'Eyebrow'),
      title: getText(header, 'Title'),
      body: getText(header, 'Body'),
      positioning: {
        title: getText(positioning, 'Section title'),
        body: getText(positioning, 'Body'),
      },
      strengths: {
        title: getText(strengths, 'Section title'),
        bullets: getList(strengths, 'Bullets'),
      },
      domains: {
        title: getText(domains, 'Section title'),
        bullets: getList(domains, 'Bullets'),
      },
      background: {
        title: getText(background, 'Section title'),
        body: getText(background, 'Body'),
      },
      closing: {
        title: getText(closing, 'Section title'),
        body: getText(closing, 'Body'),
        cta: getText(closing, 'CTA'),
      },
    };
  })(),
  demoIndex: (() => {
    const header = getSection(demoIndexRaw, 'Page header');
    const access = getSection(demoIndexRaw, 'Access note');

    return {
      eyebrow: getText(header, 'Eyebrow'),
      title: getText(header, 'Title'),
      body: getText(header, 'Body'),
      accessTitle: getText(access, 'Title'),
      accessBody: getText(access, 'Body'),
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
  })(),
  projects: {} as Record<string, ProjectCopy>,
  demos: {
    paymentExceptionReview: {} as TimelineDemoCopy,
    investingOpsCopilot: {} as TimelineDemoCopy,
    legacyAiAdapter: {} as LegacyAdapterDemoCopy,
    evalConsole: {} as EvalConsoleDemoCopy,
  },
  repoWorkflow: {
    eyebrow: 'Repo',
    title: 'Public build. Public proof.',
    body:
      'The repository is part of the portfolio surface. Structure, specs, Terraform, CI/CD, and working discipline are visible by design.',
    sections: [
      {
        title: 'What is visible',
        body:
          'Reviewers can inspect repo structure, technical specs, checklists, workflow files, Terraform, and the route surfaces themselves.',
        items: [
          'repo structure',
          'technical specs',
          'checklists',
          'workflow files',
          'Terraform',
          'demo surfaces',
          'evaluation surfaces',
        ],
      },
      {
        title: 'Delivery model',
        body:
          'Code change, local checks, GitHub Actions, Terraform plan, deploy to dev, milestone merge, deploy to prod.',
        items: [
          'Code change',
          'local checks',
          'GitHub Actions',
          'Terraform plan',
          'deploy to dev',
          'milestone merge',
          'deploy to prod',
        ],
      },
      {
        title: 'Branch and environment discipline',
        body:
          'Development and production are separated on purpose. The branch model mirrors the cloud model.',
        items: ['dev branch -> dev project', 'main branch -> prod project'],
      },
    ],
    ctaLabel: 'View the Repo',
    ctaHref: repoHref,
  },
};

const projectDefinitions = [
  {
    key: 'payment-exception-review',
    raw: projectPaymentRaw,
    workSection: getSection(workRaw, 'Project card 1'),
    href: '/projects/payment-exception-review',
    demoHref: '/demo/payment-exception-review',
    filterTags: ['All', 'AI Workflows', 'Reliability', 'Backend'],
  },
  {
    key: 'investing-ops-copilot',
    raw: projectInvestingRaw,
    workSection: getSection(workRaw, 'Project card 2'),
    href: '/projects/investing-ops-copilot',
    demoHref: '/demo/investing-ops-copilot',
    filterTags: ['All', 'AI Workflows', 'Backend', 'Product Thinking'],
  },
  {
    key: 'legacy-ai-adapter',
    raw: projectLegacyRaw,
    workSection: getSection(workRaw, 'Project card 3'),
    href: '/projects/legacy-ai-adapter',
    demoHref: '/demo/legacy-ai-adapter',
    filterTags: ['All', 'Systems Architecture', 'AI Workflows', 'Backend'],
  },
  {
    key: 'eval-console',
    raw: projectEvalRaw,
    workSection: getSection(workRaw, 'Project card 4'),
    href: '/projects/eval-console',
    demoHref: '/demo/eval-console',
    filterTags: ['All', 'Reliability', 'Systems Architecture', 'Product Thinking'],
  },
] as const;

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

  siteCopy.projects[definition.key] = {
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

const demoPaymentHeader = getSection(demoPaymentRaw, 'Page header');
const demoPaymentInput = getSection(demoPaymentRaw, 'Input panel');
const demoPaymentOutput = getSection(demoPaymentRaw, 'Output panel');
const demoPaymentTrace = getSection(demoPaymentRaw, 'Trace panel');
const demoPaymentEval = getSection(demoPaymentRaw, 'Evaluation panel');
const demoPaymentEscalation = getSection(demoPaymentRaw, 'Escalation state');
const demoPaymentSuccess = getSection(demoPaymentRaw, 'Success state');

siteCopy.demos.paymentExceptionReview = {
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

siteCopy.demos.investingOpsCopilot = {
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
  emptyState: siteCopy.shell.states.noDataBody,
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

siteCopy.demos.legacyAiAdapter = {
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

siteCopy.demos.evalConsole = {
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

export const portfolioProjectsCopy = [
  siteCopy.projects['payment-exception-review'],
  siteCopy.projects['investing-ops-copilot'],
  siteCopy.projects['legacy-ai-adapter'],
  siteCopy.projects['eval-console'],
];
