import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { INTRO_LIFT, introPending } from '../../lib/bootLoader';
import { easeOutExpo } from '../../lib/motion';
import { useMediaQuery } from '../../lib/useMediaQuery';
import PhoneCopy from '../ui/PhoneCopy';
import ArrowChip from '../ui/ArrowChip';

const HERO_VIDEO = '/videos/hero-circuit.mp4';
const HERO_POSTER = '/videos/hero-circuit-poster.jpg';
const PAPER = '#F5F5F7';

/*
 * The opening, as a way in: the page is a wall with one window, an iPhone's screen, and the film
 * plays behind it. Scrolling walks into the screen: the phone grows and comes to the middle until
 * the film fills the view and the frame has gone past the edges; then the name of the shop comes
 * up over the film. The section is held in place (sticky) for the length of that walk.
 *
 * The wall is a single shape: the screen's rounded rectangle, ringed by the black bezel and the
 * metal edge and, past them, by an endless spread of the page colour (box-shadows), so scaling it
 * is all it takes. Visitors who prefer less motion get the film and the name straight away.
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
  const y = useTransform([zoom, startY], ([z, from]: number[]) => from * (1 - Math.min(1, z * 1.5)));

  const introOpacity = useTransform(progress, [0.03, 0.2], [1, 0]);
  const introY = useTransform(progress, [0, 0.2], [0, -48]);
  const introEvents = useTransform(introOpacity, (value) => (value > 0.4 ? 'auto' : 'none'));
  const hintOpacity = useTransform(progress, [0, 0.05], [1, 0]);
  const shade = useTransform(progress, [0.55, 0.85], [0, 1]);
  const finalOpacity = useTransform(progress, [0.7, 0.86], [0, 1]);
  const finalY = useTransform(progress, [0.7, 0.9], [28, 0]);
  const finalEvents = useTransform(finalOpacity, (value) => (value > 0.5 ? 'auto' : 'none'));

  return (
    <section ref={sectionRef} className={`relative bg-paper ${still ? 'h-[100svh]' : 'h-[260svh]'}`}>
      <div className="sticky top-0 h-[100svh] min-h-[560px] overflow-hidden bg-ink">
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
              borderRadius: radius,
              boxShadow: [
                `0 0 0 ${bezel}px #0b0b0d`,
                `0 0 0 ${bezel + 1.5}px #3a3a3f`,
                `0 0 0 ${bezel + 3}px #9a9aa0`,
                `0 40px 60px -36px rgba(12,12,13,0.4)`,
                `0 0 0 300vmax ${PAPER}`,
              ].join(', '),
            }}
          >
            {/* Dynamic Island */}
            <span className="absolute left-1/2 top-[2.4%] h-[3.6%] w-[31%] -translate-x-1/2 rounded-full bg-black" />
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
              <p className="type-display mt-4 lg:mt-5">Original, com garantia e perto de si</p>
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
