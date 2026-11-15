import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { STORE } from '../../data/store';
import { easeOutExpo, inViewOnce } from '../../lib/motion';
import ArrowChip from '../ui/ArrowChip';
import { storeStatus } from '../../lib/storeHours';
import StoreDisplay from './StoreDisplay';

/**
 * Closing call to visit the shop: the copy beside a display table of phones. Everything needed to
 * come in sits in one card under it: whether the shop is open now (live, Maputo time), where it is,
 * its hours and phone, the way there and WhatsApp, and the other way in, collecting an online
 * order at the shop.
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
        {/* Phones: the words, the display table, then the card. Desktop: words and card on the left,
            the table on the right, standing level with the foot of the card. */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-0">
          <motion.div
            className="lg:col-span-6 lg:row-start-1"
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
          </motion.div>

          <div className="-mx-2 lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:mx-0 lg:self-end">
            <StoreDisplay />
          </div>

          <motion.div
            className="lg:col-span-6 lg:row-start-2"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewOnce}
            transition={{ duration: 1.1, ease: easeOutExpo, delay: 0.1 }}
          >
            {/* The visit card */}
            <div className="max-w-xl rounded-[28px] bg-paper/[0.06] p-6 ring-1 ring-inset ring-paper/10 backdrop-blur-md sm:p-8 lg:mt-10">
              <p className="flex items-center gap-2.5 text-sm font-medium text-paper/85" aria-live="polite">
                <span
                  aria-hidden="true"
                  className={`h-2 w-2 rounded-full ${status.open ? 'bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.18)]' : 'bg-paper/35'}`}
                />
                {status.label}
              </p>
              <p className="mt-4 font-display text-2xl font-medium tracking-tight">{STORE.address}</p>
              <p className="mt-1.5 text-sm tabular-nums text-paper/55">
                {STORE.hours} ·{' '}
                <a href={STORE.phoneHref} className="link-underline text-paper/80 hover:text-paper">
                  {STORE.phone}
                </a>
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
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
                  className="inline-flex h-14 items-center rounded-full border border-paper/25 px-7 text-sm font-medium transition-colors duration-300 hover:border-paper/60 hover:bg-paper/10"
                >
                  Falar no WhatsApp
                </a>
              </div>
              {/* The other way in: buy online, collect at the shop */}
              <div className="mt-7 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-paper/10 pt-5 text-sm">
                <span className="text-paper/60">Compre online e levante na loja, grátis.</span>
                <Link to="/loja" className="link-underline shrink-0 font-medium text-paper">
                  Ver a loja online
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StoreVisit;
