import { useRef, type PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { easeOutExpo, inViewOnce } from '../../lib/motion';
import { useMediaQuery } from '../../lib/useMediaQuery';
import PhotoScreen from '../content/PhotoScreen';
import AirFront from '../content/chat/AirFront';
import { HAND } from '../content/chat/photos';
import ArrowChip from '../ui/ArrowChip';
import ShopScreen from './ShopScreen';

const spring = { stiffness: 90, damping: 22, mass: 0.5 };

/*
 * The shop page's "in your pocket": a hand holds a phone with Rhulany Tech running on it, the new
 * phones going by. The card stays still; only the hand and its phone move in 3D: they swing round
 * from a tilt to face the visitor as the section scrolls in, then lean gently towards the pointer,
 * with a soft light on the glass that follows. The copy sits in the photo's empty left side on
 * desktop and under it on phones.
 */
const PocketShop = () => {
  const ref = useRef<HTMLElement>(null);
  const still = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // Scroll: from a three-quarter view to facing front.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const entry = useSpring(scrollYProgress, spring);
  // Pointer: a few degrees towards where the visitor is looking.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const leanY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-7, 7]), spring);
  const leanX = useSpring(useTransform(pointerY, [-0.5, 0.5], [5, -5]), spring);

  const rotateY = useTransform([entry, leanY], ([e, l]: number[]) => (still ? 0 : -24 * (1 - e) + l));
  const rotateX = useTransform([entry, leanX], ([e, l]: number[]) => (still ? 0 : 12 * (1 - e) + l));
  const scale = useTransform(entry, [0, 1], still ? [1, 1] : [0.88, 1]);
  const lightX = useTransform(pointerX, [-0.5, 0.5], ['30%', '75%']);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };
  const onPointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <section ref={ref} className="container-site mt-24 lg:mt-32" aria-labelledby="no-bolso">
      <div
        className="relative isolate overflow-hidden rounded-[32px] bg-[radial-gradient(70%_80%_at_75%_55%,#ffffff_0%,#eef0f4_70%)]"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        {/* A soft light behind the hand that drifts with the pointer */}
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute top-[10%] -z-10 aspect-square w-[45%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.95),transparent)]"
          style={{ left: lightX }}
        />
        {/* Only the hand and its phone move, in 3D */}
        <div className="[perspective:1400px]">
          <motion.div style={{ rotateY, rotateX, scale, transformOrigin: '72% 62%' }}>
            <PhotoScreen
              src="/images/blog/telemovel-mao-1400.png"
              srcSet="/images/blog/telemovel-mao-800.png 800w, /images/blog/telemovel-mao-1400.png 1400w"
              sizes="(min-width: 1360px) 1264px, 100vw"
              alt="Mão a segurar um iPhone com a loja Rhulany Tech aberta no ecrã"
              photo={HAND}
              aspect={isDesktop ? HAND.width / HAND.height : 4 / 5}
              zoom={isDesktop ? 1 : 2.5}
              focus={isDesktop ? undefined : { x: 0.676, y: 0.477 }}
            >
              <AirFront>
                <ShopScreen />
              </AirFront>
            </PhotoScreen>
          </motion.div>
        </div>

        {/* The copy: over the photo's empty left side on desktop, under the photo on phones */}
        <motion.div
          className="p-8 sm:p-12 lg:absolute lg:inset-y-0 lg:left-0 lg:flex lg:w-[44%] lg:flex-col lg:justify-center lg:p-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewOnce}
          transition={{ duration: 0.9, ease: easeOutExpo }}
        >
          <p className="eyebrow text-ink/45">Compre de onde estiver</p>
          <h2 id="no-bolso" className="type-display mt-4">
            A loja no seu bolso
          </h2>
          <p className="type-lead mt-4 max-w-sm text-ink/60">
            Veja as novidades, compare e pague com <span className="whitespace-nowrap">M-Pesa</span> em segundos, no telemóvel.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/loja/celulares?ordem=novidades"
              className="group inline-flex h-14 items-center gap-3 rounded-full bg-ink pl-7 pr-3 text-sm font-medium text-paper shadow-[0_18px_40px_-18px_rgba(12,12,13,0.55)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              Ver as novidades
              <ArrowChip />
            </Link>
            <Link
              to="/#pagamentos"
              className="inline-flex h-14 items-center rounded-full bg-white px-7 text-sm font-medium text-ink ring-1 ring-ink/10 transition-colors duration-300 hover:bg-mist"
            >
              Como pagar
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PocketShop;
