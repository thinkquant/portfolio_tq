import {
  ArchitecturePanelFrame,
  Card,
  designTokens,
  PageHeading,
  SectionHeading,
} from '@portfolio-tq/ui';
import { Link } from 'react-router-dom';

import { architectureCopy } from '@/content/architectureCopy';

export function ArchitecturePage() {
  return (
    <div className={designTokens.pageSection}>
      <PageHeading
        eyebrow={architectureCopy.eyebrow}
        lead={architectureCopy.body}
        title={architectureCopy.title}
      />

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
        <div className="grid max-w-3xl content-start gap-5">
          <SectionHeading
            eyebrow="System shape"
            lead={architectureCopy.systemShape.body}
            title={architectureCopy.systemShape.title}
          />
          <p className={designTokens.bodyText}>
            {architectureCopy.whyItMatters.body}
          </p>
        </div>

        <Card className="grid content-start gap-3">
          <p className={designTokens.label}>
            {architectureCopy.whyItMatters.title}
          </p>
          <p className={designTokens.bodyTextTight}>
            {architectureCopy.whyItMatters.body}
          </p>
        </Card>
      </section>

      <section className="grid gap-7 border-y border-border/80 py-10 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-12">
        <SectionHeading
          eyebrow="Composition"
          lead={architectureCopy.systemShape.body}
          title="Shared runtime layers"
        />

        <div className="grid gap-0 divide-y divide-border/80">
          {architectureCopy.systemShape.structure.map((layer, index) => (
            <article
              className="grid gap-3 py-5 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-5"
              key={layer}
            >
              <span className="font-mono text-sm font-semibold text-primary">
                0{index + 1}
              </span>
              <p className="font-serif text-[1.375rem] font-semibold leading-tight text-foreground [text-wrap:balance]">
                {layer}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12">
        <div className="grid content-start gap-6">
          <SectionHeading
            eyebrow="Environment discipline"
            lead={architectureCopy.environmentModel.body}
            title={architectureCopy.environmentModel.title}
          />
          <p className={designTokens.bodyTextTight}>
            {architectureCopy.environmentModel.supportingLine}
          </p>

          <div className="grid gap-3">
            {architectureCopy.environmentModel.mapping.map((mapping) => (
              <div
                className="rounded-[var(--radius)] border border-border/80 bg-card p-4 text-base leading-7 text-muted-foreground [text-wrap:pretty]"
                key={mapping}
              >
                {mapping}
              </div>
            ))}
          </div>
        </div>

        <ArchitecturePanelFrame
          kicker="Delivery path"
          title={architectureCopy.deliveryModel.title}
        >
          <ol className="grid gap-3 text-base leading-7 text-muted-foreground">
            {architectureCopy.deliveryModel.flow.map((step, index) => (
              <li
                className="grid gap-2 rounded-[var(--radius)] border border-border/80 bg-background/70 p-4"
                key={step}
              >
                <span className="font-mono text-[0.75rem] font-semibold text-primary">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </ArchitecturePanelFrame>
      </section>

      <section className="grid gap-6 rounded-[var(--radius)] border border-border/80 bg-card p-6 text-card-foreground shadow-lg shadow-black/10 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="grid gap-5">
          <SectionHeading
            eyebrow="Inspection"
            lead={architectureCopy.inspect.list.join(', ')}
            title={architectureCopy.inspect.title}
          />
          <ul className="flex flex-wrap gap-2">
            {architectureCopy.inspect.list.map((item) => (
              <li
                className="rounded-[var(--radius)] border border-border/80 bg-background/60 px-3 py-2 text-sm font-semibold leading-6 text-muted-foreground"
                key={item}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <Link className={designTokens.buttonPrimary} to="/repo-workflow">
          {architectureCopy.inspect.cta}
        </Link>
      </section>
    </div>
  );
}
