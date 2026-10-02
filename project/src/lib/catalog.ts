import { products, type Product } from '../data/products';
import { CATEGORIES, type Category, type Subcategory } from '../data/catalog/taxonomy';
import { PLACEMENTS } from '../data/catalog/placements';
import {
  COLOR_SWATCHES,
  MERCHANDISING,
  type Finish,
  type GalleryView,
  type Highlight,
  type Merchandising,
} from '../data/catalog/merchandising';
import { unsplash } from './images';

export type { Category, Subcategory } from '../data/catalog/taxonomy';
export type { Finish, GalleryView, Highlight, OptionChoice } from '../data/catalog/merchandising';

export interface Placement {
  category: string;
  subcategory: string;
}

export interface ResolvedView extends GalleryView {
  /** Resolved image URL; undefined for angles rendered by the 3D model. */
  url?: string;
}

export interface CatalogProduct extends Product {
  slug: string;
  /** Name without a storage suffix when storage is a selectable option. */
  title: string;
  summary: string;
  placements: Placement[];
  finishes: Finish[];
  option?: Merchandising['option'];
  scene3d?: Merchandising['scene3d'];
  gallery: ResolvedView[];
  highlights: Highlight[];
  primaryImage: string;
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/["'’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const STORAGE_SUFFIX = /\s+\d+\s?(GB|TB)\b.*$/i;

// Accepts an Unsplash id or a full URL; Unsplash URLs are re-sized consistently.
export const resolveImage = (src: string, width = 1200) => {
  if (!src.startsWith('http')) return unsplash(src, width);
  const match = src.match(/images\.unsplash\.com\/photo-([\w-]+)/);
  return match ? unsplash(match[1], width) : src;
};

// The legacy data repeats one photo with a meaningless `&angle=` parameter; keep distinct photos only.
const distinctImages = (images: string[]) => [...new Set(images.map((src) => src.split('?')[0]))];

const buildGallery = (product: Product, merch: Merchandising): ResolvedView[] => {
  if (merch.gallery?.length) {
    return merch.gallery.map((view) => ({ ...view, url: view.src ? resolveImage(view.src) : undefined }));
  }
  return distinctImages(product.images).map((src, index) => ({
    angle: index === 0 ? 'frente' : 'detalhe',
    src,
    url: resolveImage(src),
    alt: index === 0 ? product.name : `${product.name}, outra vista`,
  }));
};

const toCatalogProduct = (product: Product): CatalogProduct => {
  const merch = MERCHANDISING[product.id] ?? {};
  const finishes =
    merch.finishes ??
    (product.colors ?? []).map((name) => ({ name, hex: COLOR_SWATCHES[name] ?? '#c9c9c9' }));
  const title = merch.option ? product.name.replace(STORAGE_SUFFIX, '') : product.name;
  const gallery = buildGallery(product, merch);

  return {
    ...product,
    slug: slugify(title),
    title,
    summary: merch.summary ?? product.description,
    placements: (PLACEMENTS[product.id] ?? []).map((path) => {
      const [category, subcategory] = path.split('/');
      return { category, subcategory };
    }),
    finishes,
    option: merch.option,
    scene3d: merch.scene3d,
    gallery,
    highlights:
      merch.highlights ?? product.features.slice(0, 4).map((feature) => ({ title: feature, body: '' })),
    primaryImage: gallery.find((view) => view.url)?.url ?? resolveImage(product.images[0]),
  };
};

export const CATALOG: CatalogProduct[] = products.map(toCatalogProduct);

// ---------- Selectors ----------

export const getCategory = (slug?: string) => CATEGORIES.find((category) => category.slug === slug);

export const getSubcategory = (category: Category | undefined, slug?: string) =>
  category?.subcategories.find((subcategory) => subcategory.slug === slug);

export const productsIn = (categorySlug: string, subcategorySlug?: string) =>
  CATALOG.filter((product) =>
    product.placements.some(
      (p) => p.category === categorySlug && (!subcategorySlug || p.subcategory === subcategorySlug),
    ),
  );

export const getProductBySlug = (slug?: string) => CATALOG.find((product) => product.slug === slug);
export const getProductById = (id?: string) => CATALOG.find((product) => product.id === id);

/** The product's main shelf, used for breadcrumbs and "more like this". */
export const primaryPlacement = (product: CatalogProduct) => product.placements[0];

export const subcategoryCover = (categorySlug: string, subcategory: Subcategory, width = 800) => {
  if (subcategory.image) return resolveImage(subcategory.image, width);
  const product = productsIn(categorySlug, subcategory.slug)[0];
  return product && resolveImage(product.primaryImage, width);
};

export const priceFrom = (product: CatalogProduct) =>
  product.price + Math.min(0, ...(product.option?.choices.map((choice) => choice.priceDelta) ?? [0]));

export const relatedProducts = (product: CatalogProduct, limit = 4) => {
  const placement = primaryPlacement(product);
  if (!placement) return [];
  const sameShelf = productsIn(placement.category, placement.subcategory);
  const sameCategory = productsIn(placement.category);
  const seen = new Set([product.id]);
  return [...sameShelf, ...sameCategory].filter((p) => !seen.has(p.id) && seen.add(p.id)).slice(0, limit);
};

export const productPath = (product: CatalogProduct) => `/produto/${product.slug}`;
export const categoryPath = (categorySlug: string, subcategorySlug?: string) =>
  subcategorySlug ? `/loja/${categorySlug}/${subcategorySlug}` : `/loja/${categorySlug}`;

// ---------- Sorting ----------

export const SORT_OPTIONS = [
  { id: 'destaque', label: 'Em destaque' },
  { id: 'preco-asc', label: 'Preço, do mais baixo' },
  { id: 'preco-desc', label: 'Preço, do mais alto' },
  { id: 'avaliacao', label: 'Melhor avaliados' },
] as const;

export type SortId = (typeof SORT_OPTIONS)[number]['id'];

const popularity = (product: Product) => product.rating * Math.log10(product.reviews + 10);

export const sortProducts = (list: CatalogProduct[], sort: SortId) => {
  const copy = [...list];
  switch (sort) {
    case 'preco-asc':
      return copy.sort((a, b) => priceFrom(a) - priceFrom(b));
    case 'preco-desc':
      return copy.sort((a, b) => priceFrom(b) - priceFrom(a));
    case 'avaliacao':
      return copy.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    default:
      return copy.sort((a, b) => popularity(b) - popularity(a));
  }
};

// Legacy `?category=` values from old links and the homepage, mapped onto the new shelves.
export const LEGACY_CATEGORY_PATHS: Record<string, string> = {
  celulares: '/loja/celulares',
  computadores: '/loja/computadores',
  consoles: '/loja/gaming',
  perifericos: '/loja/acessorios',
  componentes: '/loja/computadores/componentes',
  acessorios: '/loja/acessorios',
  cameras: '/loja/cameras',
  'casa-inteligente': '/loja/casa-inteligente',
};

export { CATEGORIES };
