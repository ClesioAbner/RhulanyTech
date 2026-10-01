import { useLayoutEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import Phone3D from '../payments/Phone3D';
import PhoneScreen from '../payments/PhoneScreen';
import {
  INTRO_END,
  activeMethodAt,
  fallRotateX,
  fallRotateY,
  fallRotateZ,
  paymentRotateX,
  paymentRotateY,
  paymentRotateZ,
} from '../payments/phoneTimeline';
import Payments from './Payments';
import ShopSection from './ShopSection';

const springConfig = { stiffness: 120, damping: 28, mass: 0.4 };
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const PHONE_FILL = 0.84; // share of the product card's height the phone occupies while on display
const RELEASE_LINE = 0.5; // the phone leaves its card once the card's centre reaches this share of the viewport

// Layout offset of `el` inside `ancestor`, ignoring CSS transforms (entrance animations must not skew it).
const offsetWithin = (el: HTMLElement, ancestor: HTMLElement) => {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== ancestor) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
};

/**
 * The shop and payments sections share one 3D phone (desktop only).
 *
 * 1. On display: it sits inside the iPhone product card and scrolls with the page like any product.
 * 2. Release: when the card reaches the middle of the viewport, it lifts out and falls, tumbling.
 * 3. Landing: it arrives in the payments stage exactly as that section pins, then turns to show
 *    each payment method.
 *
 * A sticky layer spanning both sections hosts the phone; positions are in that layer's coordinates,
 * which match the viewport whenever the layer is pinned.
 */
