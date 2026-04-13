import { Card, designTokens, ProofTag, SectionHeading } from '@portfolio-tq/ui';
import { Link } from 'react-router-dom';

import { HeroBlock } from '@/components/ui/hero-block-shadcnui';
import { portfolioProjectsCopy, siteCopy } from '@/content/textCopy';

function HomeLink({
  children,
  to,
  tone = 'primary',
}: {
  children: string;
  to: string;
  tone?: 'primary' | 'secondary';
}) {
  return (
    <Link
      className={
        tone === 'primary'
          ? designTokens.buttonPrimary
          : designTokens.buttonSecondary
      }
      to={to}
    >
      {children}
    </Link>
  );
}

export function HomePage() {
  return (
    <div className="grid gap-12 lg:gap-16">
      <HeroBlock />

      <div className="grid gap-14 lg:gap-20">
        <section
          className="grid gap-8 border-b border-border/80 pb-12 lg:grid-cols-[minmax(0,1.1fr)_22rem] lg:items-start lg:gap-12 lg:pb-16"
          id="home-content"
        >
          <div className="grid max-w-3xl gap-5">
            <SectionHeading
              eyebrow="Orientation"
              lead={siteCopy.home.whatThisIs.body}
              title={siteCopy.home.whatThisIs.title}
            />
            <p className={designTokens.bodyText}>
              {siteCopy.home.doctrine.supportingLine}
            </p>
          </div>

          <aside className="grid content-start gap-5 rounded-[var(--radius)] border border-primary/25 bg-accent p-5 text-accent-foreground">
            <div className="grid gap-2">
              <p className={designTokens.label}>Core doctrine</p>
              <h3 className="font-serif text-2xl font-semibold leading-tight text-foreground [text-wrap:balance]">
                {siteCopy.home.doctrine.title}
              </h3>
            </div>
            <ol className="grid gap-3">
              {siteCopy.home.doctrine.steps.map((step, index) => (
                <li className="flex gap-3" key={step}>
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--radius)] bg-primary text-xs font-semibold text-primary-foreground">
                    {index + 1}
                  </span>
                  <span className="text-base font-semibold leading-7 text-accent-foreground">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </aside>
        </section>

        <section className="grid gap-7">
          <div className="grid gap-5">
            <SectionHeading title={siteCopy.home.featuredSurfaces.title} />
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {siteCopy.home.featuredSurfaces.tiles.map((tile, index) => (
              <Card className="grid gap-5" key={tile.href}>
                <div className="grid gap-3">
                  <p className={designTokens.label}>0{index + 1}</p>
                  <h3 className="max-w-[18ch] font-serif text-[1.5rem] font-semibold leading-tight text-foreground [text-wrap:balance]">
                    {tile.title}
                  </h3>
                  <p className={designTokens.bodyTextTight}>{tile.body}</p>
                </div>
                <div className="pt-1">
                  <HomeLink tone="secondary" to={tile.href}>
                    {tile.cta}
                  </HomeLink>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-12">
          <div className="grid content-start gap-5">
            <SectionHeading
              eyebrow="Working evidence"
              lead={siteCopy.home.publicBuildNote.body}
              title={siteCopy.home.proofPieces.title}
            />
            <HomeLink to="/architecture" tone="secondary">
              {siteCopy.home.publicBuildNote.cta}
            </HomeLink>
          </div>

          <div className="grid gap-0 divide-y divide-border/80 border-y border-border/80">
            {siteCopy.home.proofPieces.items.map((item, index) => (
              <article
                className="grid gap-4 py-5 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-5"
                key={item.title}
              >
                <span className="font-mono text-sm font-semibold text-primary">
                  0{index + 1}
                </span>
                <div className="grid gap-3">
                  <div className="flex flex-wrap gap-2">
                    {portfolioProjectsCopy[index]?.filterTags
                      .slice(0, 2)
                      .map((tag) => (
                        <ProofTag key={tag}>{tag}</ProofTag>
                      ))}
                  </div>
                  <h3 className="font-serif text-[1.375rem] font-semibold leading-tight text-foreground [text-wrap:balance]">
                    {item.title}
                  </h3>
                  <p className={designTokens.bodyTextTight}>{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 rounded-[var(--radius)] border border-border/80 bg-card p-6 text-card-foreground shadow-lg shadow-black/10 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-10">
          <SectionHeading
            eyebrow="Public build"
            lead={siteCopy.home.closing.body}
            title={siteCopy.home.publicBuildNote.title}
          />
          <div className="flex flex-wrap gap-3 lg:max-w-sm lg:justify-end">
            <HomeLink to="/work">{siteCopy.home.closing.primaryCta}</HomeLink>
            <a
              className={designTokens.buttonSecondary}
              href="https://github.com/thinkquant/portfolio_tq"
              rel="noreferrer"
              target="_blank"
            >
              {siteCopy.home.hero.tertiaryCta}
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
