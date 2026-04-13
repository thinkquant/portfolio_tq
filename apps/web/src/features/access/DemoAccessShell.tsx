import { Callout, ProofTag, SectionHeading } from '@portfolio-tq/ui';
import type { ReactNode } from 'react';

import { siteCopy } from '@/content/textCopy';

type DemoAccessShellProps = {
  children: ReactNode;
};

const accessStates = [
  {
    title: siteCopy.shell.states.lockedTitle,
    tag: 'Access code',
    body: siteCopy.shell.states.lockedBody,
  },
  {
    title: siteCopy.shell.states.comingSoonTitle,
    tag: 'Shell ready',
    body: siteCopy.shell.states.comingSoonBody,
  },
  {
    title: siteCopy.shell.states.errorTitle,
    tag: 'Review required',
    body: siteCopy.shell.states.errorBody,
  },
];

export function DemoAccessShell({ children }: DemoAccessShellProps) {
  return (
    <div className="grid gap-10 lg:gap-12">
      <section className="grid gap-5 rounded-[var(--radius)] border border-border bg-card p-5 shadow-xl shadow-black/15">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <SectionHeading
            eyebrow="Gate"
            lead={siteCopy.demoIndex.accessBody}
            title={siteCopy.shell.states.lockedTitle}
          />

          <Callout title={siteCopy.shell.contactPrompt.short} tone="success">
            {siteCopy.shell.contactPrompt.long}
          </Callout>
        </div>

        <div className="grid gap-5 border-t border-border/80 pt-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <form className="grid content-start gap-3 rounded-[var(--radius)] border border-border bg-background/60 p-4">
            <label className="grid gap-2 text-sm font-semibold text-foreground">
              Reviewer access code
              <input
                className="min-h-11 rounded-[var(--radius)] border border-border bg-background px-4 py-2 text-sm text-foreground"
                disabled
                placeholder="Enter access code"
                type="text"
              />
            </label>
            <button
              className="min-h-11 rounded-[var(--radius)] bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground opacity-70"
              disabled
              type="button"
            >
              {siteCopy.shell.states.loadingLabel}
            </button>
            <p className="text-base leading-7 text-muted-foreground [text-wrap:pretty]">
              {siteCopy.shell.states.lockedBody}
            </p>
          </form>

          <div className="grid gap-3 md:grid-cols-3">
            {accessStates.map((state) => (
              <article
                className="grid content-start gap-3 rounded-[var(--radius)] border border-border bg-background/60 p-4"
                key={state.title}
              >
                <div className="flex flex-wrap gap-2">
                  <ProofTag
                    tone={
                      state.title === siteCopy.shell.states.errorTitle
                        ? 'danger'
                        : 'neutral'
                    }
                  >
                    {state.tag}
                  </ProofTag>
                </div>
                <h3 className="font-serif text-2xl font-semibold leading-tight text-foreground [text-wrap:balance]">
                  {state.title}
                </h3>
                <p className="text-base leading-7 text-muted-foreground">
                  {state.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {children}
    </div>
  );
}
