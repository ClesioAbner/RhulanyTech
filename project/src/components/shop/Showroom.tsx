import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { getProductById, priceFrom, productPath, resolveImage, type CatalogProduct } from '../../lib/catalog';
import { formatPrice } from '../../lib/format';
import { easeOutExpo } from '../../lib/motion';
import Phone3D from './Phone3D';

// Phones on show, in order; each stays for SLIDE_SECONDS unless the visitor takes over.
const FEATURED = ['39', '46', '51', '40'];
const SLIDE_SECONDS = 8;

const SLIDES = FEATURED.map((id) => getProductById(id)).filter((p): p is CatalogProduct => Boolean(p?.finishes[0]?.images?.length));

// Dark colours would vanish on the dark stage, so their glow falls back to a cool grey.
const glowFor = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const luminance = (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
  return luminance < 0.3 ? '#5b6475' : hex;
};

/*
 * The shop's opening: a dark showroom where one phone at a time stands under its own light.
 * Colours change the phone and the light; the tabs underneath move between phones and show,
 * with a thin line, how long until the next one.
 */
const Showroom = () => {
  const [slide, setSlide] = useState(0);
  const [finishIndex, setFinishIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const progress = useMotionValue(0);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const prefersReducedMotion = useReducedMotion();
  const product = SLIDES[slide];
  const finish = product.finishes[finishIndex] ?? product.finishes[0];
  const image = resolveImage(finish.images![0], 1200);
  const glow = glowFor(finish.hex);
  const controls = useRef<ReturnType<typeof animate>>();
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  const goTo = (index: number) => {
    setSlide((index + SLIDES.length) % SLIDES.length);
    setFinishIndex(0);
  };

  // The timer restarts with each phone; choosing a colour or hovering pauses it.
  useEffect(() => {
    progress.set(0);
    if (prefersReducedMotion) return;
    controls.current = animate(progress, 1, {
      duration: SLIDE_SECONDS,
      ease: 'linear',
      onComplete: () => goTo(slide + 1),
    });
    if (pausedRef.current) controls.current.pause();
    return () => controls.current?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slide, prefersReducedMotion]);

  useEffect(() => {
    if (paused) controls.current?.pause();
    else controls.current?.play();
  }, [paused]);

  // Warm the cache with every colour of the phone on show, so switching is instant.
  useEffect(() => {
    product.finishes.forEach((item) => {
      if (item.images?.[0]) new Image().src = resolveImage(item.images[0], 1200);
    });
  }, [product]);

  const pickFinish = (index: number) => {
    setFinishIndex(index);
    setPaused(true);
  };

  return (
    <section aria-label="Em destaque" className="container-site">
      <div
        className="relative isolate overflow-hidden rounded-[28px] bg-ink text-paper sm:rounded-[36px]"
        onPointerEnter={(event) => event.pointerType === 'mouse' && setPaused(true)}
        onPointerLeave={(event) => event.pointerType === 'mouse' && finishIndex === 0 && setPaused(false)}
      >
        {/* Light behind the phone, in the phone's colour */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -z-10 aspect-square w-[78%] rounded-full opacity-50 blur-[110px] max-lg:left-1/2 max-lg:top-[4%] max-lg:-translate-x-1/2 lg:right-[2%] lg:top-1/2 lg:w-[44%] lg:-translate-y-1/2"
          animate={{ backgroundColor: glow }}
          transition={{ duration: 1.2, ease: easeOutExpo }}
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_70%_40%,transparent_30%,rgba(12,12,13,0.65)_100%)]" />

        <div className="grid lg:min-h-[600px] lg:grid-cols-12">
          {/* Phone */}
          <div
            className="relative h-[380px] [perspective:1600px] sm:h-[460px] lg:order-2 lg:col-span-7 lg:h-auto"
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
              className="absolute bottom-[5%] left-1/2 h-7 w-[34%] -translate-x-1/2 rounded-[50%] bg-black/80 blur-xl lg:bottom-[8%] lg:w-[24%]"
              animate={prefersReducedMotion ? undefined : { scaleX: [1, 0.86, 1], opacity: [0.9, 0.65, 0.9] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={product.id}
                className="absolute inset-x-0 bottom-[11%] top-[7%] flex justify-center [--depth:13px] [--half:6.5px] [transform-style:preserve-3d] lg:bottom-[14%] lg:top-[9%] lg:[--depth:20px] lg:[--half:10px]"
                initial={{ opacity: 0, rotateY: 75, x: 180, scale: 0.88 }}
                animate={{ opacity: 1, rotateY: 0, x: 0, scale: 1 }}
                exit={{ opacity: 0, rotateY: -75, x: -180, scale: 0.88, transition: { duration: 0.55, ease: [0.5, 0, 0.75, 0] } }}
                transition={{ duration: 1.3, ease: easeOutExpo }}
              >
                <motion.div
                  className="h-full [transform-style:preserve-3d]"
                  animate={prefersReducedMotion ? undefined : { y: [0, -12, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Phone3D image={image} alt={`${product.title} em ${finish.name}`} hex={finish.hex} pointerX={pointerX} pointerY={pointerY} />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Copy */}
          <div className="relative flex flex-col justify-center px-6 pb-8 sm:px-10 lg:order-1 lg:col-span-5 lg:py-16 lg:pl-14 lg:pr-0 xl:pl-16">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                transition={{ duration: 0.7, ease: easeOutExpo }}
              >
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-paper/50">{product.brand}</p>
                <h2 className="type-display mt-3 text-paper">{product.title}</h2>
                <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-paper/60">{product.summary}</p>
                <p className="mt-6 tabular-nums">
                  {product.option && <span className="text-sm text-paper/50">Desde </span>}
                  <span className="text-xl font-semibold tracking-tight">{formatPrice(priceFrom(product))}</span>
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6">
              <p className="text-sm text-paper/50">
                Cor <span className="text-paper">{finish.name}</span>
              </p>
              <ul className="-ml-1 mt-2 flex flex-wrap gap-1" aria-label="Cores">
                {product.finishes.map((item, index) => (
                  <li key={item.name}>
                    <button
                      type="button"
                      onClick={() => pickFinish(index)}
                      aria-label={item.name}
                      aria-pressed={index === finishIndex}
                      className="grid h-9 w-9 place-items-center rounded-full"
                    >
                      <span
                        className={`block h-6 w-6 rounded-full ring-1 ring-inset ring-white/20 transition-shadow duration-300 ${
                          index === finishIndex ? 'shadow-[0_0_0_2px_#0C0C0D,0_0_0_3.5px_rgba(255,255,255,0.85)]' : ''
                        }`}
                        style={{ backgroundColor: item.hex }}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={productPath(product, finish)}
                className="inline-flex h-12 items-center rounded-full bg-paper px-7 text-sm font-medium text-ink transition-transform duration-300 hover:scale-[1.03]"
              >
                Comprar
              </Link>
              <Link
                to="/loja/celulares"
                className="inline-flex h-12 items-center rounded-full px-6 text-sm font-medium text-paper ring-1 ring-inset ring-white/20 transition-colors duration-300 hover:bg-white/10"
              >
                Ver todos os celulares
              </Link>
            </div>
          </div>
        </div>

        {/* Phones on show, with time left on the current one */}
        <div role="tablist" aria-label="Escolher telemóvel" className="grid grid-cols-4 border-t border-white/10">
          {SLIDES.map((item, index) => {
            const active = index === slide;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => goTo(index)}
                className={`relative px-3 pb-5 pt-5 text-left transition-colors duration-300 sm:px-6 lg:px-8 ${active ? 'text-paper' : 'text-paper/45 hover:text-paper/80'}`}
              >
                <span aria-hidden="true" className="absolute inset-x-3 top-0 h-[2px] overflow-hidden bg-white/10 sm:inset-x-6 lg:inset-x-8">
                  {active && <motion.span className="block h-full origin-left bg-accent" style={{ scaleX: progress }} />}
                </span>
                <span className="block text-[11px] tabular-nums text-paper/35">{String(index + 1).padStart(2, '0')}</span>
                <span className="mt-1 block truncate text-sm font-medium max-sm:hidden">{item.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Showroom;
