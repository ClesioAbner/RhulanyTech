import type { RefObject } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProductById, type CatalogProduct } from '../../lib/catalog';
import { easeOutExpo, riseIn3d, stagger } from '../../lib/motion';
import { useMediaQuery } from '../../lib/useMediaQuery';
import FeaturedProductCard from './FeaturedProductCard';
import Rail from '../ui/Rail';
import SectionHeading from '../ui/SectionHeading';

// A fixed selection that spans the catalogue, each with its own product photography.
// The iPhone stays fourth (second row, left column): its card hosts the 3D phone that falls into payments.
const FAVORITE_IDS = ['67', '54', '93', '91', '80', '71'];
const PHONE_PRODUCT_ID = '91';

const FAVORITES = FAVORITE_IDS.map((id) => getProductById(id)).filter((product): product is CatalogProduct => Boolean(product));

interface ShopSectionProps {
  sectionRef?: RefObject<HTMLElement>;
  phoneSlotRef?: RefObject<HTMLDivElement>;
}

const ShopSection = ({ sectionRef, phoneSlotRef }: ShopSectionProps) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  return (
    <section ref={sectionRef} id="loja" className="relative scroll-mt-24 border-t border-ink/10" aria-labelledby="loja-titulo">
      <div className="container-site py-20 sm:py-28 lg:py-40">
        <SectionHeading
          id="loja-titulo"
          index="02"
          eyebrow="Loja"
          title="Os favoritos"
          action={
            <Link to="/loja" className="link-underline text-sm">
              Ver todos os produtos
            </Link>
          }
        />

        {/* Phones and tablets: a row to swipe, rising in as one; desktop: a grid whose rows rise in turn */}
        <Rail
          label="Os favoritos"
          className="mt-12 lg:mt-16"
          gridClassName="lg:grid lg:grid-cols-3 lg:gap-x-6 lg:gap-y-16"
          variants={stagger(0.07)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        >
          {FAVORITES.map((product, index) => (
            <motion.li
              key={product.id}
              {...(isDesktop
                ? {
                    initial: { opacity: 0, y: 40, rotateX: 18 },
                    whileInView: { opacity: 1, y: 0, rotateX: 0 },
                    viewport: { once: true, margin: '0px 0px -10% 0px' },
                    transition: { duration: 0.9, ease: easeOutExpo, delay: (index % 3) * 0.07 },
                  }
                : { variants: riseIn3d })}
              className="w-[66%] shrink-0 snap-start [transform-origin:50%_100%] sm:w-[40%] lg:w-auto"
            >
              <FeaturedProductCard product={product} mediaSlotRef={product.id === PHONE_PRODUCT_ID ? phoneSlotRef : undefined} />
            </motion.li>
          ))}
        </Rail>
      </div>
    </section>
  );
};

export default ShopSection;
