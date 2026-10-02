import { motion } from 'framer-motion';
import type { CatalogProduct } from '../../lib/catalog';
import { easeOutExpo, inViewOnce } from '../../lib/motion';

export const OVERVIEW_ID = 'visao-geral';

// The first sentence leads in full ink, the rest follows in a quieter tone.
const splitLead = (text: string) => {
  const end = text.search(/[.!?]\s/);
  return end === -1 ? [text, ''] : [text.slice(0, end + 1), text.slice(end + 2)];
};

/** "Visão geral": the product described in plain language, right after the purchase area. */
const ProductOverview = ({ product }: { product: CatalogProduct }) => {
  const [lead, rest] = splitLead(product.overview);

  return (
    <section id={OVERVIEW_ID} className="scroll-mt-24 border-t border-ink/10" aria-labelledby="visao-geral-titulo">
      <div className="container-site grid gap-8 py-20 lg:grid-cols-12 lg:py-28">
        <h2 id="visao-geral-titulo" className="text-xs font-medium uppercase tracking-[0.18em] text-ink/45 lg:col-span-3 lg:pt-3">
          Visão geral
        </h2>
        <motion.p
          className="font-display text-2xl font-medium leading-[1.3] tracking-tight [text-wrap:pretty] sm:text-[1.75rem] lg:col-span-8 lg:text-[2.1rem]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewOnce}
          transition={{ duration: 0.9, ease: easeOutExpo }}
        >
          {lead}
          {rest && <span className="text-ink/45"> {rest}</span>}
        </motion.p>
      </div>
    </section>
  );
};

export default ProductOverview;
