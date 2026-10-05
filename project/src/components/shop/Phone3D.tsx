import { useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from 'framer-motion';

interface Phone3DProps {
  /** Back of the phone, a transparent cut-out. */
  image: string;
  alt: string;
  /** Finish colour, used for the phone's edges. */
  hex: string;
  /** Pointer tilt from the stage, -0.5…0.5 on each axis. */
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
}

const shade = (hex: string, amount: number) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (c: number) => Math.round(Math.min(255, Math.max(0, c + 255 * amount)));
  return `rgb(${f((n >> 16) & 255)}, ${f((n >> 8) & 255)}, ${f(n & 255)})`;
};

/*
 * A phone made of two faces and two edges in CSS 3D, so it turns like an object rather than a
 * picture: a slow sway at rest, a tilt that follows the pointer, and a full turn to show a new
 * colour, which is painted on the hidden face before the phone comes round.
 */
const Phone3D = ({ image, alt, hex, pointerX, pointerY }: Phone3DProps) => {
  const prefersReducedMotion = useReducedMotion();
  const [faces, setFaces] = useState({ front: image, back: image, showing: 'front' as 'front' | 'back' });
  const [edge, setEdge] = useState(hex);
  const turn = useMotionValue(0);
  const sway = useMotionValue(0);
  const tiltY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-22, 22]), { stiffness: 120, damping: 18 });
  const tiltX = useSpring(useTransform(pointerY, [-0.5, 0.5], [10, -10]), { stiffness: 120, damping: 18 });
  const rotateY = useTransform([turn, sway, tiltY], ([a, b, c]: number[]) => a + b + c);
  // Light slides across the glass as the phone turns.
  const sheen = useTransform(rotateY, (deg) => `${50 - (((deg % 360) + 540) % 360 - 180) * 1.6}%`);
  const lastImage = useRef(image);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const controls = animate(sway, [-9, 9], { duration: 5.5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' });
    return () => controls.stop();
  }, [sway, prefersReducedMotion]);

  // New colour: paint it on the hidden face, then turn half way round to bring it forward.
  useEffect(() => {
    if (image === lastImage.current) return;
    lastImage.current = image;
    if (prefersReducedMotion) {
      setFaces({ front: image, back: image, showing: 'front' });
      setEdge(hex);
      return;
    }
    setFaces((current) =>
      current.showing === 'front' ? { ...current, back: image, showing: 'back' } : { ...current, front: image, showing: 'front' },
    );
    const target = Math.round(turn.get() / 180) * 180 + 180;
    const controls = animate(turn, target, { duration: 1.1, ease: [0.65, 0, 0.35, 1] });
    const swapEdge = window.setTimeout(() => setEdge(hex), 450);
    return () => {
      controls.stop();
      window.clearTimeout(swapEdge);
    };
  }, [image, hex, turn, prefersReducedMotion]);

  const faceStyle = { backfaceVisibility: 'hidden' as const, WebkitBackfaceVisibility: 'hidden' as const };
  const edgeStyle = {
    background: `linear-gradient(90deg, ${shade(edge, -0.32)}, ${shade(edge, 0.08)} 45%, ${shade(edge, -0.12)} 70%, ${shade(edge, -0.36)})`,
  };

  return (
    <motion.div
      className="relative h-full w-fit [transform-style:preserve-3d]"
      style={{ rotateY, rotateX: tiltX }}
    >
      {/* Front face sizes the phone */}
      <div className="relative h-full w-fit [transform:translateZ(var(--half))]" style={faceStyle}>
        <img src={faces.front} alt={faces.showing === 'front' ? alt : ''} draggable={false} className="h-full w-auto max-w-none select-none" />
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-soft-light"
          style={{
            backgroundImage: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.75) 48%, transparent 66%)',
            backgroundSize: '260% 100%',
            backgroundPositionX: sheen,
            WebkitMaskImage: `url("${faces.front}")`,
            maskImage: `url("${faces.front}")`,
            WebkitMaskSize: '100% 100%',
            maskSize: '100% 100%',
          }}
        />
      </div>
      {/* Back face, turned away */}
      <div className="absolute inset-0 [transform:rotateY(180deg)_translateZ(var(--half))]" style={faceStyle}>
        <img src={faces.back} alt={faces.showing === 'back' ? alt : ''} draggable={false} className="h-full w-full select-none object-contain" />
      </div>
      {/* Edges, seen when the phone turns side-on */}
      {(['left', 'right'] as const).map((side) => (
        <span
          key={side}
          aria-hidden="true"
          className="absolute top-[3.2%] h-[93.6%] w-[var(--depth)] rounded-[calc(var(--depth)/2)] [transform:rotateY(90deg)]"
          style={{ ...edgeStyle, [side]: 'calc(var(--depth) / -2)' }}
        />
      ))}
    </motion.div>
  );
};

export default Phone3D;
