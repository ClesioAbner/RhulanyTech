import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { unsplash } from '../../lib/images';
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

// The hand holds an older phone; an iPhone Air is drawn over its whole body (outline measured on the
// photo), and the fingers touching its sides are laid back on top from a cut-out of the same photo.
const HAND: ScreenPhoto = {
  width: 1400,
  height: 902,
  corners: [
    [787, 101],
    [1108, 101],
    [787, 761],
    [1108, 761],
  ],
  radius: 0.11,
  overlay: {
    src: '/images/blog/telemovel-mao-dedos-1400.webp',
    srcSet: '/images/blog/telemovel-mao-dedos-800.webp 800w, /images/blog/telemovel-mao-dedos-1400.webp 1400w',
  },
};

/** iPhone Air from the front: polished titanium edge, a slim black border, the screen inside. */
const AirFront = ({ children }: { children: ReactNode }) => (
  <div
    className="relative h-full w-full p-[1.4cqw]"
    style={{
      borderRadius: '11cqw',
      background: 'linear-gradient(90deg, #7d8087 0%, #e4e6ea 6%, #c4c7cd 22%, #eef0f2 50%, #c4c7cd 78%, #e9ebee 94%, #7b7e85 100%)',
    }}
  >
    <div className="h-full w-full bg-black p-[2.1cqw] shadow-[inset_0_0_0_0.25cqw_rgba(255,255,255,0.07)]" style={{ borderRadius: '9.6cqw' }}>
      <div className="relative h-full w-full overflow-hidden [container-type:inline-size]" style={{ borderRadius: '7.6cqw' }}>
        {children}
        {/* Glass: a faint reflection across the top corner */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0)_32%)]" />
      </div>
    </div>
  </div>
);

// ---------- Chat state and a small script runner ----------

type Ticks = 0 | 1 | 2 | 3; // none, sent, delivered, read

