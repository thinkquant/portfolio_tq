import {
  ArchitecturePanelFrame,
  Card,
  designTokens,
  PageHeading,
  SectionHeading,
} from '@portfolio-tq/ui';
import { Link } from 'react-router-dom';

import { siteCopy } from '@/content/textCopy';

export function ArchitecturePage() {
  return (
    <div className={designTokens.pageSection}>
      <PageHeading
        eyebrow={siteCopy.architecture.eyebrow}
        lead={siteCopy.architecture.body}
        title={siteCopy.architecture.title}
      />

      <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Card>
          <SectionHeading
            eyebrow={siteCopy.architecture.systemShape.title}
            lead={siteCopy.architecture.systemShape.body}
            title={siteCopy.architecture.systemShape.title}
          />
        </Card>

        <Card>
          <SectionHeading
            eyebrow={siteCopy.architecture.whyItMatters.title}
            lead={siteCopy.architecture.whyItMatters.body}
            title={siteCopy.architecture.whyItMatters.title}
          />
        </Card>
      </section>

      <section className="grid gap-5">
        <SectionHeading
          eyebrow={siteCopy.architecture.systemShape.title}
          lead={siteCopy.architecture.systemShape.body}
          title="Shared runtime layers"
        />

        <div className="grid gap-5 md:grid-cols-2">
          {siteCopy.architecture.systemShape.structure.map((layer) => (
            <Card className="grid gap-3" key={layer}>
              <h3 className="font-serif text-[1.45rem] leading-tight text-foreground">
                {layer}
              </h3>
              <p className={designTokens.bodyTextTight}>
                {siteCopy.architecture.body}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        <div className="grid gap-5">
          <SectionHeading
            eyebrow={siteCopy.architecture.environmentModel.title}
            lead={siteCopy.architecture.environmentModel.body}
            title={siteCopy.architecture.environmentModel.title}
          />
          <p className={designTokens.bodyTextTight}>
            {siteCopy.architecture.environmentModel.supportingLine}
          </p>

          <div className="grid gap-3">
            {siteCopy.architecture.environmentModel.mapping.map((mapping) => (
              <Card className="grid gap-2" key={mapping}>
                <p className={designTokens.bodyTextTight}>{mapping}</p>
              </Card>
            ))}
          </div>
        </div>

        <ArchitecturePanelFrame
          kicker={siteCopy.architecture.deliveryModel.title}
          title={siteCopy.architecture.deliveryModel.title}
        >
          <ol className="grid gap-3 text-sm leading-6 text-muted-foreground">
            {siteCopy.architecture.deliveryModel.flow.map((step) => (
              <li
                className="rounded-[var(--radius)] border border-border/80 bg-background/70 p-4"
                key={step}
              >
                {step}
              </li>
            ))}
          </ol>
        </ArchitecturePanelFrame>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <SectionHeading
            eyebrow={siteCopy.architecture.inspect.title}
            lead={siteCopy.architecture.inspect.list.join(', ')}
            title={siteCopy.architecture.inspect.title}
          />
          <ul className="mt-5 grid gap-3">
            {siteCopy.architecture.inspect.list.map((item) => (
              <li
                className="rounded-[var(--radius)] border border-border/80 bg-background/45 p-4 leading-7 text-muted-foreground"
                key={item}
              >
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-5">
            <Link className={designTokens.buttonPrimary} to="/repo-workflow">
              {siteCopy.architecture.inspect.cta}
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
