import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { STORE } from '../../data/store';
import { easeOutExpo, inViewOnce } from '../../lib/motion';
import ArrowChip from '../ui/ArrowChip';
import { storeStatus } from '../../lib/storeHours';
import StoreDisplay from './StoreDisplay';

const DETAILS = [
  { label: 'Loja física', value: STORE.address },
  { label: 'Horário', value: STORE.hours },
  { label: 'Telefone', value: STORE.phone, href: STORE.phoneHref },
];

/**
 * Closing call to visit the shop: the copy beside a display table of phones, then the shop details.
 * A line above the buttons says, live, whether the shop is open now (Maputo time).
 */
const StoreVisit = () => {
  const [status, setStatus] = useState(storeStatus);
  useEffect(() => {
    const timer = window.setInterval(() => setStatus(storeStatus()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section
      id="visitar"
      className="relative isolate scroll-mt-24 overflow-hidden bg-ink text-paper"
      aria-labelledby="visitar-titulo"
    >
      {/* Warm light from above, like the shop floor */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_75%_20%,rgba(255,214,160,0.14)_0%,transparent_70%),radial-gradient(50%_60%_at_10%_90%,rgba(120,140,200,0.12)_0%,transparent_70%)]"
      />

      <div className="container-site py-24 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <motion.div
            className="lg:col-span-6"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewOnce}
            transition={{ duration: 1.1, ease: easeOutExpo }}
          >
            <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-paper/55">
              <span className="tabular-nums">04</span>
              <span aria-hidden="true" className="h-px w-8 bg-current" />
              <span>A loja</span>
            </p>
            <h2 id="visitar-titulo" className="type-display mt-5 max-w-2xl">
              Experimente antes de comprar
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-paper/70 sm:text-lg">
              Venha ver de perto, teste à vontade e saia com tudo configurado.
            </p>
            <p className="mt-8 flex items-center gap-2.5 text-sm font-medium text-paper/85" aria-live="polite">
              <span
                aria-hidden="true"
                className={`h-2 w-2 rounded-full ${status.open ? 'bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.18)]' : 'bg-paper/35'}`}
              />
              {status.label}
            </p>
            {/* One clear way in (the shop on the map), WhatsApp beside it; the phone is in the details below */}
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={STORE.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-14 items-center gap-3 rounded-full bg-paper pl-7 pr-3 text-sm font-medium text-ink shadow-[0_18px_40px_-20px_rgba(0,0,0,0.7)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                Como chegar
                <ArrowChip tone="ink" />
              </a>
              <a
                href={STORE.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center rounded-full border border-paper/25 bg-paper/5 px-7 text-sm font-medium backdrop-blur-md transition-colors duration-300 hover:border-paper/60 hover:bg-paper/10"
              >
                Falar no WhatsApp
              </a>
            </div>
          </motion.div>

          <div className="lg:col-span-6">
            <StoreDisplay />
          </div>
        </div>

        <motion.dl
          className="mt-16 grid gap-6 sm:grid-cols-3 lg:mt-20"
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
