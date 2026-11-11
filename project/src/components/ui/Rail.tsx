import { Children, useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, type MotionProps } from 'framer-motion';

interface RailProps extends Pick<MotionProps, 'initial' | 'whileInView' | 'variants' | 'viewport'> {
  children: ReactNode;
  /** Layout from 1024px up, where the rail becomes a grid, e.g. `lg:grid lg:grid-cols-3 lg:gap-6`. */
  gridClassName: string;
  label: string;
  className?: string;
}

/**
 * Phones and tablets: a row of cards to swipe, snapping one card at a time and running to the
 * screen's edge, with a short line underneath that follows the position. From 1024px: a grid.
 * Each child sets its own width below lg (e.g. `w-[78%] shrink-0 snap-start lg:w-auto`).
 */
const Rail = ({ children, gridClassName, label, className = '', ...motionProps }: RailProps) => {
  const ref = useRef<HTMLUListElement>(null);
  const count = Children.count(children);
  const { scrollXProgress } = useScroll({ container: ref });
  // The thumb is one card's share of the track and slides across it.
  const x = useTransform(scrollXProgress, (p) => `${p * (count - 1) * 100}%`);

  return (
    <div className={className}>
      <motion.ul
        ref={ref}
        aria-label={label}
        className={`-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto overscroll-x-contain px-5 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:gap-4 sm:px-8 lg:mx-0 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden ${gridClassName}`}
        {...motionProps}
      >
        {children}
      </motion.ul>
      {count > 1 && (
        <div aria-hidden="true" className="mx-auto mt-6 h-[2px] w-24 overflow-hidden rounded-full bg-ink/10 lg:hidden">
          <motion.span className="block h-full rounded-full bg-ink" style={{ width: `${100 / count}%`, x }} />
        </div>
      )}
    </div>
  );
};

export default Rail;
