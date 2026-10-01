import { motion, type MotionValue } from 'framer-motion';
import type { ReactNode } from 'react';

// Proportions modelled on the iPhone 16 Pro Max (163 x 77.6 x 8.25 mm) in Desert Titanium.
const DEPTH = 16; // px — body thickness
const EDGE_LAYERS = 16; // stacked rounded slices fake a solid, rounded titanium band when the phone turns
const RADIUS = 'rounded-[calc(var(--phone-w)*0.18)]';

interface Phone3DProps {
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  rotateZ?: MotionValue<number>;
  children: ReactNode;
}

const face = `absolute inset-0 ${RADIUS} [backface-visibility:hidden]`;

const Lens = ({ className }: { className: string }) => (
  <span
    className={`absolute aspect-square rounded-full bg-[radial-gradient(circle_at_38%_35%,#4a5468_0%,#151922_38%,#05060a_70%)] shadow-[0_0_0_3px_#2b2826,0_0_0_5px_#8f8578,0_6px_10px_rgba(0,0,0,0.45)] ${className}`}
  />
);

const Phone3D = ({ rotateX, rotateY, rotateZ, children }: Phone3DProps) => (
  <motion.div
    className="relative h-[calc(var(--phone-w)*2.1)] w-[var(--phone-w)] [transform-style:preserve-3d]"
    style={{ rotateX, rotateY, rotateZ }}
  >
    {/* Titanium band: thin slices from back to front */}
    {Array.from({ length: EDGE_LAYERS }, (_, i) => (
      <div
        key={i}
        aria-hidden="true"
        className={`absolute inset-0 ${RADIUS} bg-gradient-to-b from-[#d9cbb8] via-[#a8998a] to-[#cdbfac]`}
        style={{ transform: `translateZ(${-DEPTH / 2 + (i * DEPTH) / (EDGE_LAYERS - 1)}px)` }}
      />
    ))}

    {/* Side buttons, sitting in the band */}
    <div aria-hidden="true" className="absolute -left-[2px] top-[17%] h-[4%] w-[3px] rounded-l-sm bg-[#b3a593]" />
    <div aria-hidden="true" className="absolute -left-[2px] top-[24%] h-[8%] w-[3px] rounded-l-sm bg-[#b3a593]" />
    <div aria-hidden="true" className="absolute -left-[2px] top-[34%] h-[8%] w-[3px] rounded-l-sm bg-[#b3a593]" />
    <div aria-hidden="true" className="absolute -right-[2px] top-[26%] h-[11%] w-[3px] rounded-r-sm bg-[#b3a593]" />
    <div aria-hidden="true" className="absolute -right-[2px] top-[58%] h-[7%] w-[3px] rounded-r-sm bg-[#9c8f7f]" />

    {/* Back: matte glass with the camera plateau */}
    <div
      aria-hidden="true"
      className={`${face} overflow-hidden bg-gradient-to-br from-[#e3d6c4] via-[#cfc0ac] to-[#b9a993]`}
      style={{ transform: `rotateY(180deg) translateZ(${DEPTH / 2 + 0.5}px)` }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.35),transparent_60%)]" />
      <div className="absolute left-[6%] top-[3.5%] aspect-square w-[50%] rounded-[24%] bg-gradient-to-br from-[#d6c8b5] to-[#b6a690] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35),0_8px_18px_-6px_rgba(60,45,30,0.45)]">
        <Lens className="left-[9%] top-[9%] w-[40%]" />
        <Lens className="bottom-[9%] left-[9%] w-[40%]" />
        <Lens className="right-[9%] top-[30%] w-[40%]" />
        <span className="absolute right-[16%] top-[9%] aspect-square w-[14%] rounded-full bg-[radial-gradient(circle,#fff8e7,#d9c9a9)] shadow-[0_0_0_2px_#9d907f]" />
        <span className="absolute bottom-[12%] right-[18%] aspect-square w-[11%] rounded-full bg-[#1d1f24] shadow-[0_0_0_2px_#9d907f]" />
      </div>
    </div>

    {/* Front: black border, display, Dynamic Island */}
    <div
      className={`${face} bg-[#0b0b0c] p-[3%] shadow-[inset_0_0_0_1.5px_rgba(217,203,184,0.6)]`}
      style={{ transform: `translateZ(${DEPTH / 2 + 0.5}px)` }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[calc(var(--phone-w)*0.155)] bg-paper">
        {children}
        <div aria-hidden="true" className="absolute left-1/2 top-[1.8%] h-[3.4%] w-[30%] -translate-x-1/2 rounded-full bg-black" />
      </div>
    </div>
  </motion.div>
);

export default Phone3D;
