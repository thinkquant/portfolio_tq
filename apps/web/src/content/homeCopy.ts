/**
 * Home-route copy isolated from heavier project and demo content.
 */

import homeRaw from '../../../../docs/design/text-copy/01-home.md?raw';

import {
  getDirectList,
  getList,
  getSection,
  getSubsection,
  getText,
} from './copyParsers';

const hero = getSection(homeRaw, 'Hero');
const whatThisIs = getSection(homeRaw, 'Section: What this is');
const doctrine = getSection(homeRaw, 'Section: Core doctrine');
const featured = getSection(homeRaw, 'Section: Featured surfaces');
const proofPieces = getSection(homeRaw, 'Section: Current proof pieces');
const publicBuildNote = getSection(homeRaw, 'Section: Public build note');
const closing = getSection(homeRaw, 'Section: Closing prompt');

export const homeCopy = {
  hero: {
    eyebrow: getText(hero, 'Eyebrow'),
    headline: getText(hero, 'Headline', ['Hero Headline']),
    subhead: getText(hero, 'Subhead'),
    primaryCta: getText(hero, 'Primary CTA'),
    secondaryCta: getText(hero, 'Secondary CTA'),
    tertiaryCta: getText(hero, 'Tertiary CTA'),
  },
  heroProofStrip: getDirectList(getSection(homeRaw, 'Hero proof strip')),
  whatThisIs: {
    title: getText(whatThisIs, 'Section title'),
    body: getText(whatThisIs, 'Body'),
  },
  doctrine: {
    title: getText(doctrine, 'Section title'),
    steps: getList(doctrine, 'Three-part doctrine'),
    supportingLine: getText(doctrine, 'Supporting line'),
  },
  featuredSurfaces: {
    title: getText(featured, 'Section title'),
    tiles: ['Tile 1', 'Tile 2', 'Tile 3', 'Tile 4'].map((tileName, index) => {
      const tile = getSubsection(featured, tileName);
      const hrefs = ['/work', '/architecture', '/demo', '/about'];

      return {
        title: getText(tile, 'Title'),
        body: getText(tile, 'Body'),
        cta: getText(tile, 'CTA'),
        href: hrefs[index],
      };
    }),
  },
  proofPieces: {
    title: getText(proofPieces, 'Section title'),
    items: ['Project 1', 'Project 2', 'Project 3', 'Project 4'].map(
      (projectName) => {
        const project = getSubsection(proofPieces, projectName);

        return {
          title: getText(project, 'Title'),
          body: getText(project, 'Body'),
        };
      },
    ),
  },
  publicBuildNote: {
    title: getText(publicBuildNote, 'Section title'),
    body: getText(publicBuildNote, 'Body'),
    cta: getText(publicBuildNote, 'CTA'),
  },
  closing: {
    title: getText(closing, 'Section title'),
    body: getText(closing, 'Body'),
    primaryCta: getText(closing, 'Primary CTA'),
  },
};
