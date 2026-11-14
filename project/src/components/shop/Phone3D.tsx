import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from 'framer-motion';
import PhoneBody from '../product/PhoneBody';

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
  /** A folding phone, shown folded; it opens like a book to show its inner screen (see FoldPhone3D). */
  fold?: boolean;
}

export interface Phone3DProps {
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

/*
 * A living wallpaper in the phone's colour, like the dynamic ones on iPhone: soft lights of that
 * colour (and a paler and a deeper shade of it) drift slowly over a deep base. Gradients only, no
 * blur filters, so it stays light to draw on a turning 3D face.
 */
const hueOf = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (d) h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: (h * 60 + 360) % 360, s };
};

// The finish's hue, made vivid; neutral finishes (silver, black, white) get a cool blue instead.
const paletteFor = (hex: string) => {
  const { h, s } = hueOf(hex);
  const neutral = s < 0.18;
  const hue = neutral ? 222 : h;
  const sat = neutral ? 38 : Math.max(58, Math.round(s * 100));
  return {
    base: `hsl(${hue} ${Math.round(sat * 0.7)}% 11%)`,
    lights: [
      `hsl(${hue} ${sat}% 64%)`,
      `hsl(${(hue + 38) % 360} ${sat}% 56%)`,
      `hsl(${(hue + 322) % 360} ${Math.round(sat * 0.9)}% 42%)`,
      `hsl(${hue} ${Math.round(sat * 0.55)}% 86%)`,
    ],
  };
};

const LIGHTS = [
  { size: 1.5, left: -0.35, top: -0.15, drift: [0.18, 0.1], duration: 14 },
  { size: 1.3, left: 0.25, top: 0.35, drift: [-0.2, 0.14], duration: 17 },
  { size: 1.4, left: -0.2, top: 0.62, drift: [0.22, -0.12], duration: 19 },
  { size: 0.9, left: 0.45, top: -0.05, drift: [-0.15, 0.2], duration: 12 },
] as const;

const Wallpaper = ({ frame, width, height }: { frame: string; width: number; height: number }) => {
  const prefersReducedMotion = useReducedMotion();
  const palette = paletteFor(frame);
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: palette.base }} aria-hidden="true">
      {/* Aurora: a soft ribbon of the finish's colours turning slowly behind everything */}
      <motion.span
        className="absolute left-1/2 top-[58%] aspect-square"
        style={{
          width: height * 1.5,
          marginLeft: -(height * 0.75),
          marginTop: -(height * 0.75),
          background: `conic-gradient(from 0deg, transparent 0deg, ${palette.lights[0]} 60deg, transparent 120deg, ${palette.lights[1]} 200deg, transparent 260deg, ${palette.lights[2]} 320deg, transparent 360deg)`,
          filter: `blur(${Math.round(width * 0.09)}px)`,
          opacity: 0.75,
        }}
        animate={prefersReducedMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
      />
      {LIGHTS.map((light, index) => (
        <motion.span
          key={index}
          className="absolute rounded-full"
          style={{
            width: width * light.size,
            height: width * light.size,
            left: width * light.left,
            top: height * light.top,
            background: `radial-gradient(closest-side, ${palette.lights[index]} 0%, transparent 100%)`,
            opacity: 0.9,
          }}
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  x: [0, width * light.drift[0], 0],
                  y: [0, height * light.drift[1], 0],
                  scale: [1, 1.15, 1],
                }
          }
          transition={{ duration: light.duration, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      {/* Glass: a faint diagonal sheen that crosses the screen now and then */}
      <motion.span
        className="absolute inset-y-0 w-1/2 bg-[linear-gradient(105deg,transparent_20%,rgba(255,255,255,0.14)_50%,transparent_80%)]"
        initial={{ x: '-120%' }}
        animate={prefersReducedMotion ? undefined : { x: ['-120%', '260%'] }}
        transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 5, ease: 'easeInOut' }}
      />
      {/* Depth: darker towards the bottom, where the clock's shadow would fall */}
      <span className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/35" />
    </div>
  );
};

/** Lock screen in the phone's colour: a living wallpaper, front camera, date and time. */
export const LockScreen = ({
  frame,
  width,
  height,
  camera,
}: {
  frame: string;
  width: number;
  height: number;
  camera: PhoneShape['camera'];
}) => (
  <div className="absolute inset-0">
    <Wallpaper frame={frame} width={width} height={height} />
    {camera === 'island' ? (
      <span
        className="absolute left-1/2 -translate-x-1/2 rounded-full bg-black"
        style={{ top: height * 0.018, width: width * 0.3, height: height * 0.034 }}
      />
    ) : (
      <span
        className="absolute left-1/2 -translate-x-1/2 rounded-full bg-black"
        style={{ top: height * 0.02, width: width * 0.052, height: width * 0.052 }}
      />
    )}
    <div className="absolute inset-x-0 text-center text-white" style={{ top: height * 0.1 }}>
      <p className="font-medium text-white/85" style={{ fontSize: width * 0.055 }}>
        {DATE}
      </p>
      <p
        className="font-display font-semibold leading-none tracking-tight"
        style={{ fontSize: width * 0.27, marginTop: width * 0.01 }}
      >
        {TIME}
      </p>
    </div>
    <span
      className="absolute left-1/2 -translate-x-1/2 rounded-full bg-white/80"
      style={{ bottom: height * 0.012, width: width * 0.36, height: Math.max(3, height * 0.006) }}
    />
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
    const controls = animate(turn, 180, { duration: 1.3, delay: 0.2, ease: [0.65, 0, 0.35, 1] });
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
    const controls = animate(turn, target, { duration: 1.3, ease: [0.65, 0, 0.35, 1] });
    const repaint = window.setTimeout(() => {
      setBack(image);
      setFrame(hex);
    }, 360);
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
