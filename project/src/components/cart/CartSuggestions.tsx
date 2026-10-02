import { Link } from 'react-router-dom';
import { priceFrom, productPath, resolveImage, type CatalogProduct } from '../../lib/catalog';
import { formatPrice } from '../../lib/format';
import { useAddToCart } from '../../lib/useAddToCart';

interface CartSuggestionsProps {
  title: string;
  products: CatalogProduct[];
  onNavigate?: () => void;
}

/** Small add-on row inside the cart drawer: one tap adds the accessory to the order. */
const CartSuggestions = ({ title, products, onNavigate }: CartSuggestionsProps) => {
  const addToCart = useAddToCart();
  if (!products.length) return null;

  return (
    <section aria-label={title} className="mt-8">
      <h3 className="px-6 text-sm font-medium">{title}</h3>
      <ul className="mt-3 flex snap-x gap-3 overflow-x-auto px-6 pb-2 [scrollbar-width:none] scroll-pl-6 [&::-webkit-scrollbar]:hidden">
        {products.map((product) => (
          <li key={product.id} className="w-[148px] shrink-0 snap-start">
            <div className="flex h-full flex-col rounded-2xl bg-white p-2.5">
              <Link to={productPath(product)} onClick={onNavigate} className="group block">
                <span className="block aspect-square overflow-hidden rounded-xl bg-mist">
                  <img
                    src={resolveImage(product.primaryImage, 320)}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out-expo group-hover:scale-105"
                  />
                </span>
                <span className="mt-2.5 line-clamp-2 block px-0.5 text-xs font-medium leading-snug">{product.title}</span>
              </Link>
              <div className="mt-auto px-0.5 pt-1.5">
                <span className="block whitespace-nowrap text-xs tabular-nums text-ink/60">{formatPrice(priceFrom(product))}</span>
                <button
                  type="button"
                  onClick={() => addToCart(product, product.finishes[0], product.option?.choices[0])}
                  aria-label={`Adicionar ${product.title}`}
                  className="mt-2.5 h-8 w-full rounded-full bg-ink/[0.06] text-xs font-medium transition-colors hover:bg-ink hover:text-paper"
                >
                  Juntar ao carrinho
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CartSuggestions;
