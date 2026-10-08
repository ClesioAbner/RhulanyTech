import { interpolate } from 'framer-motion';
import { PAYMENT_METHODS } from './methods';

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

// Payments section timeline (0 → 1 while the section is pinned).
export const INTRO_END = 0.16;
const STEP = (1 - INTRO_END) / PAYMENT_METHODS.length;

export const activeMethodAt = (progress: number) =>
  progress < INTRO_END ? -1 : Math.min(PAYMENT_METHODS.length - 1, Math.floor((progress - INTRO_END) / STEP));

const stops = [0, INTRO_END, ...PAYMENT_METHODS.map((_, i) => INTRO_END + STEP * (i + 0.5)), 1];

// Desktop: the phone arrives facing forward from its fall, so payments only add a gentle sway per method
// (one value per stop: start, intro end, the middle of each method, end). For the card it turns towards
// the card it hands out on its left, leaving the copy on the right clear.
export const paymentRotateY = interpolate(stops, [0, 0, 12, -12, 10, 16, 8, 0]);
export const paymentRotateX = interpolate(stops, [0, 0, -3, 4, -3, 3, -2, 0]);

// Mobile has no fall: the phone turns from its back to the front as the section pins.
export const mobileRotateY = interpolate(stops, [-180, 0, 12, -12, 10, 12, 8, 0]);
export const mobileRotateX = interpolate(stops, [16, 0, -3, 4, -3, 3, -2, 0]);
export const mobileRotateZ = interpolate([0, INTRO_END], [-8, 0]);

/*
 * Fall timeline (desktop, 0 → 1 from release to landing), choreographed in three beats:
 * 1. Lift (0 → 0.2): picked up out of the card, tilting slightly towards the viewer.
 * 2. Turn (0.15 → 0.85): one smooth full turn that shows the back mid-fall.
 * 3. Settle (0.85 → 1): lands facing forward, level, exactly as payments pins.
 */
const LIFT_END = 0.2;
const TURN_START = 0.15;
const TURN_END = 0.85;

export const fallRotateY = (f: number) => -360 * easeInOutCubic(clamp01((f - TURN_START) / (TURN_END - TURN_START)));
export const fallRotateX = (f: number) =>
  10 * Math.sin(Math.PI * clamp01(f / LIFT_END) * 0.5) * (1 - clamp01((f - TURN_END) / (1 - TURN_END)));
export const fallRotateZ = (f: number) => -5 * Math.sin(Math.PI * clamp01(f));

/** Extra scale on top of the card-to-stage scale: a slight swell as it is lifted, back to 1 on landing. */
export const fallLiftScale = (f: number) => 1 + 0.06 * Math.sin(Math.PI * clamp01(f / (LIFT_END * 2)));

/** Vertical travel shape: a short rise while lifting, then an eased drop to the landing point. */
export const fallTravel = (f: number) => {
  const drop = easeInOutCubic(clamp01((f - LIFT_END * 0.5) / (1 - LIFT_END * 0.5)));
  const rise = Math.sin(Math.PI * clamp01(f / LIFT_END) * 0.5) * (1 - drop);
  return { drop, rise };
};
