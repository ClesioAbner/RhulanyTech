import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { CatalogProduct } from '../../lib/catalog';
import { easeOutExpo } from '../../lib/motion';
import SectionHeading from '../ui/SectionHeading';

const VISIBLE_ROWS = 6;

/** Specifications with progressive disclosure: the first rows, then the rest on request. */
const ProductSpecifications = ({ product }: { product: CatalogProduct }) => {
  const [expanded, setExpanded] = useState(false);
  const listId = useId();

  const rows: [string, string][] = [
    ['Marca', product.brand],
    ['Modelo', product.model],
    ...product.specs.map((spec, index): [string, string] => [index === 0 ? 'Características' : '', spec]),
    ...(product.dimensions ? [['Dimensões', product.dimensions] as [string, string]] : []),
    ...(product.weight ? [['Peso', product.weight] as [string, string]] : []),
    ...(product.finishes.length ? [['Acabamentos', product.finishes.map((f) => f.name).join(', ')] as [string, string]] : []),
    ['Garantia', product.warranty],
  ];
  const visible = expanded ? rows : rows.slice(0, VISIBLE_ROWS);
  const hidden = rows.length - VISIBLE_ROWS;

  return (
    <section className="border-t border-ink/10" aria-labelledby="especificacoes">
      <div className="container-site grid gap-12 py-24 lg:grid-cols-12 lg:py-32">
        <div className="lg:col-span-4">
          <SectionHeading id="especificacoes" index="02" eyebrow="Especificações" title="Ficha técnica" />
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <dl id={listId} className="divide-y divide-ink/10 border-y border-ink/10">
            <AnimatePresence initial={false}>
              {visible.map(([label, value], index) => (
                <motion.div
                  key={`${label}-${value}`}
                  className="grid grid-cols-[9rem_1fr] gap-6 overflow-hidden py-4 text-sm sm:grid-cols-[12rem_1fr]"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{
                    duration: 0.35,
                    ease: easeOutExpo,
                    delay: index >= VISIBLE_ROWS ? (index - VISIBLE_ROWS) * 0.03 : 0,
                  }}
                >
                  <dt className="text-ink/50">{label}</dt>
                  <dd>{value}</dd>
                </motion.div>
              ))}
            </AnimatePresence>
          </dl>
          {hidden > 0 && (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              aria-expanded={expanded}
              aria-controls={listId}
              className="link-underline mt-6 text-sm font-medium"
            >
              {expanded ? 'Mostrar menos' : `Ver todas as especificações (${rows.length})`}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductSpecifications;
