/**
 * About-page copy isolated from heavier route content.
 */

import aboutRaw from '../../../../docs/design/text-copy/04-about.md?raw';

import { getList, getSection, getText } from './copyParsers';

const header = getSection(aboutRaw, 'Page header');
const positioning = getSection(aboutRaw, 'Section: Positioning');
const strengths = getSection(aboutRaw, 'Section: Strengths');
const domains = getSection(aboutRaw, 'Section: Working domains');
const background = getSection(aboutRaw, 'Section: Background note');
const closing = getSection(aboutRaw, 'Section: Closing line');

export const aboutCopy = {
  eyebrow: getText(header, 'Eyebrow'),
  title: getText(header, 'Title'),
  body: getText(header, 'Body'),
  positioning: {
    title: getText(positioning, 'Section title'),
    body: getText(positioning, 'Body'),
  },
  strengths: {
    title: getText(strengths, 'Section title'),
    bullets: getList(strengths, 'Bullets'),
  },
  domains: {
    title: getText(domains, 'Section title'),
    bullets: getList(domains, 'Bullets'),
  },
  background: {
    title: getText(background, 'Section title'),
    body: getText(background, 'Body'),
  },
  closing: {
    title: getText(closing, 'Section title'),
    body: getText(closing, 'Body'),
    cta: getText(closing, 'CTA'),
  },
};
