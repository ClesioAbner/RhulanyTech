import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, type Variants } from 'framer-motion';
import { getProductById, priceFrom, productPath, resolveImage, type CatalogProduct } from '../../lib/catalog';
import { formatPrice } from '../../lib/format';
import { easeOutExpo } from '../../lib/motion';
import Phone3D, { type PhoneShape } from './Phone3D';

// Phones on show, with their real proportions (body, corners, thickness, front camera).
const FEATURED: { id: string; shape: PhoneShape }[] = [
  { id: '39', shape: { aspect: 0.486, radius: 0.17, depth: 0.12, camera: 'island' } },
  { id: '46', shape: { aspect: 0.499, radius: 0.09, depth: 0.105, camera: 'punch' } },
  { id: '51', shape: { aspect: 0.479, radius: 0.165, depth: 0.118, camera: 'punch' } },
  { id: '40', shape: { aspect: 0.488, radius: 0.17, depth: 0.075, camera: 'island' } },
];
const SLIDE_SECONDS = 9;

const SLIDES = FEATURED.map(({ id, shape }) => ({ product: getProductById(id), shape })).filter(
  (slide): slide is { product: CatalogProduct; shape: PhoneShape } => Boolean(slide.product?.finishes[0]?.images?.length),
);

const toRgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
// The stage takes the phone's colour; very dark or very light finishes get a softer stand-in.
const lightFor = (hex: string) => {
  const [r, g, b] = toRgb(hex);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  if (luminance < 0.3) return [139, 147, 163];
  if (luminance > 0.88) return [196, 201, 210];
  return [r, g, b];
};
const fieldFor = (hex: string) => {
  const [r, g, b] = lightFor(hex);
  return `radial-gradient(52% 62% at 70% 48%, rgba(${r},${g},${b},0.5) 0%, rgba(${r},${g},${b},0) 72%), radial-gradient(38% 46% at 8% 92%, rgba(${r},${g},${b},0.2) 0%, rgba(${r},${g},${b},0) 70%), linear-gradient(180deg, #f7f7f9 0%, #eceef2 100%)`;
};

const textVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.35 } },
  exit: { transition: { staggerChildren: 0.025, staggerDirection: -1 } },
};
const line: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOutExpo } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25 } },
};
const word: Variants = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 1, ease: easeOutExpo } },
  exit: { y: '-110%', transition: { duration: 0.35, ease: [0.5, 0, 0.75, 0] } },
};

/*
 * The shop's opening, full width. One phone at a time stands in a light of its own colour.
 * Choreography: the stage changes colour, the phone sweeps in screen first and turns to show its
 * back, the name rises word by word, then the details and colours follow. Colours turn the phone
 * all the way round; the tabs move between phones and show the time left on the current one.
 */
