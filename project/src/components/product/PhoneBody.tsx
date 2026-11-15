import type { ReactNode } from 'react';
import { motion, type MotionValue } from 'framer-motion';
import { mixColor } from '../../lib/color';
import type { PhoneControls } from './phoneControls';

const SLICES = 16;

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
  back?: string;
  /** A second screen on the back instead of the photo (one half of a folding phone). */
  backScreen?: ReactNode;
  backAlt?: string;
  /** Screen content, drawn inside the black border on the front. */
  screen: ReactNode;
  /** Horizontal position of the light on the glass, e.g. "50%"; moves as the phone turns. */
  sheen: MotionValue<string>;
  /** Its physical buttons down the sides, where the real model has them. */
  controls?: PhoneControls;
}

/*
 * A phone in CSS 3D, to be placed inside a parent with transform-style: preserve-3d.
 * The real back photo on one side, the screen on the other, and a body of thin rounded slices in
 * between plus solid side bands, so it keeps its thickness and corners from any angle. The buttons
 * stand a little proud of the frame: seen side on as rounded keys, and from the front as a slight
 * bump at the edge, like the real phone.
 */
const PhoneBody = ({
  width,
  height,
  radius,
  depth,
  frame,
  back,
  backScreen,
  backAlt = '',
  screen,
  sheen,
  controls,
}: PhoneBodyProps) => {
  const half = depth / 2;
  const border = width * 0.028;
  const metal = `linear-gradient(90deg, ${mixColor(frame, 0, 0.45)}, ${mixColor(frame, 255, 0.25)} 40%, ${mixColor(frame, 0, 0.15)} 65%, ${mixColor(frame, 0, 0.5)})`;
  const metalVertical = `linear-gradient(180deg, ${mixColor(frame, 0, 0.4)}, ${mixColor(frame, 255, 0.2)} 45%, ${mixColor(frame, 0, 0.45)})`;
  const face = { backfaceVisibility: 'hidden' as const, WebkitBackfaceVisibility: 'hidden' as const };
  // Buttons: a touch lighter than the frame, rounded, across the middle of the thickness.
  const proud = Math.max(1, width * 0.006);
  const keyWidth = depth * 0.46;
  const key = `linear-gradient(90deg, ${mixColor(frame, 0, 0.35)}, ${mixColor(frame, 255, 0.35)} 45%, ${mixColor(frame, 0, 0.3)})`;
  const keys = [
    ...(controls?.left ?? []).map((span) => ({ side: 'left' as const, span, camera: false })),
    ...(controls?.right ?? []).map((span) => ({ side: 'right' as const, span, camera: false })),
    ...(controls?.camera ? [{ side: 'right' as const, span: controls.camera, camera: true }] : []),
  ];

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
      {/* Buttons on the sides; the Camera Control is flush sapphire, the others stand proud */}
      {keys.map(({ side, span: [start, end], camera }) => (
        <span
          key={`${side}-${start}`}
          aria-hidden="true"
          className="absolute"
          style={{
            top: height * start,
            height: height * (end - start),
            width: camera ? depth * 0.5 : keyWidth,
            [side]: -(camera ? depth * 0.5 : keyWidth) / 2,
            borderRadius: 999,
            background: camera ? 'linear-gradient(90deg, #121317, #3a3d44 45%, #15161a)' : key,
            boxShadow: camera ? 'inset 0 0 0 1px rgba(255,255,255,0.12)' : '0 0 0 0.5px rgba(0,0,0,0.25)',
            transform: `rotateY(${side === 'left' ? -90 : 90}deg) translateZ(${camera ? 0.3 : proud}px)`,
          }}
        />
      ))}
      {/* From the front, the raised keys show as a slight bump past the edge of the frame */}
      {keys
        .filter((item) => !item.camera)
        .map(({ side, span: [start, end] }) => (
          <span
            key={`lip-${side}-${start}`}
            aria-hidden="true"
            className="absolute"
            style={{
              top: height * start,
              height: height * (end - start),
              width: proud + 0.5,
              [side]: -proud,
              borderRadius: 999,
              background: mixColor(frame, 0, 0.25),
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
        style={{
          ...face,
          borderRadius: radius,
          transform: `translateZ(${half + 0.5}px)`,
          background: '#050506',
          padding: border,
        }}
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

      {/* Back: a second screen (one half of a folding phone), or the real photo */}
      {backScreen && (
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            ...face,
            borderRadius: radius,
            transform: `rotateY(180deg) translateZ(${half + 0.5}px)`,
            background: '#050506',
            padding: border,
          }}
        >
          <div className="relative h-full w-full overflow-hidden" style={{ borderRadius: radius - border }}>
            {backScreen}
          </div>
        </div>
      )}
      {back && (
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
      )}
    </>
  );
};

export default PhoneBody;
