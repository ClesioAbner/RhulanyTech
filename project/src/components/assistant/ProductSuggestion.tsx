import { Link } from 'react-router-dom';
import { getProductById, priceFrom, productPath } from '../../lib/catalog';
import { formatPrice } from '../../lib/format';
import ProductImage from '../product/ProductImage';

/** A product the assistant points to: studio photo, name and price, linking to its page. */
const ProductSuggestion = ({ id, onFollow }: { id: string; onFollow: () => void }) => {
  const product = getProductById(id);
  if (!product) return null;

  return (
    <Link
      to={productPath(product)}
      onClick={onFollow}
      className="group block w-[168px] shrink-0 snap-start overflow-hidden rounded-[20px] bg-white ring-1 ring-ink/[0.06] transition-[box-shadow,transform] duration-500 ease-out-expo hover:-translate-y-0.5 hover:shadow-[0_20px_36px_-24px_rgba(12,12,13,0.35)]"
    >
      <div className="stage relative aspect-[4/3]">
        <span className="absolute inset-0 transition-transform duration-700 ease-out-expo group-hover:scale-[1.05]">
          <ProductImage src={product.primaryImage} inset="p-[12%]" loading="lazy" loader />
        </span>
      </div>
      <div className="px-3.5 pb-3.5 pt-2.5">
        <p className="eyebrow text-[10px] text-ink/40">{product.brand}</p>
        <p className="mt-1 line-clamp-2 text-sm font-medium leading-snug">{product.title}</p>
        <p className="mt-1.5 text-[13px] tabular-nums text-ink/60">Desde {formatPrice(priceFrom(product))}</p>
      </div>
    </Link>
  );
};

export default ProductSuggestion;
