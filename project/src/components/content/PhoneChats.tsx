import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { easeOutExpo } from '../../lib/motion';
import PhotoScreen, { type ScreenPhoto } from './PhotoScreen';

// ---------- The two photos and their measured screens (public/images/blog) ----------

const SOFA: ScreenPhoto = {
  width: 1200,
  height: 1500,
  corners: [
    [605, 330],
    [812, 348],
    [549, 783],
    [756, 804],
  ],
  radius: 0.11,
  // The right thumb rests over the lower right of the screen.
  occluders: [
    [
      [773, 540], [778, 522], [788, 514], [801, 512], [815, 516], [832, 530], [870, 560], [870, 880],
      [722, 880], [728, 830], [735, 800], [742, 775], [750, 740], [757, 700], [764, 660], [770, 610],
    ],
  ],
};

const HAND: ScreenPhoto = {
  width: 1400,
  height: 902,
  corners: [
    [806, 118],
    [1087, 118],
    [806, 743],
    [1087, 743],
  ],
  radius: 0.107,
};

// ---------- Chat state and a small script runner ----------

type Ticks = 0 | 1 | 2 | 3; // none, sent, delivered, read

interface Line {
  id: number;
  from: 'cliente' | 'loja';
  text: string;
  time: string;
  ticks: Ticks;
}

interface ChatState {
  lines: Line[];
  composing: string;
  typing: boolean;
}

type Step =
  | { type: 'compose'; text: string; duration?: number }
  | { type: 'send' }
  | { type: 'ticks'; value: Ticks; after: number }
  | { type: 'typing'; duration: number }
  | { type: 'reply'; text: string }
  | { type: 'wait'; duration: number };

const EMPTY: ChatState = { lines: [], composing: '', typing: false };
const clock = () => new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

/** Plays a chat script while `active`; with `loop`, starts again after a pause. */
const useChatScript = (steps: Step[], active: boolean, loop: boolean) => {
  const [state, setState] = useState<ChatState>(EMPTY);
  const idRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    const sleep = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

    const run = async () => {
      do {
        setState(EMPTY);
        await sleep(500);
        for (const step of steps) {
          if (cancelled) return;
          if (step.type === 'compose') {
            const perChar = Math.min(45, (step.duration ?? 1600) / step.text.length);
            for (let i = 1; i <= step.text.length && !cancelled; i += 1) {
              setState((s) => ({ ...s, composing: step.text.slice(0, i) }));
              await sleep(perChar);
            }
            await sleep(250);
          } else if (step.type === 'send') {
            idRef.current += 1;
            const id = idRef.current;
            setState((s) => ({ ...s, composing: '', lines: [...s.lines, { id, from: 'cliente', text: s.composing, time: clock(), ticks: 1 }] }));
          } else if (step.type === 'ticks') {
            await sleep(step.after);
            setState((s) => ({ ...s, lines: s.lines.map((line) => (line.from === 'cliente' ? { ...line, ticks: step.value } : line)) }));
          } else if (step.type === 'typing') {
            setState((s) => ({ ...s, typing: true }));
            await sleep(step.duration);
            setState((s) => ({ ...s, typing: false }));
          } else if (step.type === 'reply') {
            idRef.current += 1;
            const id = idRef.current;
            setState((s) => ({ ...s, lines: [...s.lines, { id, from: 'loja', text: step.text, time: clock(), ticks: 0 }] }));
            await sleep(500);
          } else {
            await sleep(step.duration);
          }
        }
      } while (loop && !cancelled);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [steps, active, loop]);

  return state;
};

// ---------- The chat app, drawn in container units of the screen width ----------

const Signal = () => (
  <svg viewBox="0 0 18 12" className="h-[2.8cqw] w-[4.2cqw]" aria-hidden="true">
    {[0, 1, 2, 3].map((bar) => (
      <rect key={bar} x={bar * 4.6} y={9 - bar * 3} width="3.2" height={3 + bar * 3} rx="0.8" fill="currentColor" />
    ))}
  </svg>
);

const Battery = () => (
  <svg viewBox="0 0 27 13" className="h-[3cqw] w-[6.2cqw]" aria-hidden="true">
    <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" strokeOpacity="0.4" />
    <rect x="2" y="2" width="17" height="9" rx="2" fill="currentColor" />
    <path d="M25 4.5v4a2 2 0 0 0 0-4z" fill="currentColor" fillOpacity="0.45" />
  </svg>
);

const TickMarks = ({ value }: { value: Ticks }) => {
  if (!value) return null;
  const color = value === 3 ? '#53bdeb' : 'rgba(12,12,13,0.4)';
  return (
    <svg viewBox="0 0 16 11" className="h-[2.6cqw] w-[3.8cqw]" aria-hidden="true">
      <path d="M1 5.8l2.8 2.8L9.6 2.6" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.4s' }} />
      {value >= 2 && (
        <motion.path
          d="M6.4 8.6l.1.1L12.4 2.6"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: 'stroke 0.4s' }}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.25 }}
        />
      )}
    </svg>
  );
};

