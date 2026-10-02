import { AnimatePresence, motion } from 'framer-motion';
import { easeOutExpo } from '../../lib/motion';

interface QuantityStepperProps {
  value: number;
  max?: number;
  label: string;
  onChange: (value: number) => void;
}

const stepButton =
  'grid h-full w-9 place-items-center text-base text-ink/70 transition-colors hover:text-ink disabled:cursor-not-allowed disabled:text-ink/20';

/** Compact − n + control; the number rolls in the direction of the change. */
const QuantityStepper = ({ value, max = 99, label, onChange }: QuantityStepperProps) => (
  <div role="group" aria-label={`Quantidade de ${label}`} className="inline-flex h-9 items-center rounded-full border border-ink/[0.12]">
    <button
      type="button"
      onClick={() => onChange(value - 1)}
      disabled={value <= 1}
      aria-label="Diminuir quantidade"
      className={stepButton}
    >
      −
    </button>
    <span className="relative grid w-6 place-items-center overflow-hidden text-sm tabular-nums" aria-live="polite">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ duration: 0.3, ease: easeOutExpo }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
    <button
      type="button"
      onClick={() => onChange(value + 1)}
      disabled={value >= max}
      aria-label="Aumentar quantidade"
      className={stepButton}
    >
      +
    </button>
  </div>
);

export default QuantityStepper;
