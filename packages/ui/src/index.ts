import { repositoryMetadata } from '@portfolio-tq/config';

export interface NavigationItem {
  label: string;
  href: string;
}

export const primaryNavigation: NavigationItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Architecture', href: '/architecture' },
  { label: 'Observability', href: '/observability' },
  { label: 'Repo Workflow', href: '/repo-workflow' },
];

export const appHeaderTitle = repositoryMetadata.productName;
