import {
  Card,
  designTokens,
  PageHeading,
  SectionHeading,
} from '@portfolio-tq/ui';
import { Link } from 'react-router-dom';

import { aboutCopy } from '@/content/aboutCopy';

export function AboutPage() {
  return (
    <div className={designTokens.pageSection}>
      <PageHeading
        eyebrow={aboutCopy.eyebrow}
        lead={aboutCopy.body}
        title={aboutCopy.title}
      />

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_22rem] lg:gap-12">
        <div className="grid max-w-3xl content-start gap-5">
          <SectionHeading
            eyebrow="Positioning"
            lead={aboutCopy.positioning.body}
            title={aboutCopy.positioning.title}
          />
          <p className={designTokens.bodyText}>{aboutCopy.background.body}</p>
        </div>

        <Card className="grid content-start gap-3">
          <p className={designTokens.label}>{aboutCopy.background.title}</p>
          <p className={designTokens.bodyTextTight}>
            {aboutCopy.background.body}
          </p>
        </Card>
      </section>

      <section className="grid gap-7 border-y border-border/80 py-10 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-12">
        <SectionHeading
          eyebrow="Operating pattern"
          lead={aboutCopy.body}
          title={aboutCopy.strengths.title}
        />

        <div className="grid gap-0 divide-y divide-border/80">
          {aboutCopy.strengths.bullets.map((strength, index) => (
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
          <SectionHeading eyebrow="Scope" title={aboutCopy.domains.title} />
          <ul className="flex flex-wrap gap-2">
            {aboutCopy.domains.bullets.map((principle) => (
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
            lead={aboutCopy.closing.body}
            title={aboutCopy.closing.title}
          />
          <div>
            <Link className={designTokens.buttonPrimary} to="/work">
              {aboutCopy.closing.cta}
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
