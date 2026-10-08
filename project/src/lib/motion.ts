import type { Transition, Variants } from 'framer-motion';

// One easing curve across the site keeps motion consistent: fast start, long soft settle.
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export const revealTransition: Transition = { duration: 0.9, ease: easeOutExpo };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { ...revealTransition, delay },
  }),
};

// Same reveal, but the element swings up from a backwards tilt; parent needs a perspective.
export const riseIn3d: Variants = {
  hidden: { opacity: 0, y: 60, rotateX: 22 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 1.1, ease: easeOutExpo, delay },
  }),
};

export const stagger =(staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});

export const inViewOnce = { once: true, margin: '0px 0px -12% 0px' } as const;
