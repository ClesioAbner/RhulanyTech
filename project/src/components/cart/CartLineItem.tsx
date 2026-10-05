import { Link } from 'react-router-dom';
import { formatPrice } from '../../lib/format';
import { resolveImage } from '../../lib/catalog';
import type { CartLine } from '../../lib/cart';
import { useCartStore } from '../../stores/cartStore';
import QuantityStepper from './QuantityStepper';
import RollingPrice from './RollingPrice';
import { removeWithUndo } from './removeWithUndo';
import ProductImage from '../product/ProductImage';

interface CartLineItemProps {
  line: CartLine;
  size?: 'compact' | 'full';
  /** Marks the line that was just added. */
  isNew?: boolean;
  onNavigate?: () => void;
}

/** One cart line: photo, name, chosen variant, quantity and line total. */
const CartLineItem = ({ line, size = 'compact', isNew = false, onNavigate }: CartLineItemProps) => {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const full = size === 'full';

  return (
    <div className={`flex gap-4 ${full ? 'sm:gap-8' : ''}`}>
      <Link
        to={line.href}
        onClick={onNavigate}
        tabIndex={-1}
        aria-hidden="true"
        className={`stage relative shrink-0 overflow-hidden rounded-2xl ${full ? 'h-24 w-24 sm:h-36 sm:w-36' : 'h-20 w-20'}`}
      >
        <ProductImage src={resolveImage(line.image, 320)} inset="p-[9%]" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        {isNew && <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[#b34700]">Adicionado agora</p>}
        <div className={`flex justify-between gap-4 ${full ? 'sm:gap-10' : ''}`}>
          <div className="min-w-0">
            <Link
              to={line.href}
              onClick={onNavigate}
              className={`link-underline font-medium leading-snug ${full ? 'text-base sm:font-display sm:text-xl sm:tracking-tight' : 'text-sm'}`}
            >
              {line.title}
            </Link>
            {line.variant && <p className="mt-1 text-xs text-ink/50 sm:text-sm">{line.variant}</p>}
            {full && line.quantity > 1 && (
              <p className="mt-1 text-xs tabular-nums text-ink/45">{formatPrice(line.price)} cada</p>
            )}
          </div>
          <RollingPrice value={line.price * line.quantity} className={`shrink-0 text-right ${full ? 'text-base sm:text-lg' : 'text-sm'}`} />
        </div>

        <div className={`flex items-center justify-between gap-4 ${full ? 'mt-auto pt-4' : 'mt-3'}`}>
          <QuantityStepper
            value={line.quantity}
            max={line.maxQuantity}
            label={line.title}
            onChange={(quantity) => updateQuantity(line.id, quantity)}
          />
          <button
            type="button"
            onClick={() => removeWithUndo(line.id)}
            className="link-underline text-xs text-ink/55 hover:text-ink sm:text-sm"
          >
            Remover
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartLineItem;
