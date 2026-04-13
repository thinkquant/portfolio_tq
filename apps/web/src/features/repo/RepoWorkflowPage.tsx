import {
  Card,
  designTokens,
  PageHeading,
  SectionHeading,
} from '@portfolio-tq/ui';

import { siteCopy } from '@/content/textCopy';

export function RepoWorkflowPage() {
  return (
    <div className={designTokens.pageSection}>
      <PageHeading
        eyebrow={siteCopy.repoWorkflow.eyebrow}
        lead={siteCopy.repoWorkflow.body}
        title={siteCopy.repoWorkflow.title}
      />

      <section className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-12">
        <SectionHeading
          eyebrow="Build discipline"
          lead={siteCopy.repoWorkflow.body}
          title="How the repo proves the work"
        />

        <div className="grid gap-5">
          {siteCopy.repoWorkflow.sections.map((section, index) => (
            <Card
              className={[
                'grid gap-5',
                index === 0
                  ? 'lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start lg:p-7'
                  : '',
              ].join(' ')}
              key={section.title}
            >
              <SectionHeading
                eyebrow={`0${index + 1}`}
                lead={section.body}
                title={section.title}
              />
              <ul className="flex flex-wrap gap-2">
                {section.items.map((item) => (
                  <li
                    className="rounded-[var(--radius)] border border-border bg-background/60 px-3 py-2 text-sm font-semibold leading-6 text-muted-foreground"
                    key={item}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <section className="flex justify-start border-t border-border/80 pt-8">
        <a
          className={designTokens.buttonPrimary}
          href={siteCopy.repoWorkflow.ctaHref}
          rel="noreferrer"
          target="_blank"
        >
          {siteCopy.repoWorkflow.ctaLabel}
        </a>
      </section>
    </div>
  );
}
