import { Link, Outlet, useLocation, useNavigation } from 'react-router-dom';

import { ProtectedEmailLink } from '@/components/ProtectedEmail';
import { shellCopy } from '@/content/sharedCopy';

function isNavigationActive(href: string, pathname: string): boolean {
  if (href === '/') {
    return pathname === '/';
  }

  if (href === '/work') {
    return pathname === '/work' || pathname.startsWith('/projects/');
  }

  if (href === '/demo') {
    return pathname === '/demo' || pathname.startsWith('/demo/');
  }

  return pathname === href;
}

export function RootLayout() {
  const { pathname } = useLocation();
  const navigation = useNavigation();
  const isNavigating = navigation.state !== 'idle';
  const shellNavigation = shellCopy.navigation;

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-[var(--radius)] focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
        href="#main-content"
      >
        Skip to content
      </a>

      <div className="mx-auto flex min-h-screen w-full max-w-[82rem] flex-col px-5 py-4 sm:px-7 sm:py-5 lg:px-10 lg:py-6">
        <header className="sticky top-0 z-40 bg-background/92 pb-3 pt-1 backdrop-blur-xl">
          <div className="grid gap-4 border-b border-border/80 pb-3">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <Link
                aria-label="Go to portfolio home"
                className="group grid max-w-3xl gap-2 text-left no-underline"
                to="/"
              >
                <span className="text-[0.75rem] font-semibold uppercase tracking-[0.11em] text-primary/80">
                  {shellCopy.brand}
                </span>
                <span className="font-serif text-[2rem] font-semibold leading-none tracking-normal text-foreground transition group-hover:text-primary sm:text-[2.35rem]">
                  {shellCopy.primaryLockup}
                </span>
                <span className="max-w-[56ch] text-[0.9375rem] leading-6 text-muted-foreground [text-wrap:pretty]">
                  {shellCopy.secondaryLine}
                </span>
                <span className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                  {shellCopy.utilityLine}
                </span>
              </Link>

              <nav
                aria-label="Primary navigation"
                className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 text-sm [scrollbar-width:none] sm:flex-wrap sm:overflow-visible lg:justify-end"
              >
                {shellNavigation.map((item) => {
                  const active = isNavigationActive(item.href, pathname);

                  return (
                    <Link
                      aria-current={active ? 'page' : undefined}
                      className={[
                        'min-h-11 shrink-0 rounded-[var(--radius)] border px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background',
                        active
                          ? 'border-primary/80 bg-primary text-primary-foreground'
                          : 'border-transparent bg-transparent text-muted-foreground hover:border-border/80 hover:bg-card/75 hover:text-foreground',
                      ].join(' ')}
                      key={item.href}
                      to={item.href}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </header>

        <main
          className="flex-1 pb-4 pt-[3.75rem] sm:pb-5 sm:pt-16 lg:pb-6 lg:pt-[4.25rem]"
          id="main-content"
          tabIndex={-1}
        >
          <div className="mx-auto grid w-full gap-8">
            {isNavigating ? (
              <div
                aria-live="polite"
                className="rounded-[var(--radius)] border border-primary/20 bg-accent px-4 py-3 text-sm text-accent-foreground"
                role="status"
              >
                {shellCopy.states.loadingLabel}...
              </div>
            ) : null}
            <Outlet />
          </div>
        </main>

        <footer className="mt-auto border-t border-border/80 py-6 text-sm text-muted-foreground">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
            <div className="grid gap-3">
              <p className="font-semibold text-foreground">
                {shellCopy.footer.line1}
              </p>
              <p className="max-w-[60ch] leading-6">
                {shellCopy.footer.line2}
              </p>
              <p className="text-[0.75rem] uppercase tracking-[0.1em] text-muted-foreground">
                {shellCopy.footer.note}
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-[auto_auto]">
              <div className="flex flex-wrap gap-2" aria-label="Footer links">
                {shellCopy.footer.navigation.map((item) =>
                  item.href.startsWith('http') ? (
                    <a
                      className="inline-flex min-h-11 items-center rounded-[var(--radius)] border border-transparent px-3 py-2 text-muted-foreground transition hover:border-border/80 hover:bg-card hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                      href={item.href}
                      key={item.label}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      className="inline-flex min-h-11 items-center rounded-[var(--radius)] border border-transparent px-3 py-2 text-muted-foreground transition hover:border-border/80 hover:bg-card hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                      key={item.label}
                      to={item.href}
                    >
                      {item.label}
                    </Link>
                  ),
                )}
              </div>

              <div className="grid gap-2">
                {shellCopy.footer.contacts.map((contact) =>
                  contact.label === 'Email' ? (
                    <ProtectedEmailLink
                      className="w-fit border-0 bg-transparent p-0 text-left text-muted-foreground transition hover:text-foreground"
                      key={contact.label}
                      revealLabel={contact.label}
                    />
                  ) : contact.href ? (
                    <a
                      className="text-muted-foreground transition hover:text-foreground"
                      href={contact.href}
                      key={contact.label}
                      rel={
                        contact.href.startsWith('http')
                          ? 'noreferrer'
                          : undefined
                      }
                      target={
                        contact.href.startsWith('http') ? '_blank' : undefined
                      }
                    >
                      {contact.label}
                    </a>
                  ) : (
                    <span key={contact.label}>{contact.label}</span>
                  ),
                )}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
