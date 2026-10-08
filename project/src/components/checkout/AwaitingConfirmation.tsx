import { motion } from 'framer-motion';
import { isWallet, maskMobile, paymentName, type PaymentMethodId } from '../../lib/checkout';
import { formatPrice } from '../../lib/format';
import { easeOutExpo } from '../../lib/motion';
import BrandLoader from '../ui/BrandLoader';

/** Shown while the payment is processed: the logo loader, and for mobile money, what to do on the phone. */
const AwaitingConfirmation = ({ method, phone, amount }: { method: PaymentMethodId; phone: string; amount: number }) => {
  const wallet = isWallet(method);
  return (
    <motion.div
      className="rounded-[24px] bg-paper px-6 py-10 text-center sm:px-10 sm:py-12"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: easeOutExpo }}
      role="status"
      aria-live="polite"
    >
      <BrandLoader size={22} progress timing="now" />
      <p className="type-heading mt-8">
        {wallet ? 'Confirme no seu telemóvel' : method === 'paypal' ? 'A ligar ao PayPal' : 'A processar o pagamento'}
      </p>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink/60">
        {wallet
          ? `Enviámos um pedido de ${formatPrice(amount)} para ${maskMobile(phone)}. Introduza o PIN ${paymentName(method)} para concluir`
          : 'Não feche esta página, demora apenas alguns segundos'}
      </p>
    </motion.div>
  );
};

export default AwaitingConfirmation;
