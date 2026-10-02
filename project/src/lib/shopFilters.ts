import type { Product } from '../data/products';

export const CATEGORY_LABELS: Record<Product['category'], string> = {
  celulares: 'Celulares',
  computadores: 'Computadores',
  consoles: 'Consoles',
  perifericos: 'Periféricos',
  componentes: 'Componentes',
  acessorios: 'Acessórios',
};

export const PRICE_RANGES = [
  { id: 'ate-50', label: 'Até 50 000 MT', min: 0, max: 50_000 },
  { id: '50-150', label: '50 000 a 150 000 MT', min: 50_000, max: 150_000 },
  { id: '150-300', label: '150 000 a 300 000 MT', min: 150_000, max: 300_000 },
  { id: '300-mais', label: 'Mais de 300 000 MT', min: 300_000, max: Infinity },
] as const;

export const SORT_OPTIONS = [
  { id: 'relevancia', label: 'Relevância' },
  { id: 'preco-asc', label: 'Preço, do mais baixo' },
  { id: 'preco-desc', label: 'Preço, do mais alto' },
  { id: 'avaliacao', label: 'Melhor avaliados' },
  { id: 'novidades', label: 'Novidades' },
] as const;

export type SortId = (typeof SORT_OPTIONS)[number]['id'];
export type PriceRangeId = (typeof PRICE_RANGES)[number]['id'];

export interface ShopFilters {
  category: Product['category'] | null;
  brands: string[];
  price: PriceRangeId | null;
  inStockOnly: boolean;
  query: string;
  sort: SortId;
}

const isCategory = (value: string | null): value is Product['category'] =>
  value !== null && value in CATEGORY_LABELS;
const isPrice = (value: string | null): value is PriceRangeId => PRICE_RANGES.some((range) => range.id === value);
const isSort = (value: string | null): value is SortId => SORT_OPTIONS.some((option) => option.id === value);

// URL format: /products?category=celulares&marca=Apple,Samsung&preco=50-150&stock=1&q=pro&ordem=preco-asc
export const filtersFromParams = (params: URLSearchParams): ShopFilters => {
  const category = params.get('category');
  const price = params.get('preco');
  const sort = params.get('ordem');
  return {
    category: isCategory(category) ? category : null,
    brands: params.get('marca')?.split(',').filter(Boolean) ?? [],
    price: isPrice(price) ? price : null,
    inStockOnly: params.get('stock') === '1',
    query: params.get('q') ?? '',
    sort: isSort(sort) ? sort : 'relevancia',
  };
};

export const filtersToParams = (filters: ShopFilters) => {
  const params = new URLSearchParams();
  if (filters.category) params.set('category', filters.category);
  if (filters.brands.length) params.set('marca', filters.brands.join(','));
  if (filters.price) params.set('preco', filters.price);
  if (filters.inStockOnly) params.set('stock', '1');
  if (filters.query.trim()) params.set('q', filters.query.trim());
  if (filters.sort !== 'relevancia') params.set('ordem', filters.sort);
  return params;
};

export const countActiveFilters = (filters: ShopFilters) =>
  (filters.category ? 1 : 0) + filters.brands.length + (filters.price ? 1 : 0) + (filters.inStockOnly ? 1 : 0);

const normalise = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

const matchesQuery = (product: Product, query: string) => {
  const terms = normalise(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const haystack = normalise(
    [product.name, product.brand, product.model, CATEGORY_LABELS[product.category], ...product.tags].join(' '),
  );
  return terms.every((term) => haystack.includes(term));
};

type Criterion = 'category' | 'brands' | 'price' | 'stock' | 'query';

// `ignore` lets a facet count what it *would* show if its own selection were cleared.
const passes = (product: Product, filters: ShopFilters, ignore?: Criterion) => {
  if (ignore !== 'category' && filters.category && product.category !== filters.category) return false;
  if (ignore !== 'brands' && filters.brands.length && !filters.brands.includes(product.brand)) return false;
  if (ignore !== 'price' && filters.price) {
    const range = PRICE_RANGES.find((r) => r.id === filters.price)!;
    if (product.price < range.min || product.price >= range.max) return false;
  }
  if (ignore !== 'stock' && filters.inStockOnly && !product.inStock) return false;
  if (ignore !== 'query' && !matchesQuery(product, filters.query)) return false;
  return true;
};

const popularity = (product: Product) => product.rating * Math.log10(product.reviews + 10);

export const applyFilters = (products: Product[], filters: ShopFilters) => {
  const result = products.filter((product) => passes(product, filters));
  switch (filters.sort) {
    case 'preco-asc':
      return result.sort((a, b) => a.price - b.price);
    case 'preco-desc':
      return result.sort((a, b) => b.price - a.price);
    case 'avaliacao':
      return result.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    case 'novidades':
      return result.sort((a, b) => Number(b.id) - Number(a.id));
    default:
      return result.sort((a, b) => popularity(b) - popularity(a));
  }
};

/** Counts per facet value, given every other active filter. */
export const facetCounts = (products: Product[], filters: ShopFilters) => {
  const count = <K extends string>(criterion: Criterion, key: (product: Product) => K | K[]) => {
    const counts = {} as Record<K, number>;
    for (const product of products) {
      if (!passes(product, filters, criterion)) continue;
      const keys = key(product);
      for (const k of Array.isArray(keys) ? keys : [keys]) counts[k] = (counts[k] ?? 0) + 1;
    }
    return counts;
  };

  return {
    category: count('category', (product) => product.category),
    brands: count('brands', (product) => product.brand),
    price: count('price', (product) =>
      PRICE_RANGES.filter((range) => product.price >= range.min && product.price < range.max).map((range) => range.id),
    ),
    inStock: products.filter((product) => product.inStock && passes(product, filters, 'stock')).length,
  };
};
