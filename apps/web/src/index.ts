import { repositoryMetadata } from '@portfolio-tq/config';

import { siteCopy } from './content/textCopy';

const summary = [
  `${repositoryMetadata.productName} web scaffold ready.`,
  `Primary routes: ${siteCopy.shell.navigation.map((item) => item.href).join(', ')}`,
].join(' ');

console.log(summary);
