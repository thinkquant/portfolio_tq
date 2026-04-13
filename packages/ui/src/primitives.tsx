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
  neutral: 'border-white/10 bg-white/[0.04] text-stone-200',
  accent: 'border-amber-300/40 bg-amber-300/10 text-amber-100',
  success: 'border-emerald-300/40 bg-emerald-300/10 text-emerald-100',
  warning: 'border-orange-300/40 bg-orange-300/10 text-orange-100',
  danger: 'border-rose-300/40 bg-rose-300/10 text-rose-100',
};

const proofToneClasses: Record<PrimitiveTone, string> = {
  neutral: 'border-white/10 bg-white/[0.04] text-stone-300',
  accent: 'border-amber-300/50 bg-amber-300 text-stone-950',
  success: 'border-emerald-300/40 bg-emerald-300/15 text-emerald-100',
  warning: 'border-orange-300/40 bg-orange-300/15 text-orange-100',
  danger: 'border-rose-300/40 bg-rose-300/15 text-rose-100',
};

export const designTokens = {
  pageSection: 'grid gap-8',
  insetSection:
    'rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 sm:p-8',
  cardSurface:
    'rounded-[1.5rem] border border-white/10 bg-stone-950/52 p-5 shadow-xl shadow-black/20',
  headingSerif: 'font-serif tracking-[-0.045em]',
  focusRing:
    'focus:outline-none focus:ring-2 focus:ring-amber-200 focus:ring-offset-2 focus:ring-offset-stone-950',
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
        'rounded-[2.5rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),transparent_34%),linear-gradient(135deg,rgba(28,25,23,0.96),rgba(12,10,9,0.96))] p-8 shadow-2xl shadow-black/30 sm:p-12',
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-xs font-black uppercase tracking-[0.32em] text-amber-300">
          {eyebrow}
        </p>
      ) : null}
      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <h1
            className={cx(
              designTokens.headingSerif,
              'max-w-4xl text-4xl leading-none text-white sm:text-6xl',
            )}
          >
            {title}
          </h1>
          {lead ? (
            <p className="mt-6 max-w-3xl text-base leading-8 text-stone-300 sm:text-lg">
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
        <p className="text-xs font-black uppercase tracking-[0.26em] text-amber-300">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cx(
          designTokens.headingSerif,
          'text-2xl leading-tight text-white sm:text-4xl',
        )}
      >
        {title}
      </h2>
      {lead ? (
        <p className="max-w-3xl leading-7 text-stone-300">{lead}</p>
      ) : null}
    </div>
  );
}

export function Card({ children, className, tone = 'neutral' }: CardProps) {
  return (
    <article
      className={cx(
        designTokens.cardSurface,
        tone === 'accent' && 'border-amber-300/30 bg-amber-300/10',
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
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.16em]',
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
        'rounded-[1.5rem] border p-5 shadow-xl shadow-black/15',
        toneClasses[tone],
        className,
      )}
    >
      <h3 className="font-serif text-xl text-white">{title}</h3>
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
        'rounded-[1.35rem] border p-5 shadow-xl shadow-black/15',
        toneClasses[tone],
        className,
      )}
    >
      <p className="text-xs font-black uppercase tracking-[0.22em] opacity-75">
        {label}
      </p>
      <strong className="mt-3 block font-serif text-4xl leading-none text-white">
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
        'rounded-[1.5rem] border border-dashed border-white/20 bg-white/[0.03] p-6 text-center',
        className,
      )}
    >
      <h3 className="font-serif text-2xl text-white">{title}</h3>
      <p className="mx-auto mt-3 max-w-2xl leading-7 text-stone-300">
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
    <span className="inline-flex min-h-11 items-center rounded-full bg-amber-300 px-5 py-2 text-sm font-black text-stone-950 shadow-lg shadow-amber-950/30">
      {ctaLabel}
    </span>
  );

  return (
    <article
      className={cx(
        'rounded-[1.75rem] border border-amber-300/30 bg-amber-300/10 p-6',
        className,
      )}
    >
      <h3 className="font-serif text-2xl text-white">{title}</h3>
      <p className="mt-3 leading-7 text-amber-50/85">{body}</p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {href ? (
          <a className={designTokens.focusRing} href={href}>
            {cta}
          </a>
        ) : (
          cta
        )}
        {meta ? <div className="text-sm text-amber-100/75">{meta}</div> : null}
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
        'rounded-[1.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.025))] p-5 shadow-2xl shadow-black/20',
        className,
      )}
    >
      <figcaption className="mb-4">
        {kicker ? (
          <p className="text-xs font-black uppercase tracking-[0.22em] text-teal-200">
            {kicker}
          </p>
        ) : null}
        <h3 className="mt-2 font-serif text-2xl text-white">{title}</h3>
      </figcaption>
      <div className="rounded-[1.25rem] border border-white/10 bg-stone-950/60 p-5">
        {children}
      </div>
    </figure>
  );
}
