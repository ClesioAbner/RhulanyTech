import { AnimatePresence, motion } from 'framer-motion';
import type { CatalogProduct } from '../../lib/catalog';
import { easeOutExpo } from '../../lib/motion';
import ProductCard from '../product/ProductCard';

interface ProductGridProps {
  products: CatalogProduct[];
  /** Desktop column count; fewer columns give the photography more room. */
  columns?: 2 | 3 | 4;
}

const COLUMNS = {
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-3 xl:grid-cols-4',
} as const;

const ProductGrid = ({ products, columns = 3 }: ProductGridProps) => (
  <motion.ul
    layout
    className={`grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:gap-x-8 lg:gap-y-20 ${COLUMNS[columns]}`}
  >
    <AnimatePresence mode="popLayout" initial={false}>
      {products.map((product, index) => (
        <motion.li
          key={product.id}
          layout
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.2 } }}
          viewport={{ once: true, margin: '0px 0px -8% 0px' }}
          transition={{ duration: 0.8, ease: easeOutExpo, delay: (index % columns) * 0.06 }}
        >
          <ProductCard product={product} size={columns === 2 ? 'large' : 'regular'} />
        </motion.li>
      ))}
    </AnimatePresence>
  </motion.ul>
);

export default ProductGrid;
