import { useMemo, useState, type RefObject } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { products, type Product } from '../../data/products';
import { easeOutExpo } from '../../lib/motion';
import ProductCard from '../product/ProductCard';
import SectionHeading from '../ui/SectionHeading';

type Filter = 'todos' | Product['category'];

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'celulares', label: 'Celulares' },
  { id: 'computadores', label: 'Computadores' },
  { id: 'consoles', label: 'Consoles' },
  { id: 'perifericos', label: 'Periféricos' },
  { id: 'componentes', label: 'Componentes' },
];

// A mixed selection for the default view so the first impression spans the whole catalogue.
const CURATED_IDS = ['18', '6', '10', '1', '12', '20'];
const MAX_ITEMS = 6;
// This product's card hosts the 3D phone on desktop; the phone then falls into the payments section.
const PHONE_PRODUCT_ID = '1';

interface ShopSectionProps {
  sectionRef?: RefObject<HTMLElement>;
  phoneSlotRef?: RefObject<HTMLDivElement>;
}

const ShopSection = ({ sectionRef, phoneSlotRef }: ShopSectionProps) => {
  const [activeFilter, setActiveFilter] = useState<Filter>('todos');

  const visibleProducts = useMemo(() => {
    if (activeFilter === 'todos') {
      return CURATED_IDS.map((id) => products.find((product) => product.id === id)).filter(
        (product): product is Product => Boolean(product),
      );
    }
    return products.filter((product) => product.category === activeFilter).slice(0, MAX_ITEMS);
  }, [activeFilter]);

  const catalogueLink = activeFilter === 'todos' ? '/products' : `/products?category=${activeFilter}`;

  return (
    <section ref={sectionRef} id="loja" className="relative scroll-mt-24 border-t border-ink/10" aria-labelledby="loja-titulo">
      <div className="container-site py-28 lg:py-40">
        <SectionHeading
          id="loja-titulo"
          index="02"
          eyebrow="Loja"
          title="Os favoritos desta semana"
          action={
            <Link to={catalogueLink} className="link-underline text-sm">
              Ver todos os produtos
            </Link>
          }
        />

        <div
          role="tablist"
          aria-label="Filtrar por categoria"
          className="-mx-5 mt-10 flex gap-2 overflow-x-auto px-5 pb-1 text-sm sm:mx-0 sm:px-0 lg:mt-12"
        >
          {FILTERS.map((filter) => {
            const isActive = filter.id === activeFilter;
            return (
              <button
                key={filter.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFilter(filter.id)}
                className={`relative isolate h-10 shrink-0 rounded-full px-5 transition-colors duration-300 ${isActive ? 'text-paper' : 'text-ink/55 hover:text-ink'}`}
              >
                {isActive && (
                  <motion.span
                    layoutId="shop-filter"
                    className="absolute inset-0 -z-10 rounded-full bg-ink"
                    transition={{ duration: 0.5, ease: easeOutExpo }}
                  />
                )}
                {filter.label}
              </button>
            );
          })}
        </div>

        <motion.ul
          layout
          className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 lg:mt-16 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-16"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {visibleProducts.map((product, index) => (
              <motion.li
                key={product.id}
                layout
                initial={{ opacity: 0, y: 40, rotateX: 18 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 0.9, ease: easeOutExpo, delay: (index % 3) * 0.07 }}
                className="[transform-origin:50%_100%]"
              >
                <ProductCard
                  product={product}
                  mediaSlotRef={product.id === PHONE_PRODUCT_ID ? phoneSlotRef : undefined}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
};

export default ShopSection;
