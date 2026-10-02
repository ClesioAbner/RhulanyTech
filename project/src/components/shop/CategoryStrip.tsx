import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { easeOutExpo } from '../../lib/motion';
import { BLEED_GUTTER, BLEED_SCROLL_PAD } from './Shelf';

export interface StripItem {
  key: string;
  to: string;
  label: string;
  image?: string;
  /** Small muted line under the label, e.g. a product count. */
  meta?: string;
}

interface CategoryStripProps {
  label: string;
  items: StripItem[];
  activeKey?: string;
  /** Shared layout id for the active marker; set it to animate between items. */
  markerId?: string;
}

/** Row of small photos with names: the shop's visual index of categories and ranges. */
const CategoryStrip = ({ label, items, activeKey, markerId }: CategoryStripProps) => {
  const listRef = useRef<HTMLUListElement>(null);

  // Keep the active item in view where the row scrolls sideways.
  useEffect(() => {
    const active = listRef.current?.querySelector<HTMLElement>('[aria-current="page"]');
    const list = listRef.current;
    if (!active || !list) return;
    const offset = active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2;
    list.scrollTo({ left: offset, behavior: 'smooth' });
  }, [activeKey]);

  return (
    <nav aria-label={label}>
      <motion.ul
        ref={listRef}
        className={`relative flex gap-3 overflow-x-auto pb-2 pt-2 [scrollbar-width:none] sm:gap-5 [&::-webkit-scrollbar]:hidden ${BLEED_GUTTER} ${BLEED_SCROLL_PAD}`}
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } } }}
      >
        {items.map((item) => {
          const isActive = item.key === activeKey;
          return (
            <motion.li
              key={item.key}
              className="shrink-0 snap-start"
              variants={{
                hidden: { opacity: 0, y: 14 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOutExpo } },
              }}
            >
              <Link
                to={item.to}
                aria-current={isActive ? 'page' : undefined}
                className="group flex w-[104px] flex-col items-center text-center sm:w-[120px]"
              >
                <span
                  className={`relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-mist transition-[box-shadow,transform] duration-500 ease-out-expo group-hover:-translate-y-0.5 ${
                    isActive ? 'ring-2 ring-ink ring-offset-2 ring-offset-paper' : ''
                  }`}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.06]"
                    />
                  ) : (
                    <span className="grid h-full place-items-center font-display text-lg font-medium tracking-tight text-ink/70">
                      {item.label}
                    </span>
                  )}
                </span>
                <span
                  className={`relative mt-3 text-[13px] leading-tight transition-colors duration-300 ${
                    isActive ? 'font-medium text-ink' : 'text-ink/70 group-hover:text-ink'
                  }`}
                >
                  {item.label}
                  {isActive && markerId && (
                    <motion.span
                      layoutId={markerId}
                      className="absolute inset-x-0 -bottom-1.5 h-px bg-ink"
                      transition={{ duration: 0.45, ease: easeOutExpo }}
                    />
                  )}
                </span>
                {item.meta && <span className="mt-1.5 text-[11px] tabular-nums text-ink/40">{item.meta}</span>}
              </Link>
            </motion.li>
          );
        })}
      </motion.ul>
    </nav>
  );
};

export default CategoryStrip;