interface Line {
  id: number;
  from: 'cliente' | 'loja';
  text: string;
  time: string;
  ticks: Ticks;
  /** Emoji reaction shown under the bubble. */
  reaction?: string;
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
  | { type: 'react'; emoji: string; after: number }
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
          } else if (step.type === 'react') {
            await sleep(step.after);
            // The store reacts to the customer's latest message.
            setState((s) => {
              const index = s.lines.map((line) => line.from).lastIndexOf('cliente');
              return index < 0 ? s : { ...s, lines: s.lines.map((line, i) => (i === index ? { ...line, reaction: step.emoji } : line)) };
            });
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

// Chat wallpaper: tech line drawings (phone, headphones, gamepad, laptop, camera, watch, chip, bolt).
const WALLPAPER_TILE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none" stroke="rgba(30,41,59,0.11)" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
<rect x="10" y="8" width="16" height="28" rx="4"/><path d="M15 11h6"/>
<path d="M56 32v-6a11 11 0 0 1 22 0v6"/><rect x="53" y="29" width="6" height="9" rx="2"/><rect x="75" y="29" width="6" height="9" rx="2"/>
<path d="M90 48h20a7 7 0 0 1 0 14c-3 0-4.5-3-7-3h-6c-2.5 0-4 3-7 3a7 7 0 0 1 0-14z"/><path d="M95 52v6M92 55h6"/><circle cx="105" cy="54" r="1"/><circle cx="107" cy="57" r="1"/>
<rect x="15" y="60" width="26" height="16" rx="2"/><path d="M10 80h36"/>
<rect x="58" y="68" width="26" height="17" rx="3"/><circle cx="71" cy="76.5" r="5"/><path d="M64 68l2.5-4h9l2.5 4"/>
<rect x="99" y="92" width="12" height="14" rx="3.5"/><path d="M101 92v-5h8v5M101 106v5h8v-5"/>
<path d="M35 95l-6 10h6l-3 9 9-12h-6l4-7z"/>
<rect x="64" y="100" width="13" height="13" rx="2"/><path d="M67 100v-3M74 100v-3M67 113v3M74 113v3M64 103h-3M64 110h-3M77 103h3M77 110h3"/>
<circle cx="44" cy="22" r="1.2"/><circle cx="100" cy="20" r="1.2"/><circle cx="48" cy="112" r="1.2"/><circle cx="8" cy="100" r="1.2"/>
</svg>`;
const WALLPAPER = `url("data:image/svg+xml,${encodeURIComponent(WALLPAPER_TILE)}")`;

/** Pinned at the top of the chat like a business profile: a tech banner with the store's name. */
const BusinessCard = () => (
  <div className="mx-auto mb-auto mt-[3cqw] w-[86%] shrink-0 overflow-hidden rounded-[3cqw] bg-white shadow-[0_1px_2px_rgba(12,12,13,0.12)]">
    <div className="relative aspect-[16/8] overflow-hidden bg-ink">
      <img src={unsplash('1616440347437-b1c73416efc2', 400)} alt="" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
      <p className="absolute bottom-[2cqw] left-[3cqw] text-[4.4cqw] font-semibold leading-tight text-white">
        Rhulany<span className="text-white/60">Tech</span>
      </p>
    </div>
    <div className="px-[3cqw] py-[2.4cqw]">
      <p className="text-[3.3cqw] font-medium leading-snug">Loja de tecnologia em Maputo</p>
      <p className="mt-[0.6cqw] text-[2.8cqw] leading-snug text-ink/50">Originais com garantia, entregas em todo o país</p>
      <p className="mt-[1.6cqw] border-t border-ink/[0.08] pt-[1.6cqw] text-center text-[3cqw] font-medium text-[#0a84ff]">Ver catálogo</p>
    </div>
  </div>
);

const ChatScreen = ({ state }: { state: ChatState }) => (
  <div className="flex h-full flex-col bg-white font-sans text-ink">
    {/* Status bar: time and icons either side of the Dynamic Island */}
    <div className="relative grid h-[13.6cqw] shrink-0 grid-cols-[1fr_32cqw_1fr] items-center pt-[0.6cqw] text-[4.2cqw] font-semibold tabular-nums tracking-tight">
      <span className="justify-self-center pl-[2cqw]">{clock()}</span>
      <span aria-hidden="true" className="h-[9.4cqw] rounded-full bg-black shadow-[inset_0_0_0_0.3cqw_rgba(255,255,255,0.04)]">
        <span className="ml-auto mr-[3.2cqw] mt-[3.2cqw] block h-[3cqw] w-[3cqw] rounded-full bg-[radial-gradient(circle_at_35%_35%,#2a3550_0%,#0b0d14_60%)]" />
      </span>
      <span className="flex items-center justify-self-center gap-[1.2cqw] pr-[2cqw]">
        <Signal />
        <span className="text-[3.1cqw] font-semibold">4G</span>
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

    {/* Messages over a tech wallpaper; new ones push the rest up and out of view */}
    <div
      className="relative flex min-h-0 flex-1 flex-col justify-end overflow-hidden bg-[#eceff3] px-[3cqw] pb-[2.4cqw]"
      style={{ backgroundImage: WALLPAPER, backgroundSize: '36cqw 36cqw' }}
    >
      <BusinessCard />
      <span className="mx-auto mb-[2cqw] mt-[2.4cqw] rounded-[1.6cqw] bg-white/90 px-[2.4cqw] py-[0.8cqw] text-[2.7cqw] font-medium text-ink/55 shadow-sm">Hoje</span>
      <AnimatePresence initial={false}>
        {state.lines.map((line, index) => {
          const first = state.lines[index - 1]?.from !== line.from;
          const own = line.from === 'cliente';
          return (
            <motion.div
              key={line.id}
              layout
              className={`flex ${own ? 'justify-end' : 'justify-start'} ${first ? 'mt-[2.2cqw]' : 'mt-[0.8cqw]'} ${line.reaction ? 'mb-[3.4cqw]' : ''}`}
              initial={{ opacity: 0, y: 16, scale: 0.94, originX: own ? 1 : 0, originY: 1 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.7 }}
            >
              <p
                className={`relative max-w-[80%] rounded-[2.6cqw] px-[2.8cqw] pb-[1.4cqw] pt-[1.8cqw] text-[4.1cqw] leading-[1.32] shadow-[0_1px_0.5px_rgba(12,12,13,0.13)] ${
                  own ? `bg-[#d9fdd3] ${first ? 'rounded-tr-[0.6cqw]' : ''}` : `bg-white ${first ? 'rounded-tl-[0.6cqw]' : ''}`
                }`}
              >
                {line.text}
                <span className="float-right ml-[2cqw] mt-[1.2cqw] inline-flex items-center gap-[0.8cqw] text-[2.6cqw] tabular-nums text-ink/45">
                  {line.time}
                  {own && <TickMarks value={line.ticks} />}
                </span>
                <AnimatePresence>
                  {line.reaction && (
                    <motion.span
                      className={`absolute -bottom-[3.6cqw] grid h-[5.6cqw] min-w-[5.6cqw] place-items-center rounded-full border border-[#eceff3] bg-white px-[1cqw] text-[3.2cqw] shadow-[0_1px_2px_rgba(12,12,13,0.18)] ${own ? 'left-[2cqw]' : 'right-[2cqw]'}`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.35, 1], opacity: 1 }}
                      transition={{ duration: 0.45, ease: 'easeOut' }}
                    >
                      {line.reaction}
                    </motion.span>
                  )}
                </AnimatePresence>
              </p>
            </motion.div>
          );
        })}
        {state.typing && (
          <motion.div
            key="a-escrever"
            layout
            className="mt-[2.2cqw] flex"
            initial={{ opacity: 0, y: 10, scale: 0.9, originX: 0 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
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

// The store opens the conversation.
const HELP_STEPS: Step[] = [
  { type: 'typing', duration: 1100 },
  { type: 'reply', text: 'Bro! 👋 Aqui é a Rhulany Tech. Em que te podemos ajudar?' },
  { type: 'compose', text: 'Epá bro, preciso de help 🙏', duration: 1000 },
  { type: 'send' },
  { type: 'ticks', value: 2, after: 300 },
  { type: 'ticks', value: 3, after: 400 },
  { type: 'compose', text: 'O meu laptop está a aquecer muito mal, meu chefe. A ventoinha até parece avião 😅', duration: 2400 },
  { type: 'send' },
  { type: 'ticks', value: 3, after: 600 },
  { type: 'typing', duration: 1500 },
  { type: 'reply', text: 'Fr bro! 😂 Estás a usar o gajo em cima da cama ou no sofá?' },
  { type: 'compose', text: 'Às vezes na cama', duration: 800 },
  { type: 'send' },
  { type: 'ticks', value: 3, after: 500 },
  { type: 'typing', duration: 1600 },
  { type: 'reply', text: 'Aí está! Assim tapas as entradas de ar. Usa-o numa mesa ou num suporte' },
  { type: 'typing', duration: 1300 },
  { type: 'reply', text: 'Se continuar, passa cá na loja e fazemos uma limpeza por dentro 👌' },
  { type: 'compose', text: 'Tá nice bro, amanhã passo aí. Valeu brada! 🔥', duration: 1500 },
  { type: 'send' },
  { type: 'ticks', value: 3, after: 500 },
  { type: 'react', emoji: '👍', after: 700 },
  { type: 'typing', duration: 1000 },
  { type: 'reply', text: 'Estamos à tua espera 👊' },
  { type: 'wait', duration: 6000 },
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
        alt="Mão a segurar um iPhone Air com uma conversa de WhatsApp com a Rhulany Tech"
        photo={HAND}
        aspect={wide ? HAND.width / HAND.height : 4 / 5}
        zoom={wide ? 1 : 2.5}
        focus={wide ? undefined : { x: 0.676, y: 0.477 }}
      >
        <AirFront>
          <ChatScreen state={state} />
        </AirFront>
      </PhotoScreen>
    </div>
  );
};
