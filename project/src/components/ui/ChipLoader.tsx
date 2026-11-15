import { motion, useReducedMotion } from 'framer-motion';

// Three pins on each side of the chip, listed clockwise from the top left, so the light runs round.
const PINS = [
  // Top, left to right
  'M19 8v6',
  'M24 8v6',
  'M29 8v6',
  // Right, top to bottom
  'M34 19h6',
  'M34 24h6',
  'M34 29h6',
  // Bottom, right to left
  'M29 34v6',
  'M24 34v6',
  'M19 34v6',
  // Left, bottom to top
  'M8 29h6',
  'M8 24h6',
  'M8 19h6',
];
const ROUND = 1.2; // seconds for the light to go once round the chip

interface ChipLoaderProps {
  /** What is happening, said under the chip and to screen readers. */
  label: string;
  /** Size of the chip in px. */
  size?: number;
  className?: string;
}

/**
 * The brand's processor chip at work: a light runs round its pins, one after another, while the
 * core breathes. For the waits the visitor starts in the shop, such as a search.
 */
const ChipLoader = ({ label, size = 52, className = '' }: ChipLoaderProps) => {
  const still = useReducedMotion();
  return (
    <div role="status" className={`flex flex-col items-center gap-4 text-ink ${className}`}>
      <svg
        viewBox="0 0 48 48"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        aria-hidden="true"
      >
        {PINS.map((d, index) => (
          <motion.path
            key={d}
            d={d}
            strokeWidth={2}
            initial={{ opacity: 0.18 }}
            animate={still ? { opacity: 0.5 } : { opacity: [0.18, 1, 0.18] }}
            transition={
              still
                ? undefined
                : {
                    duration: ROUND * 0.45,
                    repeat: Infinity,
                    repeatDelay: ROUND * 0.55,
                    delay: (index / PINS.length) * ROUND,
                    ease: 'easeInOut',
                  }
            }
          />
        ))}
        <rect x="14" y="14" width="20" height="20" rx="4.5" strokeWidth={2} />
        <motion.rect
          x="19.5"
          y="19.5"
          width="9"
          height="9"
          rx="2"
          fill="currentColor"
          stroke="none"
          style={{ transformOrigin: '24px 24px' }}
          animate={still ? undefined : { scale: [0.82, 1, 0.82], opacity: [0.55, 1, 0.55] }}
          transition={{ duration: ROUND, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
      <p className="text-sm text-ink/55">{label}</p>
    </div>
  );
};

export default ChipLoader;
