import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { animate, motion, useIsPresent, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import PhoneBody from '../product/PhoneBody';
import { LockScreen, type Phone3DProps } from './Phone3D';

const EASE: [number, number, number, number] = [0.65, 0, 0.35, 1];
const TIME = '09:41';

// Dusk over dunes, like the inner screen's wallpaper: a sky fading to a warm horizon, then sand.
const DUNES = [
  'radial-gradient(70% 38% at 28% 100%, #b98f86 0%, #8c6c6c 45%, transparent 75%)',
  'radial-gradient(80% 42% at 82% 104%, #a27f80 0%, #6f5560 50%, transparent 80%)',
  'radial-gradient(120% 30% at 50% 74%, rgba(255,214,190,0.55) 0%, transparent 70%)',
  'linear-gradient(180deg, #1c2440 0%, #3b3f63 32%, #8a6f86 58%, #d9a593 70%, #7e6268 100%)',
].join(', ');

/** The inner screen, wider than one half: each half shows its own side of the same wallpaper. */
const InnerScreen = ({ side, height }: { side: 'left' | 'right'; height: number }) => (
  <div className="absolute inset-y-0 w-[200%]" style={{ left: side === 'left' ? 0 : '-100%', background: DUNES }}>
    {/* The low sun's glow drifting slowly along the horizon */}
    <motion.span
      aria-hidden="true"
      className="absolute left-[20%] top-[48%] h-[38%] w-[36%] rounded-full bg-[radial-gradient(closest-side,rgba(255,206,170,0.55),transparent)]"
      animate={{ x: ['0%', '120%', '0%'], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
    />
    {/* The time sits on the left half, clear of the fold */}
    <p
      className="absolute left-0 w-1/2 text-center font-display font-semibold leading-none tracking-tight text-white/95"
      style={{ top: height * 0.16, fontSize: height * 0.17 }}
    >
      {TIME}
    </p>
  </div>
);

/*
 * The iPhone Duo on show: two halves joined by a hinge on the left (seen from the front). Folded,
 * it is a phone with the back photo on one side and the cover screen on the other. It arrives
 * showing its back, turns to the front and opens like a book: the front half swings round the
 * hinge and the inner screen spans both halves. A new colour folds it, turns it round in that
 * colour, and opens it again. It can be turned by hand like the other phones.
 */
const FoldPhone3D = ({
  image,
  alt,
  hex,
  shape,
  height,
  pointerX,
  pointerY,
  onGrab,
  maxWidth,
  closing = false,
}: Phone3DProps & {
  maxWidth: number;
  /** The showroom is about to move on: fold it shut before it leaves. */
  closing?: boolean;
}) => {
  const prefersReducedMotion = useReducedMotion();
  const width = Math.round(height * shape.aspect);
  const depth = Math.max(8, Math.round(width * shape.depth));
  const leaf = depth / 2;
  const radius = Math.round(width * shape.radius);

  const [back, setBack] = useState(image);
  const [frame, setFrame] = useState(hex);
  const turn = useMotionValue(0);
  const open = useMotionValue(prefersReducedMotion ? 1 : 0);
  const sway = useMotionValue(0);
  const tiltY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-12, 12]), { stiffness: 110, damping: 20 });
  const tiltX = useSpring(useTransform(pointerY, [-0.5, 0.5], [6, -6]), { stiffness: 110, damping: 20 });
  const rotateY = useTransform([turn, sway, tiltY], ([a, b, c]: number[]) => a + b + c);
  const sheen = useTransform(rotateY, (deg) => `${50 + Math.sin((deg * Math.PI) / 180) * 70}%`);

  // Open, it is twice as wide: it shifts to stay centred, turns around the hinge, and shrinks if the
  // stage is too narrow for it (phones).
  const openScale = Math.min(1, (maxWidth * 0.94) / (width * 2));
  const leafRotate = useTransform(open, [0, 1], [0, -180]);
  const shift = useTransform(open, (p) => (width / 2) * p);
  const originX = useTransform(open, (p) => 0.5 - 0.5 * p);
  const scale = useTransform(open, (p) => 1 + (openScale - 1) * p);

  // It folds shut before leaving: when its time is nearly up, or at once if another phone is picked.
  const isPresent = useIsPresent();
  useEffect(() => {
    if (!closing && isPresent) return;
    const controls = animate(open, 0, { duration: isPresent ? 0.9 : 0.45, ease: EASE });
    return () => controls.stop();
  }, [closing, isPresent, open]);

  const lastImage = useRef(image);
  const drag = useRef<{ x: number; turn: number } | null>(null);

  // Arrival: the back first, then round to the front, opening as it faces the visitor.
  useEffect(() => {
    if (prefersReducedMotion) return;
    const controls = [animate(turn, 180, { duration: 1.2, delay: 0.2, ease: EASE })];
    const unfold = window.setTimeout(() => {
      controls.push(animate(turn, 360, { duration: 1.3, ease: EASE }));
      controls.push(animate(open, 1, { duration: 1.4, delay: 0.45, ease: EASE }));
    }, 1700);
    return () => {
      window.clearTimeout(unfold);
      controls.forEach((control) => control.stop());
    };
  }, [turn, open, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const controls = animate(sway, [-6, 6], { duration: 6, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' });
    return () => controls.stop();
  }, [sway, prefersReducedMotion]);

  // New colour: fold, turn round to show the back in the new colour, then face front and open again.
  useEffect(() => {
    if (image === lastImage.current) return;
    lastImage.current = image;
    if (prefersReducedMotion) {
      setBack(image);
      setFrame(hex);
      return;
    }
    const controls = [animate(open, 0, { duration: 0.6, ease: EASE })];
    const timers = [
      window.setTimeout(() => {
        const from = turn.get();
        controls.push(animate(turn, Math.round(from / 360) * 360 + 540, { duration: 1.3, ease: EASE }));
      }, 450),
      window.setTimeout(() => {
        setBack(image);
        setFrame(hex);
      }, 800),
      window.setTimeout(() => {
        controls.push(animate(turn, turn.get() + 180, { duration: 1.2, ease: EASE }));
        controls.push(animate(open, 1, { duration: 1.3, delay: 0.4, ease: EASE }));
      }, 2100),
    ];
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      controls.forEach((control) => control.stop());
    };
  }, [image, hex, turn, open, prefersReducedMotion]);

  // Turning by hand: follows the finger, then settles on the nearest side.
  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    drag.current = { x: event.clientX, turn: turn.get() };
    event.currentTarget.setPointerCapture(event.pointerId);
    onGrab?.();
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    turn.set(drag.current.turn + (event.clientX - drag.current.x) * 0.5);
  };
  const onPointerUp = () => {
    if (!drag.current) return;
    drag.current = null;
    animate(turn, Math.round(turn.get() / 180) * 180, { type: 'spring', stiffness: 70, damping: 16 });
  };

  return (
    <motion.div
      className="relative cursor-grab touch-pan-y select-none [transform-style:preserve-3d] active:cursor-grabbing"
      style={{ width, height, rotateY, rotateX: tiltX, x: shift, originX, scale }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* Fixed half: the back photo outside, the right of the inner screen inside */}
      <div className="absolute inset-0 [transform-style:preserve-3d]" style={{ transform: `translateZ(${-leaf / 2}px)` }}>
        <PhoneBody
          width={width}
          height={height}
          radius={radius}
          depth={leaf}
          frame={frame}
          back={back}
          backAlt={alt}
          sheen={sheen}
          screen={<InnerScreen side="right" height={height} />}
        />
      </div>
      {/* Folding half, hinged on the left: the cover screen outside, the left of the inner screen inside */}
      <motion.div className="absolute inset-0 [transform-style:preserve-3d]" style={{ originX: 0, rotateY: leafRotate }}>
        <div className="absolute inset-0 [transform-style:preserve-3d]" style={{ transform: `translateZ(${leaf / 2}px)` }}>
          <PhoneBody
            width={width}
            height={height}
            radius={radius}
            depth={leaf}
            frame={frame}
            sheen={sheen}
            screen={<LockScreen frame={frame} width={width} height={height} camera={shape.camera} />}
            backScreen={<InnerScreen side="left" height={height} />}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FoldPhone3D;
