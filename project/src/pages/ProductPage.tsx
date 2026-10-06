import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import {
  categoryPath,
  getCategory,
  getProductBySlug,
  getSubcategory,
  galleryFor,
  primaryPlacement,
  slugify,
  type CatalogProduct,
} from '../lib/catalog';
import { formatPrice } from '../lib/format';
import { easeOutExpo } from '../lib/motion';
import { useAddToCart } from '../lib/useAddToCart';
import ProductGallery from '../components/product/ProductGallery';
import ProductVariants from '../components/product/ProductVariants';
import ProductOverview, { OVERVIEW_ID } from '../components/product/ProductOverview';
import ProductHighlights from '../components/product/ProductHighlights';
import ProductSpecifications from '../components/product/ProductSpecifications';
import ProductRecommendations from '../components/product/ProductRecommendations';

const ratingFormatter = new Intl.NumberFormat('pt-PT', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const countFormatter = new Intl.NumberFormat('pt-PT');

const Breadcrumb = ({ product }: { product: CatalogProduct }) => {
  const placement = primaryPlacement(product);
  const category = getCategory(placement?.category);
  const subcategory = getSubcategory(category, placement?.subcategory);
  return (
    <nav aria-label="Caminho" className="text-xs text-ink/45">
      <Link to="/loja" className="link-underline">
        Loja
      </Link>
      {category && (
        <>
          <span className="mx-2">/</span>
          <Link to={categoryPath(category.slug)} className="link-underline">
            {category.name}
          </Link>
        </>
      )}
      {category && subcategory && (
        <>
          <span className="mx-2">/</span>
          <Link to={categoryPath(category.slug, subcategory.slug)} className="link-underline">
            {subcategory.name}
          </Link>
        </>
      )}
      <span className="mx-2">/</span>
      <span className="text-ink/70">{product.title}</span>
    </nav>
  );
};

const ProductView = ({ product }: { product: CatalogProduct }) => {
  const navigate = useNavigate();
  const addToCart = useAddToCart();
  const [searchParams] = useSearchParams();
  // A card can link straight to a colour (?cor=azul-profundo).
  const [finishIndex, setFinishIndex] = useState(() =>
    Math.max(
      0,
      product.finishes.findIndex((item) => slugify(item.name) === searchParams.get('cor')),
    ),
  );
  const [optionIndex, setOptionIndex] = useState(0);
  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaVisible = useInView(ctaRef, { margin: '0px 0px -10% 0px' });

  const finish = product.finishes[finishIndex];
  const views = useMemo(() => galleryFor(product, finish), [product, finish]);
  const option = product.option?.choices[optionIndex];
  const price = product.price + (option?.priceDelta ?? 0);

  const handleAdd = () => addToCart(product, finish, option);

  const handleBuyNow = () => {
    addToCart(product, finish, option, { openDrawer: false });
    navigate('/checkout');
  };

  const stockLine = !product.inStock
    ? 'Esgotado de momento'
    : product.stockQuantity <= 5
      ? `Em stock, restam ${product.stockQuantity} unidades`
      : 'Em stock';

  return (
    <>
      <div className="container-site pt-10 lg:pt-14">
        <Breadcrumb product={product} />

        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-28">
              <ProductGallery product={product} views={views} finish={finish} />
            </div>
          </div>

          <div className="lg:col-span-5 lg:pt-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink/45">{product.brand}</p>
            <h1 className="type-display mt-3">{product.title}</h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-ink/60">{product.summary}</p>
            <button
              type="button"
              onClick={() => document.getElementById(OVERVIEW_ID)?.scrollIntoView({ behavior: 'smooth' })}
              className="link-underline mt-3 text-sm font-medium"
            >
              Ler a visão geral
            </button>
            <p className="mt-4 text-sm text-ink/55">
              <span className="font-medium text-ink">{ratingFormatter.format(product.rating)} de 5</span>
              <span className="mx-2">·</span>
              {countFormatter.format(product.reviews)} avaliações
            </p>

            <div className="mt-8 flex items-baseline gap-3">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.p
                  key={price}
                  className="font-display text-3xl font-medium tabular-nums tracking-tight"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: easeOutExpo }}
                >
                  {formatPrice(price)}
                </motion.p>
              </AnimatePresence>
              {product.originalPrice && optionIndex === 0 && (
                <p className="text-sm tabular-nums text-ink/40 line-through">{formatPrice(product.originalPrice)}</p>
              )}
            </div>
            <p className="mt-1 text-xs text-ink/45">Preço em Meticais, com garantia oficial do fabricante</p>

            <div className="mt-10">
              <ProductVariants
                product={product}
                finishIndex={finishIndex}
                optionIndex={optionIndex}
                onFinishChange={setFinishIndex}
                onOptionChange={setOptionIndex}
              />
            </div>

            <div ref={ctaRef} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleAdd}
                disabled={!product.inStock}
                className="h-14 flex-1 rounded-full bg-ink text-sm font-medium text-paper transition-[background-color,transform] duration-300 hover:bg-ink-soft active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-ink/30"
              >
                Adicionar ao carrinho
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="h-14 flex-1 rounded-full border border-ink/20 text-sm font-medium transition-[border-color,transform] duration-300 hover:border-ink active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Comprar agora
              </button>
            </div>
            <p className={`mt-4 text-sm ${product.inStock ? 'text-ink/60' : 'text-ink'}`}>{stockLine}</p>

            <dl className="mt-10 divide-y divide-ink/10 border-y border-ink/10 text-sm">
              <div className="flex justify-between gap-6 py-4">
                <dt className="text-ink/50">Garantia</dt>
                <dd className="text-right">{product.warranty}</dd>
              </div>
              <div className="flex justify-between gap-6 py-4">
                <dt className="text-ink/50">Entrega</dt>
                <dd className="text-right">Maputo e todas as províncias</dd>
              </div>
              <div className="flex justify-between gap-6 py-4">
                <dt className="text-ink/50">Pagamento</dt>
                <dd className="text-right">
                  <Link to="/#pagamentos" className="link-underline">
                    M-Pesa, e-Mola, mKesh, cartão ou PayPal
                  </Link>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="mt-24 lg:mt-32">
        <ProductOverview product={product} />
        <ProductHighlights product={product} />
        <ProductSpecifications product={product} />
        <ProductRecommendations product={product} />
      </div>

      {/* Mobile: the purchase action stays within reach once the main button scrolls away */}
      <AnimatePresence>
        {!ctaVisible && product.inStock && (
          <motion.div
            className="fixed inset-x-3 bottom-3 z-40 flex items-center gap-3 rounded-full border border-ink/10 bg-paper/90 py-2 pl-5 pr-2 shadow-[0_20px_40px_-20px_rgba(12,12,13,0.4)] backdrop-blur-xl lg:hidden"
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ duration: 0.45, ease: easeOutExpo }}
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-ink/55">{product.title}</p>
              <p className="text-sm font-medium tabular-nums">{formatPrice(price)}</p>
            </div>
            <button type="button" onClick={handleAdd} className="h-11 rounded-full bg-ink px-5 text-sm font-medium text-paper">
              Adicionar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/** /produto/:slug */
const ProductPage = () => {
  const { slug } = useParams();
  const product = getProductBySlug(slug);

  useEffect(() => {
    if (product) document.title = `${product.title} | Rhulany Tech`;
    return () => {
      document.title = 'Rhulany Tech | Tecnologia original em Maputo';
    };
  }, [product]);

  if (!product) {
    return (
      <div className="container-site py-32 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink/45">Produto</p>
        <h1 className="type-display mt-4">Não encontrámos este produto</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm text-ink/60">Pode ter mudado de nome ou já não estar disponível.</p>
        <Link to="/loja" className="mt-8 inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper">
          Ir para a loja
        </Link>
      </div>
    );
  }

  // Keyed so variant state resets when moving between products.
  return <ProductView key={product.id} product={product} />;
};

export default ProductPage;
