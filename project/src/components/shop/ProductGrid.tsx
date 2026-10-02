import { AnimatePresence, motion } from 'framer-motion';
import type { CatalogProduct } from '../../lib/catalog';
import { easeOutExpo } from '../../lib/motion';
import ProductCard from '../product/ProductCard';

/** Store grid: two columns on phones, up to four on wide screens. */
const ProductGrid = ({ products }: { products: CatalogProduct[] }) => (
  <motion.ul layout className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:gap-5 xl:grid-cols-4">
    <AnimatePresence mode="popLayout" initial={false}>
      {products.map((product, index) => (
        <motion.li
          key={product.id}
          layout
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.2 } }}
          viewport={{ once: true, margin: '0px 0px -8% 0px' }}
          transition={{ duration: 0.7, ease: easeOutExpo, delay: (index % 4) * 0.05 }}
        >
          <ProductCard product={product} />
        </motion.li>
      ))}
    </AnimatePresence>
  </motion.ul>
);

export default ProductGrid;
