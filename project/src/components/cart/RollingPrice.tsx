import { AnimatePresence, motion } from 'framer-motion';
import { formatPrice } from '../../lib/format';
import { easeOutExpo } from '../../lib/motion';

/** A price that rolls up or down when it changes, so totals visibly respond to the cart. */
const RollingPrice = ({ value, className = '' }: { value: number; className?: string }) => (
  <span className={`relative inline-flex overflow-hidden tabular-nums ${className}`}>
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={value}
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '-100%', opacity: 0 }}
        transition={{ duration: 0.45, ease: easeOutExpo }}
      >
        {formatPrice(value)}
      </motion.span>
    </AnimatePresence>
  </span>
);

export default RollingPrice;
