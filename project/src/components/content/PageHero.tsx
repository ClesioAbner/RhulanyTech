import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { unsplash, unsplashSrcSet } from '../../lib/images';
import { easeOutExpo } from '../../lib/motion';

interface PageHeroProps {
  image: string;
  /** Portrait crop for phones, so the subject is not cut off on narrow screens. */
  mobileImage?: string;
  /** Object-position classes for the photo, e.g. to keep the subject clear of the header. */
  imagePosition?: string;
  alt: string;
  eyebrow: string;
  title: string;
  /** Second line under the title, quieter and smaller. */
  lead?: string;
  /** Bottom-right on desktop, under the title on mobile. */
  aside?: ReactNode;
  /** Section the "Deslize" cue scrolls to. */
  nextId?: string;
}

/**
 * Full-screen opening banner for content pages: edge-to-edge photo under the floating header,
 * title at the bottom. The photo drifts and the copy fades as the page scrolls away.
 */
const PageHero = ({ image, mobileImage, imagePosition = '', alt, eyebrow, title, lead, aside, nextId }: PageHeroProps) => {
  const ref = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  // A cached photo can finish before React attaches onLoad.
  useEffect(() => {
    if (photoRef.current?.complete && photoRef.current.naturalWidth) setLoaded(true);
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const copyY = useTransform(scrollYProgress, [0, 0.55], [0, -40]);

  return (
    <section ref={ref} className="relative isolate h-[100svh] min-h-[620px] overflow-hidden bg-ink text-paper">
      <motion.div className="absolute inset-0 -z-10" style={{ y: imageY, scale: imageScale }}>
        {/* Blur-up: a tiny copy shows the colours at once while the full photo loads */}
        <img
          src={unsplash(image, 48)}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl"
        />
        <picture className="relative block h-full w-full">
          {mobileImage && <source media="(max-width: 767px)" srcSet={unsplashSrcSet(mobileImage)} sizes="100vw" />}
          <motion.img
            ref={photoRef}
            src={unsplash(image, 1600)}
            srcSet={unsplashSrcSet(image)}
            sizes="100vw"
            alt={alt}
            onLoad={() => setLoaded(true)}
            className={`h-full w-full object-cover ${imagePosition}`}
            initial={{ scale: 1.08, opacity: 0 }}
            animate={loaded ? { scale: 1, opacity: 1 } : { scale: 1.08, opacity: 0 }}
            transition={{ duration: 1.6, ease: easeOutExpo }}
          />
        </picture>
      </motion.div>
      {/* Shade only where the copy sits, so the sky keeps its colour */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 via-ink/30 via-35% to-transparent to-70%" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/45 via-transparent to-transparent" />

      <motion.div
        className="container-site flex h-full flex-col justify-end gap-10 pb-14 pt-32 lg:flex-row lg:items-end lg:justify-between lg:pb-32"
        style={{ opacity: copyOpacity, y: copyY }}
      >
        <div className="max-w-2xl">
          <motion.p
            className="text-xs font-medium uppercase tracking-[0.18em] text-paper/65"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {eyebrow}
          </motion.p>
          <h1 className="type-display mt-4 overflow-hidden pb-[0.08em]">
            <motion.span
              className="block"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1, ease: easeOutExpo, delay: 0.2 }}
            >
              {title}
            </motion.span>
          </h1>
          {lead && (
            <motion.p
              className="type-lead mt-4 max-w-xl text-paper/70"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: easeOutExpo, delay: 0.45 }}
            >
              {lead}
            </motion.p>
          )}
        </div>
        {aside && (
          <motion.div
            className="lg:max-w-sm lg:shrink-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: easeOutExpo, delay: 0.55 }}
          >
            {aside}
          </motion.div>
        )}
      </motion.div>

      {nextId && (
        <motion.button
          type="button"
          onClick={() => document.getElementById(nextId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-paper/60 transition-colors hover:text-paper lg:flex"
          style={{ opacity: copyOpacity }}
        >
          Deslize
          <span className="relative block h-10 w-px overflow-hidden bg-paper/20">
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-paper"
              animate={{ y: ['-100%', '200%'] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
        </motion.button>
      )}
    </section>
  );
};

export default PageHero;