const ChatScreen = ({ state }: { state: ChatState }) => (
  <div className="flex h-full flex-col bg-white font-sans text-ink">
    {/* Status bar: either side of the notch */}
    <div className="flex h-[11.5cqw] shrink-0 items-center justify-between pl-[9cqw] pr-[6.5cqw] pt-[1.2cqw] text-[3.8cqw] font-semibold tabular-nums">
      <span>{clock()}</span>
      <span className="flex items-center gap-[1.2cqw]">
        <Signal />
        <span className="text-[3cqw] font-semibold">4G</span>
        <Battery />
      </span>
    </div>

    {/* Conversation header */}
    <div className="flex shrink-0 items-center gap-[2.4cqw] border-b border-ink/[0.08] px-[3.5cqw] pb-[2.4cqw] pt-[1cqw]">
      <svg viewBox="0 0 10 18" className="h-[4.2cqw] w-[2.4cqw] text-[#0a84ff]" aria-hidden="true">
        <path d="M8.5 1.5 1.5 9l7 7.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="grid h-[9cqw] w-[9cqw] shrink-0 place-items-center rounded-full bg-ink text-[3.2cqw] font-semibold text-paper">RT</span>
      <span className="min-w-0 flex-1 leading-tight">
        <span className="block truncate text-[4.1cqw] font-semibold">Rhulany Tech</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={state.typing ? 'escreve' : 'online'}
            className={`block text-[3cqw] ${state.typing ? 'text-[#25a244]' : 'text-ink/45'}`}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.2 }}
          >
            {state.typing ? 'a escrever…' : 'online'}
          </motion.span>
        </AnimatePresence>
      </span>
      <svg viewBox="0 0 24 24" className="h-[5cqw] w-[5cqw] text-[#0a84ff]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M6.6 3.75h2.2l1.3 3.6-1.7 1.2a11 11 0 0 0 5.05 5.05l1.2-1.7 3.6 1.3v2.2a1.9 1.9 0 0 1-2.05 1.9A15.2 15.2 0 0 1 4.7 5.8a1.9 1.9 0 0 1 1.9-2.05z" strokeLinejoin="round" />
      </svg>
    </div>

    {/* Messages over the chat wallpaper; new ones push the rest up */}
    <div
      className="relative flex min-h-0 flex-1 flex-col justify-end gap-[1.6cqw] overflow-hidden bg-[#efeae2] px-[3cqw] pb-[2.4cqw]"
      style={{ backgroundImage: 'radial-gradient(rgba(12,12,13,0.045) 0.08em, transparent 0.09em)', backgroundSize: '3.2cqw 3.2cqw' }}
    >
      <span className="mx-auto mb-[1cqw] rounded-[1.6cqw] bg-white/85 px-[2.4cqw] py-[0.8cqw] text-[2.7cqw] font-medium text-ink/55 shadow-sm">Hoje</span>
      <AnimatePresence initial={false}>
        {state.lines.map((line) => (
          <motion.div
            key={line.id}
            layout
            className={`flex ${line.from === 'cliente' ? 'justify-end' : 'justify-start'}`}
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: easeOutExpo }}
          >
            <p
              className={`max-w-[80%] rounded-[2.6cqw] px-[2.8cqw] pb-[1.4cqw] pt-[1.8cqw] text-[4.1cqw] leading-[1.32] shadow-[0_1px_0.5px_rgba(12,12,13,0.13)] ${
                line.from === 'cliente' ? 'rounded-tr-[0.6cqw] bg-[#d9fdd3]' : 'rounded-tl-[0.6cqw] bg-white'
              }`}
            >
              {line.text}
              <span className="float-right ml-[2cqw] mt-[1.2cqw] inline-flex items-center gap-[0.8cqw] text-[2.6cqw] tabular-nums text-ink/45">
                {line.time}
                {line.from === 'cliente' && <TickMarks value={line.ticks} />}
              </span>
            </p>
          </motion.div>
        ))}
        {state.typing && (
          <motion.div
            key="a-escrever"
            layout
            className="flex"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            transition={{ duration: 0.3, ease: easeOutExpo }}
          >
            <span className="flex items-center gap-[1.2cqw] rounded-[2.6cqw] rounded-tl-[0.6cqw] bg-white px-[3.2cqw] py-[2.8cqw] shadow-[0_1px_0.5px_rgba(12,12,13,0.13)]">
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  className="block h-[1.6cqw] w-[1.6cqw] rounded-full bg-ink/40"
                  animate={{ y: [0, -2, 0], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: dot * 0.15 }}
                />
              ))}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    {/* Message bar */}
    <div className="relative shrink-0 bg-[#f6f6f6] px-[3cqw] pb-[7cqw] pt-[2.2cqw]">
      <div className="flex items-center gap-[2cqw]">
        <svg viewBox="0 0 24 24" className="h-[5cqw] w-[5cqw] shrink-0 text-[#0a84ff]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
        <span className="flex h-[8.4cqw] min-w-0 flex-1 items-center overflow-hidden rounded-full border border-ink/10 bg-white px-[3cqw] text-[3.7cqw]">
          {state.composing ? (
            <span className="truncate">
              {state.composing}
              <motion.span
                className="ml-[0.3cqw] inline-block h-[4cqw] w-[0.45cqw] translate-y-[0.6cqw] bg-[#0a84ff]"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.9, repeat: Infinity }}
              />
            </span>
          ) : (
            <span className="text-ink/35">Mensagem</span>
          )}
        </span>
        <motion.span
          className="grid h-[8.4cqw] w-[8.4cqw] shrink-0 place-items-center rounded-full"
          animate={{ backgroundColor: state.composing ? '#25a244' : 'rgba(0,0,0,0)', color: state.composing ? '#ffffff' : '#0a84ff' }}
          transition={{ duration: 0.2 }}
        >
          {state.composing ? (
            <svg viewBox="0 0 24 24" className="h-[4.4cqw] w-[4.4cqw]" fill="currentColor" aria-hidden="true">
              <path d="M3.4 20.4 21 12 3.4 3.6l-.1 6.5L15 12 3.3 13.9z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-[5cqw] w-[5cqw]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <rect x="9" y="3" width="6" height="11" rx="3" />
              <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
            </svg>
          )}
        </motion.span>
      </div>
      <span className="absolute bottom-[2cqw] left-1/2 h-[1.2cqw] w-[34%] -translate-x-1/2 rounded-full bg-ink" />
    </div>
  </div>
);

