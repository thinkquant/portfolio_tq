import { portfolioProjectsCopy } from '@/content/textCopy';

export type PortfolioProject = {
  id: string;
  title: string;
  href: string;
  demoHref: string;
  summary: string;
  problem: string;
  whyItMatters: string;
  workflowSteps: string[];
  controls: string[];
  proves: string[];
  workCardProves: string[];
  workCardCta: string;
  filterTags: string[];
};

export const portfolioProjects: PortfolioProject[] = [
  {
    id: 'payment-exception-review',
    title: portfolioProjectsCopy[0].title,
    href: portfolioProjectsCopy[0].href,
    demoHref: portfolioProjectsCopy[0].demoHref,
    summary: portfolioProjectsCopy[0].summary,
    problem: portfolioProjectsCopy[0].problemBody,
    whyItMatters: portfolioProjectsCopy[0].whyItMattersBody,
    workflowSteps: portfolioProjectsCopy[0].howItWorksFlow,
    controls: portfolioProjectsCopy[0].controls,
    proves: portfolioProjectsCopy[0].whatThisProves,
    workCardProves: portfolioProjectsCopy[0].workCardProves,
    workCardCta: portfolioProjectsCopy[0].cta,
    filterTags: portfolioProjectsCopy[0].filterTags,
  },
  {
    id: 'investing-ops-copilot',
    title: portfolioProjectsCopy[1].title,
    href: portfolioProjectsCopy[1].href,
    demoHref: portfolioProjectsCopy[1].demoHref,
    summary: portfolioProjectsCopy[1].summary,
    problem: portfolioProjectsCopy[1].problemBody,
    whyItMatters: portfolioProjectsCopy[1].whyItMattersBody,
    workflowSteps: portfolioProjectsCopy[1].howItWorksFlow,
    controls: portfolioProjectsCopy[1].controls,
    proves: portfolioProjectsCopy[1].whatThisProves,
    workCardProves: portfolioProjectsCopy[1].workCardProves,
    workCardCta: portfolioProjectsCopy[1].cta,
    filterTags: portfolioProjectsCopy[1].filterTags,
  },
  {
    id: 'legacy-ai-adapter',
    title: portfolioProjectsCopy[2].title,
    href: portfolioProjectsCopy[2].href,
    demoHref: portfolioProjectsCopy[2].demoHref,
    summary: portfolioProjectsCopy[2].summary,
    problem: portfolioProjectsCopy[2].problemBody,
    whyItMatters: portfolioProjectsCopy[2].whyItMattersBody,
    workflowSteps: portfolioProjectsCopy[2].howItWorksFlow,
    controls: portfolioProjectsCopy[2].controls,
    proves: portfolioProjectsCopy[2].whatThisProves,
    workCardProves: portfolioProjectsCopy[2].workCardProves,
    workCardCta: portfolioProjectsCopy[2].cta,
    filterTags: portfolioProjectsCopy[2].filterTags,
  },
  {
    id: 'eval-console',
    title: portfolioProjectsCopy[3].title,
    href: portfolioProjectsCopy[3].href,
    demoHref: portfolioProjectsCopy[3].demoHref,
    summary: portfolioProjectsCopy[3].summary,
    problem: portfolioProjectsCopy[3].problemBody,
    whyItMatters: portfolioProjectsCopy[3].whyItMattersBody,
    workflowSteps: portfolioProjectsCopy[3].howItWorksFlow,
    controls: portfolioProjectsCopy[3].controls,
    proves: portfolioProjectsCopy[3].whatThisProves,
    workCardProves: portfolioProjectsCopy[3].workCardProves,
    workCardCta: portfolioProjectsCopy[3].cta,
    filterTags: portfolioProjectsCopy[3].filterTags,
  },
];

export function findPortfolioProject(
  href: string,
): PortfolioProject | undefined {
  return portfolioProjects.find((project) => project.href === href);
}

export function findPortfolioProjectByDemoHref(
  demoHref: string,
): PortfolioProject | undefined {
  return portfolioProjects.find((project) => project.demoHref === demoHref);
}