const ShopToPayments = () => {
  const shopRef = useRef<HTMLElement>(null);
  const phoneSlotRef = useRef<HTMLDivElement>(null);
  const paymentsRef = useRef<HTMLElement>(null);
  const paymentsStickyRef = useRef<HTMLDivElement>(null);
  const phoneTargetRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showcaseStage, setShowcaseStage] = useState<number | null>(0);

  // Measured layout lives in motion values so the scroll transforms always read the latest numbers.
  const shopTop = useMotionValue(0); // page offset of the shop section
  const shopHeight = useMotionValue(1);
  const viewportHeight = useMotionValue(800);
  const startX = useMotionValue(0); // card centre, relative to the shop section
  const startY = useMotionValue(0);
  const startScale = useMotionValue(0.7);
  const hasSlot = useMotionValue(1);
  const endX = useMotionValue(0); // payments target centre, relative to the pinned payments viewport
  const endY = useMotionValue(0);

  const { scrollY } = useScroll();

  // How far the page has scrolled past the top of the shop section (the sticky layer pins from there).
  const pastShopTop = useTransform([scrollY, shopTop], ([y, top]: number[]) => Math.max(0, y - top));
  // Scroll distance, measured from the shop top, at which the card reaches the release line.
  const releaseAt = useTransform([startY, viewportHeight], ([sy, vh]: number[]) => Math.max(0, sy - vh * RELEASE_LINE));

  // Fall progress: 0 while on display, 1 the moment the payments section pins.
  const fall = useTransform([pastShopTop, releaseAt, shopHeight], ([past, release, height]: number[]) =>
    past <= release ? 0 : Math.min(1, (past - release) / Math.max(1, height - release)),
  );

  const x = useTransform([fall, startX, endX], ([f, from, to]: number[]) => from + (to - from) * easeInOutCubic(f));
  const y = useTransform([fall, pastShopTop, releaseAt, startY, endY], ([f, past, release, from, to]: number[]) => {
    if (f <= 0) return from - past; // riding along with its card
    const releasedAt = from - release;
    const lift = Math.sin(Math.min(f / 0.3, 1) * Math.PI) * 70; // a small rise before the drop
    return releasedAt + (to - releasedAt) * easeInOutCubic(f) - lift;
  });
  const scale = useTransform([fall, startScale], ([f, from]: number[]) => from + (1 - from) * easeInOutCubic(f));
  const opacity = useTransform([fall, hasSlot], ([f, slotted]: number[]) => (slotted ? 1 : Math.min(f / 0.2, 1)));

  // Payments: progress through the pinned section.
  const { scrollYProgress: paymentsRaw } = useScroll({ target: paymentsRef, offset: ['start start', 'end end'] });
  const payments = useSpring(paymentsRaw, springConfig);

  // Lock-screen notifications appear one by one as the phone falls; the checkout takes over once payments pins.
  const updateShowcase = () => {
    const f = fall.get();
    const next = paymentsRaw.get() > 0 ? null : f <= 0 ? 0 : f < 0.3 ? 1 : f < 0.6 ? 2 : 3;
    setShowcaseStage((current) => (current === next ? current : next));
  };

  useMotionValueEvent(fall, 'change', updateShowcase);
  useMotionValueEvent(paymentsRaw, 'change', (value) => {
    const next = activeMethodAt(value);
    setActiveIndex((current) => (current === next ? current : next));
    updateShowcase();
  });

  const still = (value: number) => (prefersReducedMotion ? 0 : value);
  const inPayments = (p: number) => p > 0.0001;

  // Desktop phone: fall rotations first, payment rotations once the section pins.
  const rotateY = useTransform([fall, payments], ([f, p]: number[]) =>
    still(inPayments(p) ? paymentRotateY(p) : fallRotateY(f)),
  );
  const rotateX = useTransform([fall, payments], ([f, p]: number[]) =>
    still(inPayments(p) ? paymentRotateX(p) : fallRotateX(f)),
  );
  const rotateZ = useTransform([fall, payments], ([f, p]: number[]) =>
    still(inPayments(p) ? paymentRotateZ(p) : fallRotateZ(f)),
  );

  // Mobile phone: payments only.
  const mobileRotateY = useTransform(payments, (p) => still(paymentRotateY(p)));
  const mobileRotateX = useTransform(payments, (p) => still(paymentRotateX(p)));
  const mobileRotateZ = useTransform(payments, (p) => still(paymentRotateZ(p)));

  const hintOpacity = useTransform(payments, [0, 0.08], [1, 0]);
  const listOpacity = useTransform(payments, [0.06, INTRO_END], [0, 1]);
  const listY = useTransform(payments, [0.06, INTRO_END], [24, 0]);

  // Declared after the transforms on purpose: effects run in order, so the transforms are already
  // subscribed when the first measurement lands.
  useLayoutEffect(() => {
    const measure = () => {
      const shop = shopRef.current;
      const sticky = paymentsStickyRef.current;
      const target = phoneTargetRef.current;
      const phone = phoneRef.current;
      if (!shop || !sticky || !target || !phone || !phone.offsetHeight) return;

      shopTop.set(shop.getBoundingClientRect().top + window.scrollY);
      shopHeight.set(shop.offsetHeight);
      viewportHeight.set(window.innerHeight);

      const to = offsetWithin(target, sticky);
      endX.set(to.x + target.offsetWidth / 2);
      endY.set(to.y + target.offsetHeight / 2);

      const slot = phoneSlotRef.current;
      if (slot && slot.offsetHeight) {
        const from = offsetWithin(slot, shop);
        startX.set(from.x + slot.offsetWidth / 2);
        startY.set(from.y + slot.offsetHeight / 2);
        startScale.set((slot.offsetHeight * PHONE_FILL) / phone.offsetHeight);
        hasSlot.set(1);
      } else {
        // The iPhone card is filtered out: the phone fades in mid-fall instead of leaving a card.
        startX.set(endX.get());
        startY.set(window.innerHeight * RELEASE_LINE);
        startScale.set(0.7);
        hasSlot.set(0);
      }
    };

    measure();
    const resizes = new ResizeObserver(measure);
    [document.body, shopRef.current, paymentsStickyRef.current].forEach((el) => el && resizes.observe(el));
    const mutations = new MutationObserver(measure);
    if (shopRef.current) mutations.observe(shopRef.current, { childList: true, subtree: true });
    window.addEventListener('resize', measure);
    return () => {
      resizes.disconnect();
      mutations.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [shopTop, shopHeight, viewportHeight, startX, startY, startScale, hasSlot, endX, endY]);

  return (
    <div className="relative">
      <ShopSection sectionRef={shopRef} phoneSlotRef={phoneSlotRef} />
      <Payments
        sectionRef={paymentsRef}
        stickyRef={paymentsStickyRef}
        phoneTargetRef={phoneTargetRef}
        activeIndex={activeIndex}
        hintOpacity={hintOpacity}
        listOpacity={listOpacity}
        listY={listY}
        mobilePhone={{ rotateX: mobileRotateX, rotateY: mobileRotateY, rotateZ: mobileRotateZ }}
      />

      {/* Shared phone layer (desktop) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-30 hidden lg:block">
        <div className="sticky top-0 h-[100svh] w-full">
          <motion.div className="absolute left-0 top-0 h-0 w-0" style={{ x, y, scale, opacity }}>
            <div
              ref={phoneRef}
              className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 [--phone-w:clamp(190px,26vh,250px)] [perspective:1600px]"
            >
              <Phone3D rotateX={rotateX} rotateY={rotateY} rotateZ={rotateZ}>
                <PhoneScreen activeIndex={activeIndex} showcaseStage={showcaseStage} />
              </Phone3D>
              <div className="absolute -bottom-12 left-1/2 h-6 w-[80%] -translate-x-1/2 rounded-[100%] bg-ink/20 blur-xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ShopToPayments;
