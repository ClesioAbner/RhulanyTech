import type { RefObject } from 'react';
import { AnimatePresence, motion, type MotionValue } from 'framer-motion';
import { easeOutExpo } from '../../lib/motion';
import { PAYMENT_METHODS } from '../payments/methods';
import PhoneScreen from '../payments/PhoneScreen';
import Phone3D from '../payments/Phone3D';
import SectionHeading from '../ui/SectionHeading';

const ROW_HEIGHT = 64; // px — height of one entry in the method wheel

interface PaymentsProps {
  sectionRef: RefObject<HTMLElement>;
  stickyRef: RefObject<HTMLDivElement>;
  phoneTargetRef: RefObject<HTMLDivElement>;
  activeIndex: number;
  hintOpacity: MotionValue<number>;
  listOpacity: MotionValue<number>;
  listY: MotionValue<number>;
  mobilePhone: {
    rotateX: MotionValue<number>;
    rotateY: MotionValue<number>;
    rotateZ: MotionValue<number>;
  };
}

const Payments = ({
  sectionRef,
  stickyRef,
  phoneTargetRef,
  activeIndex,
  hintOpacity,
  listOpacity,
  listY,
  mobilePhone,
}: PaymentsProps) => {
  const current = Math.max(activeIndex, 0);
  const method = PAYMENT_METHODS[current];

  return (
    <section id="pagamentos" ref={sectionRef} className="relative h-[460vh] border-t border-ink/10" aria-labelledby="pagamentos-titulo">
      <ul className="sr-only">
        {PAYMENT_METHODS.map((item) => (
          <li key={item.name}>
            {item.name}: {item.body}
          </li>
        ))}
      </ul>

      <div ref={stickyRef} className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pt-24 lg:pt-28">
        <div className="container-site">
          <SectionHeading id="pagamentos-titulo" index="03" eyebrow="Pagamentos" title="Pague como já paga todos os dias" />
        </div>

        <div
          aria-hidden="true"
          className="container-site grid min-h-0 flex-1 grid-rows-[1fr_auto] items-center gap-6 pb-8 lg:grid-cols-12 lg:grid-rows-1 lg:pb-0"
        >
          {/* Stage. Desktop: an empty target where the falling phone lands. Mobile: its own phone. */}
          <div className="relative flex h-full items-center justify-center [perspective:1600px] lg:col-span-5">
            <div
              ref={phoneTargetRef}
              className="hidden h-[calc(var(--phone-w)*2.1)] w-[var(--phone-w)] [--phone-w:clamp(190px,26vh,250px)] lg:block"
            />
            <div className="relative [--phone-w:clamp(160px,23vh,250px)] lg:hidden">
              <Phone3D rotateX={mobilePhone.rotateX} rotateY={mobilePhone.rotateY} rotateZ={mobilePhone.rotateZ}>
                <PhoneScreen activeIndex={activeIndex} />
              </Phone3D>
            </div>
            <motion.p className="absolute bottom-[4%] text-center text-sm text-ink/50" style={{ opacity: hintOpacity }}>
              Continue a deslizar
            </motion.p>
          </div>

          {/* Method wheel */}
          <motion.div style={{ opacity: listOpacity, y: listY }} className="lg:col-span-6 lg:col-start-7">
            <div className="flex items-center gap-4 text-xs tabular-nums text-ink/45">
              <span>{String(current + 1).padStart(2, '0')}</span>
              <span className="h-px w-16 bg-ink/15">
                <motion.span
                  className="block h-full origin-left bg-ink"
                  animate={{ scaleX: (current + 1) / PAYMENT_METHODS.length }}
                  transition={{ duration: 0.6, ease: easeOutExpo }}
                />
              </span>
              <span>{String(PAYMENT_METHODS.length).padStart(2, '0')}</span>
            </div>

            <div
              className="relative mt-5 hidden overflow-hidden lg:block"
              style={{ height: ROW_HEIGHT * 3, maskImage: 'linear-gradient(to bottom, black 55%, transparent)' }}
            >
              <motion.ol animate={{ y: -current * ROW_HEIGHT }} transition={{ duration: 0.7, ease: easeOutExpo }}>
                {PAYMENT_METHODS.map((item, index) => {
                  const distance = Math.abs(index - current);
                  return (
                    <motion.li
                      key={item.name}
                      className="flex items-center font-display font-medium tracking-tight"
                      style={{ height: ROW_HEIGHT }}
                      animate={{
                        opacity: distance === 0 ? 1 : distance === 1 ? 0.3 : 0.12,
                        fontSize: distance === 0 ? '44px' : '30px',
                      }}
                      transition={{ duration: 0.6, ease: easeOutExpo }}
                    >
                      {item.name}
                    </motion.li>
                  );
                })}
              </motion.ol>
            </div>

            <div className="relative mt-4 min-h-[9.5rem] lg:mt-2">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, ease: easeOutExpo }}
                >
                  <p className="font-display text-2xl font-medium tracking-tight lg:hidden">{method.name}</p>
                  <h3 className="mt-1 text-lg font-medium lg:mt-0">{method.title}</h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-ink/60 sm:text-base">{method.body}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Payments;