const Showroom = () => {
  const [slide, setSlide] = useState(0);
  const [finishIndex, setFinishIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [phoneHeight, setPhoneHeight] = useState(520);
  const stageRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const prefersReducedMotion = useReducedMotion();
  const { product, shape } = SLIDES[slide];
  const finish = product.finishes[finishIndex] ?? product.finishes[0];
  const image = resolveImage(finish.images![0], 1200);
  const controls = useRef<ReturnType<typeof animate>>();
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  // The phone is sized from the stage so it always fits, whatever the screen.
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () =>
      setPhoneHeight(Math.round(Math.min(stage.clientHeight * 0.84, (stage.clientWidth * 0.62) / shape.aspect)));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [shape.aspect]);

  const goTo = (index: number) => {
    setSlide((index + SLIDES.length) % SLIDES.length);
    setFinishIndex(0);
  };

  // The timer restarts with each phone; picking a colour or turning the phone pauses it.
  useEffect(() => {
    progress.set(0);
    if (prefersReducedMotion) return;
    controls.current = animate(progress, 1, { duration: SLIDE_SECONDS, ease: 'linear', onComplete: () => goTo(slide + 1) });
    if (pausedRef.current) controls.current.pause();
    return () => controls.current?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slide, prefersReducedMotion]);

  useEffect(() => {
    if (paused) controls.current?.pause();
    else controls.current?.play();
  }, [paused]);

  // Warm the cache with every colour of the phone on show, so turning to a new one is instant.
  useEffect(() => {
    product.finishes.forEach((item) => {
      if (item.images?.[0]) new Image().src = resolveImage(item.images[0], 1200);
    });
  }, [product]);

  const pickFinish = (index: number) => {
    setFinishIndex(index);
    setPaused(true);
  };

  const words = product.title.split(' ');

  return (
    <section
      aria-label="Em destaque"
      className="relative isolate overflow-hidden bg-paper"
      onPointerLeave={() => finishIndex === 0 && setPaused(false)}
    >
      {/* Stage colour */}
      <AnimatePresence initial={false}>
        <motion.div
          key={finish.hex}
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{ background: fieldFor(finish.hex) }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: easeOutExpo }}
        />
      </AnimatePresence>
      {/* Spotlight and floor line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -z-10 aspect-square w-[min(92vw,820px)] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0)_66%)] max-lg:left-1/2 max-lg:top-[6%] max-lg:-translate-x-1/2 lg:right-[4%] lg:top-1/2 lg:-translate-y-1/2"
      />

      <div className="container-site grid min-h-[100svh] items-center gap-4 pb-32 pt-24 lg:grid-cols-12 lg:gap-8 lg:pb-36 lg:pt-28">
        {/* Phone */}
        <div
          ref={stageRef}
          className="relative h-[48svh] min-h-[340px] [perspective:1800px] lg:order-2 lg:col-span-7 lg:h-[68svh] lg:max-h-[720px] lg:min-h-[520px]"
          onPointerMove={(event) => {
            if (event.pointerType !== 'mouse') return;
            const rect = event.currentTarget.getBoundingClientRect();
            pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
            pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
          }}
          onPointerLeave={() => {
            pointerX.set(0);
            pointerY.set(0);
          }}
        >
          <motion.div
            aria-hidden="true"
            className="absolute bottom-[3%] left-1/2 h-8 w-[40%] -translate-x-1/2 rounded-[50%] bg-ink/30 blur-2xl lg:w-[30%]"
            animate={prefersReducedMotion ? undefined : { scaleX: [1, 0.82, 1], opacity: [0.9, 0.6, 0.9] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={product.id}
              className="absolute inset-0 flex items-center justify-center [transform-style:preserve-3d]"
              initial={{ opacity: 0, x: 260, y: 30, scale: 0.82, rotateZ: 8 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotateZ: 0 }}
              exit={{
                opacity: 0,
                x: -300,
                y: 20,
                scale: 0.82,
                rotateZ: -8,
                transition: { duration: 0.7, ease: [0.55, 0, 0.75, 0.2] },
              }}
              transition={{ duration: 1.5, ease: easeOutExpo }}
            >
              <motion.div
                className="[transform-style:preserve-3d]"
                animate={prefersReducedMotion ? undefined : { y: [0, -14, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Phone3D
                  image={image}
                  alt={`${product.title} em ${finish.name}`}
                  hex={finish.hex}
                  shape={shape}
                  height={phoneHeight}
                  pointerX={pointerX}
                  pointerY={pointerY}
                  onGrab={() => setPaused(true)}
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Copy */}
        <div className="relative lg:order-1 lg:col-span-5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={product.id} variants={textVariants} initial="hidden" animate="show" exit="exit">
              <motion.p variants={line} className="eyebrow text-ink/50">
                {product.brand}
              </motion.p>
              <h2 className="type-display mt-4" aria-label={product.title}>
                {words.map((text, index) => (
                  <span
                    key={index}
                    aria-hidden="true"
                    className="mr-[0.24em] inline-block overflow-hidden pb-[0.1em] align-bottom last:mr-0"
                  >
                    <motion.span variants={word} className="inline-block">
                      {text}
                    </motion.span>
                  </span>
                ))}
              </h2>
              <motion.p variants={line} className="type-lead mt-4 max-w-md text-ink/60">
                {product.summary}
              </motion.p>
              <motion.p variants={line} className="mt-6 tabular-nums">
                {product.option && <span className="text-sm text-ink/50">Desde </span>}
                <span className="text-2xl font-semibold tracking-tight">{formatPrice(priceFrom(product))}</span>
              </motion.p>

              <motion.div variants={line} className="mt-7">
                <p className="text-sm text-ink/50">
                  Cor{' '}
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={finish.name}
                      className="inline-block font-medium text-ink"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.3 }}
                    >
                      {finish.name}
                    </motion.span>
                  </AnimatePresence>
                </p>
                <ul className="-ml-1.5 mt-2.5 flex flex-wrap gap-1" aria-label="Cores">
                  {product.finishes.map((item, index) => (
                    <motion.li
                      key={item.name}
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.75 + index * 0.06 }}
                    >
                      <button
                        type="button"
                        onClick={() => pickFinish(index)}
                        aria-label={item.name}
                        aria-pressed={index === finishIndex}
                        className="grid h-10 w-10 place-items-center rounded-full"
                      >
                        <span
                          className={`block h-7 w-7 rounded-full ring-1 ring-inset ring-ink/15 transition-[box-shadow,transform] duration-300 hover:scale-110 ${
                            index === finishIndex ? 'shadow-[0_0_0_2.5px_#F5F5F7,0_0_0_4px_rgba(12,12,13,0.75)]' : ''
                          }`}
                          style={{ backgroundColor: item.hex }}
                        />
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div variants={line} className="mt-9 flex flex-wrap gap-3">
                <Link
                  to={productPath(product, finish)}
                  className="inline-flex h-12 items-center rounded-full bg-ink px-8 text-sm font-medium text-paper transition-transform duration-300 hover:scale-[1.03]"
                >
                  Comprar
                </Link>
                <Link
                  to="/loja/celulares"
                  className="inline-flex h-12 items-center rounded-full bg-white/70 px-6 text-sm font-medium ring-1 ring-inset ring-ink/10 backdrop-blur transition-colors duration-300 hover:bg-white"
                >
                  Ver todos os celulares
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Phones on show, with time left on the current one */}
      <div className="absolute inset-x-0 bottom-0">
        <div
          role="tablist"
          aria-label="Escolher telemóvel"
          className="container-site grid grid-cols-4 gap-2 pb-6 sm:gap-6 lg:pb-8"
        >
          {SLIDES.map(({ product: item }, index) => {
            const active = index === slide;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => goTo(index)}
                className={`group relative flex items-center gap-3 pt-4 text-left transition-colors duration-300 ${active ? 'text-ink' : 'text-ink/40 hover:text-ink/75'}`}
              >
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] overflow-hidden rounded-full bg-ink/10">
                  {active && <motion.span className="block h-full origin-left bg-ink" style={{ scaleX: progress }} />}
                </span>
                <span className="relative hidden h-11 w-6 shrink-0 sm:block">
                  <img
                    src={resolveImage(item.finishes[0].images![0], 600)}
                    alt=""
                    className={`h-full w-full object-contain transition-[opacity,transform] duration-500 ${active ? 'opacity-100' : 'opacity-50 group-hover:opacity-80'}`}
                  />
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] tabular-nums opacity-60">{String(index + 1).padStart(2, '0')}</span>
                  <span className="block truncate text-sm font-medium max-sm:hidden">{item.title}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Showroom;
