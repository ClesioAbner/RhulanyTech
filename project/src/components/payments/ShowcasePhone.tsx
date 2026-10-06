import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { animate, motion, useReducedMotion, useTransform, type MotionValue } from 'framer-motion';
import PhoneBody from '../product/PhoneBody';
import { resolveImage } from '../../lib/catalog';
import { easeOutExpo } from '../../lib/motion';
import { CARD_METHOD_INDEX } from './methods';
import PaymentCard3D from './PaymentCard3D';
import { ScreenPainter, type ScreenKey } from './screens';

// iPhone 17 Pro in Deep Blue: real proportions, back photo and frame colour.
const ASPECT = 0.486;
const BACK = resolveImage('/images/produtos/iphone-17-pro-azul', 1200);
const FRAME = '#33415f';
const CARD_SCREEN = `method-${CARD_METHOD_INDEX}` as ScreenKey;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const EASE_OUT = [...easeOutExpo] as [number, number, number, number];

interface ShowcasePhoneProps {
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  rotateZ: MotionValue<number>;
  scale?: MotionValue<number>;
  screen: ScreenKey;
  /** Lock-screen notifications shown (0–3). */
  lockStage: number;
}

/*
 * The homepage phone: an iPhone 17 Pro in CSS 3D that fills its box. Its screen is the canvas from
 * screens.ts (lock screen, checkout, each payment method).
 *
 * Card choreography, while the card method is on screen: the Rhulany Classic Visa comes out from
 * behind the phone with a full turn, settles beside it, moves in to tap the screen (which answers
 * "Pagamento aprovado"), then goes back to its place and floats.
 */
const ShowcasePhone = ({ rotateX, rotateY, rotateZ, scale, screen, lockStage }: ShowcasePhoneProps) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [boxWidth, setBoxWidth] = useState(0);
  const [paid, setPaid] = useState(false);
  const painter = useMemo(() => new ScreenPainter(), []);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const measure = () => setBoxWidth(box.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  // The painter owns a canvas; it lives inside the phone's screen.
  useEffect(() => {
    const host = screenRef.current;
    if (!host) return;
    painter.canvas.style.width = '100%';
    painter.canvas.style.height = '100%';
    painter.canvas.style.display = 'block';
    host.appendChild(painter.canvas);
    return () => {
      painter.canvas.remove();
    };
  }, [painter, boxWidth]);

  const showCard = screen === CARD_SCREEN;
  const shownScreen: ScreenKey = showCard && paid ? 'card-paid' : screen;
  useEffect(() => painter.setScreen(shownScreen, lockStage, performance.now()), [painter, shownScreen, lockStage]);

  // Repaint loop: cheap when nothing changed (the painter returns early).
  useEffect(() => {
    let frame = requestAnimationFrame(function tick(now) {
      painter.update(now);
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [painter]);

  const sheen = useTransform(rotateY, (deg) => `${50 + Math.sin((deg * Math.PI) / 180) * 70}%`);

  const width = Math.round(boxWidth * 0.98);
  const height = Math.round(width / ASPECT);
  const compact = width < 210;
  const cardWidth = width * 1.24;

  // Card positions, relative to the phone's centre.
  useEffect(() => {
    const card = cardRef.current;
    if (!card || !width) return;
    const hidden = { opacity: 0, x: 0, y: 0, z: -width * 0.2, rotateY: 0, rotateX: 0, rotateZ: 0, scale: 0.9 };
    // At rest the card leans in front of the phone's lower left, away from the copy on the right.
    const rest = compact
      ? { opacity: 1, x: -width * 0.28, y: height * 0.36, z: width * 0.45, rotateY: 14, rotateX: 12, rotateZ: 8, scale: 0.8 }
      : { opacity: 1, x: -width * 0.68, y: height * 0.22, z: width * 0.4, rotateY: 22, rotateX: 10, rotateZ: 9, scale: 1 };
    // Tapping: flat over the contactless target in the upper third of the screen.
    const tap = { x: -width * 0.02, y: -height * 0.12, z: width * 0.55, rotateY: 6, rotateX: 4, rotateZ: 2, scale: compact ? 0.72 : 0.86 };

    if (!showCard) {
      setPaid(false);
      animate(card, hidden, { duration: prefersReducedMotion ? 0 : 0.55, ease: [0.5, 0, 0.75, 0] });
      return;
    }
    if (prefersReducedMotion) {
      animate(card, rest, { duration: 0 });
      setPaid(true);
      return;
    }

    let cancelled = false;
    const run = async () => {
      // 1. Out from behind the phone with a full turn (the back passes by), settling at an angle.
      animate(card, { opacity: 1 }, { duration: 0.3 });
      await animate(card, { ...rest, rotateY: rest.rotateY + 360 }, { duration: 1.8, ease: EASE_OUT });
      if (cancelled) return;
      animate(card, { rotateY: rest.rotateY }, { duration: 0 });
      await wait(450);
      if (cancelled) return;
      // 2. In to tap the screen…
      await animate(card, tap, { duration: 0.75, ease: [0.65, 0, 0.35, 1] });
      if (cancelled) return;
      // 3. …the phone answers…
      setPaid(true);
      await wait(380);
      if (cancelled) return;
      // 4. …and back to its place.
      await animate(card, rest, { duration: 1.1, ease: EASE_OUT });
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [showCard, width, height, compact, prefersReducedMotion]);

  return (
    <div ref={boxRef} className="relative h-full w-full [transform-style:preserve-3d]">
      {width > 0 && (
        <motion.div
          className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]"
          style={{ width, height, marginLeft: -width / 2, marginTop: -height / 2, rotateX, rotateY, rotateZ, scale }}
        >
          <PhoneBody
            width={width}
            height={height}
            radius={Math.round(width * 0.17)}
            depth={Math.round(width * 0.12)}
            frame={FRAME}
            back={BACK}
            backAlt="iPhone 17 Pro em azul profundo"
            sheen={sheen}
            screen={<div ref={screenRef} className="absolute inset-0 bg-black" />}
          />

          {/* The card */}
          <div
            ref={cardRef}
            className="absolute left-1/2 top-1/2 opacity-0 [transform-style:preserve-3d]"
            style={{ width: cardWidth, marginLeft: -cardWidth / 2, marginTop: -cardWidth / 1.586 / 2 }}
          >
            <motion.div
              className="[transform-style:preserve-3d]"
              animate={showCard && paid && !prefersReducedMotion ? { y: [0, -8, 0], rotateZ: [0, 1.5, 0] } : { y: 0, rotateZ: 0 }}
              transition={showCard && paid ? { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.4 } : { duration: 0.4 }}
            >
              <PaymentCard3D width={cardWidth} />
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ShowcasePhone;
