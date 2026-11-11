import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PAYMENT_OPTIONS, isWallet } from '../../../lib/checkout';
import { easeOutExpo } from '../../../lib/motion';
import DeliveryTruck from '../../checkout/DeliveryTruck';
import { StatusBar } from '../chat/ChatScreen';
import PaymentMark from './PaymentMarks';

type Phase = 'choose' | 'confirm' | 'sending';

// How long each part of the story stays on screen, in ms.
const DURATION: Record<Phase, number> = { choose: 3200, confirm: 2400, sending: 3200 };
const NEXT: Record<Phase, Phase> = { choose: 'confirm', confirm: 'sending', sending: 'choose' };

// What the customer is asked to do once they press "Pagar", as in the checkout.
const CONFIRM: Record<string, string> = {
  mpesa: 'Introduza o PIN M-Pesa no telemóvel',
  emola: 'Aprove o pedido na carteira Movitel',
  mkesh: 'Aprove o pedido na carteira Tmcel',
  card: 'A processar o pagamento com cartão',
  paypal: 'A ligar ao PayPal',
};

// Steps cross-fade in place, so the screen is never empty between them.
const fade = {
  initial: { opacity: 0, y: '3cqw' },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOutExpo, delay: 0.1 } },
  exit: { opacity: 0, y: '-2cqw', transition: { duration: 0.35 } },
};

/**
 * The checkout on a phone screen, for the sign-in page, played in a loop: a way to pay is chosen
 * (a different one each round, with its logo), the payment is confirmed, and the van sets off.
 */
