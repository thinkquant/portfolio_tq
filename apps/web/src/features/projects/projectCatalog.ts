import { projectModuleMetadata } from '@portfolio-tq/config';
import type { ProjectId } from '@portfolio-tq/types';

import { portfolioProjectsCopy } from '@/content/textCopy';

export type PortfolioProject = {
  id: ProjectId;
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

export const portfolioProjects: PortfolioProject[] = projectModuleMetadata.map(
  (module, index) => {
    const copy = portfolioProjectsCopy[index];

    return {
      id: module.id,
      title: copy.title,
      href: module.projectRoute,
      demoHref: module.demoRoute,
      summary: copy.summary,
      problem: copy.problemBody,
      whyItMatters: copy.whyItMattersBody,
      workflowSteps: copy.howItWorksFlow,
      controls: copy.controls,
      proves: copy.whatThisProves,
      workCardProves: copy.workCardProves,
      workCardCta: copy.cta,
      filterTags: copy.filterTags.length ? copy.filterTags : module.proofTags,
    };
  },
);

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
