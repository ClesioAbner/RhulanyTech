import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { formatPrice } from '../../lib/format';
import { easeOutExpo } from '../../lib/motion';
import { galleryFor, imageFor, isNewArrival, priceFrom, productPath, resolveImage, type CatalogProduct } from '../../lib/catalog';
import { useAddToCart } from '../../lib/useAddToCart';

const MAX_SWATCHES = 6;
const IMAGE_WIDTH = 600; // cards render at ~300px, so 2x is enough

/*
 * Store card: contained photo, finishes, name, one line, starting price.
 * The whole card links to the product; a quick-add bar slides up over the photo on hover.
 * Pointing at a colour swatch shows that colour, and the link and quick-add follow it.
 */
const ProductCard = ({ product }: { product: CatalogProduct }) => {
  const addToCart = useAddToCart();
  const [finishIndex, setFinishIndex] = useState(0);
  const finish = product.finishes[finishIndex];
  const image = imageFor(product, finish, IMAGE_WIDTH);
  // With several colours the hover belongs to the swatches, so the second-photo swap is skipped.
  const secondSrc = product.finishes.length > 1 ? undefined : galleryFor(product, finish).filter((view) => view.url)[1]?.src;
  const secondImage = secondSrc && resolveImage(secondSrc, IMAGE_WIDTH);
  const hasOptions = Boolean(product.option);

  return (
    <article className="group relative flex h-full flex-col rounded-[22px] bg-white p-3 transition-[transform,box-shadow] duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-[0_28px_50px_-32px_rgba(12,12,13,0.38)] sm:p-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-mist">
        <AnimatePresence initial={false}>
          <motion.img
            key={image}
            src={image}
            alt=""
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-[transform,opacity] duration-700 ease-out-expo group-hover:scale-[1.04] ${
              secondImage ? 'lg:group-hover:opacity-0' : ''
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: easeOutExpo }}
          />
        </AnimatePresence>
        {secondImage && (
          <img
            src={secondImage}
            alt=""
            loading="lazy"
            className="absolute inset-0 hidden h-full w-full scale-[1.04] object-cover opacity-0 transition-[transform,opacity] duration-700 ease-out-expo group-hover:scale-100 group-hover:opacity-100 lg:block"
          />
        )}

        {product.inStock && (
          <button
            type="button"
            onClick={() => addToCart(product, finish, product.option?.choices[0])}
            className="absolute inset-x-2 bottom-2 z-10 hidden h-11 translate-y-[120%] rounded-full bg-ink/90 text-sm font-medium text-paper backdrop-blur transition-[transform,background-color] duration-500 ease-out-expo hover:bg-ink focus-visible:translate-y-0 group-hover:translate-y-0 lg:block"
          >
            Adicionar ao carrinho
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col px-1 pb-1 pt-4">
        {product.finishes.length > 1 && (
          <ul className="relative z-10 -m-1 mb-2 flex items-center gap-0.5 self-start" aria-label={`${product.finishes.length} cores`}>
            {product.finishes.slice(0, MAX_SWATCHES).map((item, index) => (
              <li key={item.name}>
                <button
                  type="button"
                  title={item.name}
                  aria-label={`Ver em ${item.name}`}
                  aria-pressed={index === finishIndex}
                  onPointerEnter={() => setFinishIndex(index)}
                  onFocus={() => setFinishIndex(index)}
                  onClick={() => setFinishIndex(index)}
                  className="grid h-[22px] w-[22px] place-items-center rounded-full"
                >
                  <span
                    className={`block h-2.5 w-2.5 rounded-full ring-1 ring-inset ring-ink/15 transition-[box-shadow] duration-300 ${
                      index === finishIndex ? 'shadow-[0_0_0_2px_#fff,0_0_0_3px_rgba(12,12,13,0.55)]' : ''
                    }`}
                    style={{ backgroundColor: item.hex }}
                  />
                </button>
              </li>
            ))}
            {product.finishes.length > MAX_SWATCHES && (
              <li className="pl-1 text-[11px] text-ink/45">+{product.finishes.length - MAX_SWATCHES}</li>
            )}
          </ul>
        )}

        <p className="text-xs">
          {isNewArrival(product) && <span className="mr-2 font-medium text-[#b34700]">Novo</span>}
          <span className="uppercase tracking-[0.12em] text-ink/45">{product.brand}</span>
        </p>
        <h3 className="mt-1 text-[15px] font-medium leading-snug">
          {/* Stretched link: the whole card is clickable; swatches and quick-add sit above it. */}
          <Link to={productPath(product, finish)} className="after:absolute after:inset-0 after:rounded-[22px]">
            {product.title}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm leading-snug text-ink/55">{product.summary}</p>

        <p className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-4 text-sm tabular-nums">
          <span>
            {hasOptions && <span className="text-ink/50">Desde </span>}
            {formatPrice(priceFrom(product))}
          </span>
          {product.originalPrice && !hasOptions && (
            <span className="text-ink/40 line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </p>
        {!product.inStock && <p className="mt-1 text-xs text-ink/55">Esgotado de momento</p>}
      </div>
    </article>
  );
};

export default ProductCard;
