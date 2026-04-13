const localPart = ['d', 'a', 'n', 'i', 'e', 'l'] as const;
const domainPart = ['t', 'h', 'i', 'n', 'k', 'q', 'u', 'a', 'n', 't'] as const;
const tldPart = ['c', 'o'] as const;
const mailtoScheme = ['m', 'a', 'i', 'l', 't', 'o'] as const;

export function getProtectedEmailAddress(): string {
  return `${localPart.join('')}@${domainPart.join('')}.${tldPart.join('')}`;
}

export function getProtectedMailtoHref(): string {
  return `${mailtoScheme.join('')}:${getProtectedEmailAddress()}`;
}
