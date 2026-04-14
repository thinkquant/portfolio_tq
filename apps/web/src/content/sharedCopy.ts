/**
 * Shared shell and repo copy loaded by the root layout.
 */

import persistentRaw from '../../../../docs/design/text-copy/00-persistent-components.md?raw';

import { getDirectList, getSection, getText, type NamedLink } from './copyParsers';

export const repoHref = 'https://github.com/thinkquant/portfolio_tq';
export const linkedInHref = 'https://www.linkedin.com/in/daniel-oosthuyzen';

const persistentHeader = getSection(persistentRaw, 'Header / Brand block');
const persistentNav = getSection(persistentRaw, 'Primary navigation');
const persistentUtility = getSection(persistentRaw, 'Header utility text');
const persistentAnnouncement = getSection(
  persistentRaw,
  'Global announcement bar',
);
const persistentFooter = getSection(persistentRaw, 'Footer');
const persistentProofTags = getSection(persistentRaw, 'Shared proof tags');
const persistentCtas = getSection(persistentRaw, 'Shared CTA labels');
const persistentDemoStates = getSection(persistentRaw, 'Shared demo states');
const persistentContactPrompt = getSection(
  persistentRaw,
  'Shared contact prompt',
);

export const shellCopy = {
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
      { label: 'Email', href: '' },
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
};

export const repoWorkflowCopy = {
  eyebrow: 'Repo',
  title: 'Public build. Public proof.',
  body: 'The repository is part of the portfolio. Structure, specs, Terraform, CI/CD, and working discipline are visible by design.',
  sections: [
    {
      title: 'What is visible',
      body: 'Reviewers can inspect repo structure, technical specs, checklists, workflow files, Terraform, and the public pages themselves.',
      items: [
        'repo structure',
        'technical specs',
        'checklists',
        'workflow files',
        'Terraform',
        'demo views',
        'evaluation views',
      ],
    },
    {
      title: 'Delivery model',
      body: 'Code change, local checks, GitHub Actions, Terraform plan, deploy to dev, milestone merge, deploy to prod.',
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
      body: 'Development and production are separated on purpose. The branch model mirrors the cloud model.',
      items: ['dev branch -> dev project', 'main branch -> prod project'],
    },
  ],
  ctaLabel: 'View the Repo',
  ctaHref: repoHref,
};
