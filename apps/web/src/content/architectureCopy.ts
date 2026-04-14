/**
 * Architecture-page copy kept separate from other routes.
 */

import architectureRaw from '../../../../docs/design/text-copy/03-architecture.md?raw';

import { getCodeLines, getList, getSection, getText } from './copyParsers';

const header = getSection(architectureRaw, 'Page header');
const systemShape = getSection(architectureRaw, 'Section: System shape');
const environmentModel = getSection(
  architectureRaw,
  'Section: Environment model',
);
const deliveryModel = getSection(architectureRaw, 'Section: Delivery model');
const whyItMatters = getSection(architectureRaw, 'Section: Why this matters');
const inspect = getSection(architectureRaw, 'Section: What to inspect');

export const architectureCopy = {
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
