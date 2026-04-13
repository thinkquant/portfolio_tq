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

      <section className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
        <Card>
          <SectionHeading
            eyebrow={siteCopy.about.positioning.title}
            lead={siteCopy.about.positioning.body}
            title={siteCopy.about.positioning.title}
          />
          <p className={`mt-5 ${designTokens.bodyText}`}>
            {siteCopy.about.background.body}
          </p>
        </Card>

        <Card>
          <SectionHeading
            eyebrow={siteCopy.about.background.title}
            lead={siteCopy.about.background.body}
            title={siteCopy.about.background.title}
          />
        </Card>
      </section>

      <section className="grid gap-5">
        <SectionHeading
          eyebrow={siteCopy.about.strengths.title}
          lead={siteCopy.about.body}
          title={siteCopy.about.strengths.title}
        />

        <div className="grid gap-5 md:grid-cols-2">
          {siteCopy.about.strengths.bullets.map((strength) => (
            <Card className="grid gap-3" key={strength}>
              <h3 className="max-w-[18ch] font-serif text-[1.45rem] leading-tight text-foreground">
                {strength}
              </h3>
              <p className={designTokens.bodyTextTight}>
                {siteCopy.about.positioning.body}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <SectionHeading
            eyebrow={siteCopy.about.domains.title}
            title={siteCopy.about.domains.title}
          />
          <ul className="mt-5 grid gap-3">
            {siteCopy.about.domains.bullets.map((principle) => (
              <li
                className="rounded-[var(--radius)] border border-border/80 bg-background/45 p-4 leading-7 text-muted-foreground"
                key={principle}
              >
                {principle}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <SectionHeading
            eyebrow={siteCopy.about.closing.title}
            lead={siteCopy.about.closing.body}
            title={siteCopy.about.closing.title}
          />
          <div className="mt-5">
            <Link className={designTokens.buttonPrimary} to="/work">
              {siteCopy.about.closing.cta}
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
