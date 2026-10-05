import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { STORE } from '../data/store';
import { PAYMENTS_LIVE, deliveryLine, formatOrderDate, orderWhatsappUrl, paymentName } from '../lib/checkout';
import { resolveImage } from '../lib/catalog';
import { formatPrice } from '../lib/format';
import { easeOutExpo } from '../lib/motion';
import { downloadReceiptPdf, receiptQrDataUrl } from '../lib/receipt';
import { ORDER_STEPS, useOrderStore, type Order } from '../stores/orderStore';
import { useUserStore } from '../stores/userStore';
import CheckoutProgress from '../components/checkout/CheckoutProgress';
import { WhatsAppIcon } from '../components/ui/Icons';
import ProductImage from '../components/product/ProductImage';

const Check = () => (
  <svg viewBox="0 0 52 52" className="h-16 w-16" aria-hidden="true">
    <motion.circle
      cx="26"
      cy="26"
      r="24"
      fill="none"
      stroke="#0C0C0D"
      strokeWidth="1.5"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.9, ease: easeOutExpo }}
    />
    <motion.path
      d="M16 27 l7 7 l13 -15"
      fill="none"
      stroke="#0C0C0D"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.55 }}
    />
  </svg>
);

/** Where the order is: confirmed, being prepared, on its way, delivered. */
const StatusTrack = ({ order }: { order: Order }) => {
  const current = ORDER_STEPS.findIndex((step) => step.id === order.status);
  const steps = order.delivery.method === 'levantamento' ? ORDER_STEPS.map((step) => (step.id === 'enviada' ? { ...step, label: 'Pronta a levantar' } : step.id === 'entregue' ? { ...step, label: 'Levantada' } : step)) : ORDER_STEPS;
  return (
    <ol className="grid grid-cols-4 gap-2">
      {steps.map((step, index) => {
        const reached = index <= current;
        return (
          <li key={step.id}>
            <span className="relative block h-1 overflow-hidden rounded-full bg-ink/10">
              <motion.span
                className="absolute inset-0 origin-left rounded-full bg-ink"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: reached ? 1 : 0 }}
                transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.6 + index * 0.15 }}
              />
            </span>
            <span className={`mt-3 block text-xs sm:text-sm ${reached ? 'font-medium text-ink' : 'text-ink/45'}`}>{step.label}</span>
          </li>
        );
      })}
    </ol>
  );
};

/** The receipt as shown on screen; also what gets printed. */
const ReceiptCard = ({ order }: { order: Order }) => {
  const [qr, setQr] = useState<string>();
  useEffect(() => {
    receiptQrDataUrl(order).then(setQr).catch(() => setQr(undefined));
  }, [order]);

  const rows: [string, string][] = [
    ['Data', formatOrderDate(order.createdAt)],
    ['Pagamento', [paymentName(order.payment.method), order.payment.detail].filter(Boolean).join(', ')],
    ['Cliente', `${order.customer.name}, ${order.customer.phone}`],
    ['Entrega', [deliveryLine(order), order.delivery.reference].filter(Boolean).join('. ')],
  ];

  return (
    <article className="rounded-[28px] bg-white p-6 sm:p-10 print:rounded-none print:p-0" aria-label={`Recibo da encomenda ${order.number}`}>
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
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-paper">{qr && <img src={qr} alt="Código QR com o número e o total da encomenda" className="h-full w-full" />}</div>
        <div className="text-sm">
          <p className="font-medium">Obrigado pela sua compra</p>
          <p className="mt-1 text-ink/55">Produtos originais com garantia oficial do fabricante</p>
          {!PAYMENTS_LIVE && <p className="mt-1 text-xs text-ink/40">Pagamento simulado em modo de demonstração</p>}
        </div>
      </footer>
    </article>
  );
};

