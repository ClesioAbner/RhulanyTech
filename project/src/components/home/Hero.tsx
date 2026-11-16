import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTime, useTransform } from 'framer-motion';
import { INTRO_LIFT, introPending } from '../../lib/bootLoader';
import { easeOutExpo } from '../../lib/motion';
import { useMediaQuery } from '../../lib/useMediaQuery';
import PhoneCopy from '../ui/PhoneCopy';
import ArrowChip from '../ui/ArrowChip';
import ShopScreen from '../shop/ShopScreen';

const HERO_VIDEO = '/videos/hero-circuit.mp4';
const HERO_POSTER = '/videos/hero-circuit-poster.jpg';
const PAPER = '#F5F5F7';

/*
 * The opening, as a way in: the page is a wall with one window, an iPhone's screen, with the shop
 * running on it (the new phones going by) and the film behind. Scrolling walks into the screen:
 * the shop fades to show the film, and the phone grows and comes to the middle until the film fills
 * the view and the frame has gone past the edges; then the name of the shop comes up over the
 * film. The section is held in place (sticky) for the length of that walk.
 *
 * The wall is a single shape: the screen's rounded rectangle, ringed by the black bezel and, past
 * it, by an endless spread of the page colour (box-shadows), so scaling it is all it takes. On it
 * sit the phone's titanium edge (a ring cut from a metal gradient), its side buttons and the light
 * on the glass. Before the walk the phone floats, turned a little in 3D, and leans towards the
 * pointer; it squares up to the visitor as the walk begins. Visitors who prefer less motion get
 * the film and the name straight away.
 */
