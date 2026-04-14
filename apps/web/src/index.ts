/**
 * Logs a scaffold summary for the web package entrypoint.
 */

import { repositoryMetadata } from '@portfolio-tq/config';

import { shellCopy } from './content/sharedCopy';

const summary = [
  `${repositoryMetadata.productName} web scaffold ready.`,
  `Primary routes: ${shellCopy.navigation.map((item) => item.href).join(', ')}`,
].join(' ');

console.log(summary);
