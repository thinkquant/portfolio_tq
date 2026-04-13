import { Card, designTokens, PageHeading, SectionHeading } from '@portfolio-tq/ui';

import { siteCopy } from '@/content/textCopy';

export function RepoWorkflowPage() {
  return (
    <div className={designTokens.pageSection}>
      <PageHeading
        eyebrow={siteCopy.repoWorkflow.eyebrow}
        lead={siteCopy.repoWorkflow.body}
        title={siteCopy.repoWorkflow.title}
      />

      <section className="grid gap-5 lg:grid-cols-3">
        {siteCopy.repoWorkflow.sections.map((section) => (
          <Card className="grid gap-4" key={section.title}>
            <SectionHeading
              eyebrow={section.title}
              lead={section.body}
              title={section.title}
            />
            <ul className="grid gap-3">
              {section.items.map((item) => (
                <li
                  className="rounded-[var(--radius)] border border-border bg-background/60 p-4 leading-7 text-muted-foreground"
                  key={item}
                >
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </section>

      <section>
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
