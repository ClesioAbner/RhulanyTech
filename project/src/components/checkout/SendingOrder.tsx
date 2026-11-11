import { motion } from 'framer-motion';
import { easeOutExpo } from '../../lib/motion';
import DeliveryTruck from './DeliveryTruck';

/** Once the payment is confirmed, the van sets off while the order is sent, before the receipt opens. */
const SendingOrder = ({ pickup }: { pickup: boolean }) => (
  <motion.div
    className="rounded-[24px] bg-paper px-6 py-10 text-center sm:px-10 sm:py-12"
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, ease: easeOutExpo }}
    role="status"
    aria-live="polite"
  >
    <DeliveryTruck />
    <p className="type-heading mt-8">Pagamento confirmado</p>
    <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink/60">
      {pickup ? 'A reservar a sua encomenda na loja' : 'A enviar a sua encomenda para preparação'}
    </p>
  </motion.div>
);

export default SendingOrder;
