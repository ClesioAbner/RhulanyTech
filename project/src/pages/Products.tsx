import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { products } from '../data/products';
import FilterPanel from '../components/shop/FilterPanel';
import ProductCard from '../components/product/ProductCard';
import { easeOutExpo } from '../lib/motion';
import {
  CATEGORY_LABELS,
  SORT_OPTIONS,
  applyFilters,
  countActiveFilters,
  facetCounts,
  filtersFromParams,
  filtersToParams,
  type ShopFilters,
  type SortId,
} from '../lib/shopFilters';

const BRANDS = [...new Set(products.map((product) => product.brand))].sort((a, b) => a.localeCompare(b));
const SEARCH_DEBOUNCE_MS = 250;

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => filtersFromParams(searchParams), [searchParams]);
  const [searchText, setSearchText] = useState(filters.query);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const results = useMemo(() => applyFilters(products, filters), [filters]);
  const counts = useMemo(() => facetCounts(products, filters), [filters]);
  const activeCount = countActiveFilters(filters);

  // Always merge into the latest URL (not the one captured by a closure), so a debounced search or two
  // quick changes in a row can't overwrite each other.
  const latestParams = useRef(searchParams);
  latestParams.current = searchParams;
  const update = (next: Partial<ShopFilters>) => {
    const merged = filtersToParams({ ...filtersFromParams(latestParams.current), ...next });
    latestParams.current = merged;
    setSearchParams(merged, { replace: true });
  };

  // Search typing updates the URL after a short pause, so history and filtering don't churn on every key.
  useEffect(() => {
    if (searchText === filters.query) return;
    const timer = setTimeout(() => update({ query: searchText }), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  // Keep the field in sync when the URL changes from elsewhere (header links, back button).
  useEffect(() => setSearchText(filters.query), [filters.query]);

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  const clearAll = () => {
    setSearchText('');
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const title = filters.category ? CATEGORY_LABELS[filters.category] : 'Loja';

  return (
    <div className="container-site pb-28 pt-10 lg:pb-40 lg:pt-14">
      {/* Header */}
      <nav aria-label="Caminho" className="text-xs text-ink/45">
        <Link to="/" className="link-underline">
          Início
        </Link>
        <span className="mx-2">/</span>
        {filters.category ? (
          <>
            <button type="button" className="link-underline" onClick={() => update({ category: null })}>
              Loja
            </button>
            <span className="mx-2">/</span>
            <span className="text-ink/70">{title}</span>
          </>
        ) : (
          <span className="text-ink/70">Loja</span>
        )}
      </nav>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="overflow-hidden pb-[0.08em] font-display text-5xl font-medium leading-[1] tracking-tightest sm:text-6xl lg:text-[5rem]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={title}
              className="block"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.6, ease: easeOutExpo }}
            >
              {title}
            </motion.span>
          </AnimatePresence>
        </h1>
        <p className="text-sm text-ink/55">Produtos originais, com garantia oficial e entrega em todo Moçambique</p>
      </div>

      {/* Toolbar */}
      <div className="mt-10 flex flex-col gap-3 border-y border-ink/10 py-4 sm:flex-row sm:items-center">
        <label className="flex-1">
          <span className="sr-only">Pesquisar produtos</span>
          <input
            type="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Pesquisar por produto, marca ou modelo"
            className="h-11 w-full rounded-full border border-ink/15 bg-transparent px-5 text-sm outline-none transition-colors placeholder:text-ink/40 focus:border-ink/50"
          />
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="inline-flex h-11 items-center gap-1.5 rounded-full border border-ink/15 px-5 text-sm lg:hidden"
          >
            Filtros{activeCount > 0 && <span className="tabular-nums text-ink/50">({activeCount})</span>}
          </button>
          <label className="relative">
            <span className="sr-only">Ordenar por</span>
            <select
              value={filters.sort}
              onChange={(event) => update({ sort: event.target.value as SortId })}
              className="h-11 cursor-pointer appearance-none rounded-full border border-ink/15 bg-transparent pl-5 pr-10 text-sm outline-none transition-colors focus:border-ink/50"
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
        </div>
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-12">
        {/* Sidebar */}
        <aside className="hidden lg:col-span-3 lg:block" aria-label="Filtros">
          <div className="sticky top-28 max-h-[calc(100svh-8rem)] overflow-y-auto pb-6 pr-2">
            <FilterPanel filters={filters} counts={counts} brands={BRANDS} onChange={update} layoutScope="sidebar" />
            {activeCount > 0 && (
              <button type="button" onClick={clearAll} className="link-underline mt-2 px-3 text-sm text-ink/60">
                Limpar filtros
              </button>
            )}
          </div>
        </aside>

        {/* Results */}
        <section className="lg:col-span-9" aria-labelledby="resultados" aria-live="polite">
          <p id="resultados" className="mb-8 text-sm text-ink/55">
            <span className="tabular-nums text-ink">{results.length}</span>{' '}
            {results.length === 1 ? 'produto' : 'produtos'}
            {filters.query && (
              <>
                {' '}
                para <span className="text-ink">“{filters.query}”</span>
              </>
            )}
          </p>

          {results.length > 0 ? (
            <motion.ul layout className="grid grid-cols-2 gap-x-4 gap-y-12 lg:gap-x-6 lg:gap-y-16 xl:grid-cols-3">
              <AnimatePresence mode="popLayout" initial={false}>
                {results.map((product, index) => (
                  <motion.li
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 32, rotateX: 14 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.22 } }}
                    transition={{ duration: 0.8, ease: easeOutExpo, delay: Math.min(index, 8) * 0.04 }}
                    className="[transform-origin:50%_100%]"
                  >
                    <ProductCard product={product} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOutExpo }}
              className="rounded-2xl border border-ink/10 px-6 py-20 text-center"
            >
              <h2 className="font-display text-3xl font-medium tracking-tight">Nenhum produto encontrado</h2>
              <p className="mx-auto mt-3 max-w-sm text-sm text-ink/60">
                Experimente outra pesquisa ou retire alguns filtros. Se procura algo específico, fale connosco pelo
                WhatsApp
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-8 inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper transition-colors hover:bg-ink-soft"
              >
                Limpar filtros
              </button>
            </motion.div>
          )}
        </section>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-ink/40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Filtros"
              className="fixed inset-x-0 bottom-0 z-[61] flex max-h-[88svh] flex-col rounded-t-[28px] bg-paper lg:hidden"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.5, ease: easeOutExpo }}
            >
              <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
                <h2 className="font-display text-xl font-medium tracking-tight">Filtros</h2>
                <button type="button" onClick={() => setIsDrawerOpen(false)} className="link-underline text-sm">
                  Fechar
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-3 py-6">
                <FilterPanel filters={filters} counts={counts} brands={BRANDS} onChange={update} layoutScope="drawer" />
              </div>
              <div className="flex gap-3 border-t border-ink/10 px-6 py-4">
                <button
                  type="button"
                  onClick={clearAll}
                  className="h-12 flex-1 rounded-full border border-ink/15 text-sm font-medium"
                >
                  Limpar
                </button>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="h-12 flex-[2] rounded-full bg-ink text-sm font-medium text-paper"
                >
                  Ver {results.length} {results.length === 1 ? 'produto' : 'produtos'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;