const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const still = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  // On the first visit the entrance waits for the intro's curtain, so it is seen rather than played behind it.
  const [waiting, setWaiting] = useState(introPending);
  useEffect(() => {
    if (!waiting) return;
    const lift = () => setWaiting(false);
    window.addEventListener(INTRO_LIFT, lift);
    return () => window.removeEventListener(INTRO_LIFT, lift);
  }, [waiting]);

  useEffect(() => {
    if (still) videoRef.current?.pause();
  }, [still]);

  // The screen's size and place follow the window: beside the words on desktop, under them on phones.
  const [viewport, setViewport] = useState({ width: 1440, height: 900 });
  useEffect(() => {
    const measure = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  const screenHeight = Math.min(viewport.height * (isDesktop ? 0.64 : 0.46), 620);
  const screenWidth = screenHeight * 0.46;
  const radius = screenWidth * 0.17;
  const bezel = Math.max(7, screenWidth * 0.045);
  const rim = Math.max(2, screenWidth * 0.014);
  const key = Math.max(2, screenWidth * 0.012);
  // The iPhone's buttons, as a share of the screen's height: Action and volume on the left, the
  // side button and the Camera Control on the right.
  const keys = [
    { side: 'left' as const, from: 0.15, to: 0.19, camera: false },
    { side: 'left' as const, from: 0.24, to: 0.31, camera: false },
    { side: 'left' as const, from: 0.34, to: 0.41, camera: false },
    { side: 'right' as const, from: 0.23, to: 0.34, camera: false },
    { side: 'right' as const, from: 0.55, to: 0.61, camera: true },
  ];

  // Kept in motion values so the scroll transforms always read the latest layout.
  const startX = useMotionValue(0);
  const startY = useMotionValue(0);
  const endScale = useMotionValue(6);
  useEffect(() => {
    startX.set(isDesktop ? viewport.width * 0.2 : 0);
    startY.set(isDesktop ? 0 : viewport.height * 0.14);
    // Far enough that the rounded corners and the bezel are well past the edges of the view.
    endScale.set(1.35 * Math.max(viewport.width / screenWidth, viewport.height / screenHeight));
  }, [viewport, isDesktop, screenWidth, screenHeight, startX, startY, endScale]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 130, damping: 30, mass: 0.3 });
  // The walk in: a short rest, then the zoom, geometric so its speed feels even all the way.
  const zoom = useTransform(progress, [0.06, 0.72], [0, 1]);
  const scale = useTransform([zoom, endScale], ([z, end]: number[]) => Math.pow(end, z));
  const x = useTransform([zoom, startX], ([z, from]: number[]) => from * (1 - Math.min(1, z * 1.5)));

  // Before the walk: a float, a turn in 3D and a lean towards the pointer, all fading out as it starts.
  const settle = useTransform(zoom, [0, 0.3], [1, 0]);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const leanY = useSpring(pointerX, { stiffness: 70, damping: 18 });
  const leanX = useSpring(pointerY, { stiffness: 70, damping: 18 });
  const time = useTime();
  const rotateY = useTransform([settle, leanY], ([s, lean]: number[]) => s * (-16 + lean * 14));
  const rotateX = useTransform([settle, leanX], ([s, lean]: number[]) => s * (5 - lean * 8));
  const float = useTransform([time, settle], ([t, s]: number[]) => Math.sin(t / 1100) * 9 * s);
  const y = useTransform([zoom, startY, float], ([z, from, drift]: number[]) => from * (1 - Math.min(1, z * 1.5)) + drift);
  const sheen = useTransform(zoom, [0, 0.25], [1, 0]);
  // The shop on the screen gives way to the film as the walk goes into it.
  const shopOnScreen = useTransform(zoom, [0.12, 0.42], [1, 0]);
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return;
    pointerX.set(event.clientX / window.innerWidth - 0.5);
    pointerY.set(event.clientY / window.innerHeight - 0.5);
  };

  const introOpacity = useTransform(progress, [0.03, 0.2], [1, 0]);
  const introY = useTransform(progress, [0, 0.2], [0, -48]);
  const introEvents = useTransform(introOpacity, (value) => (value > 0.4 ? 'auto' : 'none'));
  const hintOpacity = useTransform(progress, [0, 0.05], [1, 0]);
  const shade = useTransform(progress, [0.55, 0.85], [0, 1]);
  const finalOpacity = useTransform(progress, [0.7, 0.86], [0, 1]);
  const finalY = useTransform(progress, [0.7, 0.9], [28, 0]);
  const finalEvents = useTransform(finalOpacity, (value) => (value > 0.5 ? 'auto' : 'none'));

  return (
    <section ref={sectionRef} className={`relative bg-paper ${still ? 'h-[100svh]' : 'h-[200svh] lg:h-[260svh]'}`}>
      <div
        className="sticky top-0 h-[100svh] min-h-[560px] overflow-hidden bg-ink [perspective:1800px]"
        onPointerMove={onPointerMove}
      >
        {/* The film behind the wall */}
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={HERO_VIDEO}
          poster={HERO_POSTER}
          autoPlay={!still}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-ink/10"
          style={{ opacity: still ? 1 : shade }}
        />

        {/* After the walk: the name of the shop over the film (under the wall, seen through its window) */}
        <motion.div
          className="container-site absolute inset-x-0 bottom-0 pb-14 text-paper sm:pb-16"
          style={still ? undefined : { opacity: finalOpacity, y: finalY, pointerEvents: finalEvents }}
        >
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-md">
              <h1 className="font-display text-[28px] font-medium leading-[1.1] tracking-tight text-paper sm:text-[40px]">
                Tecnologia original em Moçambique
              </h1>
              <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-paper/70 sm:mt-4 sm:text-base">
                <PhoneCopy phone="Com garantia e entrega em todo o país">
                  Smartphones, computadores, consolas e acessórios originais, com garantia e entrega em todo o país.
                </PhoneCopy>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/loja"
                className="group inline-flex h-14 items-center gap-3 rounded-full bg-paper pl-7 pr-3 text-sm font-medium text-ink shadow-[0_18px_40px_-20px_rgba(0,0,0,0.6)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                Entrar na loja
                <ArrowChip tone="ink" />
              </Link>
              <Link
                to="/loja/celulares?ordem=novidades"
                className="inline-flex h-14 items-center rounded-full border border-paper/25 bg-paper/5 px-7 text-sm font-medium text-paper backdrop-blur-md transition-colors duration-300 hover:border-paper/60 hover:bg-paper/10"
              >
                Ver novidades
              </Link>
            </div>
          </div>
        </motion.div>

        {/* The wall, with the phone's screen as its window */}
        {!still && (
          <motion.div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 [will-change:transform]"
            style={{
              width: screenWidth,
              height: screenHeight,
              marginLeft: -screenWidth / 2,
              marginTop: -screenHeight / 2,
              x,
              y,
              scale,
              rotateY,
              rotateX,
              borderRadius: radius,
              boxShadow: [
                `0 0 0 ${bezel}px #0b0b0d`,
                `0 80px 90px -50px rgba(12,12,13,0.5)`,
                `30px 50px 120px -40px rgba(12,12,13,0.18)`,
                `0 0 0 300vmax ${PAPER}`,
              ].join(', '),
            }}
          >
            {/* Titanium edge round the bezel: a ring cut out of a metal gradient */}
            <span
              className="absolute"
              style={{
                inset: -(bezel + rim),
                borderRadius: radius + bezel + rim,
                padding: rim,
                background:
                  'linear-gradient(135deg, #f1f1f3 0%, #9a9ba1 18%, #3d3e43 42%, #c9cace 62%, #6c6d72 82%, #d9dadd 100%)',
                WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                WebkitMaskComposite: 'xor',
                mask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                maskComposite: 'exclude',
              }}
            />
            {/* Side buttons */}
            {keys.map(({ side, from, to, camera }) => (
              <span
                key={`${side}-${from}`}
                className="absolute"
                style={{
                  [side]: -(bezel + rim + key),
                  top: screenHeight * from,
                  height: screenHeight * (to - from),
                  width: key + 1,
                  borderRadius: key,
                  background: camera
                    ? 'linear-gradient(90deg, #16171b, #4a4c53, #16171b)'
                    : 'linear-gradient(90deg, #6b6c71, #d2d3d7 50%, #7a7b80)',
                }}
              />
            ))}
            {/* The shop running on the screen */}
            <motion.div
              className="absolute inset-0 overflow-hidden [container-type:inline-size]"
              style={{ borderRadius: radius, opacity: shopOnScreen }}
            >
              <ShopScreen />
            </motion.div>
            {/* Light on the glass, gone once the walk starts */}
            <motion.span
              className="pointer-events-none absolute inset-0"
              style={{
                borderRadius: radius,
                opacity: sheen,
                background: 'linear-gradient(118deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.07) 30%, transparent 48%)',
              }}
            />
          </motion.div>
        )}

        {/* Before the walk: the words on the wall */}
        {!still && (
          <motion.div
            className="container-site absolute inset-0 flex flex-col pt-28 lg:justify-center lg:pt-0"
            style={{ opacity: introOpacity, y: introY, pointerEvents: introEvents }}
          >
            <motion.div
              className="max-w-xl lg:max-w-[44%]"
              initial={{ opacity: 0, y: 24 }}
              animate={waiting ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: easeOutExpo, delay: 0.3 }}
            >
              <p className="eyebrow text-ink/45">Rhulany Tech, Maputo</p>
              <p className="type-display mt-4 lg:mt-5">A loja mais perto de si</p>
              <p className="type-lead mt-4 text-ink/60 lg:mt-5">Original, com garantia e entrega em todo o país.</p>
              <div className="mt-8 hidden lg:block">
                <Link
                  to="/loja"
                  className="group inline-flex h-14 items-center gap-3 rounded-full bg-ink pl-7 pr-3 text-sm font-medium text-paper shadow-[0_18px_40px_-18px_rgba(12,12,13,0.55)] transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Entrar na loja
                  <ArrowChip />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
        {!still && (
          <motion.p
            aria-hidden="true"
            className="absolute inset-x-0 bottom-6 text-center text-xs uppercase tracking-[0.18em] text-ink/40"
            style={{ opacity: hintOpacity }}
          >
            Deslize para entrar
          </motion.p>
        )}
      </div>
    </section>
  );
};

export default Hero;
