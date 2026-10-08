import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CATEGORIES,
  categoryFace,
  categoryPath,
  priceFrom,
  productsIn,
  sortProducts,
  subcategoryFace,
  type CatalogProduct,
  type Category,
  type SortId,
  type Subcategory,
} from '../../../lib/catalog';
import { easeOutExpo } from '../../../lib/motion';
import { STORE } from '../../../data/store';
import ProductCard from '../../product/ProductCard';
import SortMenu from '../SortMenu';
import { SearchIcon } from '../../ui/Icons';
import { Group, NavItem, Option } from './FilterControls';
import { PAGE, PRICES, VISIBLE_BRANDS, countLabel, fold, isSort } from './filters';

interface CatalogueProps {
  /** Products in scope: the whole shop, a category or one of its ranges. */
  products: CatalogProduct[];
  category?: Category;
  subcategory?: Subcategory;
}

/*
 * The shop's organised view: the sections of the shop and the filters on the left, results with
 * search and order on the right. Filters live in the URL, so a filtered list can be shared.
 */
const Catalogue = ({ products, category, subcategory }: CatalogueProps) => {
  const [params, setParams] = useSearchParams();
  const [shown, setShown] = useState(PAGE);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [allBrands, setAllBrands] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setSheetOpen(false), [pathname]);

  const sort: SortId = isSort(params.get('ordem')) ? (params.get('ordem') as SortId) : 'destaque';
  const brands = params.get('marca')?.split(',').filter(Boolean) ?? [];
  const price = PRICES.find((p) => p.id === params.get('preco'));
  const inStockOnly = params.get('stock') === '1';
  const query = params.get('q') ?? '';
  const [draft, setDraft] = useState(query);

  const update = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)));
    setParams(next, { replace: true });
  };

  // Search applies as the visitor types, after a short pause.
  useEffect(() => {
    if (draft === query) return;
    const timer = window.setTimeout(() => update({ q: draft.trim() || null }), 250);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);
  useEffect(() => setDraft(query), [query]);

  // Each filter's counts are taken with every other filter applied.
  const matches = (product: CatalogProduct, skip?: 'marca' | 'preco' | 'stock') => {
    if (query && !fold(`${product.title} ${product.brand} ${product.summary}`).includes(fold(query))) return false;
    if (skip !== 'marca' && brands.length && !brands.includes(product.brand)) return false;
    if (skip !== 'preco' && price && !price.test(priceFrom(product))) return false;
    if (skip !== 'stock' && inStockOnly && !product.inStock) return false;
    return true;
  };

  const results = useMemo(
    () =>
      sortProducts(
        products.filter((p) => matches(p)),
        sort,
      ),
    // `matches` and `sort` only read values taken from the URL, so `params` covers them.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [products, params],
  );
  const brandOptions = useMemo(() => [...new Set(products.map((p) => p.brand))].sort((a, b) => a.localeCompare(b)), [products]);

  useEffect(() => setShown(PAGE), [params, products]);

  const activeCount = brands.length + (price ? 1 : 0) + (inStockOnly ? 1 : 0) + (query ? 1 : 0);
  const clearAll = () => update({ marca: null, preco: null, stock: null, q: null });
  const toggleBrand = (brand: string) =>
    update({ marca: (brands.includes(brand) ? brands.filter((b) => b !== brand) : [...brands, brand]).join(',') || null });

  const keepSort = (path: string) => (sort === 'destaque' ? path : `${path}?ordem=${sort}`);

  const visibleBrands = allBrands ? brandOptions : brandOptions.slice(0, VISIBLE_BRANDS);
  // Selected brands stay in view even when the list is folded.
  const brandList = [...visibleBrands, ...brands.filter((b) => !visibleBrands.includes(b) && brandOptions.includes(b))];

  const renderFilters = (where: 'side' | 'sheet') => (
    <>
      <Group title={category ? 'Gamas' : 'Categorias'}>
        {category ? (
          <>
            <NavItem
              group={where}
              to={keepSort(categoryPath(category.slug))}
              label="Tudo"
              count={productsIn(category.slug).length}
              active={!subcategory}
              images={category.subcategories
                .map((sub) => subcategoryFace(category.slug, sub))
                .filter(Boolean)
                .slice(0, 4)}
            />
            {category.subcategories.map((sub) => (
              <NavItem
                key={sub.slug}
                group={where}
                to={keepSort(categoryPath(category.slug, sub.slug))}
                label={sub.name}
                count={productsIn(category.slug, sub.slug).length}
                active={subcategory?.slug === sub.slug}
                images={[subcategoryFace(category.slug, sub)]}
              />
            ))}
          </>
        ) : (
          <>
            <NavItem
              group={where}
              to="/loja"
              label="Toda a loja"
              count={products.length}
              active
              images={CATEGORIES.slice(0, 4).map((c) => categoryFace(c.slug))}
            />
            {CATEGORIES.map((item) => (
              <NavItem
                key={item.slug}
                group={where}
                to={categoryPath(item.slug)}
                label={item.name}
                count={productsIn(item.slug).length}
                active={false}
                images={[categoryFace(item.slug)]}
              />
            ))}
          </>
        )}
      </Group>

      {brandOptions.length > 1 && (
        <Group title="Marca">
          {brandList.map((brand) => (
            <Option
              key={brand}
              type="checkbox"
              checked={brands.includes(brand)}
              onChange={() => toggleBrand(brand)}
              label={brand}
              count={products.filter((p) => p.brand === brand && matches(p, 'marca')).length}
            />
          ))}
          {brandOptions.length > VISIBLE_BRANDS && (
            <button
              type="button"
              onClick={() => setAllBrands((value) => !value)}
              className="link-underline ml-2 mt-2 text-[13px] font-medium text-ink/70 hover:text-ink"
            >
              {allBrands ? 'Mostrar menos' : `Ver todas as marcas (${brandOptions.length})`}
            </button>
          )}
        </Group>
      )}

      <Group title="Preço">
        {PRICES.map((range) => (
          <Option
            key={range.id}
            type="radio"
            checked={price?.id === range.id}
            onChange={() => update({ preco: price?.id === range.id ? null : range.id })}
            label={range.label}
            count={products.filter((p) => range.test(priceFrom(p)) && matches(p, 'preco')).length}
          />
        ))}
      </Group>

      <Group title="Disponibilidade">
        <Option
          type="checkbox"
          checked={inStockOnly}
          onChange={() => update({ stock: inStockOnly ? null : '1' })}
          label="Pronta entrega"
          count={products.filter((p) => p.inStock && matches(p, 'stock')).length}
        />
      </Group>
    </>
  );

  const chips = [
    ...(query ? [{ key: 'q', label: `“${query}”`, clear: () => update({ q: null }) }] : []),
    ...brands.map((brand) => ({ key: brand, label: brand, clear: () => toggleBrand(brand) })),
    ...(price ? [{ key: 'preco', label: price.label, clear: () => update({ preco: null }) }] : []),
    ...(inStockOnly ? [{ key: 'stock', label: 'Pronta entrega', clear: () => update({ stock: null }) }] : []),
  ];

  // Lock the page behind the mobile filter sheet.
  useEffect(() => {
    document.body.style.overflow = sheetOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sheetOpen]);

  return (
    <div className="lg:grid lg:grid-cols-[232px_1fr] lg:gap-12 xl:grid-cols-[256px_1fr] xl:gap-16">
      <aside aria-label="Filtros" className="hidden lg:block">
        <div className="sticky top-28 max-h-[calc(100svh-8rem)] overflow-y-auto rounded-[24px] bg-white ring-1 ring-ink/[0.06] [scrollbar-width:thin]">
          <div className="flex items-center justify-between px-5 pb-1 pt-5">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink/45">Filtrar</p>
            {activeCount > 0 && (
              <button type="button" onClick={clearAll} className="link-underline text-xs font-medium text-ink/70 hover:text-ink">
                Limpar ({activeCount})
              </button>
            )}
          </div>
          {renderFilters('side')}
        </div>
      </aside>

      <div className="min-w-0">
        {/* Sections of the shop, always at hand on small screens (the sidebar holds them on desktop) */}
        <nav
          aria-label={category ? 'Gamas' : 'Categorias'}
          className="-mx-5 mb-4 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:hidden [&::-webkit-scrollbar]:hidden"
        >
          {(category
            ? [
                { to: keepSort(categoryPath(category.slug)), label: 'Tudo', active: !subcategory },
                ...category.subcategories.map((sub) => ({
                  to: keepSort(categoryPath(category.slug, sub.slug)),
                  label: sub.name,
                  active: subcategory?.slug === sub.slug,
                })),
              ]
            : CATEGORIES.map((item) => ({ to: categoryPath(item.slug), label: item.name, active: false }))
          ).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              aria-current={item.active ? 'page' : undefined}
              className={`inline-flex h-10 shrink-0 items-center rounded-full px-4 text-sm transition-colors ${
                item.active ? 'bg-ink text-paper' : 'bg-white ring-1 ring-ink/10'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="relative flex h-11 w-full min-w-0 items-center rounded-full bg-white ring-1 ring-ink/10 transition-shadow focus-within:ring-ink/40 sm:w-auto sm:max-w-sm sm:flex-1">
            <SearchIcon className="pointer-events-none absolute left-4 h-[18px] w-[18px] text-ink/40" />
            <span className="sr-only">Pesquisar produtos</span>
            <input
              type="search"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={category ? `Pesquisar em ${subcategory?.name ?? category.name}` : 'Pesquisar na loja'}
              className="h-full w-full rounded-full bg-transparent pl-11 pr-4 text-sm outline-none placeholder:text-ink/40"
            />
          </label>
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium ring-1 ring-ink/10 lg:hidden"
          >
            Filtros
            {activeCount > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1.5 text-[11px] tabular-nums text-paper">
                {activeCount}
              </span>
            )}
          </button>
          <div className="ml-auto flex items-center gap-4">
            <p className="text-sm tabular-nums text-ink/50 max-sm:hidden" aria-live="polite">
              {countLabel(results.length)}
            </p>
            {results.length > 1 && (
              <SortMenu value={sort} onChange={(next) => update({ ordem: next === 'destaque' ? null : next })} />
            )}
          </div>
        </div>

        <AnimatePresence initial={false}>
          {chips.length > 0 && (
            <motion.div
              className="flex flex-wrap items-center gap-2 overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: easeOutExpo }}
            >
              <span className="h-4 w-full" />
              {chips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={chip.clear}
                  className="inline-flex h-8 items-center gap-2 rounded-full bg-ink/[0.06] pl-3.5 pr-3 text-[13px] transition-colors hover:bg-ink/[0.1]"
                  aria-label={`Remover filtro ${chip.label}`}
                >
                  {chip.label}
                  <span aria-hidden="true" className="text-ink/45">
                    ×
                  </span>
                </button>
              ))}
              <button type="button" onClick={clearAll} className="link-underline ml-1 text-[13px] text-ink/60 hover:text-ink">
                Limpar tudo
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {results.length > 0 ? (
          <>
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5">
              <AnimatePresence mode="popLayout" initial={false}>
                {results.slice(0, shown).map((product, index) => (
                  <motion.li
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 24, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.6, ease: easeOutExpo, delay: (index % PAGE) * 0.03 }}
                  >
                    <ProductCard product={product} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
            {results.length > shown && (
              <div className="mt-10 flex flex-col items-center gap-3">
                <p className="text-xs tabular-nums text-ink/45">
                  A ver {shown} de {results.length}
                </p>
                <button
                  type="button"
                  onClick={() => setShown((n) => n + PAGE)}
                  className="inline-flex h-12 items-center rounded-full bg-ink px-8 text-sm font-medium text-paper transition-colors hover:bg-ink-soft"
                >
                  Mostrar mais produtos
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="mt-6 rounded-[26px] bg-white px-6 py-16 text-center ring-1 ring-ink/[0.06]">
            {products.length === 0 ? (
              <>
                <h3 className="type-heading">Brevemente nesta gama</h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink/60">
                  Estamos a preparar o stock. Se procura um modelo específico, encomendamos para si.
                </p>
                <a
                  href={STORE.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper"
                >
                  Pedir pelo WhatsApp
                </a>
              </>
            ) : (
              <>
                <h3 className="type-heading">Nenhum produto com estes filtros</h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink/60">
                  Experimente outra marca ou outro intervalo de preço.
                </p>
                <button
                  type="button"
                  onClick={clearAll}
                  className="mt-7 inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper"
                >
                  Limpar filtros
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Mobile filter sheet */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-[60] bg-ink/40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSheetOpen(false)}
            />
            <motion.div
              key="sheet"
              role="dialog"
              aria-modal="true"
              aria-label="Filtros"
              className="fixed inset-x-0 bottom-0 z-[61] flex max-h-[88svh] flex-col rounded-t-[28px] bg-paper lg:hidden"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.5, ease: easeOutExpo }}
            >
              <div className="flex items-center justify-between px-5 pb-3 pt-5">
                <p className="type-heading">Filtros</p>
                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  className="h-10 rounded-full px-4 text-sm text-ink/60"
                  aria-label="Fechar filtros"
                >
                  Fechar
                </button>
              </div>
              <div className="flex-1 overflow-y-auto pb-6">{renderFilters('sheet')}</div>
              <div className="flex gap-3 border-t border-ink/[0.08] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                {activeCount > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="h-12 rounded-full px-5 text-sm font-medium ring-1 ring-ink/15"
                  >
                    Limpar
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  className="h-12 flex-1 rounded-full bg-ink text-sm font-medium text-paper"
                >
                  Ver {countLabel(results.length)}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Catalogue;