const PaymentStoryScreen = () => {
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState<Phase>('choose');
  const [picked, setPicked] = useState(false);
  const method = PAYMENT_OPTIONS[round % PAYMENT_OPTIONS.length];
  const previous = PAYMENT_OPTIONS[(round + PAYMENT_OPTIONS.length - 1) % PAYMENT_OPTIONS.length];
  const selected = picked ? method : previous;

  useEffect(() => {
    // The highlight moves to this round's method a moment after the list appears.
    const pick = phase === 'choose' ? window.setTimeout(() => setPicked(true), 900) : undefined;
    const next = window.setTimeout(() => {
      if (phase === 'sending') {
        setRound((value) => value + 1);
        setPicked(false);
      }
      setPhase(NEXT[phase]);
    }, DURATION[phase]);
    return () => {
      window.clearTimeout(pick);
      window.clearTimeout(next);
    };
  }, [phase]);

  return (
    <div className="flex h-full flex-col bg-paper font-sans text-ink">
      <StatusBar />

      <div className="px-[5cqw] pt-[4cqw]">
        <p className="font-display text-[7.4cqw] font-medium leading-none tracking-tight">Finalizar compra</p>
      </div>

      {/* The phone being bought */}
      <div className="mx-[5cqw] mt-[5cqw] flex items-center gap-[3cqw] rounded-[4.4cqw] bg-white p-[3cqw]">
        <span className="stage grid h-[21cqw] w-[18cqw] shrink-0 place-items-center overflow-hidden rounded-[3cqw]">
          <img src="/images/produtos/iphone-17-pro-laranja-600.webp" alt="" className="stage-shadow h-[84%] object-contain" />
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block text-[3.9cqw] font-medium">iPhone 17 Pro</span>
          <span className="mt-[1cqw] block text-[3cqw] text-ink/50">256GB · Laranja cósmico</span>
        </span>
        <span className="text-[3.4cqw] font-medium tabular-nums">165 000 MT</span>
      </div>

      <div className="relative mt-[5cqw] flex min-h-0 flex-1 flex-col">
        <AnimatePresence initial={false}>
          {phase === 'choose' && (
            <motion.div key={`escolher-${round}`} className="absolute inset-x-0 top-0 px-[5cqw]" {...fade}>
              <p className="text-[2.8cqw] font-medium uppercase tracking-[0.14em] text-ink/45">Pagamento</p>
              <ul className="mt-[2.6cqw] space-y-[2.2cqw]">
                {PAYMENT_OPTIONS.map((option) => {
                  const active = option.id === selected.id;
                  return (
                    <li key={option.id} className="relative flex items-center gap-[3cqw] rounded-[3.6cqw] bg-white p-[2.8cqw]">
                      {active && (
                        <motion.span
                          layoutId="ecra-pagamento"
                          className="absolute inset-0 rounded-[3.6cqw] ring-[0.5cqw] ring-ink"
                          transition={{ duration: 0.5, ease: easeOutExpo }}
                        />
                      )}
                      <PaymentMark method={option.id} className="h-[10cqw] w-[10cqw]" />
                      <span className="min-w-0 flex-1 truncate text-[3.6cqw] font-medium">{option.name}</span>
                      <span
                        className={`grid h-[3.6cqw] w-[3.6cqw] place-items-center rounded-full border-[0.4cqw] ${active ? 'border-ink' : 'border-ink/20'}`}
                      >
                        {active && <span className="h-[1.8cqw] w-[1.8cqw] rounded-full bg-ink" />}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <motion.span
                className="mt-[4.4cqw] block rounded-full bg-ink py-[3.8cqw] text-center text-[3.6cqw] font-medium text-paper"
                // Pressed just before the confirmation takes over
                animate={{ scale: [1, 1, 0.95, 1] }}
                transition={{ duration: 0.5, delay: (DURATION.choose - 600) / 1000, times: [0, 0.2, 0.5, 1] }}
              >
                Pagar com {selected.id === 'card' ? 'cartão' : selected.name}
              </motion.span>
            </motion.div>
          )}

          {phase === 'confirm' && (
            <motion.div
              key={`confirmar-${round}`}
              className="absolute inset-0 flex flex-col items-center justify-center px-[7cqw] pb-[10cqw] text-center"
              {...fade}
            >
              <PaymentMark method={method.id} className="h-[24cqw] w-[24cqw] drop-shadow-[0_3cqw_5cqw_rgba(12,12,13,0.18)]" />
              <p className="mt-[7cqw] text-[5cqw] font-medium leading-tight">
                {isWallet(method.id) ? 'Confirme no seu telemóvel' : 'Quase pronto'}
              </p>
              <p className="mt-[2cqw] text-[3.4cqw] leading-snug text-ink/55">{CONFIRM[method.id]}</p>
              {/* The PIN going in, or a quiet progress line for card and PayPal */}
              {isWallet(method.id) ? (
                <span className="mt-[6cqw] flex gap-[3cqw]">
                  {[0, 1, 2, 3].map((dot) => (
                    <motion.span
                      key={dot}
                      className="h-[3.2cqw] w-[3.2cqw] rounded-full border-[0.45cqw] border-ink"
                      initial={{ backgroundColor: 'rgba(12,12,13,0)' }}
                      animate={{ backgroundColor: 'rgba(12,12,13,1)' }}
                      transition={{ delay: 0.5 + dot * 0.28, duration: 0.15 }}
                    />
                  ))}
                </span>
              ) : (
                <span className="mt-[6cqw] block h-[0.7cqw] w-[36cqw] overflow-hidden rounded-full bg-ink/10">
                  <motion.span
                    className="block h-full origin-left rounded-full bg-ink"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: (DURATION.confirm - 400) / 1000, ease: 'easeInOut' }}
                  />
                </span>
              )}
            </motion.div>
          )}

          {phase === 'sending' && (
            <motion.div
              key={`enviar-${round}`}
              className="absolute inset-0 flex flex-col items-center justify-center px-[6cqw] pb-[10cqw] text-center"
              {...fade}
            >
              <DeliveryTruck size="3.9cqw" />
              <p className="mt-[7cqw] text-[5cqw] font-medium leading-tight">Pagamento confirmado</p>
              <p className="mt-[2cqw] text-[3.4cqw] leading-snug text-ink/55">A enviar a sua encomenda para preparação</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <span className="mx-auto mb-[2.4cqw] block h-[1.3cqw] w-[34%] shrink-0 rounded-full bg-ink/80" aria-hidden="true" />
    </div>
  );
};

export default PaymentStoryScreen;