/** /encomenda/:number */
const OrderConfirmation = () => {
  const { number } = useParams();
  const order = useOrderStore((state) => state.orders.find((item) => item.number === number));
  const currentUser = useUserStore((state) => state.currentUser);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    document.title = order ? `Encomenda ${order.number} | Rhulany Tech` : 'Encomenda | Rhulany Tech';
    return () => {
      document.title = 'Rhulany Tech | Tecnologia original em Maputo';
    };
  }, [order]);

  if (!order) {
    return (
      <div className="container-site py-24 text-center lg:py-32">
        <h1 className="type-display">Não encontrámos esta encomenda</h1>
        <p className="type-lead mx-auto mt-4 max-w-md text-ink/60">
          As encomendas ficam guardadas no dispositivo onde foram feitas. Se precisar de ajuda, fale connosco com o número da encomenda
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/contacto" className="inline-flex h-12 items-center rounded-full bg-ink px-7 text-sm font-medium text-paper">
            Falar connosco
          </Link>
          <Link to="/loja" className="inline-flex h-12 items-center rounded-full border border-ink/15 px-7 text-sm font-medium">
            Ir para a loja
          </Link>
        </div>
      </div>
    );
  }

  const download = async () => {
    setDownloading(true);
    try {
      await downloadReceiptPdf(order);
    } catch {
      toast('Não foi possível gerar o PDF, tente imprimir o recibo');
    } finally {
      setDownloading(false);
    }
  };

  const firstName = order.customer.name.split(' ')[0];

  return (
    <div className="pb-28 lg:pb-36 print:pb-0">
      <header className="container-site pt-8 lg:pt-12 print:hidden">
        <div className="flex justify-end">
          <CheckoutProgress current={4} />
        </div>
        <div className="mx-auto mt-10 max-w-2xl text-center lg:mt-14">
          <div className="flex justify-center">
            <Check />
          </div>
          <motion.h1
            className="type-display mt-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.3 }}
          >
            Obrigado, {firstName}
          </motion.h1>
          <motion.p
            className="type-lead mt-4 text-ink/60"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.4 }}
          >
            A encomenda <span className="font-medium text-ink">{order.number}</span> está confirmada.{' '}
            {order.delivery.method === 'levantamento'
              ? 'Contactamos consigo quando estiver pronta a levantar'
              : 'Contactamos consigo para combinar a entrega'}
          </motion.p>
        </div>
        <motion.div
          className="mx-auto mt-10 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <StatusTrack order={order} />
        </motion.div>
      </header>

      <div className="container-site mt-14 grid gap-8 lg:mt-20 lg:grid-cols-12 lg:gap-10 print:mt-0 print:block">
        <motion.div
          className="lg:col-span-7"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easeOutExpo, delay: 0.6 }}
        >
          <ReceiptCard order={order} />
        </motion.div>

        <motion.aside
          className="lg:col-span-5 print:hidden"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easeOutExpo, delay: 0.7 }}
        >
          <div className="space-y-3 lg:sticky lg:top-28">
            <div className="rounded-[28px] bg-white p-6 sm:p-8">
              <h2 className="type-heading">O seu recibo</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">Guarde-o ou envie-o para a loja, com todos os dados da encomenda</p>
              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={download}
                  disabled={downloading}
                  className="h-14 w-full rounded-full bg-ink text-sm font-medium text-paper transition-colors hover:bg-ink-soft disabled:cursor-progress disabled:opacity-80"
                >
                  {downloading ? 'A preparar o PDF' : 'Descarregar recibo em PDF'}
                </button>
                <a
                  href={orderWhatsappUrl(order)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-paper text-sm font-medium transition-colors hover:bg-ink hover:text-paper"
                >
                  <WhatsAppIcon className="h-[18px] w-[18px]" />
                  Enviar à loja pelo WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="h-12 w-full rounded-full text-sm font-medium text-ink/65 transition-colors hover:text-ink"
                >
                  Imprimir
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 px-2 pt-2 text-sm">
              <Link to="/loja" className="link-underline font-medium">
                Continuar a comprar
              </Link>
              {currentUser && (
                <Link to="/conta" className="link-underline text-ink/60 hover:text-ink">
                  Ver as minhas encomendas
                </Link>
              )}
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
};

export default OrderConfirmation;
