import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { resolveImage } from '../../lib/catalog';
import { formatPrice } from '../../lib/format';
import { easeOutExpo } from '../../lib/motion';
import { itemCountLabel } from '../../lib/cart';
import RollingPrice from '../cart/RollingPrice';
import ProductImage from '../product/ProductImage';

interface SummaryLine {
  id: string;
  title: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderSummaryProps {
  lines: SummaryLine[];
  subtotal: number;
  /** What the delivery row says, e.g. "Grátis" or "A confirmar". */
  delivery: string;
  editable?: boolean;
}

const Lines = ({ lines }: { lines: SummaryLine[] }) => (
  <ul className="space-y-4">
    {lines.map((line) => (
      <li key={line.id} className="flex items-center gap-4">
        <span className="stage relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl">
          <ProductImage src={resolveImage(line.image, 200)} inset="p-[9%]" />
          {line.quantity > 1 && (
            <span className="absolute right-1 top-1 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-ink px-1 text-[10px] font-medium tabular-nums text-paper">
              {line.quantity}
            </span>
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">{line.title}</span>
          {line.variant && <span className="block truncate text-xs text-ink/50">{line.variant}</span>}
        </span>
        <span className="shrink-0 text-sm tabular-nums">{formatPrice(line.price * line.quantity)}</span>
      </li>
    ))}
  </ul>
);

/** Order summary: lines, subtotal, delivery and total. Collapses behind a bar on phones. */
const OrderSummary = ({ lines, subtotal, delivery, editable = true }: OrderSummaryProps) => {
  const [open, setOpen] = useState(false);
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);

  const totals = (
    <dl className="space-y-2.5 text-sm">
      <div className="flex justify-between gap-4">
        <dt className="text-ink/60">Subtotal, {itemCountLabel(count)}</dt>
        <dd className="tabular-nums">
          <RollingPrice value={subtotal} />
        </dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt className="text-ink/60">Entrega</dt>
        <dd className="text-ink/70">{delivery}</dd>
      </div>
      <div className="flex items-baseline justify-between gap-4 pt-3">
        <dt className="text-base font-medium">Total</dt>
        <dd className="text-xl font-medium">
          <RollingPrice value={subtotal} />
        </dd>
      </div>
    </dl>
  );

  return (
    <div className="rounded-[28px] bg-white p-6 sm:p-7">
      {/* Phones: a bar that opens the full summary */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 lg:hidden"
      >
        <span className="text-sm font-medium">{open ? 'Ocultar resumo' : 'Ver resumo da encomenda'}</span>
        <span className="text-base font-medium tabular-nums">{formatPrice(subtotal)}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="overflow-hidden lg:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: easeOutExpo }}
          >
            <div className="pt-6">
              <Lines lines={lines} />
              <div className="mt-6">{totals}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden lg:block">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="type-heading">Resumo</h2>
          {editable && (
            <Link to="/cart" className="link-underline text-sm text-ink/60 hover:text-ink">
              Alterar
            </Link>
          )}
        </div>
        <div className="mt-6">
          <Lines lines={lines} />
        </div>
        <div className="mt-6 rounded-2xl bg-paper p-5">{totals}</div>
      </div>
    </div>
  );
};

export default OrderSummary;
