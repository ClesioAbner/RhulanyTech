import { motion } from 'framer-motion';
import { easeOutExpo } from '../../../lib/motion';
import { StatusBar } from '../chat/ChatScreen';

const rise = (index: number) => ({
  initial: { opacity: 0, y: '3cqw' },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: easeOutExpo, delay: 0.15 + index * 0.08 },
});

const Check = () => (
  <svg viewBox="0 0 16 16" className="h-[3.2cqw] w-[3.2cqw] shrink-0" aria-hidden="true">
    <circle cx="8" cy="8" r="8" fill="#0C0C0D" />
    <path
      d="M4.6 8.2l2.2 2.2 4.6-4.8"
      fill="none"
      stroke="#F5F5F7"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Checkout on a phone screen, for the sign-in page: with an account, address and payment come filled in. */
const SavedCheckoutScreen = () => (
  <div className="flex h-full flex-col bg-paper font-sans text-ink">
    <StatusBar />

    <motion.div className="px-[5cqw] pt-[4cqw]" {...rise(0)}>
      <p className="font-display text-[7cqw] font-medium leading-none tracking-tight">Finalizar compra</p>
      <div className="mt-[3.4cqw] flex items-center gap-[1.6cqw] text-[2.8cqw] font-medium">
        <Check />
        <span>Contacto</span>
        <span className="h-px w-[4cqw] bg-ink/20" />
        <Check />
        <span>Entrega</span>
        <span className="h-px w-[4cqw] bg-ink/20" />
        <span className="grid h-[3.2cqw] w-[3.2cqw] place-items-center rounded-full border border-ink/30 text-[2cqw]">3</span>
        <span className="text-ink/50">Pagamento</span>
      </div>
    </motion.div>

    <motion.div className="mx-[5cqw] mt-[5cqw] rounded-[4.4cqw] bg-white p-[4cqw]" {...rise(1)}>
      <p className="text-[2.7cqw] font-medium uppercase tracking-[0.14em] text-ink/45">Entrega ao domicílio</p>
      <p className="mt-[2.4cqw] text-[3.5cqw] font-medium">Ana Machava · 84 123 4567</p>
      <p className="mt-[1cqw] text-[3.2cqw] leading-snug text-ink/60">Av. Julius Nyerere, 1234, Sommerschield, Maputo</p>
      <p className="mt-[2.6cqw] text-[2.8cqw] text-ink/45">Preenchido com os dados da sua conta</p>
    </motion.div>

    <motion.div className="mx-[5cqw] mt-[3cqw] flex items-center gap-[3cqw] rounded-[4.4cqw] bg-white p-[4cqw]" {...rise(2)}>
      <span className="grid h-[9cqw] w-[9cqw] shrink-0 place-items-center rounded-[2.4cqw] bg-[#E60000] text-[3.6cqw] font-bold text-white">
        M
      </span>
      <span className="min-w-0 flex-1 leading-tight">
        <span className="block text-[3.5cqw] font-medium">M-Pesa</span>
        <span className="mt-[0.8cqw] block text-[2.9cqw] tabular-nums text-ink/50">84 ••• 4567</span>
      </span>
      <Check />
    </motion.div>

    <motion.div className="mx-[5cqw] mt-[3cqw] rounded-[4.4cqw] bg-white p-[4cqw] text-[3.2cqw]" {...rise(3)}>
      <div className="flex justify-between">
        <span className="text-ink/60">iPhone 17 Pro · 256GB</span>
        <span className="tabular-nums">165 000 MT</span>
      </div>
      <div className="mt-[2.4cqw] flex justify-between border-t border-ink/[0.08] pt-[2.4cqw] font-medium">
        <span>Total</span>
        <span className="tabular-nums">165 000 MT</span>
      </div>
    </motion.div>

    <motion.span
      className="relative mx-[5cqw] mt-[4cqw] block overflow-hidden rounded-full bg-ink py-[3.6cqw] text-center text-[3.5cqw] font-medium text-paper"
      {...rise(4)}
    >
      Pagar 165 000 MT
      {/* A slow sheen across the button, as if it were about to be pressed */}
      <motion.span
        aria-hidden="true"
        className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent"
        initial={{ x: '-120%' }}
        animate={{ x: '360%' }}
        transition={{ duration: 2.4, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1.6, delay: 1 }}
      />
    </motion.span>
    <span className="mx-auto mb-[2.4cqw] mt-auto block h-[1.3cqw] w-[34%] rounded-full bg-ink/80" aria-hidden="true" />
  </div>
);

export default SavedCheckoutScreen;
