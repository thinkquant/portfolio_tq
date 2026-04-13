import type { ReactNode } from 'react';

type PrimitiveTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

type PrimitiveProps = {
  children?: ReactNode;
  className?: string;
};

type PageHeadingProps = {
  eyebrow?: string;
  title: string;
  lead?: string;
  actions?: ReactNode;
  className?: string;
};

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  lead?: string;
  className?: string;
};

type CardProps = PrimitiveProps & {
  tone?: Extract<PrimitiveTone, 'neutral' | 'accent'>;
};

type ProofTagProps = PrimitiveProps & {
  tone?: PrimitiveTone;
};

type CalloutProps = PrimitiveProps & {
  title: string;
  tone?: PrimitiveTone;
};

type MetricTileProps = {
  label: string;
  value: string;
  detail?: string;
  tone?: PrimitiveTone;
  className?: string;
};

type EmptyStateProps = {
  title: string;
  message: string;
  action?: ReactNode;
  className?: string;
};

type DemoLauncherPanelProps = {
  title: string;
  body: string;
  ctaLabel?: string;
  href?: string;
  meta?: ReactNode;
  className?: string;
};

type ArchitecturePanelFrameProps = PrimitiveProps & {
  title: string;
  kicker?: string;
};

const toneClasses: Record<PrimitiveTone, string> = {
  neutral: 'border-border bg-card text-card-foreground',
  accent: 'border-primary/25 bg-accent text-accent-foreground',
  success: 'border-emerald-300/40 bg-emerald-300/10 text-emerald-100',
  warning: 'border-orange-300/40 bg-orange-300/10 text-orange-100',
  danger: 'border-rose-300/40 bg-rose-300/10 text-rose-100',
};

const proofToneClasses: Record<PrimitiveTone, string> = {
  neutral: 'border-border bg-muted text-muted-foreground',
  accent: 'border-primary bg-primary text-primary-foreground',
  success: 'border-emerald-300/40 bg-emerald-300/15 text-emerald-100',
  warning: 'border-orange-300/40 bg-orange-300/15 text-orange-100',
  danger: 'border-rose-300/40 bg-rose-300/15 text-rose-100',
};

export const designTokens = {
  pageSection: 'grid gap-8',
  insetSection:
    'rounded-[var(--radius)] border border-border bg-card p-6 text-card-foreground shadow-lg shadow-black/15 sm:p-8',
  cardSurface:
    'rounded-[var(--radius)] border border-border bg-card p-5 text-card-foreground shadow-xl shadow-black/20',
  headingSerif: 'font-[family-name:var(--font-serif)] tracking-normal',
  focusRing:
    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background',
} as const;

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

