import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { easeOutExpo, inViewOnce } from '../../lib/motion';

interface SectionHeadingProps {
  id?: string;
  index: string;
  eyebrow: string;
  title: string;
  action?: ReactNode;
  tone?: 'light' | 'dark';
  align?: 'left' | 'center';
}

// Shared typographic system for section headers: indexed eyebrow, large display title, optional action on the right.
const SectionHeading = ({ id, index, eyebrow, title, action, tone = 'light', align = 'left' }: SectionHeadingProps) => {
  const muted = tone === 'dark' ? 'text-paper/45' : 'text-ink/45';
  const centered = align === 'center';

  return (
    <div
      className={`flex flex-col gap-6 ${centered ? 'items-center text-center' : 'lg:flex-row lg:items-end lg:justify-between'}`}
    >
      <div className={centered ? 'flex flex-col items-center' : undefined}>
        <motion.p
          className={`flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] ${muted}`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={inViewOnce}
          transition={{ duration: 0.8 }}
        >
          <span className="tabular-nums">{index}</span>
          <span aria-hidden="true" className="h-px w-8 bg-current" />
          <span>{eyebrow}</span>
        </motion.p>
        <h2 id={id} className="type-display mt-5 max-w-3xl overflow-hidden pb-[0.1em]">
          <motion.span
            className="block"
            initial={{ y: '100%' }}
            whileInView={{ y: 0 }}
            viewport={inViewOnce}
            transition={{ duration: 1, ease: easeOutExpo }}
          >
            {title}
          </motion.span>
        </h2>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export default SectionHeading;
