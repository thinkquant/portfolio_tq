import { motion } from 'framer-motion';
import { ArrowDown, Briefcase, Mail } from 'lucide-react';
import type { SVGProps } from 'react';
import { Link } from 'react-router-dom';

import { ProtectedEmailButton } from '@/components/ProtectedEmail';
import { buttonVariants } from '@/components/ui/button';
import { siteCopy } from '@/content/textCopy';
import { cn } from '@/lib/utils';

function GitHubMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M12 1.5a10.5 10.5 0 0 0-3.32 20.46c.53.1.72-.22.72-.51v-1.96c-2.93.64-3.54-1.24-3.54-1.24-.48-1.22-1.17-1.54-1.17-1.54-.96-.65.07-.64.07-.64 1.06.07 1.62 1.09 1.62 1.09.94 1.62 2.47 1.15 3.07.88.1-.68.37-1.15.66-1.41-2.34-.27-4.8-1.17-4.8-5.22 0-1.15.41-2.08 1.08-2.81-.1-.27-.47-1.37.1-2.86 0 0 .88-.28 2.89 1.07A9.96 9.96 0 0 1 12 6.84c.9 0 1.82.12 2.67.35 2-1.35 2.88-1.07 2.88-1.07.58 1.49.21 2.59.11 2.86.68.73 1.08 1.66 1.08 2.81 0 4.06-2.47 4.95-4.82 5.21.38.33.72.97.72 1.96v2.91c0 .29.19.62.73.51A10.5 10.5 0 0 0 12 1.5Z" />
    </svg>
  );
}

function LinkedInMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M4.98 3.5a1.74 1.74 0 1 0 0 3.48 1.74 1.74 0 0 0 0-3.48ZM3.5 8.54h2.96V20.5H3.5V8.54Zm4.82 0h2.84v1.63h.04c.4-.75 1.36-1.83 2.8-1.83 2.99 0 3.54 1.97 3.54 4.53v7.63h-2.96v-6.77c0-1.61-.03-3.68-2.24-3.68-2.24 0-2.58 1.75-2.58 3.56v6.9H8.32V8.54Z" />
    </svg>
  );
}

export function HeroBlock() {
  const iconLinks = [
    {
      href: 'https://github.com/thinkquant/portfolio_tq',
      icon: GitHubMark,
      label: 'GitHub',
    },
    {
      href: 'https://www.linkedin.com/in/daniel-oosthuyzen',
      icon: LinkedInMark,
      label: 'LinkedIn',
    },
  ];

  return (
    <section className="relative flex min-h-[calc(70svh-2rem)] w-full items-start justify-center overflow-hidden border-y border-border/80 bg-background">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800f_1px,transparent_1px),linear-gradient(to_bottom,#8080800f_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-[7.25rem] pt-[3.25rem] text-center sm:px-8 sm:pt-14 lg:pb-[8.25rem] lg:pt-14">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            animate={{ scale: 1 }}
            className="mb-6 inline-block"
            initial={{ scale: 0 }}
            transition={{ delay: 0.2, stiffness: 200, type: 'spring' }}
          >
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-background bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/10">
              <span className="font-serif text-2xl font-semibold tracking-[0.06em] text-foreground">
                TQ
              </span>
            </div>
          </motion.div>

          <motion.h1
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-6 max-w-[12ch] font-serif text-5xl font-semibold leading-[0.95] text-foreground [text-wrap:balance] md:max-w-none md:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {siteCopy.home.hero.headline}
          </motion.h1>

          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-8 max-w-3xl text-[1.125rem] leading-8 text-muted-foreground [text-wrap:pretty] md:text-[1.375rem]"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {siteCopy.home.hero.subhead}
          </motion.p>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Link
              className={cn(buttonVariants({ size: 'lg' }), 'gap-2')}
              to="/work"
            >
              <Briefcase className="h-4 w-4" />
              {siteCopy.home.hero.primaryCta}
            </Link>
            <Link
              className={cn(
                buttonVariants({ size: 'lg', variant: 'outline' }),
                'gap-2',
              )}
              to="/architecture"
            >
              {siteCopy.home.hero.secondaryCta}
              <ArrowDown className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            animate={{ opacity: 1 }}
            className="flex justify-center gap-4"
            initial={{ opacity: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {iconLinks.map((item) => (
              <motion.div
                key={item.label}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  aria-label={item.label}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  href={item.href}
                  rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                >
                  <item.icon className="h-5 w-5" />
                </a>
              </motion.div>
            ))}
            <motion.div
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ProtectedEmailButton
                aria-label="Email"
                className="flex h-12 w-12 items-center justify-center rounded-full border-0 bg-secondary text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Mail className="h-5 w-5" />
              </ProtectedEmailButton>
            </motion.div>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex flex-wrap justify-center gap-2"
            initial={{ opacity: 0, y: 16 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            {siteCopy.home.heroProofStrip.map((label) => (
              <span
                className="inline-flex items-center rounded-[var(--radius)] border border-border bg-card px-2.5 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.11em] text-muted-foreground"
                key={label}
              >
                {label}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <motion.a
        animate={{ opacity: 1, y: [0, 10, 0] }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 transform"
        href="#home-content"
        initial={{ opacity: 0 }}
        transition={{
          opacity: { delay: 1, duration: 0.6 },
          y: { delay: 1.5, duration: 1.5, repeat: Infinity },
        }}
      >
        <ArrowDown className="h-6 w-6 text-muted-foreground" />
      </motion.a>
    </section>
  );
}
