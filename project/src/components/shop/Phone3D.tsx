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
import PhoneBody, { mixColor } from '../product/PhoneBody';

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

const TIME = '09:41';
const today = new Intl.DateTimeFormat('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
const DATE = today.charAt(0).toUpperCase() + today.slice(1);

/** Lock screen in the phone's colour: wallpaper, front camera, date and time. */
const LockScreen = ({ frame, width, height, camera }: { frame: string; width: number; height: number; camera: PhoneShape['camera'] }) => (
  <div
    className="absolute inset-0"
    style={{
      background: `radial-gradient(90% 60% at 20% 18%, ${mixColor(frame, 255, 0.35)} 0%, transparent 60%), radial-gradient(80% 70% at 85% 80%, ${mixColor(frame, 0, 0.1)} 0%, transparent 65%), linear-gradient(165deg, ${mixColor(frame, 0, 0.35)} 0%, ${mixColor(frame, 0, 0.82)} 100%)`,
    }}
  >
    {camera === 'island' ? (
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
);

/*
 * The shop's showroom phone: the real back photo, a lit lock screen on the front and a solid body
 * (see PhoneBody), so it turns like an object rather than a picture.
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

  return (
    <motion.div
      className="relative cursor-grab touch-pan-y select-none [transform-style:preserve-3d] active:cursor-grabbing"
      style={{ width, height, rotateY, rotateX: tiltX }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <PhoneBody
        width={width}
        height={height}
        radius={radius}
        depth={depth}
        frame={frame}
        back={back}
        backAlt={alt}
        sheen={sheen}
        screen={<LockScreen frame={frame} width={width} height={height} camera={shape.camera} />}
      />
    </motion.div>
  );
};

export default Phone3D;
