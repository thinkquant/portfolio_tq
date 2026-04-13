import { motion } from 'framer-motion';
import { ArrowDown, Briefcase, GitBranch, User } from 'lucide-react';
import { Link } from 'react-router-dom';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function HeroBlock() {
  return (
    <section className="relative flex min-h-[calc(100svh-6rem)] w-full items-center justify-center overflow-hidden border-y border-border/80 bg-background">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800f_1px,transparent_1px),linear-gradient(to_bottom,#8080800f_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex flex-wrap justify-center gap-2"
            initial={{ opacity: 0, y: 16 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            {['Measured', 'Rigorous', 'Sovereign'].map((label) => (
              <span
                className="inline-flex items-center rounded-[var(--radius)] border border-border bg-card px-2.5 py-1 text-[0.68rem] font-black uppercase tracking-[0.12em] text-muted-foreground"
                key={label}
              >
                {label}
              </span>
            ))}
          </motion.div>

          <motion.div
            animate={{ scale: 1 }}
            className="mb-6 inline-block"
            initial={{ scale: 0 }}
            transition={{ delay: 0.2, stiffness: 200, type: 'spring' }}
          >
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-border bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.26),transparent_55%),linear-gradient(145deg,rgba(38,38,38,0.95),rgba(23,23,23,1))] shadow-lg shadow-black/20">
              <span className="font-serif text-2xl font-semibold tracking-[0.08em] text-foreground">
                TQ
              </span>
            </div>
          </motion.div>

          <motion.h1
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-6 max-w-[14ch] font-serif text-5xl leading-[0.95] text-foreground md:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Serious systems portfolio. Working proof, not ornament.
          </motion.h1>

          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-8 max-w-3xl text-lg leading-8 text-muted-foreground md:text-[1.45rem]"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Built for technical hiring managers, founders, and engineering
            leads evaluating whether ambiguity can be turned into structured,
            working products, systems, and pipelines.
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
              Explore the work
            </Link>
            <Link
              className={cn(
                buttonVariants({ size: 'lg', variant: 'outline' }),
                'gap-2',
              )}
              to="/architecture"
            >
              Read architecture
              <ArrowDown className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            animate={{ opacity: 1 }}
            className="flex justify-center gap-4"
            initial={{ opacity: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {[
              { icon: Briefcase, label: 'Work', to: '/work' },
              { icon: GitBranch, label: 'Repo workflow', to: '/repo-workflow' },
              { icon: User, label: 'About', to: '/about' },
            ].map((item) => (
              <motion.div
                key={item.label}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  aria-label={item.label}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary/60 hover:bg-accent hover:text-foreground"
                  to={item.to}
                >
                  <item.icon className="h-5 w-5" />
                </Link>
              </motion.div>
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
