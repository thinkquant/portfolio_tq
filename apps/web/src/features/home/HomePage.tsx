import {
  Callout,
  Card,
  designTokens,
  ProofTag,
  SectionHeading,
} from '@portfolio-tq/ui';
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

      <div className={designTokens.pageSection}>
        <section
          className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_0.95fr]"
          id="home-content"
        >
          <div className="grid gap-4">
            <SectionHeading
              eyebrow={siteCopy.home.whatThisIs.title}
              lead={siteCopy.home.whatThisIs.body}
              title={siteCopy.home.doctrine.title}
            />
            <p className={designTokens.bodyText}>
              {siteCopy.home.doctrine.supportingLine}
            </p>
          </div>

          <Callout title={siteCopy.home.doctrine.title}>
            <div className="flex flex-wrap gap-2">
              {siteCopy.home.doctrine.steps.map((step) => (
                <ProofTag key={step} tone="accent">
                  {step}
                </ProofTag>
              ))}
            </div>
          </Callout>
        </section>

        <section className="grid gap-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
            <SectionHeading
              eyebrow={siteCopy.home.featuredSurfaces.title}
              lead={siteCopy.home.closing.body}
              title={siteCopy.home.featuredSurfaces.title}
            />
            <p className={designTokens.bodyTextTight}>
              {siteCopy.home.publicBuildNote.body}
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-4">
            {siteCopy.home.featuredSurfaces.tiles.map((tile) => (
              <Card className="grid gap-5" key={tile.href}>
                <div className="grid gap-3">
                  <h3 className="max-w-[18ch] font-serif text-[1.55rem] leading-tight text-foreground">
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

      <section className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_1.1fr]">
        <div className="grid gap-4">
          <SectionHeading
              eyebrow={siteCopy.home.proofPieces.title}
              lead={siteCopy.home.publicBuildNote.body}
              title={siteCopy.home.proofPieces.title}
          />
          <p className={designTokens.bodyText}>
              {siteCopy.home.publicBuildNote.body}
          </p>
        </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {siteCopy.home.proofPieces.items.map((item, index) => (
              <Card className="grid gap-3" key={item.title}>
                <div className="flex flex-wrap gap-2">
                  {portfolioProjectsCopy[index]?.filterTags.slice(0, 2).map((tag) => (
                    <ProofTag key={tag}>{tag}</ProofTag>
                  ))}
                </div>
                <h3 className="font-serif text-[1.45rem] leading-tight text-foreground">
                  {item.title}
                </h3>
                <p className={designTokens.bodyTextTight}>{item.body}</p>
              </Card>
            ))}
          </div>
      </section>

      <section className="grid gap-6">
        <SectionHeading
            eyebrow={siteCopy.home.closing.title}
            lead={siteCopy.home.closing.body}
            title={siteCopy.home.publicBuildNote.title}
        />
          <div className="flex flex-wrap gap-3">
            <HomeLink to="/work">{siteCopy.home.closing.primaryCta}</HomeLink>
            <HomeLink to="/architecture" tone="secondary">
              {siteCopy.home.publicBuildNote.cta}
            </HomeLink>
            <a
              className={designTokens.buttonSecondary}
              href="https://github.com/thinkquant/portfolio_tq"
              rel="noreferrer"
              target="_blank"
            >
              {siteCopy.home.hero.tertiaryCta}
            </a>
          </div>
          <div className="grid gap-5 lg:grid-cols-4">
            {siteCopy.home.featuredSurfaces.tiles.map((tile) => (
              <Card className="grid gap-3" key={`closing-${tile.href}`}>
                <h3 className="font-serif text-[1.3rem] leading-tight text-foreground">
                  {tile.title}
                </h3>
                <p className={designTokens.bodyTextTight}>{tile.body}</p>
                <HomeLink tone="secondary" to={tile.href}>
                  {tile.cta}
                </HomeLink>
              </Card>
            ))}
          </div>
      </section>
      </div>
    </div>
  );
}
