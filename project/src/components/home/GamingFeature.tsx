import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { unsplash, unsplashSrcSet } from '../../lib/images';
import { easeOutExpo, inViewOnce } from '../../lib/motion';
import SectionHeading from '../ui/SectionHeading';

const MAIN_IMAGE = '1593305841991-05c297ba4575';
const DETAIL_IMAGE = '1552820728-8b83bb6b773f';

const HIGHLIGHTS = [
  { label: 'Consoles', detail: 'PlayStation, Xbox e Nintendo' },
  { label: 'Periféricos', detail: 'Teclados, ratos e headsets de competição' },
  { label: 'Monitores', detail: 'Alta frequência para jogar sem atrasos' },
];

const GamingFeature = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sceneRef, offset: ['start end', 'end start'] });

  // The main photo opens from a narrow window and drifts slowly; the detail card floats against it.
  const reveal = useTransform(scrollYProgress, [0, 0.45], ['inset(18% 12% 18% 12% round 28px)', 'inset(0% 0% 0% 0% round 20px)']);
  const mainScale = useTransform(scrollYProgress, [0, 1], [1.25, 1.02]);
  const mainY = useTransform(scrollYProgress, [0, 1], ['-4%', '4%']);
  const detailY = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const detailRotate = useTransform(scrollYProgress, [0, 1], [-10, 6]);

  return (
    <section className="overflow-hidden border-t border-ink/10" aria-labelledby="gaming-titulo">
      <div className="container-site grid items-center gap-16 py-28 lg:grid-cols-12 lg:gap-12 lg:py-40">
        <div className="lg:col-span-5">
          <SectionHeading id="gaming-titulo" index="04" eyebrow="Gaming" title="O seu setup, montado peça a peça" />
          <motion.p
            className="mt-6 max-w-md text-base leading-relaxed text-ink/60"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewOnce}
            transition={{ duration: 0.9, ease: easeOutExpo, delay: 0.1 }}
          >
            Consoles, monitores de alta frequência e periféricos de competição. Ajudamos a escolher cada componente
            para que tudo funcione em conjunto desde o primeiro dia
          </motion.p>

          <motion.ul
            className="mt-10 border-t border-ink/10"
            initial="hidden"
            whileInView="visible"
            viewport={inViewOnce}
            variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }}
          >
            {HIGHLIGHTS.map((item) => (
              <motion.li
                key={item.label}
                className="flex items-baseline justify-between gap-6 border-b border-ink/10 py-4"
                variants={{
                  hidden: { opacity: 0, x: -16 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: easeOutExpo } },
                }}
              >
                <span className="font-medium">{item.label}</span>
                <span className="text-right text-sm text-ink/55">{item.detail}</span>
              </motion.li>
            ))}
          </motion.ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/loja/gaming"
              className="inline-flex h-12 items-center rounded-full bg-ink px-7 text-sm font-medium text-paper transition-colors duration-300 hover:bg-ink-soft"
            >
              Ver consoles
            </Link>
            <Link
              to="/loja/acessorios"
              className="inline-flex h-12 items-center rounded-full border border-ink/20 px-7 text-sm font-medium transition-colors duration-300 hover:border-ink"
            >
              Ver periféricos
            </Link>
          </div>
        </div>

        <div ref={sceneRef} className="relative lg:col-span-7">
          <motion.div className="relative aspect-[4/5] overflow-hidden bg-ink sm:aspect-[5/4]" style={{ clipPath: reveal }}>
            <motion.img
              src={unsplash(MAIN_IMAGE, 1600)}
              srcSet={unsplashSrcSet(MAIN_IMAGE)}
              sizes="(min-width: 1024px) 55vw, 100vw"
              alt="Sala de gaming iluminada a roxo com monitor e consolas"
              loading="lazy"
              className="h-full w-full object-cover"
              style={{ scale: mainScale, y: mainY }}
            />
          </motion.div>

          <motion.div
            className="absolute -bottom-12 -right-3 w-[36%] overflow-hidden rounded-xl border-[6px] border-paper bg-ink shadow-[0_40px_80px_-30px_rgba(12,12,13,0.6)] sm:-right-6 lg:-right-8"
            style={{ y: detailY, rotate: detailRotate }}
          >
            <img
              src={unsplash(DETAIL_IMAGE, 700)}
              alt="Comando de consola sobre superfície escura"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GamingFeature;
