import { motion } from 'framer-motion';
import { isWallet, maskMobile, paymentName, type PaymentMethodId } from '../../lib/checkout';
import { formatPrice } from '../../lib/format';
import { easeOutExpo } from '../../lib/motion';
import { PhoneIcon } from '../ui/Icons';

/** Mobile-money confirmation screen shown while the customer approves on the phone. */
const AwaitingConfirmation = ({ method, phone, amount }: { method: PaymentMethodId; phone: string; amount: number }) => {
  const wallet = isWallet(method);
  return (
    <motion.div
      className="rounded-[24px] bg-paper p-6 text-center sm:p-10"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: easeOutExpo }}
      role="status"
      aria-live="polite"
    >
      <div className="relative mx-auto grid h-20 w-20 place-items-center">
        <motion.span
          className="absolute inset-0 rounded-full bg-ink/10"
          animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
        />
        <span className="relative grid h-14 w-14 place-items-center rounded-full bg-ink text-paper">
          {wallet ? (
            <PhoneIcon className="h-6 w-6" />
          ) : (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-paper/30 border-t-paper" />
          )}
        </span>
      </div>
      <p className="type-heading mt-6">
        {wallet ? 'Confirme no seu telemóvel' : method === 'paypal' ? 'A ligar ao PayPal' : 'A processar o pagamento'}
      </p>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink/60">
        {wallet
          ? `Enviámos um pedido de ${formatPrice(amount)} para ${maskMobile(phone)}. Introduza o PIN ${paymentName(method)} para concluir`
          : 'Não feche esta página, demora apenas alguns segundos'}
      </p>
      <div className="mx-auto mt-6 h-1 max-w-xs overflow-hidden rounded-full bg-ink/10">
        <motion.span
          className="block h-full w-1/3 rounded-full bg-ink"
          animate={{ x: ['-100%', '300%'] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  );
};

export default AwaitingConfirmation;
