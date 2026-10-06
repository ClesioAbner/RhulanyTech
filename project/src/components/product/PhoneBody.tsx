import type { ReactNode } from 'react';
import { motion, type MotionValue } from 'framer-motion';

const SLICES = 16;

const rgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
/** Mixes a colour towards black (0) or white (255). */
export const mixColor = (hex: string, target: number, amount: number) =>
  `rgb(${rgb(hex)
    .map((c) => Math.round(c + (target - c) * amount))
    .join(', ')})`;

interface PhoneBodyProps {
  /** Size of the phone in px. */
  width: number;
  height: number;
  /** Corner radius and thickness in px. */
  radius: number;
  depth: number;
  /** Frame colour. */
  frame: string;
  /** Back of the phone: a transparent studio cut-out. */
  back: string;
  backAlt?: string;
  /** Screen content, drawn inside the black border on the front. */
  screen: ReactNode;
  /** Horizontal position of the light on the glass, e.g. "50%"; moves as the phone turns. */
  sheen: MotionValue<string>;
}

/*
 * A phone in CSS 3D, to be placed inside a parent with transform-style: preserve-3d.
 * The real back photo on one side, the screen on the other, and a body of thin rounded slices in
 * between plus solid side bands, so it keeps its thickness and corners from any angle.
 */
const PhoneBody = ({ width, height, radius, depth, frame, back, backAlt = '', screen, sheen }: PhoneBodyProps) => {
  const half = depth / 2;
  const border = width * 0.028;
  const metal = `linear-gradient(90deg, ${mixColor(frame, 0, 0.45)}, ${mixColor(frame, 255, 0.25)} 40%, ${mixColor(frame, 0, 0.15)} 65%, ${mixColor(frame, 0, 0.5)})`;
  const metalVertical = `linear-gradient(180deg, ${mixColor(frame, 0, 0.4)}, ${mixColor(frame, 255, 0.2)} 45%, ${mixColor(frame, 0, 0.45)})`;
  const face = { backfaceVisibility: 'hidden' as const, WebkitBackfaceVisibility: 'hidden' as const };

  return (
    <>
      {/* Body: rounded slices through the thickness */}
      {Array.from({ length: SLICES }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="absolute inset-0"
          style={{ borderRadius: radius, background: metal, transform: `translateZ(${-half + (depth * (i + 0.5)) / SLICES}px)` }}
        />
      ))}
      {/* Straight sides as solid bands, so a side-on view reads as one surface */}
      {(['left', 'right'] as const).map((side) => (
        <span
          key={side}
          aria-hidden="true"
          className="absolute"
          style={{
            top: radius,
            height: height - radius * 2,
            width: depth,
            [side]: -half,
            background: metalVertical,
            transform: `rotateY(${side === 'left' ? -90 : 90}deg)`,
          }}
        />
      ))}
      {(['top', 'bottom'] as const).map((side) => (
        <span
          key={side}
          aria-hidden="true"
          className="absolute"
          style={{
            left: radius,
            width: width - radius * 2,
            height: depth,
            [side]: -half,
            background: metal,
            transform: `rotateX(${side === 'top' ? 90 : -90}deg)`,
          }}
        />
      ))}

      {/* Front: black glass with the screen inside a slim border */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ ...face, borderRadius: radius, transform: `translateZ(${half + 0.5}px)`, background: '#050506', padding: border }}
      >
        <div className="relative h-full w-full overflow-hidden" style={{ borderRadius: radius - border }}>
          {screen}
        </div>
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.2) 50%, transparent 65%)',
            backgroundSize: '250% 100%',
            backgroundPositionX: sheen,
          }}
        />
      </div>

      {/* Back: the real photo */}
      <div className="absolute inset-0" style={{ ...face, transform: `rotateY(180deg) translateZ(${half + 0.5}px)` }}>
        <img src={back} alt={backAlt} draggable={false} className="h-full w-full object-fill" />
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-soft-light"
          style={{
            backgroundImage: 'linear-gradient(110deg, transparent 32%, rgba(255,255,255,0.8) 50%, transparent 68%)',
            backgroundSize: '250% 100%',
            backgroundPositionX: sheen,
            WebkitMaskImage: `url("${back}")`,
            maskImage: `url("${back}")`,
            WebkitMaskSize: '100% 100%',
            maskSize: '100% 100%',
          }}
        />
      </div>
    </>
  );
};

export default PhoneBody;
