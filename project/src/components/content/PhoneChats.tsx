import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { easeOutExpo } from '../../lib/motion';
import PhotoScreen, { type ScreenGeometry } from './PhotoScreen';

// Screens measured on the supplied photos (public/images/blog).
const SOFA: ScreenGeometry = { width: 1200, height: 1500, cx: 681.5, cy: 565, w: 213, h: 453, rotate: 5.4 };
const HAND: ScreenGeometry = { width: 1400, height: 902, cx: 950, cy: 430, w: 294, h: 624 };

const bubbleIn = {
  initial: { opacity: 0, y: 6, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.45, ease: easeOutExpo },
};

const ChatHeader = () => (
  <div className="flex items-center gap-[3cqw]">
    <span className="grid h-[11cqw] w-[11cqw] shrink-0 place-items-center rounded-full bg-ink text-[3.8cqw] font-semibold text-paper">RT</span>
    <span className="leading-tight">
      <span className="block text-[4.8cqw] font-semibold text-ink">Rhulany Tech</span>
      <span className="block text-[3.4cqw] text-ink/45">WhatsApp</span>
    </span>
  </div>
);

const Bubble = ({ from, children }: { from: 'cliente' | 'loja'; children: ReactNode }) => (
  <motion.p
    {...bubbleIn}
    className={`max-w-[78%] rounded-[3.5cqw] px-[3.6cqw] py-[2.6cqw] text-[4.3cqw] leading-[1.35] ${
      from === 'cliente' ? 'ml-auto rounded-br-[1cqw] bg-[#d9fdd3] text-ink' : 'rounded-bl-[1cqw] bg-[#f0f0f2] text-ink'
    }`}
  >
    {children}
  </motion.p>
);

const Typing = () => (
  <motion.span
    {...bubbleIn}
    exit={{ opacity: 0, transition: { duration: 0.15 } }}
    className="flex w-fit items-center gap-[1.4cqw] rounded-[3.5cqw] rounded-bl-[1cqw] bg-[#f0f0f2] px-[3.6cqw] py-[3.2cqw]"
    aria-hidden="true"
  >
    {[0, 1, 2].map((dot) => (
      <motion.span
        key={dot}
        className="block h-[1.6cqw] w-[1.6cqw] rounded-full bg-ink/40"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1, repeat: Infinity, delay: dot * 0.18 }}
      />
    ))}
  </motion.span>
);

/** FAQ: the phone on the sofa shows the question that is open in the list, then the store's reply. */
export const FaqPhone = ({ question, answer }: { question: string; answer: string }) => {
  const [replied, setReplied] = useState(false);

  useEffect(() => {
    setReplied(false);
    const timer = window.setTimeout(() => setReplied(true), 900);
    return () => window.clearTimeout(timer);
  }, [question]);

  return (
    <PhotoScreen
      src="/images/blog/telemovel-sofa-1200.jpg"
      srcSet="/images/blog/telemovel-sofa-700.jpg 700w, /images/blog/telemovel-sofa-1200.jpg 1200w"
      sizes="(min-width: 1024px) 560px, 100vw"
      alt="Pessoa no sofá a ler uma resposta da Rhulany Tech no telemóvel"
      geometry={SOFA}
      aspect={4 / 5}
      zoom={2.25}
      focus={{ x: 0.568, y: 0.377 }}
      className="rounded-[28px] bg-mist"
    >
      {/* The right thumb covers the lower right of the screen, so the chat keeps to the top and left */}
      <div className="flex h-full flex-col gap-[3cqw] px-[6cqw] pt-[9cqw]">
        <ChatHeader />
        <AnimatePresence mode="wait">
          <motion.div key={question} className="mt-[3cqw] flex flex-col gap-[3cqw]" exit={{ opacity: 0, transition: { duration: 0.2 } }}>
            <Bubble from="cliente">{question}</Bubble>
            <AnimatePresence mode="wait">
              {replied ? (
                <motion.p
                  key="resposta"
                  {...bubbleIn}
                  className="line-clamp-6 max-w-[74%] rounded-[3.5cqw] rounded-bl-[1cqw] bg-[#f0f0f2] px-[3.6cqw] py-[2.6cqw] text-[4.1cqw] leading-[1.35] text-ink"
                >
                  {answer}
                </motion.p>
              ) : (
                <Typing key="a-escrever" />
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </PhotoScreen>
  );
};

const HELP_SCRIPT: { from: 'cliente' | 'loja'; text: string }[] = [
  { from: 'cliente', text: 'Olá, o meu portátil está a aquecer muito. É normal?' },
  { from: 'loja', text: 'Olá! Confirme se as entradas de ar não estão tapadas e use-o numa superfície dura.' },
  { from: 'loja', text: 'Se continuar, traga-o à loja e vemos consigo.' },
];

/** Help: a WhatsApp conversation with the store writes itself once it scrolls into view. */
export const HelpPhone = ({ variant }: { variant: 'wide' | 'compact' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -20% 0px' });
  const [step, setStep] = useState(0);

  // 1: question, 2: typing, 3: first reply, 4: typing, 5: second reply
  useEffect(() => {
    if (!inView) return;
    const timings = [300, 1200, 2600, 3400, 4600];
    const timers = timings.map((delay, index) => window.setTimeout(() => setStep(index + 1), delay));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [inView]);

  const wide = variant === 'wide';
  return (
    <div ref={ref}>
      <PhotoScreen
        src="/images/blog/telemovel-mao-1400.png"
        srcSet="/images/blog/telemovel-mao-800.png 800w, /images/blog/telemovel-mao-1400.png 1400w"
        sizes={wide ? '(min-width: 1360px) 1264px, 100vw' : '100vw'}
        alt="Mão a segurar um telemóvel com uma conversa de WhatsApp com a Rhulany Tech"
        geometry={HAND}
        aspect={wide ? HAND.width / HAND.height : 4 / 5}
        zoom={wide ? 1 : 2.3}
        focus={wide ? undefined : { x: 0.678, y: 0.48 }}
      >
        {/* Fingers rest on the left edge halfway down, so bubbles keep a little inset */}
        <div className="flex h-full flex-col gap-[3cqw] px-[7cqw] pt-[12cqw]">
          <ChatHeader />
          <div className="mt-[4cqw] flex flex-col gap-[3cqw]">
            <AnimatePresence>
              {step >= 1 && <Bubble key="q" from="cliente">{HELP_SCRIPT[0].text}</Bubble>}
              {step === 2 && <Typing key="t1" />}
              {step >= 3 && <Bubble key="r1" from="loja">{HELP_SCRIPT[1].text}</Bubble>}
              {step === 4 && <Typing key="t2" />}
              {step >= 5 && <Bubble key="r2" from="loja">{HELP_SCRIPT[2].text}</Bubble>}
            </AnimatePresence>
          </div>
        </div>
      </PhotoScreen>
    </div>
  );
};
