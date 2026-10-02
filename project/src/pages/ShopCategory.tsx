import { useMemo } from 'react';
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
import CategoryHero from '../components/shop/CategoryHero';
import CategoryTabs from '../components/shop/CategoryTabs';
import ProductGrid from '../components/shop/ProductGrid';

const LINEUP_ID = 'gama';
const isSort = (value: string | null): value is SortId => SORT_OPTIONS.some((option) => option.id === value);

/** /loja/:category and /loja/:category/:subcategory share this page so tabs and hero animate in place. */
const ShopCategory = () => {
  const { category: categorySlug, subcategory: subcategorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = getCategory(categorySlug);
  const subcategory = getSubcategory(category, subcategorySlug);
  const sortParam = searchParams.get('ordem');
  const sort: SortId = isSort(sortParam) ? sortParam : 'destaque';

  const products = useMemo(
    () => (category ? sortProducts(productsIn(category.slug, subcategory?.slug), sort) : []),
    [category, subcategory, sort],
  );

  if (!category || (subcategorySlug && !subcategory)) {
    return (
      <div className="container-site py-32 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink/45">Loja</p>
        <h1 className="mt-4 font-display text-4xl font-medium tracking-tight">Esta secção não existe</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm text-ink/60">O endereço pode estar incompleto ou a gama já não estar disponível.</p>
        <Link to="/loja" className="mt-8 inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper">
          Voltar à loja
        </Link>
      </div>
    );
  }

  const heroImage = subcategory ? subcategoryCover(category.slug, subcategory, 2000) : resolveImage(category.image, 2000);
  const lineupTitle = subcategory ? `Gama ${subcategory.name}` : `Tudo em ${category.name}`;

  const setSort = (next: SortId) => {
    const params = new URLSearchParams(searchParams);
    if (next === 'destaque') params.delete('ordem');
    else params.set('ordem', next);
    setSearchParams(params, { replace: true });
  };

  return (
    <div className="pb-28 lg:pb-40">
      <CategoryHero category={category} subcategory={subcategory} image={heroImage} lineupId={LINEUP_ID} />

      <div className="mt-16 lg:mt-24">
        <CategoryTabs category={category} activeSubcategory={subcategory?.slug} />
      </div>

      <section id={LINEUP_ID} className="container-site scroll-mt-40 pt-12 lg:pt-16" aria-labelledby="gama-titulo">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:mb-14">
          <div>
            <h2 id="gama-titulo" className="font-display text-3xl font-medium tracking-tight lg:text-4xl">
              {lineupTitle}
            </h2>
            <p className="mt-2 text-sm text-ink/55" aria-live="polite">
              <span className="tabular-nums text-ink">{products.length}</span> {products.length === 1 ? 'produto' : 'produtos'}
            </p>
          </div>
          {products.length > 1 && (
            <label className="relative self-start sm:self-auto">
              <span className="sr-only">Ordenar por</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortId)}
                className="h-11 cursor-pointer appearance-none rounded-full border border-ink/15 bg-transparent pl-5 pr-10 text-sm outline-none transition-colors hover:border-ink/40 focus:border-ink/60"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-5 top-1/2 h-1.5 w-1.5 -translate-y-[70%] rotate-45 border-b border-r border-ink/60"
              />
            </label>
          )}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {products.length > 0 ? (
            <motion.div
              key={subcategory?.slug ?? 'tudo'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.4 }}
            >
              <ProductGrid products={products} columns={products.length <= 2 ? 2 : 3} />
            </motion.div>
          ) : (
            <motion.div
              key="vazio"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: easeOutExpo }}
              className="rounded-[24px] border border-ink/10 px-6 py-20 text-center"
            >
              <h3 className="font-display text-3xl font-medium tracking-tight">Brevemente nesta gama</h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink/60">
                Estamos a preparar o stock de {subcategory?.name ?? category.name}. Se procura um modelo específico,
                encomendamos para si.
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
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

export default ShopCategory;
