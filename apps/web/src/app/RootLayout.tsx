import { repositoryMetadata } from '@portfolio-tq/config';
import { appHeaderTitle, primaryNavigation } from '@portfolio-tq/ui';
import { Link, Outlet, useLocation, useNavigation } from 'react-router-dom';

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

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-[var(--radius)] focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
        href="#main-content"
      >
        Skip to content
      </a>

      <div className="mx-auto flex min-h-screen w-full max-w-[82rem] flex-col px-5 py-5 sm:px-7 sm:py-6 lg:px-10 lg:py-7">
        <header className="sticky top-0 z-40 bg-[linear-gradient(180deg,rgba(23,23,23,0.95),rgba(23,23,23,0.88)_72%,rgba(23,23,23,0))] pb-5 pt-1 backdrop-blur-xl">
          <div className="grid gap-5 border-b border-border/80 pb-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <Link
              aria-label="Go to portfolio home"
              className="group grid max-w-3xl gap-2 text-left no-underline"
              to="/"
            >
              <span className="text-[0.7rem] font-black uppercase tracking-[0.14em] text-primary/80">
                thinkquant
              </span>
              <span className="font-serif text-[2rem] leading-none tracking-normal text-foreground transition group-hover:text-primary sm:text-[2.35rem]">
                {appHeaderTitle}
              </span>
              <span className="max-w-[56ch] text-sm leading-6 text-muted-foreground">
                Capture ambiguity. Process chaos. Produce ordered action.
              </span>
            </Link>

            <nav
              aria-label="Primary navigation"
              className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 text-sm [scrollbar-width:none] sm:flex-wrap sm:overflow-visible lg:justify-end"
            >
              {primaryNavigation.map((item) => {
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
        </header>

        <main
          className="flex-1 py-8 sm:py-10 lg:py-12"
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
                Loading route data...
              </div>
            ) : null}
            <Outlet />
          </div>
        </main>

        <footer className="mt-auto border-t border-border/80 py-6 text-sm text-muted-foreground">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <p className="max-w-[60ch] leading-6">
              {repositoryMetadata.productName} is a public-safe portfolio shell
              for AI-native workflow demos; backend secrets stay out of the
              frontend bundle.
            </p>
            <div className="flex flex-wrap gap-2" aria-label="Footer links">
              {primaryNavigation.map((item) => (
                <Link
                  className="inline-flex min-h-11 items-center rounded-[var(--radius)] border border-transparent px-3 py-2 text-muted-foreground transition hover:border-border/80 hover:bg-card hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                  key={item.href}
                  to={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
