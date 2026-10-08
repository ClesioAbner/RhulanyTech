import { useRef, type PointerEvent, type RefObject } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { formatPrice } from '../../lib/format';
import { priceFrom, productPath, resolveImage, type CatalogProduct } from '../../lib/catalog';
import { isCutout } from '../../lib/images';
import { useAddToCart } from '../../lib/useAddToCart';
import ProductImage from '../product/ProductImage';

const MAX_TILT = 5;
const MAX_SWATCHES = 5;
const spring = { stiffness: 200, damping: 24, mass: 0.6 };

interface ProductCardProps {
  product: CatalogProduct;
  /** Desktop only: leaves the image area empty so a 3D model rendered elsewhere can sit in it. */
  mediaSlotRef?: RefObject<HTMLDivElement>;
  /** Larger type for editorial grids with fewer columns. */
  size?: 'regular' | 'large';
}

/*
 * Homepage card: tall editorial photo with a pointer tilt. The image height also sizes the
 * falling 3D phone (see ShopToPayments), so keep its 4/5 ratio. The shop uses product/ProductCard.
 */
const FeaturedProductCard = ({ product, mediaSlotRef, size = 'regular' }: ProductCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const addToCart = useAddToCart();
  const href = productPath(product);
  // On hover: the same product in another colour, always a studio shot (never a lifestyle photo).
  const secondSrc = product.finishes[1]?.images?.[0];
  const secondImage = secondSrc && isCutout(resolveImage(secondSrc)) ? resolveImage(secondSrc, 600) : undefined;
  const hasOptions = Boolean(product.option);

  // Pointer position normalised to -0.5…0.5; springs make the tilt feel physical, not glued to the cursor.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-MAX_TILT, MAX_TILT]), spring);
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [MAX_TILT, -MAX_TILT]), spring);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || !cardRef.current || mediaSlotRef) return;
    const rect = cardRef.current.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const resetTilt = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const handleQuickAdd = () => addToCart(product, product.finishes[0], product.option?.choices[0]);

  return (
    <article className="group [perspective:1000px]">
      <motion.div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="stage relative aspect-[4/5] rounded-2xl transition-shadow duration-500 group-hover:shadow-[0_30px_60px_-34px_rgba(12,12,13,0.45)]"
      >
        <Link to={href} className="absolute inset-0 overflow-hidden rounded-2xl" tabIndex={-1} aria-hidden="true">
          <span
            className={`absolute inset-0 transition-[transform,opacity] duration-700 ease-out-expo group-hover:scale-[1.03] ${
              secondImage && !mediaSlotRef ? 'lg:group-hover:opacity-0' : ''
            } ${mediaSlotRef ? 'lg:hidden' : ''}`}
          >
            <ProductImage src={product.primaryImage} loading="lazy" />
          </span>
          {secondImage && !mediaSlotRef && (
            <span className="absolute inset-0 hidden translate-y-3 opacity-0 transition-[transform,opacity] duration-700 ease-out-expo group-hover:translate-y-0 group-hover:scale-[1.03] group-hover:opacity-100 lg:block">
              <ProductImage src={secondImage} loading="lazy" />
            </span>
          )}
          {mediaSlotRef && (
            <div
              ref={mediaSlotRef}
              className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(ellipse_at_50%_85%,rgba(12,12,13,0.12),transparent_55%)] lg:block"
            />
          )}
        </Link>

        {!product.inStock && (
          <span className="absolute left-4 top-4 text-xs font-medium uppercase tracking-[0.14em] text-ink/60">Esgotado</span>
        )}

        <button
          type="button"
          onClick={handleQuickAdd}
          disabled={!product.inStock}
          className="absolute inset-x-3 bottom-3 h-11 rounded-full bg-paper/95 text-sm font-medium text-ink backdrop-blur transition-all duration-500 ease-out-expo hover:bg-ink hover:text-paper focus-visible:translate-y-0 focus-visible:opacity-100 disabled:hidden max-lg:hidden lg:translate-y-3 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
        >
          Adicionar ao carrinho
        </button>
      </motion.div>

      <div className="mt-5">
        <p className="text-xs uppercase tracking-[0.14em] text-ink/45">{product.brand}</p>
        <h3
          className={`mt-1.5 font-medium leading-snug ${size === 'large' ? 'font-display text-xl tracking-tight' : 'text-[15px]'}`}
        >
          <Link to={href} className="link-underline">
            {product.title}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-1 text-sm text-ink/55">{product.summary}</p>

        {/* Phones: colours above the price, so the price never breaks across lines */}
        <div className="mt-3 flex flex-col-reverse items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="flex flex-wrap items-baseline gap-x-2 text-sm tabular-nums">
            <span className="whitespace-nowrap">
              {hasOptions && <span className="text-ink/50">Desde </span>}
              {formatPrice(priceFrom(product))}
            </span>
            {product.originalPrice && !hasOptions && (
              <span className="text-ink/40 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </p>

          {product.finishes.length > 1 && (
            <ul className="flex items-center gap-1.5" aria-label={`${product.finishes.length} acabamentos`}>
              {product.finishes.slice(0, MAX_SWATCHES).map((finish) => (
                <li key={finish.name} title={finish.name}>
                  <span
                    className="block h-3 w-3 rounded-full ring-1 ring-inset ring-ink/15"
                    style={{ backgroundColor: finish.hex }}
                  />
                </li>
              ))}
              {product.finishes.length > MAX_SWATCHES && (
                <li className="text-xs text-ink/45">+{product.finishes.length - MAX_SWATCHES}</li>
              )}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
};

export default FeaturedProductCard;
