import { Link } from 'react-router-dom';
import { formatPrice } from '../../lib/format';
import { isNewArrival, priceFrom, productPath, resolveImage, type CatalogProduct } from '../../lib/catalog';
import { useAddToCart } from '../../lib/useAddToCart';

const MAX_SWATCHES = 6;
const IMAGE_WIDTH = 600; // cards render at ~300px, so 2x is enough

/*
 * Store card: contained photo, finishes, name, one line, starting price.
 * The whole card links to the product; a quick-add bar slides up over the photo on hover.
 */
const ProductCard = ({ product }: { product: CatalogProduct }) => {
  const addToCart = useAddToCart();
  const secondImage = product.gallery.filter((view) => view.url)[1]?.url;
  const image = (src: string) => resolveImage(src, IMAGE_WIDTH);
  const hasOptions = Boolean(product.option);

  return (
    <article className="group relative flex h-full flex-col rounded-[22px] bg-white p-3 transition-[transform,box-shadow] duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-[0_28px_50px_-32px_rgba(12,12,13,0.38)] sm:p-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-mist">
        <img
          src={image(product.primaryImage)}
          alt=""
          loading="lazy"
          className={`h-full w-full object-cover transition-[transform,opacity] duration-700 ease-out-expo group-hover:scale-[1.04] ${
            secondImage ? 'lg:group-hover:opacity-0' : ''
          }`}
        />
        {secondImage && (
          <img
            src={image(secondImage)}
            alt=""
            loading="lazy"
            className="absolute inset-0 hidden h-full w-full scale-[1.04] object-cover opacity-0 transition-[transform,opacity] duration-700 ease-out-expo group-hover:scale-100 group-hover:opacity-100 lg:block"
          />
        )}

        {product.inStock && (
          <button
            type="button"
            onClick={() => addToCart(product, product.finishes[0], product.option?.choices[0])}
            className="absolute inset-x-2 bottom-2 z-10 hidden h-11 translate-y-[120%] rounded-full bg-ink/90 text-sm font-medium text-paper backdrop-blur transition-[transform,background-color] duration-500 ease-out-expo hover:bg-ink focus-visible:translate-y-0 group-hover:translate-y-0 lg:block"
          >
            Adicionar ao carrinho
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col px-1 pb-1 pt-4">
        {product.finishes.length > 1 && (
          <ul className="mb-3 flex items-center gap-1.5" aria-label={`${product.finishes.length} cores`}>
            {product.finishes.slice(0, MAX_SWATCHES).map((finish) => (
              <li key={finish.name} title={finish.name}>
                <span
                  className="block h-2.5 w-2.5 rounded-full ring-1 ring-inset ring-ink/15"
                  style={{ backgroundColor: finish.hex }}
                />
              </li>
            ))}
            {product.finishes.length > MAX_SWATCHES && (
              <li className="text-[11px] text-ink/45">+{product.finishes.length - MAX_SWATCHES}</li>
            )}
          </ul>
        )}

        <p className="text-xs">
          {isNewArrival(product) && <span className="mr-2 font-medium text-[#b34700]">Novo</span>}
          <span className="uppercase tracking-[0.12em] text-ink/45">{product.brand}</span>
        </p>
        <h3 className="mt-1 text-[15px] font-medium leading-snug">
          {/* Stretched link: the whole card is clickable, the quick-add button sits above it. */}
          <Link to={productPath(product)} className="after:absolute after:inset-0 after:rounded-[22px]">
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
