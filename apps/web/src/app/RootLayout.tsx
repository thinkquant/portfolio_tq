import { repositoryMetadata } from '@portfolio-tq/config';
import { appHeaderTitle, primaryNavigation } from '@portfolio-tq/ui';
import { Link, Outlet, useLocation } from 'react-router-dom';

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

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_10%_0%,rgba(217,119,6,0.26),transparent_28%),radial-gradient(circle_at_86%_12%,rgba(20,184,166,0.16),transparent_25%),linear-gradient(145deg,#0c0a09_0%,#17120d_48%,#080605_100%)] text-stone-100">
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-amber-300 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-stone-950"
        href="#main-content"
      >
        Skip to content
      </a>

      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-10">
        <header className="sticky top-3 z-40 rounded-[1.75rem] border border-white/10 bg-stone-950/82 p-4 shadow-2xl shadow-black/25 backdrop-blur-xl sm:top-5 sm:p-5">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <Link
              aria-label="Go to portfolio home"
              className="group grid max-w-3xl gap-2 text-left no-underline"
              to="/"
            >
              <span className="text-xs font-black uppercase tracking-[0.38em] text-amber-300">
                thinkquant
              </span>
              <span className="font-serif text-3xl tracking-[-0.045em] text-white transition group-hover:text-amber-100 sm:text-5xl">
                {appHeaderTitle}
              </span>
              <span className="max-w-2xl text-sm leading-6 text-stone-300">
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
                      'min-h-11 shrink-0 rounded-full border px-4 py-2.5 font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-200 focus:ring-offset-2 focus:ring-offset-stone-950',
                      active
                        ? 'border-amber-300 bg-amber-300 text-stone-950 shadow-lg shadow-amber-950/30'
                        : 'border-white/10 bg-white/[0.03] text-stone-300 hover:border-amber-300/70 hover:bg-white/[0.07] hover:text-white',
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
            <Outlet />
          </div>
        </main>

        <footer className="mt-auto rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-5 py-6 text-sm text-stone-400 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-3xl leading-6">
              {repositoryMetadata.productName} is a public-safe portfolio shell
              for AI-native workflow demos; backend secrets stay out of the
              frontend bundle.
            </p>
            <div className="flex flex-wrap gap-3" aria-label="Footer links">
              {primaryNavigation.map((item) => (
                <Link
                  className="text-stone-300 underline decoration-white/20 underline-offset-4 transition hover:text-amber-200"
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
