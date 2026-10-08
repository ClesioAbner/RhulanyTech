import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { resolveImage } from '../../lib/catalog';

interface Piece {
  src: string;
  alt: string;
  /** Box in % of the stage: left, top, width. */
  left: number;
  top: number;
  width: number;
  rotate: number;
  /** Scroll parallax in px: nearer pieces travel further. */
  travel: number;
}

const P = '/images/produtos/';

// Back to front.
const PIECES: Piece[] = [
  { src: `${P}xbox-series-x-1tb`, alt: 'Xbox Series X', left: 11, top: 15, width: 22, rotate: 0, travel: 30 },
  { src: `${P}asus-rog-ally`, alt: 'ASUS ROG Ally', left: 50, top: 14, width: 40, rotate: 8, travel: 50 },
  { src: `${P}nintendo-switch-2`, alt: 'Nintendo Switch 2', left: 22, top: 47, width: 52, rotate: -4, travel: 80 },
  {
    src: `${P}comando-sem-fios-dualsense-midnight-black`,
    alt: 'Comando DualSense Midnight Black',
    left: 3,
    top: 62,
    width: 25,
    rotate: -18,
    travel: 120,
  },
  {
    src: `${P}comando-sem-fios-dualsense-nova-pink`,
    alt: 'Comando DualSense Nova Pink',
    left: 67,
    top: 52,
    width: 27,
    rotate: 16,
    travel: 140,
  },
];

const StagePiece = ({ piece, progress, index }: { piece: Piece; progress: MotionValue<number>; index: number }) => {
  const y = useTransform(progress, [0, 1], [piece.travel, -piece.travel]);
  const rotate = useTransform(progress, [0, 1], [piece.rotate - 4, piece.rotate + 4]);
  return (
    <motion.img
      src={resolveImage(piece.src, 1200)}
      alt={piece.alt}
      loading="lazy"
      draggable={false}
      className="absolute select-none drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)]"
      style={{ left: `${piece.left}%`, top: `${piece.top}%`, width: `${piece.width}%`, zIndex: index, y, rotate }}
    />
  );
};

/*
 * Gaming still life on a dark stage: consoles and controllers under violet and blue light, over a
 * glowing grid floor. The stage opens from a narrow window as it scrolls in and each piece drifts
 * at its own depth.
 */
const GamingStage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const reveal = useTransform(scrollYProgress, [0, 0.45], ['inset(16% 10% 16% 10% round 32px)', 'inset(0% 0% 0% 0% round 28px)']);

  return (
    <div ref={ref} className="relative">
      <motion.div className="relative aspect-[4/5] overflow-hidden bg-[#0b0b10] sm:aspect-[5/4]" style={{ clipPath: reveal }}>
        {/* Light */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(45%_45%_at_22%_30%,rgba(124,58,237,0.5)_0%,transparent_70%),radial-gradient(45%_50%_at_82%_62%,rgba(37,99,235,0.42)_0%,transparent_70%),radial-gradient(60%_40%_at_50%_100%,rgba(236,72,153,0.22)_0%,transparent_70%)]"
        />
        {/* Grid floor */}
        <div aria-hidden="true" className="absolute inset-x-[-30%] bottom-[-10%] h-[55%] [perspective:500px]">
          <div
            className="h-full w-full [transform-origin:50%_100%] [transform:rotateX(62deg)]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(168,140,255,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(168,140,255,0.16) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
              maskImage: 'linear-gradient(to top, black 10%, transparent 90%)',
              WebkitMaskImage: 'linear-gradient(to top, black 10%, transparent 90%)',
            }}
          />
        </div>
        {PIECES.map((piece, index) => (
          <StagePiece key={piece.src} piece={piece} progress={scrollYProgress} index={index + 1} />
        ))}
      </motion.div>
    </div>
  );
};

export default GamingStage;
