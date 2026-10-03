import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Faq } from '../../data/blog';
import { easeOutExpo } from '../../lib/motion';

/** Accordion of questions; one answer open at a time, with a soft height animation. */
const FaqList = ({ items, initiallyOpen = 0 }: { items: Faq[]; initiallyOpen?: number | null }) => {
  const [open, setOpen] = useState<number | null>(initiallyOpen);
  const baseId = useId();

  return (
    <ul className="divide-y divide-ink/10 border-y border-ink/10">
      {items.map((item, index) => {
        const isOpen = open === index;
        const panelId = `${baseId}-${index}`;
        return (
          <li key={item.q}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className={`text-base font-medium transition-colors duration-300 sm:text-lg ${isOpen ? 'text-ink' : 'text-ink/80 group-hover:text-ink'}`}>
                  {item.q}
                </span>
                {/* Plus that turns into a minus: two hairlines, the vertical one folds away */}
                <span aria-hidden="true" className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink/[0.05] transition-colors group-hover:bg-ink/[0.09]">
                  <span className="absolute h-px w-3 bg-ink" />
                  <motion.span
                    className="absolute h-3 w-px bg-ink"
                    animate={{ scaleY: isOpen ? 0 : 1 }}
                    transition={{ duration: 0.35, ease: easeOutExpo }}
                  />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  className="overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: easeOutExpo }}
                >
                  <p className="max-w-2xl pb-7 pr-12 text-[15px] leading-relaxed text-ink/60">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
};

export default FaqList;
