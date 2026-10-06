import { motion } from 'framer-motion';
import { easeOutExpo } from '../../lib/motion';

const STEPS = ['Carrinho', 'Dados', 'Pagamento', 'Confirmação'];

/** Where the customer is between cart and confirmation; the line fills as they move forward. */
const CheckoutProgress = ({ current }: { current: number }) => (
  <ol className="flex items-center gap-2 text-xs sm:gap-3 sm:text-sm" aria-label="Passos da compra">
    {STEPS.map((step, index) => {
      const done = index < current;
      const active = index === current;
      return (
        <li key={step} className="flex items-center gap-2 sm:gap-3" aria-current={active ? 'step' : undefined}>
          <span className="flex items-center gap-2">
            <span
              className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-medium tabular-nums transition-colors duration-500 ${
                done || active ? 'bg-ink text-paper' : 'bg-ink/[0.07] text-ink/45'
              }`}
            >
              {done ? (
                <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
                  <path
                    d="M2.5 6.2l2.2 2.2 4.8-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                index + 1
              )}
            </span>
            <span
              className={`${active ? 'font-medium text-ink' : done ? 'text-ink/70' : 'text-ink/40'} ${active ? '' : 'max-sm:hidden'}`}
            >
              {step}
            </span>
          </span>
          {index < STEPS.length - 1 && (
            <span className="relative block h-px w-6 overflow-hidden bg-ink/10 sm:w-12" aria-hidden="true">
              <motion.span
                className="absolute inset-0 origin-left bg-ink"
                initial={false}
                animate={{ scaleX: done ? 1 : 0 }}
                transition={{ duration: 0.6, ease: easeOutExpo }}
              />
            </span>
          )}
        </li>
      );
    })}
  </ol>
);

export default CheckoutProgress;
