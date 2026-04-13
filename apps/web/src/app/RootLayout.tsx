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

      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-10">
        <header className="sticky top-3 z-40 rounded-[var(--radius)] border border-border/80 bg-card/90 p-4 shadow-2xl shadow-black/25 backdrop-blur-xl sm:top-5 sm:p-5">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <Link
              aria-label="Go to portfolio home"
              className="group grid max-w-3xl gap-2 text-left no-underline"
              to="/"
            >
              <span className="text-xs font-black uppercase tracking-normal text-primary">
                thinkquant
              </span>
              <span className="font-serif text-3xl tracking-normal text-foreground transition group-hover:text-primary">
                {appHeaderTitle}
              </span>
              <span className="max-w-2xl text-sm leading-6 text-muted-foreground">
                Capture ambiguity. Process chaos. Produce ordered action.
              </span>
            </Link>

            <nav
              aria-label="Primary navigation"
              className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 text-sm [scrollbar-width:none] sm:flex-wrap sm:overflow-visible"
            >
              {primaryNavigation.map((item) => {
                const active = isNavigationActive(item.href, pathname);

                return (
                  <Link
                    aria-current={active ? 'page' : undefined}
                    className={[
                      'min-h-11 shrink-0 rounded-[var(--radius)] border px-4 py-2.5 font-semibold transition focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background',
                      active
                        ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-slate-950/30'
                        : 'border-border bg-card/70 text-muted-foreground hover:border-primary/60 hover:bg-accent hover:text-foreground',
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

        <footer className="mt-auto rounded-[var(--radius)] border border-border bg-card/85 px-5 py-6 text-sm text-muted-foreground sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-3xl leading-6">
              {repositoryMetadata.productName} is a public-safe portfolio shell
              for AI-native workflow demos; backend secrets stay out of the
              frontend bundle.
            </p>
            <div className="flex flex-wrap gap-3" aria-label="Footer links">
              {primaryNavigation.map((item) => (
                <Link
                  className="inline-flex min-h-11 items-center rounded-[var(--radius)] border border-border px-3 py-2 text-muted-foreground transition hover:border-primary/50 hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
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
