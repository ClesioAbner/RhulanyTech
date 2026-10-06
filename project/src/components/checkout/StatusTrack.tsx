import { motion } from 'framer-motion';
import { easeOutExpo } from '../../lib/motion';
import { ORDER_STEPS, type Order } from '../../stores/orderStore';

/** Where the order is: confirmed, being prepared, on its way, delivered. */
const StatusTrack = ({ order }: { order: Order }) => {
  const current = ORDER_STEPS.findIndex((step) => step.id === order.status);
  const steps =
    order.delivery.method === 'levantamento'
      ? ORDER_STEPS.map((step) =>
          step.id === 'enviada'
            ? { ...step, label: 'Pronta a levantar' }
            : step.id === 'entregue'
              ? { ...step, label: 'Levantada' }
              : step,
        )
      : ORDER_STEPS;
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
            <span className={`mt-3 block text-xs sm:text-sm ${reached ? 'font-medium text-ink' : 'text-ink/45'}`}>
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
};

export default StatusTrack;
