import {
  Card,
  designTokens,
  PageHeading,
  SectionHeading,
} from '@portfolio-tq/ui';
import { Link } from 'react-router-dom';

import { siteCopy } from '@/content/textCopy';

export function AboutPage() {
  return (
    <div className={designTokens.pageSection}>
      <PageHeading
        eyebrow={siteCopy.about.eyebrow}
        lead={siteCopy.about.body}
        title={siteCopy.about.title}
      />

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_22rem] lg:gap-12">
        <div className="grid max-w-3xl content-start gap-5">
          <SectionHeading
            eyebrow="Positioning"
            lead={siteCopy.about.positioning.body}
            title={siteCopy.about.positioning.title}
          />
          <p className={designTokens.bodyText}>
            {siteCopy.about.background.body}
          </p>
        </div>

        <Card className="grid content-start gap-3">
          <p className={designTokens.label}>
            {siteCopy.about.background.title}
          </p>
          <p className={designTokens.bodyTextTight}>
            {siteCopy.about.background.body}
          </p>
        </Card>
      </section>

      <section className="grid gap-7 border-y border-border/80 py-10 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-12">
        <SectionHeading
          eyebrow="Operating pattern"
          lead={siteCopy.about.body}
          title={siteCopy.about.strengths.title}
        />

        <div className="grid gap-0 divide-y divide-border/80">
          {siteCopy.about.strengths.bullets.map((strength, index) => (
            <article
              className="grid gap-3 py-5 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-5"
              key={strength}
            >
              <span className="font-mono text-sm font-semibold text-primary">
                0{index + 1}
              </span>
              <h3 className="max-w-[34ch] font-serif text-[1.375rem] font-semibold leading-tight text-foreground [text-wrap:balance]">
                {strength}
              </h3>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
        <div className="grid content-start gap-5">
          <SectionHeading
            eyebrow="Scope"
            title={siteCopy.about.domains.title}
          />
          <ul className="flex flex-wrap gap-2">
            {siteCopy.about.domains.bullets.map((principle) => (
              <li
                className="rounded-[var(--radius)] border border-border/80 bg-card px-3 py-2 text-sm font-semibold leading-6 text-muted-foreground"
                key={principle}
              >
                {principle}
              </li>
            ))}
          </ul>
        </div>

        <Card className="grid content-start gap-5 p-6 sm:p-8">
          <SectionHeading
            eyebrow="Portfolio intent"
            lead={siteCopy.about.closing.body}
            title={siteCopy.about.closing.title}
          />
          <div>
            <Link className={designTokens.buttonPrimary} to="/work">
              {siteCopy.about.closing.cta}
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
