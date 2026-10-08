import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { easeOutExpo, inViewOnce } from '../../lib/motion';

interface ShelfProps {
  id: string;
  title: string;
  /** Muted continuation of the title, read as one sentence. */
  lead?: string;
  link?: { to: string; label: string };
  /** Width of each item, e.g. "w-[260px]". */
  itemClassName?: string;
  /** Outer spacing; shelves stack with generous gaps by default. */
  className?: string;
  children: ReactNode[];
}

// The scroller bleeds to the viewport edges but its first item lines up with .container-site.
const BLEED_GUTTER = 'px-5 sm:px-8 lg:px-[max(3rem,calc((100%-1360px)/2+3rem))]';
const BLEED_SCROLL_PAD = 'scroll-pl-5 sm:scroll-pl-8 lg:scroll-pl-[max(3rem,calc((100%-1360px)/2+3rem))]';

const Chevron = ({ direction }: { direction: 'left' | 'right' }) => (
  <span
    aria-hidden="true"
    className={`block h-2 w-2 border-b-[1.5px] border-r-[1.5px] border-current ${
      direction === 'left' ? 'translate-x-[1px] rotate-[135deg]' : '-translate-x-[1px] -rotate-45'
    }`}
  />
);

/** Horizontal product row: native scroll with snap, plus arrow buttons on pointer devices. */
const Shelf = ({
  id,
  title,
  lead,
  link,
  itemClassName = 'w-[72vw] sm:w-[280px]',
  className = 'mt-20 lg:mt-24',
  children,
}: ShelfProps) => {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const page = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <section aria-labelledby={id} className={className}>
      <div className="container-site flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <h2 id={id} className="type-title max-w-3xl">
          {title}
          {lead && <span className="text-ink/45"> {lead}</span>}
        </h2>
        {link && (
          <Link
            to={link.to}
            className="link-underline shrink-0 self-start text-sm text-ink/70 hover:text-ink sm:self-auto sm:pb-1"
          >
            {link.label}
          </Link>
        )}
      </div>

      <motion.ul
        ref={scrollerRef}
        id={`${id}-lista`}
        onScroll={measure}
        className={`mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-10 pt-2 [scrollbar-width:none] lg:mt-8 lg:gap-5 [&::-webkit-scrollbar]:hidden ${BLEED_GUTTER} ${BLEED_SCROLL_PAD}`}
        initial="hidden"
        whileInView="visible"
        viewport={inViewOnce}
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      >
        {children.map((child, index) => (
          <motion.li
            key={index}
            className={`shrink-0 snap-start ${itemClassName}`}
            variants={{
              hidden: { opacity: 0, x: 40 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: easeOutExpo } },
            }}
          >
            {child}
          </motion.li>
        ))}
      </motion.ul>

      {!(edges.start && edges.end) && (
        <div className="container-site -mt-4 hidden justify-end gap-2 lg:flex">
          {([-1, 1] as const).map((direction) => {
            const disabled = direction === -1 ? edges.start : edges.end;
            return (
              <button
                key={direction}
                type="button"
                onClick={() => page(direction)}
                disabled={disabled}
                aria-label={direction === -1 ? 'Anteriores' : 'Seguintes'}
                aria-controls={`${id}-lista`}
                className="grid h-9 w-9 place-items-center rounded-full bg-ink/[0.06] text-ink/70 transition-[background-color,color,opacity] duration-300 hover:bg-ink/[0.1] hover:text-ink disabled:pointer-events-none disabled:opacity-35"
              >
                <Chevron direction={direction === -1 ? 'left' : 'right'} />
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Shelf;
