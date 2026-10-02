import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { easeOutExpo } from '../../lib/motion';

const HERO_VIDEO = '/videos/hero-circuit.mp4';
const HERO_POSTER = '/videos/hero-circuit-poster.jpg';

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Scroll: the stage tilts back and settles into a framed card as the page moves on.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const stageScale = useTransform(scrollYProgress, [0, 1], [1, 0.88]);
  const stageRotateX = useTransform(scrollYProgress, [0, 1], [0, 12]);
  const stageRadius = useTransform(scrollYProgress, [0, 0.35], [0, 32]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-25%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  useEffect(() => {
    if (prefersReducedMotion) videoRef.current?.pause();
  }, [prefersReducedMotion]);

  return (
    <section ref={sectionRef} className="relative h-[100svh] min-h-[600px] bg-paper [perspective:1400px]">
      <h1 className="sr-only">Rhulany Tech, tecnologia original em Maputo</h1>

      <motion.div
        className="absolute inset-0 overflow-hidden [perspective:1400px] [transform-origin:50%_0%]"
        style={{ scale: stageScale, rotateX: stageRotateX, borderRadius: stageRadius }}
      >
        {/* Entrance: the stage rises out of depth, tilted back, then settles flat. */}
        <motion.div
          className="absolute inset-0 overflow-hidden bg-ink [transform-origin:50%_100%]"
          initial={{ rotateX: 38, y: 160, scale: 0.72, borderRadius: 40, opacity: 0 }}
          animate={{ rotateX: 0, y: 0, scale: 1, borderRadius: 0, opacity: 1 }}
          transition={{ duration: 1.8, ease: easeOutExpo }}
        >
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src={HERO_VIDEO}
            poster={HERO_POSTER}
            autoPlay={!prefersReducedMotion}
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-ink/10" />
        </motion.div>

        <motion.div
          className="container-site relative flex h-full flex-col justify-end pb-14 text-paper sm:pb-16"
          style={{ y: contentY, opacity: contentOpacity }}
        >
          <motion.div
            className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: easeOutExpo, delay: 1 }}
          >
            <p className="max-w-sm text-base leading-relaxed text-paper/75 sm:text-lg">
              Smartphones, computadores, consoles e periféricos originais, com garantia e entrega em todo Moçambique
            </p>

            <div className="flex items-center gap-3">
              <Link
                to="/loja"
                className="inline-flex h-12 items-center rounded-full bg-paper px-7 text-sm font-medium text-ink transition-colors duration-300 hover:bg-mist"
              >
                Entrar na loja
              </Link>
              <a
                href="#categorias"
                className="inline-flex h-12 items-center rounded-full border border-paper/25 px-7 text-sm font-medium text-paper backdrop-blur-sm transition-colors duration-300 hover:border-paper/60"
              >
                Ver categorias
              </a>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
