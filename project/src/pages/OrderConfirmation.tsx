import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { orderWhatsappUrl } from '../lib/checkout';
import { easeOutExpo } from '../lib/motion';
import { downloadReceiptPdf } from '../lib/receipt';
import { useOrderStore } from '../stores/orderStore';
import { useUserStore } from '../stores/userStore';
import CheckoutProgress from '../components/checkout/CheckoutProgress';
import Check from '../components/checkout/CheckMark';
import StatusTrack from '../components/checkout/StatusTrack';
import ReceiptCard from '../components/checkout/ReceiptCard';
import { WhatsAppIcon } from '../components/ui/Icons';

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
          As encomendas ficam guardadas no dispositivo onde foram feitas. Se precisar de ajuda, fale connosco com o número da
          encomenda
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
              <p className="mt-2 text-sm leading-relaxed text-ink/60">
                Guarde-o ou envie-o para a loja, com todos os dados da encomenda
              </p>
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
