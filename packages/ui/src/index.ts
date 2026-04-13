import { repositoryMetadata } from '@portfolio-tq/config';

export {
  ArchitecturePanelFrame,
  Callout,
  Card,
  DemoLauncherPanel,
  designTokens,
  EmptyState,
  MetricTile,
  PageHeading,
  ProofTag,
  SectionHeading,
} from './primitives.js';

export interface NavigationItem {
  label: string;
  href: string;
}

export const primaryNavigation: NavigationItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Work', href: '/work' },
  { label: 'Demo', href: '/demo' },
  { label: 'Architecture', href: '/architecture' },
  { label: 'Observability', href: '/observability' },
  { label: 'Repo Workflow', href: '/repo-workflow' },
];

export const appHeaderTitle = repositoryMetadata.productName;
