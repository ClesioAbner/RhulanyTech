import { motion } from 'framer-motion';
import { easeOutExpo } from '../../../lib/motion';
import { StatusBar } from '../chat/ChatScreen';

// The order's progress: confirmed, being prepared, on its way, delivered.
const STEPS = 4;
const REACHED = 3;

const rise = (index: number) => ({
  initial: { opacity: 0, y: '3cqw' },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: easeOutExpo, delay: 0.15 + index * 0.08 },
});

/** "A minha conta" on a phone screen, for the sign-in page: one order on its way and one delivered. */
const AccountScreen = () => (
  <div className="flex h-full flex-col bg-paper font-sans text-ink">
    <StatusBar />

    <div className="flex items-center justify-between px-[5cqw] pt-[2cqw]">
      <span className="font-display text-[4.6cqw] font-semibold tracking-tight">
        Rhulany<span className="text-ink/40">Tech</span>
      </span>
      <span className="grid h-[8.4cqw] w-[8.4cqw] place-items-center rounded-full bg-ink text-[3.4cqw] font-semibold text-paper">
        A
      </span>
    </div>

    <motion.div className="px-[5cqw] pt-[7cqw]" {...rise(0)}>
      <p className="text-[2.7cqw] font-medium uppercase tracking-[0.16em] text-ink/45">A minha conta</p>
      <p className="mt-[1.6cqw] font-display text-[8.4cqw] font-medium leading-none tracking-tight">Olá, Ana</p>
    </motion.div>

    <motion.div
      className="mx-[5cqw] mt-[5cqw] flex w-fit gap-[1cqw] rounded-full bg-white p-[1cqw] text-[3.1cqw] font-medium"
      {...rise(1)}
    >
      <span className="rounded-full bg-ink px-[3.6cqw] py-[1.8cqw] text-paper">Encomendas</span>
      <span className="px-[3.6cqw] py-[1.8cqw] text-ink/55">Dados e morada</span>
    </motion.div>

    {/* The latest order, on its way */}
    <motion.div className="mx-[5cqw] mt-[4cqw] rounded-[4.4cqw] bg-white p-[4cqw]" {...rise(2)}>
      <div className="flex items-center gap-[3cqw]">
        <span className="stage grid h-[15cqw] w-[15cqw] shrink-0 place-items-center overflow-hidden rounded-[3cqw]">
          <img src="/images/produtos/iphone-17-pro-laranja-600.webp" alt="" className="stage-shadow h-[80%] object-contain" />
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block text-[3.7cqw] font-medium">iPhone 17 Pro</span>
          <span className="mt-[0.8cqw] block text-[2.9cqw] text-ink/50">256GB · Laranja cósmico</span>
        </span>
        <span className="text-[3.3cqw] font-medium tabular-nums">165 000 MT</span>
      </div>
      <div className="mt-[4cqw] flex items-baseline justify-between text-[2.9cqw]">
        <span className="tabular-nums text-ink/45">RT261014-4821</span>
        <span className="font-medium">A caminho</span>
      </div>
      <div className="mt-[2cqw] grid grid-cols-4 gap-[1.2cqw]">
        {Array.from({ length: STEPS }, (_, step) => (
          <span key={step} className="h-[1cqw] overflow-hidden rounded-full bg-ink/10">
            {step < REACHED && (
              <motion.span
                className="block h-full origin-left rounded-full bg-ink"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.6 + step * 0.25 }}
              />
            )}
          </span>
        ))}
      </div>
      <p className="mt-[2.4cqw] text-[2.9cqw] text-ink/50">Entrega em Sommerschield, Maputo</p>
    </motion.div>

    {/* An earlier one, delivered */}
    <motion.div className="mx-[5cqw] mt-[3cqw] flex items-center gap-[3cqw] rounded-[4.4cqw] bg-white p-[4cqw]" {...rise(3)}>
      <span className="stage grid h-[12cqw] w-[12cqw] shrink-0 place-items-center overflow-hidden rounded-[3cqw]">
        <img src="/images/produtos/airpods-pro-2-geracao-600.webp" alt="" className="stage-shadow h-[78%] object-contain" />
      </span>
      <span className="min-w-0 flex-1 leading-tight">
        <span className="block truncate text-[3.4cqw] font-medium">AirPods Pro (2.ª geração)</span>
        <span className="mt-[0.8cqw] block text-[2.8cqw] text-ink/50">Entregue a 2 de outubro</span>
      </span>
      <span className="text-[3cqw] font-medium text-[#0a84ff]">Recibo</span>
    </motion.div>

    {/* The delivery details kept for next time */}
    <motion.div className="mx-[5cqw] mt-[3cqw] rounded-[4.4cqw] bg-white p-[4cqw]" {...rise(4)}>
      <p className="text-[2.7cqw] font-medium uppercase tracking-[0.14em] text-ink/45">Morada de entrega</p>
      <p className="mt-[2cqw] text-[3.3cqw] font-medium">Av. Julius Nyerere, 1234</p>
      <p className="mt-[0.8cqw] text-[3cqw] text-ink/55">Sommerschield, Maputo · 84 123 4567</p>
    </motion.div>

    <span className="mx-auto mb-[2.4cqw] mt-auto block h-[1.3cqw] w-[34%] rounded-full bg-ink/80" aria-hidden="true" />
  </div>
);

export default AccountScreen;