export function PageHeading({
  eyebrow,
  title,
  lead,
  actions,
  className,
}: PageHeadingProps) {
  return (
    <section
      className={cx(
        'rounded-[var(--radius)] border border-border bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.2),transparent_34%),linear-gradient(135deg,rgba(38,38,38,0.96),rgba(23,23,23,0.98))] p-8 text-card-foreground shadow-2xl shadow-black/30 sm:p-12',
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-xs font-black uppercase tracking-normal text-primary">
          {eyebrow}
        </p>
      ) : null}
      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <h1
            className={cx(
              designTokens.headingSerif,
              'max-w-4xl text-4xl leading-none text-foreground',
            )}
          >
            {title}
          </h1>
          {lead ? (
            <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground">
              {lead}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cx('grid gap-3', className)}>
      {eyebrow ? (
        <p className="text-xs font-black uppercase tracking-normal text-primary">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cx(
          designTokens.headingSerif,
          'text-3xl leading-tight text-foreground',
        )}
      >
        {title}
      </h2>
      {lead ? (
        <p className="max-w-3xl leading-7 text-muted-foreground">{lead}</p>
      ) : null}
    </div>
  );
}

export function Card({ children, className, tone = 'neutral' }: CardProps) {
  return (
    <article
      className={cx(
        designTokens.cardSurface,
        tone === 'accent' && 'border-primary/25 bg-accent text-accent-foreground',
        className,
      )}
    >
      {children}
    </article>
  );
}

export function ProofTag({
  children,
  className,
  tone = 'neutral',
}: ProofTagProps) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-[var(--radius)] border px-3 py-1 text-xs font-black uppercase tracking-normal',
        proofToneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Callout({
  children,
  className,
  title,
  tone = 'accent',
}: CalloutProps) {
  return (
    <aside
      className={cx(
        'rounded-[var(--radius)] border p-5 shadow-xl shadow-black/15',
        toneClasses[tone],
        className,
      )}
    >
      <h3 className="font-[family-name:var(--font-serif)] text-xl text-foreground">
        {title}
      </h3>
      <div className="mt-3 leading-7 text-current/90">{children}</div>
    </aside>
  );
}

export function MetricTile({
  label,
  value,
  detail,
  tone = 'neutral',
  className,
}: MetricTileProps) {
  return (
    <article
      className={cx(
        'rounded-[var(--radius)] border p-5 shadow-xl shadow-black/15',
        toneClasses[tone],
        className,
      )}
    >
      <p className="text-xs font-black uppercase tracking-normal opacity-75">
        {label}
      </p>
      <strong className="mt-3 block font-[family-name:var(--font-serif)] text-4xl leading-none text-foreground">
        {value}
      </strong>
      {detail ? (
        <p className="mt-3 text-sm leading-6 opacity-80">{detail}</p>
      ) : null}
    </article>
  );
}

export function EmptyState({
  title,
  message,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cx(
        'rounded-[var(--radius)] border border-dashed border-border bg-card p-6 text-center shadow-lg shadow-black/10',
        className,
      )}
    >
      <h3 className="font-[family-name:var(--font-serif)] text-2xl text-foreground">
        {title}
      </h3>
      <p className="mx-auto mt-3 max-w-2xl leading-7 text-muted-foreground">
        {message}
      </p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function DemoLauncherPanel({
  title,
  body,
  ctaLabel = 'Open demo',
  href,
  meta,
  className,
}: DemoLauncherPanelProps) {
  const cta = (
    <span className="inline-flex min-h-11 items-center rounded-[var(--radius)] bg-primary px-5 py-2 text-sm font-black text-primary-foreground shadow-lg shadow-slate-950/30 transition hover:bg-chart-2">
      {ctaLabel}
    </span>
  );

  return (
    <article
      className={cx(
        'rounded-[var(--radius)] border border-primary/20 bg-accent p-6 text-accent-foreground shadow-xl shadow-black/15',
        className,
      )}
    >
      <h3 className="font-[family-name:var(--font-serif)] text-2xl text-foreground">
        {title}
      </h3>
      <p className="mt-3 leading-7 text-current/85">{body}</p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {href ? (
          <a className={designTokens.focusRing} href={href}>
            {cta}
          </a>
        ) : (
          cta
        )}
        {meta ? <div className="text-sm text-current/75">{meta}</div> : null}
      </div>
    </article>
  );
}

export function ArchitecturePanelFrame({
  children,
  className,
  kicker,
  title,
}: ArchitecturePanelFrameProps) {
  return (
    <figure
      className={cx(
        'rounded-[var(--radius)] border border-border bg-[linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] p-5 shadow-2xl shadow-black/20',
        className,
      )}
    >
      <figcaption className="mb-4">
        {kicker ? (
          <p className="text-xs font-black uppercase tracking-normal text-primary">
            {kicker}
          </p>
        ) : null}
        <h3 className="mt-2 font-[family-name:var(--font-serif)] text-2xl text-foreground">
          {title}
        </h3>
      </figcaption>
      <div className="rounded-[var(--radius)] border border-border bg-background/70 p-5">
        {children}
      </div>
    </figure>
  );
}
