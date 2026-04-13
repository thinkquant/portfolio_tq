import { repositoryMetadata } from '@portfolio-tq/config';
import { primaryNavigation } from '@portfolio-tq/ui';

const summary = [
  `${repositoryMetadata.productName} web scaffold ready.`,
  `Primary routes: ${primaryNavigation.map((item) => item.href).join(', ')}`,
].join(' ');

console.log(summary);
