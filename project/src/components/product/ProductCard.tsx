import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { formatPrice } from '../../lib/format';
import { easeOutExpo } from '../../lib/motion';
import { imageFor, isNewArrival, priceFrom, productPath, type CatalogProduct } from '../../lib/catalog';
import { useAddToCart } from '../../lib/useAddToCart';
import { CartIcon } from '../ui/Icons';
import ProductImage from './ProductImage';

const MAX_SWATCHES = 5;
const IMAGE_WIDTH = 600;

/*
 * Store card. The product stands whole on a studio stage, the colours under it switch the picture,
 * and the price sits next to a quick-add button that opens out on hover.
 */
const ProductCard = ({ product }: { product: CatalogProduct }) => {
  const addToCart = useAddToCart();
  const [finishIndex, setFinishIndex] = useState(0);
  const finish = product.finishes[finishIndex];
  const image = imageFor(product, finish, IMAGE_WIDTH);
  const hasOptions = Boolean(product.option);
  const saving = product.originalPrice && !hasOptions ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[22px] bg-white ring-1 ring-ink/[0.06] transition-[box-shadow,transform] duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-[0_32px_60px_-34px_rgba(12,12,13,0.32)] sm:rounded-[26px]">
      <div className="stage relative aspect-[5/6] overflow-hidden">
        {(isNewArrival(product) || saving > 0) && (
          <p className="absolute inset-x-3.5 top-3 z-10 flex justify-between text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-deep sm:inset-x-5 sm:top-4 sm:text-[11px]">
            <span>{isNewArrival(product) ? 'Novo' : ''}</span>
            {saving > 0 && <span className="tabular-nums">−{saving}%</span>}
          </p>
        )}
        <AnimatePresence initial={false}>
          <motion.div
            key={image}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
          >
            <div className="absolute inset-0 transition-transform duration-700 ease-out-expo group-hover:-translate-y-1.5 group-hover:scale-[1.035]">
              <ProductImage src={image} inset="px-[13%] pb-[9%] pt-[15%]" loading="lazy" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-1 flex-col px-3.5 pb-4 pt-3.5 sm:px-5 sm:pb-5 sm:pt-4">
        {product.finishes.length > 1 && (
          <ul className="relative z-10 -ml-1 mb-2.5 flex items-center gap-0.5" aria-label={`${product.finishes.length} cores`}>
            {product.finishes.slice(0, MAX_SWATCHES).map((item, index) => (
              <li key={item.name}>
                <button
                  type="button"
                  title={item.name}
                  aria-label={`Ver em ${item.name}`}
                  aria-pressed={index === finishIndex}
                  onPointerEnter={(event) => event.pointerType === 'mouse' && setFinishIndex(index)}
                  onFocus={() => setFinishIndex(index)}
                  onClick={() => setFinishIndex(index)}
                  className="grid h-6 w-6 place-items-center rounded-full"
                >
                  <span
                    className={`block h-3 w-3 rounded-full ring-1 ring-inset ring-ink/15 transition-shadow duration-300 ${
                      index === finishIndex ? 'shadow-[0_0_0_2px_#fff,0_0_0_3.5px_rgba(12,12,13,0.6)]' : ''
                    }`}
                    style={{ backgroundColor: item.hex }}
                  />
                </button>
              </li>
            ))}
            {product.finishes.length > MAX_SWATCHES && (
              <li className="pl-1 text-[11px] tabular-nums text-ink/45">+{product.finishes.length - MAX_SWATCHES}</li>
            )}
          </ul>
        )}

        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink/45 sm:text-[11px]">{product.brand}</p>
        <h3 className="mt-1 text-sm font-medium leading-snug sm:text-[15px]">
          {/* Stretched link: the whole card opens the product; swatches and quick-add sit above it. */}
          <Link to={productPath(product, finish)} className="after:absolute after:inset-0 after:rounded-[inherit]">
            {product.title}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-ink/55 max-sm:hidden">{product.summary}</p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <p className="min-w-0 tabular-nums leading-tight">
            {hasOptions && <span className="block text-[11px] text-ink/45">Desde</span>}
            <span className="text-[15px] font-semibold tracking-tight sm:text-base">{formatPrice(priceFrom(product))}</span>
            {saving > 0 && <span className="block text-xs text-ink/40 line-through">{formatPrice(product.originalPrice!)}</span>}
          </p>
          {product.inStock ? (
            <button
              type="button"
              onClick={() => addToCart(product, finish, product.option?.choices[0])}
              aria-label={`Adicionar ${product.title} ao carrinho`}
              className="relative z-10 flex h-9 shrink-0 items-center overflow-hidden rounded-full bg-ink pl-[11px] pr-[11px] text-paper transition-[background-color] duration-300 hover:bg-ink-soft sm:h-10 sm:pl-[13px] sm:pr-[13px]"
            >
              <CartIcon className="h-[15px] w-[15px] shrink-0" />
              <span className="max-w-0 overflow-hidden whitespace-nowrap text-[13px] font-medium opacity-0 transition-[max-width,opacity,margin] duration-500 ease-out-expo lg:group-hover:ml-2 lg:group-hover:max-w-[5.5rem] lg:group-hover:opacity-100">
                Adicionar
              </span>
            </button>
          ) : (
            <span className="text-xs text-ink/50">Esgotado</span>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
