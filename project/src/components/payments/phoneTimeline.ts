import { interpolate } from 'framer-motion';
import { PAYMENT_METHODS } from './methods';

// Payments section timeline (0 → 1 while the section is pinned).
export const INTRO_END = 0.16; // the phone turns from its back to the front
export const STEP = (1 - INTRO_END) / PAYMENT_METHODS.length;

export const activeMethodAt = (progress: number) =>
  progress < INTRO_END ? -1 : Math.min(PAYMENT_METHODS.length - 1, Math.floor((progress - INTRO_END) / STEP));

const stops = [0, INTRO_END, ...PAYMENT_METHODS.map((_, i) => INTRO_END + STEP * (i + 0.5)), 1];

// Back → front, then a gentle sway as each method takes over.
export const paymentRotateY = interpolate(stops, [-200, -14, 16, -16, 14, -10, 0]);
export const paymentRotateX = interpolate(stops, [24, 6, -4, 6, -4, 4, 0]);
export const paymentRotateZ = interpolate([0, INTRO_END], [-12, 0]);

// Fall timeline (0 → 1 while the shop section scrolls past): the phone leaves its product card facing
// forward, tumbles, and ends back-facing exactly where the payments timeline picks it up.
export const fallRotateY = interpolate([0, 1], [0, -200]);
export const fallRotateX = (f: number) => Math.sin(f * Math.PI * 2) * 14 + f * 24;
export const fallRotateZ = (f: number) => Math.sin(f * Math.PI * 2) * 10 - f * 12;
