import { useEffect, useState } from 'react';
import { STORE } from '../../data/store';
import { PAYMENTS_LIVE, deliveryLine, formatOrderDate, paymentName } from '../../lib/checkout';
import { resolveImage } from '../../lib/catalog';
import { formatPrice } from '../../lib/format';
import { receiptQrDataUrl } from '../../lib/receipt';
import type { Order } from '../../stores/orderStore';
import ProductImage from '../product/ProductImage';

/** The receipt as shown on screen; also what gets printed. */
const ReceiptCard = ({ order }: { order: Order }) => {
  const [qr, setQr] = useState<string>();
  useEffect(() => {
    receiptQrDataUrl(order)
      .then(setQr)
      .catch(() => setQr(undefined));
  }, [order]);

  const rows: [string, string][] = [
    ['Data', formatOrderDate(order.createdAt)],
    ['Pagamento', [paymentName(order.payment.method), order.payment.detail].filter(Boolean).join(', ')],
    ['Cliente', `${order.customer.name}, ${order.customer.phone}`],
    ['Entrega', [deliveryLine(order), order.delivery.reference].filter(Boolean).join('. ')],
  ];

  return (
    <article
      className="rounded-[28px] bg-white p-6 sm:p-10 print:rounded-none print:p-0"
      aria-label={`Recibo da encomenda ${order.number}`}
    >
      <header className="flex items-start justify-between gap-6">
        <div>
          <p className="font-display text-xl font-semibold tracking-tight">
            Rhulany<span className="text-ink/40">Tech</span>
          </p>
          <p className="mt-1 text-xs text-ink/45">{STORE.address}</p>
        </div>
        <div className="text-right">
          <p className="eyebrow text-ink/45">Recibo</p>
          <p className="mt-1 font-display text-lg font-medium tabular-nums tracking-tight">{order.number}</p>
        </div>
      </header>

      <dl className="mt-8 grid gap-x-8 gap-y-5 rounded-2xl bg-paper p-5 text-sm sm:grid-cols-2 print:bg-transparent print:p-0">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs text-ink/45">{label}</dt>
            <dd className="mt-1 leading-snug">{value}</dd>
          </div>
        ))}
      </dl>

      <ul className="mt-8 space-y-4">
        {order.lines.map((line) => (
          <li key={line.id} className="flex items-center gap-4">
            <span className="stage relative h-14 w-14 shrink-0 overflow-hidden rounded-xl print:hidden">
              <ProductImage src={resolveImage(line.image, 200)} inset="p-[9%]" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{line.title}</span>
              <span className="block truncate text-xs text-ink/50">
                {[line.variant, `${line.quantity} × ${formatPrice(line.price)}`].filter(Boolean).join(', ')}
              </span>
            </span>
            <span className="shrink-0 text-sm tabular-nums">{formatPrice(line.price * line.quantity)}</span>
          </li>
        ))}
      </ul>

      <dl className="mt-8 space-y-2.5 rounded-2xl bg-paper p-5 text-sm print:bg-transparent print:p-0">
        <div className="flex justify-between gap-4">
          <dt className="text-ink/60">Subtotal</dt>
          <dd className="tabular-nums">{formatPrice(order.subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink/60">Entrega</dt>
          <dd>{order.delivery.method === 'levantamento' ? 'Grátis' : 'A confirmar'}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 pt-2">
          <dt className="text-base font-medium">Total pago</dt>
          <dd className="text-xl font-medium tabular-nums">{formatPrice(order.subtotal)}</dd>
        </div>
      </dl>

      <footer className="mt-8 flex items-center gap-5">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-paper">
          {qr && <img src={qr} alt="Código QR com o número e o total da encomenda" className="h-full w-full" />}
        </div>
        <div className="text-sm">
          <p className="font-medium">Obrigado pela sua compra</p>
          <p className="mt-1 text-ink/55">Produtos originais com garantia oficial do fabricante</p>
          {!PAYMENTS_LIVE && <p className="mt-1 text-xs text-ink/40">Pagamento simulado em modo de demonstração</p>}
        </div>
      </footer>
    </article>
  );
};

export default ReceiptCard;
