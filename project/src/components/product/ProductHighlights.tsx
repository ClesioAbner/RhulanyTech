import { motion } from 'framer-motion';
import type { CatalogProduct } from '../../lib/catalog';
import { easeOutExpo, inViewOnce } from '../../lib/motion';
import SectionHeading from '../ui/SectionHeading';

/** "Porquê o …?": the product's story in a few strong points. */
const ProductHighlights = ({ product }: { product: CatalogProduct }) => {
  if (!product.highlights.length) return null;
  const withBodies = product.highlights.some((highlight) => highlight.body);

  return (
    <section className="border-t border-ink/10" aria-labelledby="destaques-produto">
      <div className="container-site py-24 lg:py-32">
        <SectionHeading id="destaques-produto" index="01" eyebrow="Destaques" title={`Porquê escolher ${product.title}`} />
        <ol className={`mt-14 grid gap-px overflow-hidden rounded-[24px] bg-ink/10 lg:mt-20 ${withBodies ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 lg:grid-cols-4'}`}>
          {product.highlights.map((highlight, index) => (
            <motion.li
              key={highlight.title}
              className={`bg-paper ${withBodies ? 'p-8 lg:p-10' : 'p-6 lg:p-8'}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inViewOnce}
              transition={{ duration: 0.8, ease: easeOutExpo, delay: (index % 3) * 0.06 }}
            >
              <span className="font-display text-sm tabular-nums text-ink/35">{String(index + 1).padStart(2, '0')}</span>
              <h3 className={`font-display font-medium tracking-tight ${withBodies ? 'mt-8 text-2xl' : 'mt-4 text-lg lg:text-xl'}`}>
                {highlight.title}
              </h3>
              {highlight.body && <p className="mt-3 text-sm leading-relaxed text-ink/60">{highlight.body}</p>}
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default ProductHighlights;