// ---------- The two placements ----------

/** FAQ: the phone on the sofa sends the question that is open in the list and gets the answer. */
export const FaqPhone = ({ question, answer }: { question: string; answer: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '0px 0px -15% 0px' });
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (inView) setSeen(true);
  }, [inView]);

  const steps = useStep(question, answer);
  const state = useChatScript(steps, seen, false);

  return (
    <div ref={ref}>
      <PhotoScreen
        src="/images/blog/telemovel-sofa-1200.jpg"
        srcSet="/images/blog/telemovel-sofa-700.jpg 700w, /images/blog/telemovel-sofa-1200.jpg 1200w"
        sizes="(min-width: 1024px) 600px, 100vw"
        alt="Pessoa no sofá a receber no telemóvel a resposta da Rhulany Tech"
        photo={SOFA}
        aspect={4 / 5}
        zoom={2.6}
        focus={{ x: 0.567, y: 0.377 }}
        className="rounded-[28px] bg-mist"
      >
        <ChatScreen state={state} />
      </PhotoScreen>
    </div>
  );
};

// One script per question, so a new choice in the list replays the conversation.
const useStep = (question: string, answer: string) => {
  const [steps, setSteps] = useState<Step[]>([]);
  useEffect(() => {
    setSteps([
      { type: 'compose', text: question, duration: 1400 },
      { type: 'send' },
      { type: 'ticks', value: 2, after: 350 },
      { type: 'ticks', value: 3, after: 450 },
      { type: 'typing', duration: 1300 },
      { type: 'reply', text: answer },
    ]);
  }, [question, answer]);
  return steps;
};

const HELP_STEPS: Step[] = [
  { type: 'compose', text: 'Olá, o meu portátil está a aquecer muito. É normal?', duration: 1900 },
  { type: 'send' },
  { type: 'ticks', value: 2, after: 400 },
  { type: 'ticks', value: 3, after: 600 },
  { type: 'typing', duration: 1600 },
  { type: 'reply', text: 'Olá! Confirme se as entradas de ar não estão tapadas e use-o numa superfície dura.' },
  { type: 'typing', duration: 1200 },
  { type: 'reply', text: 'Se continuar, traga-o à loja e vemos consigo.' },
  { type: 'compose', text: 'Obrigado, passo aí amanhã', duration: 1100 },
  { type: 'send' },
  { type: 'ticks', value: 3, after: 700 },
  { type: 'wait', duration: 5000 },
];

/** Help: a WhatsApp conversation with the store plays out while it is on screen. */
export const HelpPhone = ({ variant }: { variant: 'wide' | 'compact' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '0px 0px -20% 0px' });
  const state = useChatScript(HELP_STEPS, inView, true);
  const wide = variant === 'wide';

  return (
    <div ref={ref}>
      <PhotoScreen
        src="/images/blog/telemovel-mao-1400.png"
        srcSet="/images/blog/telemovel-mao-800.png 800w, /images/blog/telemovel-mao-1400.png 1400w"
        sizes={wide ? '(min-width: 1360px) 1264px, 100vw' : '100vw'}
        alt="Mão a segurar um telemóvel com uma conversa de WhatsApp com a Rhulany Tech"
        photo={HAND}
        aspect={wide ? HAND.width / HAND.height : 4 / 5}
        zoom={wide ? 1 : 2.6}
        focus={wide ? undefined : { x: 0.676, y: 0.477 }}
      >
        <ChatScreen state={state} />
      </PhotoScreen>
    </div>
  );
};
