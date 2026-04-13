import { Callout, ProofTag, SectionHeading } from '@portfolio-tq/ui';
import type { ReactNode } from 'react';

type DemoAccessShellProps = {
  children: ReactNode;
};

const accessStates = [
  {
    title: 'Reviewer entry',
    tag: 'Access code',
    body: 'Future reviewer codes can unlock runnable demo execution while keeping public portfolio pages browseable.',
  },
  {
    title: 'Locked',
    tag: 'No code',
    body: 'The route can show project context and shell structure without exposing execution controls.',
  },
  {
    title: 'Access denied',
    tag: 'Invalid code',
    body: 'The shell reserves space for a clear denial message without rerouting or redesigning the demo pages.',
  },
];

export function DemoAccessShell({ children }: DemoAccessShellProps) {
  return (
    <div className="grid gap-8">
      <section className="grid gap-5 rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/15">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow="Demo access shell"
            lead="The selected placeholder model is an access code gate. It is shell-only for now: no secrets, no real auth state, and no client-side code values are committed."
            title="Controlled demo access can land here later."
          />

          <Callout title="Public routes remain public" tone="success">
            This wrapper is applied only to `/demo` routes. Portfolio, project,
            architecture, observability, and repo-workflow pages remain outside
            the access shell.
          </Callout>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <form className="grid content-start gap-3 rounded-lg border border-white/10 bg-stone-950/52 p-4">
            <label className="grid gap-2 text-sm font-bold text-stone-300">
              Reviewer access code
              <input
                className="min-h-11 rounded-lg border border-white/10 bg-stone-950/70 px-4 py-2 text-sm text-stone-300"
                disabled
                placeholder="Access code placeholder"
                type="text"
              />
            </label>
            <button
              className="min-h-11 rounded-lg bg-amber-300 px-5 py-2 text-sm font-black text-stone-950 opacity-70"
              disabled
              type="button"
            >
              Validate later
            </button>
            <p className="text-sm leading-6 text-stone-400">
              Validation will move behind the API/access-code store in a later
              checklist. This shell only reserves the interaction and state
              model.
            </p>
          </form>

          <div className="grid gap-3 md:grid-cols-3">
            {accessStates.map((state) => (
              <article
                className="grid content-start gap-3 rounded-lg border border-white/10 bg-stone-950/52 p-4"
                key={state.title}
              >
                <div className="flex flex-wrap gap-2">
                  <ProofTag tone={state.title === 'Access denied' ? 'danger' : 'neutral'}>
                    {state.tag}
                  </ProofTag>
                </div>
                <h3 className="font-serif text-2xl text-white">
                  {state.title}
                </h3>
                <p className="text-sm leading-6 text-stone-300">
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
