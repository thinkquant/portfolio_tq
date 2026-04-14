/**
 * Work-page copy and filter labels.
 */

import workRaw from '../../../../docs/design/text-copy/02-work.md?raw';

import { getList, getSection, getText } from './copyParsers';

const header = getSection(workRaw, 'Page header');
const filters = getSection(workRaw, 'Intro filter line');
const bottom = getSection(workRaw, 'Bottom note');

export const workCopy = {
  eyebrow: getText(header, 'Eyebrow'),
  title: getText(header, 'Title'),
  body: getText(header, 'Body'),
  filterLabel: getText(filters, 'Label'),
  filterOptions: getList(filters, 'Filter options'),
  bottomTitle: getText(bottom, 'Title'),
  bottomBody: getText(bottom, 'Body'),
};
