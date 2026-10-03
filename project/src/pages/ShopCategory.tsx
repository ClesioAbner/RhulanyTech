import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  SORT_OPTIONS,
  categoryPath,
  getCategory,
  getSubcategory,
  productsIn,
  resolveImage,
  sortProducts,
  subcategoryCover,
  type SortId,
} from '../lib/catalog';
import { STORE } from '../data/store';
import { easeOutExpo } from '../lib/motion';
import CategoryStrip from '../components/shop/CategoryStrip';
import ProductGrid from '../components/shop/ProductGrid';
import ProductCard from '../components/product/ProductCard';
import Shelf from '../components/shop/Shelf';
import SortMenu from '../components/shop/SortMenu';

const isSort = (value: string | null): value is SortId => SORT_OPTIONS.some((option) => option.id === value);
const countLabel = (count: number) => `${count} ${count === 1 ? 'produto' : 'produtos'}`;
const HEADER_CLEARANCE = 90; // px under the floating header where the toolbar sticks

/** True once the element has scrolled up under the floating header. */
const useStuck = (key?: string) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting && entry.boundingClientRect.top < HEADER_CLEARANCE),
      { rootMargin: `-${HEADER_CLEARANCE}px 0px 0px 0px` },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [key]);
  return [sentinelRef, stuck] as const;
};

/** /loja/:category and /loja/:category/:subcategory share this page so the strip animates in place. */
const ShopCategory = () => {
  const { category: categorySlug, subcategory: subcategorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = getCategory(categorySlug);
  const subcategory = getSubcategory(category, subcategorySlug);
  const sortParam = searchParams.get('ordem');
  const sort: SortId = isSort(sortParam) ? sortParam : 'destaque';
  const [toolbarSentinel, toolbarStuck] = useStuck(category?.slug);

  const products = useMemo(
    () => (category ? sortProducts(productsIn(category.slug, subcategory?.slug), sort) : []),
    [category, subcategory, sort],
  );

  // "Tudo" in the default order reads best as one shelf per range; any explicit sort becomes one list.
  const ranges = useMemo(
    () =>
      category && !subcategory && sort === 'destaque'
        ? category.subcategories
            .map((sub) => ({ sub, products: sortProducts(productsIn(category.slug, sub.slug), 'destaque') }))
            .filter((range) => range.products.length > 0)
        : null,
    [category, subcategory, sort],
  );

  if (!category || (subcategorySlug && !subcategory)) {
    return (
      <div className="container-site py-32 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink/45">Loja</p>
        <h1 className="type-display mt-4">Esta secção não existe</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm text-ink/60">O endereço pode estar incompleto ou a gama já não estar disponível.</p>
        <Link to="/loja" className="mt-8 inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper">
          Voltar à loja
        </Link>
      </div>
    );
  }

  const setSort = (next: SortId) => {
    const params = new URLSearchParams(searchParams);
    if (next === 'destaque') params.delete('ordem');
    else params.set('ordem', next);
    setSearchParams(params, { replace: true });
  };

  // Keep the chosen order when moving between ranges.
  const withSort = (path: string) => (sort === 'destaque' ? path : `${path}?ordem=${sort}`);

  const stripItems = [
    {
      key: 'tudo',
      to: withSort(categoryPath(category.slug)),
      label: 'Tudo',
      image: resolveImage(category.image, 360),
      meta: countLabel(productsIn(category.slug).length),
    },
    ...category.subcategories.map((sub) => {
      const count = productsIn(category.slug, sub.slug).length;
      return {
        key: sub.slug,
        to: withSort(categoryPath(category.slug, sub.slug)),
        label: sub.name,
        image: subcategoryCover(category.slug, sub, 360),
        meta: count > 0 ? countLabel(count) : 'Brevemente',
      };
    }),
  ];

  const title = subcategory?.name ?? category.name;
  const lead = subcategory?.tagline ?? category.tagline;

  return (
    <div className="pb-28 lg:pb-36">
      <header className="container-site pt-10 lg:pt-14">
        <nav aria-label="Caminho" className="text-xs text-ink/45">
          <Link to="/loja" className="link-underline">
            Loja
          </Link>
          {subcategory && (
            <>
              <span className="mx-2">/</span>
              <Link to={categoryPath(category.slug)} className="link-underline">
                {category.name}
              </Link>
            </>
          )}
        </nav>
        <AnimatePresence mode="wait" initial={false}>
          <motion.h1
            key={title}
            className="type-display mt-4 max-w-4xl"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
          >
            {title} <span className="text-ink/40">{lead}</span>
          </motion.h1>
        </AnimatePresence>
      </header>

      <div className="mt-8 lg:mt-10">
        <CategoryStrip
          label={`Gamas de ${category.name}`}
          items={stripItems}
          activeKey={subcategory?.slug ?? 'tudo'}
          markerId={`strip-${category.slug}`}
        />
      </div>

      <div ref={toolbarSentinel} aria-hidden="true" className="mt-6 h-px" />
      {/* Once stuck, a frosted band also fills the strip behind the floating header so nothing peeks through. */}
      <div
        className={`sticky top-[76px] z-20 -mt-px border-y border-ink/[0.07] bg-paper/85 backdrop-blur-xl before:pointer-events-none before:absolute before:inset-x-0 before:bottom-full before:h-[84px] before:bg-paper/85 before:backdrop-blur-xl before:transition-opacity before:duration-300 sm:top-[84px] ${
          toolbarStuck ? 'before:opacity-100' : 'before:opacity-0'
        }`}
      >
        <div className="container-site flex h-16 items-center justify-between gap-4">
          <p className="text-sm text-ink/55" aria-live="polite">
            <span className="font-medium text-ink">{title}</span>
            <span className="mx-2 max-sm:hidden">·</span>
            <span className="tabular-nums max-sm:hidden">{countLabel(products.length)}</span>
          </p>
          {products.length > 1 && <SortMenu value={sort} onChange={setSort} />}
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${subcategory?.slug ?? 'tudo'}-${sort}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          transition={{ duration: 0.4 }}
        >
          {ranges ? (
            ranges.map(({ sub, products: rangeProducts }, index) => (
              <Shelf
                key={sub.slug}
                id={`gama-${sub.slug}`}
                title={sub.name}
                lead={sub.tagline}
                className={index === 0 ? 'mt-10 lg:mt-12' : 'mt-14 lg:mt-16'}
                link={{ to: categoryPath(category.slug, sub.slug), label: `Ver todos (${rangeProducts.length})` }}
              >
                {rangeProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </Shelf>
            ))
          ) : products.length > 0 ? (
            <div className="container-site mt-10 lg:mt-12">
              <ProductGrid products={products} />
            </div>
          ) : (
            <div className="container-site mt-10">
              <div className="rounded-[24px] bg-white px-6 py-20 text-center">
                <h2 className="type-title">Brevemente nesta gama</h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink/60">
                  Estamos a preparar o stock de {title}. Se procura um modelo específico, encomendamos para si.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <a
                    href={STORE.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper"
                  >
                    Pedir pelo WhatsApp
                  </a>
                  <Link
                    to={categoryPath(category.slug)}
                    className="inline-flex h-11 items-center rounded-full border border-ink/15 px-6 text-sm font-medium"
                  >
                    Ver tudo em {category.name}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ShopCategory;
