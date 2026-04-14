/**
 * Shared Markdown parsing helpers for route-scoped copy modules.
 */

export type NamedLink = {
  href: string;
  label: string;
};

/**
 * Trims Markdown source after normalizing line endings.
 *
 * @param raw Raw Markdown text imported by Vite.
 * @returns The source text without carriage returns or outer whitespace.
 */
export function normalize(raw: string): string {
  return raw.replace(/\r/g, '').trim();
}

/**
 * Splits Markdown source into sections keyed by heading text.
 *
 * @param raw Raw Markdown text to scan.
 * @param level Heading depth to treat as section boundaries.
 * @returns A record of heading titles to trimmed section body text.
 */
export function splitByHeading(
  raw: string,
  level: 2 | 3,
): Record<string, string> {
  const lines = normalize(raw).split('\n');
  const sections: Record<string, string> = {};
  const prefix = `${'#'.repeat(level)} `;
  let currentKey: string | null = null;

  for (const line of lines) {
    if (line.startsWith(prefix)) {
      currentKey = line.slice(prefix.length).trim();
      sections[currentKey] = '';
      continue;
    }

    if (currentKey) {
      sections[currentKey] += `${line}\n`;
    }
  }

  return Object.fromEntries(
    Object.entries(sections).map(([key, value]) => [key, value.trim()]),
  );
}

/**
 * Reads a required level-two Markdown section.
 *
 * @param raw Raw Markdown text to scan.
 * @param title Heading title that must exist in the source.
 * @returns The trimmed section body for the requested title.
 *
 * @throws Error when the requested section is missing.
 */
export function getSection(raw: string, title: string): string {
  const section = splitByHeading(raw, 2)[title];

  if (!section) {
    throw new Error(`Missing section "${title}".`);
  }

  return section;
}

/**
 * Reads an optional level-two Markdown section.
 *
 * @param raw Raw Markdown text to scan.
 * @param title Heading title to look up in the source.
 * @returns The trimmed section body, or undefined when the title is absent.
 */
export function getOptionalSection(
  raw: string,
  title: string,
): string | undefined {
  return splitByHeading(raw, 2)[title];
}

/**
 * Reads a required level-three Markdown subsection.
 *
 * @param raw Raw Markdown text to scan.
 * @param title Subheading title that must exist in the source.
 * @returns The trimmed subsection body for the requested title.
 *
 * @throws Error when the requested subsection is missing.
 */
export function getSubsection(raw: string, title: string): string {
  const section = splitByHeading(raw, 3)[title];

  if (!section) {
    throw new Error(`Missing subsection "${title}".`);
  }

  return section;
}

/**
 * Extracts the content block following a bold Markdown label.
 *
 * The block stops at the next bold label, section heading, subsection
 * heading, or horizontal rule.
 *
 * @param raw Markdown section text to scan.
 * @param label Primary bold label to locate.
 * @param aliases Alternate bold labels accepted for the same block.
 * @returns The trimmed block content following the matching label.
 *
 * @throws Error when neither the label nor its aliases are present.
 */
export function getLabelBlock(
  raw: string,
  label: string,
  aliases: string[] = [],
): string {
  const lines = normalize(raw).split('\n');
  const labels = [label, ...aliases];
  const start = lines.findIndex((line) =>
    labels.some((candidate) => line.trim() === `**${candidate}**`),
  );

  if (start === -1) {
    throw new Error(`Missing label "${label}".`);
  }

  const collected: string[] = [];

  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (
      trimmed.startsWith('**') ||
      trimmed.startsWith('## ') ||
      trimmed.startsWith('### ') ||
      trimmed === '---'
    ) {
      break;
    }

    collected.push(line);
  }

  return collected.join('\n').trim();
}

/**
 * Extracts a labeled block as single-line display text.
 *
 * @param raw Markdown section text to scan.
 * @param label Primary bold label to locate.
 * @param aliases Alternate bold labels accepted for the same block.
 * @returns The block content with internal newlines collapsed to spaces.
 */
export function getText(
  raw: string,
  label: string,
  aliases: string[] = [],
): string {
  return getLabelBlock(raw, label, aliases).replace(/\n+/g, ' ').trim();
}

/**
 * Extracts bullet items from a labeled Markdown block.
 *
 * @param raw Markdown section text to scan.
 * @param label Primary bold label to locate.
 * @param aliases Alternate bold labels accepted for the same block.
 * @returns Bullet text without the Markdown list prefix.
 */
export function getList(
  raw: string,
  label: string,
  aliases: string[] = [],
): string[] {
  return getLabelBlock(raw, label, aliases)
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim());
}

/**
 * Extracts top-level bullet items from Markdown text.
 *
 * @param raw Markdown text containing direct bullet lines.
 * @returns Bullet text without the Markdown list prefix.
 */
export function getDirectList(raw: string): string[] {
  return normalize(raw)
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim());
}

/**
 * Extracts non-empty lines from a labeled fenced code block.
 *
 * @param raw Markdown section text to scan.
 * @param label Bold label whose block must contain a fenced code block.
 * @returns Code block lines with trailing whitespace removed.
 *
 * @throws Error when the labeled block has no fenced code block.
 */
export function getCodeLines(raw: string, label: string): string[] {
  const match = getLabelBlock(raw, label).match(/```(?:\w+)?\n([\s\S]*?)```/);

  if (!match) {
    throw new Error(`Missing code block for "${label}".`);
  }

  return match[1]
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line) => line.length > 0);
}
