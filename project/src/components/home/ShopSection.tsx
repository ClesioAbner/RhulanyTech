import type { RefObject } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProductById, type CatalogProduct } from '../../lib/catalog';
import { easeOutExpo, isPhone } from '../../lib/motion';
import FeaturedProductCard from './FeaturedProductCard';
import SectionHeading from '../ui/SectionHeading';

// A fixed selection that spans the catalogue, each with its own product photography.
// The iPhone stays fourth (second row, left column): its card hosts the 3D phone that falls into payments.
const FAVORITE_IDS = ['67', '54', '46', '39', '80', '71'];
const PHONE_PRODUCT_ID = '39';

const FAVORITES = FAVORITE_IDS.map((id) => getProductById(id)).filter((product): product is CatalogProduct => Boolean(product));

interface ShopSectionProps {
  sectionRef?: RefObject<HTMLElement>;
  phoneSlotRef?: RefObject<HTMLDivElement>;
}

const ShopSection = ({ sectionRef, phoneSlotRef }: ShopSectionProps) => (
  <section ref={sectionRef} id="loja" className="relative scroll-mt-24 border-t border-ink/10" aria-labelledby="loja-titulo">
    <div className="container-site py-28 lg:py-40">
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

      <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 lg:mt-16 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-16">
        {FAVORITES.map((product, index) => (
          <motion.li
            key={product.id}
            initial={isPhone ? { opacity: 0, y: 24 } : { opacity: 0, y: 40, rotateX: 18 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: isPhone ? 0.7 : 0.9, ease: easeOutExpo, delay: (index % (isPhone ? 2 : 3)) * 0.07 }}
            className="[transform-origin:50%_100%]"
          >
            <FeaturedProductCard product={product} mediaSlotRef={product.id === PHONE_PRODUCT_ID ? phoneSlotRef : undefined} />
          </motion.li>
        ))}
      </ul>
    </div>
  </section>
);

export default ShopSection;
