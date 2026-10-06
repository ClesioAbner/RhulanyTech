import type { CSSProperties } from 'react';

// Pins clockwise from the top left, so they light in a wave that follows the trace.
const PINS = [
  { line: [28, 20, 28, 12], dot: [28, 10] },
  { line: [36, 20, 36, 12], dot: [36, 10] },
  { line: [44, 20, 44, 12], dot: [44, 10] },
  { line: [52, 28, 60, 28], dot: [62, 28] },
  { line: [52, 36, 60, 36], dot: [62, 36] },
  { line: [52, 44, 60, 44], dot: [62, 44] },
  { line: [44, 52, 44, 60], dot: [44, 62] },
  { line: [36, 52, 36, 60], dot: [36, 62] },
  { line: [28, 52, 28, 60], dot: [28, 62] },
  { line: [20, 44, 12, 44], dot: [10, 44] },
  { line: [20, 36, 12, 36], dot: [10, 36] },
  { line: [20, 28, 12, 28], dot: [10, 28] },
];

/**
 * The loading mark: a processor chip with light running round its outline and pins lighting in
 * turn. Its styles (.rt-*) live in index.html, shared with the first-visit loader drawn there.
 */
const TechChip = ({ size = 72 }: { size?: number }) => (
  <svg className="rt-chip" viewBox="0 0 72 72" aria-hidden="true" style={{ width: size, height: size }}>
    {PINS.map(({ line: [x1, y1, x2, y2], dot: [cx, cy] }, i) => (
      <g key={i} className="rt-pin" style={{ '--i': i } as CSSProperties}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} />
        <circle cx={cx} cy={cy} r={1.6} />
      </g>
    ))}
    <rect className="rt-chip-base" x={20} y={20} width={32} height={32} rx={7} />
    <rect className="rt-chip-trace" x={20} y={20} width={32} height={32} rx={7} pathLength={100} />
    <rect className="rt-chip-core" x={29} y={29} width={14} height={14} rx={3} />
  </svg>
);

export default TechChip;
