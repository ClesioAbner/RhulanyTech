import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { categoryPath, getCategory, getSubcategory, priceFrom, productsIn, sortProducts } from '../lib/catalog';
import { formatPrice } from '../lib/format';
import { isCutout } from '../lib/images';
import { easeOutExpo } from '../lib/motion';
import Catalogue from '../components/shop/catalogue/Catalogue';
import ProductImage from '../components/product/ProductImage';

// Three products fanned out in the header, the middle one in front.
const FAN = [
  { x: '-30%', rotate: -9, scale: 0.84, z: 0 },
  { x: '0%', rotate: 0, scale: 1, z: 2 },
  { x: '30%', rotate: 9, scale: 0.84, z: 1 },
];

/** /loja/:category and /loja/:category/:subcategory: a header for the section, then its catalogue. */
const ShopCategory = () => {
  const { category: categorySlug, subcategory: subcategorySlug } = useParams();
  const category = getCategory(categorySlug);
  const subcategory = getSubcategory(category, subcategorySlug);

  const products = useMemo(() => (category ? productsIn(category.slug, subcategory?.slug) : []), [category, subcategory]);
  const faces = useMemo(
    () =>
      sortProducts(products, 'destaque')
        .filter((p) => isCutout(p.primaryImage))
        .slice(0, 3),
    [products],
  );

  if (!category || (subcategorySlug && !subcategory)) {
    return (
      <div className="container-site py-32 text-center">
        <p className="eyebrow text-ink/45">Loja</p>
        <h1 className="type-display mt-4">Esta secção não existe</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm text-ink/60">
          O endereço pode estar incompleto ou a gama já não estar disponível.
        </p>
        <Link to="/loja" className="mt-8 inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper">
          Voltar à loja
        </Link>
      </div>
    );
  }

  const title = subcategory?.name ?? category.name;
  const lead = subcategory?.tagline ?? category.tagline;
  // Order the fan so the best seller stands in the middle.
  const fan = faces.length === 3 ? [faces[1], faces[0], faces[2]] : faces;

  return (
    <div className="pb-24 pt-4 lg:pb-32 lg:pt-6">
      <header className="container-site">
        <div className="stage relative overflow-hidden rounded-[28px] ring-1 ring-ink/[0.05] sm:rounded-[36px]">
          <div className="grid items-center gap-6 px-6 pb-2 pt-8 sm:px-10 lg:min-h-[340px] lg:grid-cols-12 lg:gap-10 lg:px-14 lg:py-12">
            <div className="lg:col-span-6">
              <nav aria-label="Caminho">
                <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px]">
                  {[
                    { to: '/loja', label: 'Loja' },
                    { to: categoryPath(category.slug), label: category.name },
                    ...(subcategory ? [{ to: categoryPath(category.slug, subcategory.slug), label: subcategory.name }] : []),
                  ].map((crumb, index, list) => {
                    const last = index === list.length - 1;
                    return (
                      <li key={crumb.to} className="flex items-center gap-2">
                        {index > 0 && (
                          <span aria-hidden="true" className="block h-[5px] w-[5px] -rotate-45 border-b border-r border-ink/35" />
                        )}
                        {last ? (
                          <span aria-current="page" className="font-medium text-ink">
                            {crumb.label}
                          </span>
                        ) : (
                          <Link to={crumb.to} className="link-underline text-ink/50 hover:text-ink">
                            {crumb.label}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </nav>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.7, ease: easeOutExpo }}
                >
                  <h1 className="type-display mt-6">{title}</h1>
                  <p className="type-lead mt-3 max-w-md text-ink/60">{lead}</p>
                  {products.length > 0 && (
                    <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                      <span>
                        <span className="font-semibold tabular-nums">{products.length}</span>{' '}
                        <span className="text-ink/55">{products.length === 1 ? 'produto' : 'produtos'}</span>
                      </span>
                      <span aria-hidden="true" className="h-4 w-px bg-ink/15" />
                      <span>
                        <span className="text-ink/55">Desde </span>
                        <span className="font-semibold tabular-nums">{formatPrice(Math.min(...products.map(priceFrom)))}</span>
                      </span>
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="relative h-[220px] sm:h-[260px] lg:col-span-6 lg:h-[300px]" aria-hidden="true">
              <AnimatePresence mode="popLayout" initial={false}>
                {fan.map((product, index) => {
                  const slot = fan.length === 3 ? FAN[index] : fan.length === 2 ? FAN[index * 2] : FAN[1];
                  return (
                    <motion.div
                      key={`${title}-${product.id}`}
                      className="absolute inset-y-0 w-[40%]"
                      style={{ zIndex: slot.z, left: `calc(30% + ${slot.x} * 0.82)` }}
                      initial={{ opacity: 0, y: 60, rotate: 0, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, rotate: slot.rotate, scale: slot.scale }}
                      exit={{ opacity: 0, y: 30, transition: { duration: 0.25 } }}
                      transition={{ duration: 1, ease: easeOutExpo, delay: 0.1 + index * 0.08 }}
                    >
                      <ProductImage src={product.primaryImage} inset="p-0" />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <section aria-label={`Produtos em ${title}`} className="container-site mt-10 lg:mt-14">
        <Catalogue products={products} category={category} subcategory={subcategory} />
      </section>
    </div>
  );
};

export default ShopCategory;
