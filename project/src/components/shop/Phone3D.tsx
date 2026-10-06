import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';

/** Physical shape of a phone, relative to its width. */
export interface PhoneShape {
  /** Width / height of the body (matches the back photo). */
  aspect: number;
  /** Corner radius / width. */
  radius: number;
  /** Thickness / width. */
  depth: number;
  /** Front camera: Dynamic Island or a punch hole. */
  camera: 'island' | 'punch';
}

interface Phone3DProps {
  /** Back of the phone: a transparent studio cut-out. */
  image: string;
  alt: string;
  /** Finish colour: frame, wallpaper and light. */
  hex: string;
  shape: PhoneShape;
  /** Height of the phone in px; everything else follows the shape. */
  height: number;
  /** Pointer position over the stage, -0.5…0.5, for the tilt. */
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  /** Called when the visitor starts turning the phone by hand. */
  onGrab?: () => void;
}

const SLICES = 16;
const TIME = '09:41';
const today = new Intl.DateTimeFormat('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
const DATE = today.charAt(0).toUpperCase() + today.slice(1);

const rgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const mix = (hex: string, target: number, amount: number) =>
  `rgb(${rgb(hex)
    .map((c) => Math.round(c + (target - c) * amount))
    .join(', ')})`;

/*
 * A phone built in CSS 3D: the real back photo on one side, a lit lock screen on the other, and a
 * body of thin rounded slices in between, so it keeps its thickness and corners from any angle.
 *
 * Choreography: it arrives screen first and turns to show its colour; a new colour is a full turn
 * (the screen passes by in the new colour); at rest it sways, follows the pointer and can be turned
 * by hand, settling on whichever side faces the visitor.
 */
const Phone3D = ({ image, alt, hex, shape, height, pointerX, pointerY, onGrab }: Phone3DProps) => {
  const prefersReducedMotion = useReducedMotion();
  const width = Math.round(height * shape.aspect);
  const depth = Math.max(6, Math.round(width * shape.depth));
  const radius = Math.round(width * shape.radius);

  const [back, setBack] = useState(image);
  const [frame, setFrame] = useState(hex);
  const turn = useMotionValue(prefersReducedMotion ? 180 : 0);
  const sway = useMotionValue(0);
  const tiltY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-16, 16]), { stiffness: 110, damping: 20 });
  const tiltX = useSpring(useTransform(pointerY, [-0.5, 0.5], [8, -8]), { stiffness: 110, damping: 20 });
  const rotateY = useTransform([turn, sway, tiltY], ([a, b, c]: number[]) => a + b + c);
  // Light slides across the glass as the phone turns.
  const sheen = useTransform(rotateY, (deg) => `${50 + Math.sin((deg * Math.PI) / 180) * 70}%`);
  const lastImage = useRef(image);
  const drag = useRef<{ x: number; turn: number } | null>(null);

  // Arrival: screen first, then a half turn to the back.
  useEffect(() => {
    if (prefersReducedMotion) return;
    const controls = animate(turn, 180, { duration: 1.7, delay: 0.35, ease: [0.65, 0, 0.35, 1] });
    return () => controls.stop();
  }, [turn, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const controls = animate(sway, [-7, 7], { duration: 6, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' });
    return () => controls.stop();
  }, [sway, prefersReducedMotion]);

  // New colour: a full turn; the back is repainted while it faces away.
  useEffect(() => {
    if (image === lastImage.current) return;
    lastImage.current = image;
    if (prefersReducedMotion) {
      setBack(image);
      setFrame(hex);
      return;
    }
    const from = turn.get();
    const target = Math.round((from - 180) / 360) * 360 + 180 + 360;
    const controls = animate(turn, target, { duration: 1.5, ease: [0.65, 0, 0.35, 1] });
    const repaint = window.setTimeout(() => {
      setBack(image);
      setFrame(hex);
    }, 420);
    return () => {
      controls.stop();
      window.clearTimeout(repaint);
    };
  }, [image, hex, turn, prefersReducedMotion]);

  // Turning by hand: follows the finger, then settles on the nearest side.
  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    drag.current = { x: event.clientX, turn: turn.get() };
    event.currentTarget.setPointerCapture(event.pointerId);
    onGrab?.();
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    turn.set(drag.current.turn + (event.clientX - drag.current.x) * 0.55);
  };
  const onPointerUp = () => {
    if (!drag.current) return;
    drag.current = null;
    animate(turn, Math.round(turn.get() / 180) * 180, { type: 'spring', stiffness: 70, damping: 16 });
  };

  const metal = `linear-gradient(90deg, ${mix(frame, 0, 0.45)}, ${mix(frame, 255, 0.25)} 40%, ${mix(frame, 0, 0.15)} 65%, ${mix(frame, 0, 0.5)})`;
  const metalVertical = `linear-gradient(180deg, ${mix(frame, 0, 0.4)}, ${mix(frame, 255, 0.2)} 45%, ${mix(frame, 0, 0.45)})`;
  const face = { backfaceVisibility: 'hidden' as const, WebkitBackfaceVisibility: 'hidden' as const, borderRadius: radius };
  const half = depth / 2;

  return (
    <motion.div
      className="relative cursor-grab touch-pan-y select-none [transform-style:preserve-3d] active:cursor-grabbing"
      style={{ width, height, rotateY, rotateX: tiltX }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* Body: rounded slices through the thickness */}
      {Array.from({ length: SLICES }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            borderRadius: radius,
            background: metal,
            transform: `translateZ(${-half + (depth * (i + 0.5)) / SLICES}px)`,
          }}
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

      {/* Front: lock screen */}
      <div className="absolute inset-0 overflow-hidden" style={{ ...face, transform: `translateZ(${half + 0.5}px)`, background: '#050506', padding: width * 0.028 }}>
        <div
          className="relative h-full w-full overflow-hidden"
          style={{
            borderRadius: radius - width * 0.028,
            background: `radial-gradient(90% 60% at 20% 18%, ${mix(frame, 255, 0.35)} 0%, transparent 60%), radial-gradient(80% 70% at 85% 80%, ${mix(frame, 0, 0.1)} 0%, transparent 65%), linear-gradient(165deg, ${mix(frame, 0, 0.35)} 0%, ${mix(frame, 0, 0.82)} 100%)`,
          }}
        >
          {shape.camera === 'island' ? (
            <span className="absolute left-1/2 -translate-x-1/2 rounded-full bg-black" style={{ top: height * 0.018, width: width * 0.3, height: height * 0.034 }} />
          ) : (
            <span className="absolute left-1/2 -translate-x-1/2 rounded-full bg-black" style={{ top: height * 0.02, width: width * 0.052, height: width * 0.052 }} />
          )}
          <div className="absolute inset-x-0 text-center text-white" style={{ top: height * 0.1 }}>
            <p className="font-medium text-white/85" style={{ fontSize: width * 0.055 }}>
              {DATE}
            </p>
            <p className="font-display font-semibold leading-none tracking-tight" style={{ fontSize: width * 0.27, marginTop: width * 0.01 }}>
              {TIME}
            </p>
          </div>
          <span className="absolute left-1/2 -translate-x-1/2 rounded-full bg-white/80" style={{ bottom: height * 0.012, width: width * 0.36, height: Math.max(3, height * 0.006) }} />
        </div>
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.22) 50%, transparent 65%)',
            backgroundSize: '250% 100%',
            backgroundPositionX: sheen,
          }}
        />
      </div>

      {/* Back: the real photo */}
      <div className="absolute inset-0" style={{ ...face, borderRadius: 0, transform: `rotateY(180deg) translateZ(${half + 0.5}px)` }}>
        <img src={back} alt={alt} draggable={false} className="h-full w-full object-fill" />
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
    </motion.div>
  );
};

export default Phone3D;
