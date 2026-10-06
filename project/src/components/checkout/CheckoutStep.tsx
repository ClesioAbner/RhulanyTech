import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { easeOutExpo } from '../../lib/motion';

interface StepProps {
  index: number;
  current: number;
  title: string;
  summary?: ReactNode;
  onEdit: () => void;
  children: ReactNode;
}

/** One checkout step: open while active, folded into a summary line once done. */
const CheckoutStep = ({ index, current, title, summary, onEdit, children }: StepProps) => {
  const active = index === current;
  const done = index < current;
  return (
    <section
      className={`rounded-[28px] bg-white p-6 transition-opacity duration-500 sm:p-8 ${!active && !done ? 'opacity-55' : ''}`}
      aria-labelledby={`passo-${index}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <span
            className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-medium tabular-nums ${
              active || done ? 'bg-ink text-paper' : 'bg-ink/[0.07] text-ink/45'
            }`}
          >
            {done ? (
              <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
                <path
                  d="M2.5 6.2l2.2 2.2 4.8-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              index + 1
            )}
          </span>
          <div className="min-w-0">
            <h2 id={`passo-${index}`} className="type-heading">
              {title}
            </h2>
            {done && summary && <div className="mt-1.5 text-sm leading-relaxed text-ink/55">{summary}</div>}
          </div>
        </div>
        {done && (
          <button type="button" onClick={onEdit} className="link-underline shrink-0 pt-1 text-sm text-ink/60 hover:text-ink">
            Alterar
          </button>
        )}
      </div>
      <AnimatePresence initial={false}>
        {active && (
          <motion.div
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
          >
            <div className="pt-7">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CheckoutStep;
