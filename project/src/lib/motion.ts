import type { Variants } from 'framer-motion';

// One easing curve across the site keeps motion consistent: fast start, long soft settle.
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;

/**
 * Phones get lighter motion: short rises without 3D tilts, which read as a judder on a narrow screen
 * scrolled by thumb. Read once, when the page loads.
 */
export const isPhone = typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches;

/** Touch screens have no hover: effects that wait for the pointer play when the element comes into view. */
export const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

// The element swings up from a backwards tilt (a short rise on phones); parent needs a perspective.
export const riseIn3d: Variants = {
  hidden: isPhone ? { opacity: 0, y: 28 } : { opacity: 0, y: 60, rotateX: 22 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: isPhone ? 0.8 : 1.1, ease: easeOutExpo, delay },
  }),
};

export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});

export const inViewOnce = { once: true, margin: '0px 0px -12% 0px' } as const;

/** Spread on a motion element: rises into place the first time it scrolls into view. */
export const riseOnView = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: inViewOnce,
};
