import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { STORE } from '../../data/store';
import { unsplash, unsplashSrcSet } from '../../lib/images';
import { easeOutExpo, inViewOnce } from '../../lib/motion';

const CTA_IMAGE = '1616763355548-1b606f439f86';

const DETAILS = [
  { label: 'Loja física', value: STORE.address },
  { label: 'Horário', value: STORE.hours },
  { label: 'Telefone', value: STORE.phone, href: STORE.phoneHref },
];

const StoreVisit = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  // Full-bleed photo drifting slower than the page, so the section feels deeper than the content around it.
  const imageY = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1.18, 1.06]);

  return (
    <section
      ref={sectionRef}
      id="visitar"
      className="relative isolate scroll-mt-24 overflow-hidden bg-ink text-paper"
      aria-labelledby="visitar-titulo"
    >
      <motion.img
        src={unsplash(CTA_IMAGE, 2400)}
        srcSet={unsplashSrcSet(CTA_IMAGE)}
        sizes="100vw"
        alt=""
        loading="lazy"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        style={{ y: imageY, scale: imageScale }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/95 via-ink/70 to-ink/10" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-ink/80 to-transparent" />

      <div className="container-site grid gap-14 py-24 lg:grid-cols-12 lg:py-28">
        <motion.div
          className="lg:col-span-7"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewOnce}
          transition={{ duration: 1.1, ease: easeOutExpo }}
        >
          <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-paper/55">
            <span className="tabular-nums">06</span>
            <span aria-hidden="true" className="h-px w-8 bg-current" />
            <span>A loja</span>
          </p>
          <h2
            id="visitar-titulo"
            className="mt-5 max-w-2xl font-display text-[2.5rem] font-medium leading-[1.02] tracking-tightest [text-wrap:balance] sm:text-5xl lg:text-[4rem]"
          >
            Experimente antes de comprar
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-paper/70 sm:text-lg">
            Venha ver os equipamentos de perto, testar teclados e ecrãs e sair com tudo configurado. Ou fale connosco
            pelo WhatsApp durante o horário de loja
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={STORE.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center rounded-full bg-paper px-7 text-sm font-medium text-ink transition-colors duration-300 hover:bg-mist"
            >
              Falar pelo WhatsApp
            </a>
            <a
              href={STORE.phoneHref}
              className="inline-flex h-12 items-center rounded-full border border-paper/30 px-7 text-sm font-medium backdrop-blur-sm transition-colors duration-300 hover:border-paper/70"
            >
              Ligar agora
            </a>
          </div>
        </motion.div>

        <motion.dl
          className="grid content-end gap-6 sm:grid-cols-3 lg:col-span-4 lg:col-start-9 lg:grid-cols-1"
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
          variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }}
        >
          {DETAILS.map((detail) => (
            <motion.div
              key={detail.label}
              className="border-t border-paper/20 pt-4"
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOutExpo } },
              }}
            >
              <dt className="text-xs uppercase tracking-[0.16em] text-paper/50">{detail.label}</dt>
              <dd className="mt-2 text-base tabular-nums">
                {detail.href ? (
                  <a href={detail.href} className="link-underline">
                    {detail.value}
                  </a>
                ) : (
                  detail.value
                )}
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
};

export default StoreVisit;
