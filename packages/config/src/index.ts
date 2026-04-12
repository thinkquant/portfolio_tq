import { environments, type Environment } from '@portfolio-tq/types';

export const repositoryMetadata = {
  productName: 'portfolio-tq',
  publicHost: 'thinkquant.co',
  defaultBranch: 'main',
  integrationBranch: 'dev',
} as const;

export const environmentLabels: Record<Environment, string> = {
  dev: 'Development',
  prod: 'Production',
};

export const supportedEnvironments = [...environments];
