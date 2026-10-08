import { AnimatePresence, motion } from 'framer-motion';
import { unsplash } from '../../../lib/images';
import { clock, type ChatState, type Ticks } from './chatScript';

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
      <path
        d="M1 5.8l2.8 2.8L9.6 2.6"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transition: 'stroke 0.4s' }}
      />
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
      <p className="mt-[1.6cqw] border-t border-ink/[0.08] pt-[1.6cqw] text-center text-[3cqw] font-medium text-[#0a84ff]">
        Ver catálogo
      </p>
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
      <span className="flex items-center gap-[1.2cqw] justify-self-center pr-[2cqw]">
        <Signal />
        <span className="text-[3.1cqw] font-semibold">4G</span>
        <Battery />
      </span>
    </div>

    {/* Conversation header */}
    <div className="flex shrink-0 items-center gap-[2.4cqw] border-b border-ink/[0.08] px-[3.5cqw] pb-[2.4cqw] pt-[1cqw]">
      <svg viewBox="0 0 10 18" className="h-[4.2cqw] w-[2.4cqw] text-[#0a84ff]" aria-hidden="true">
        <path
          d="M8.5 1.5 1.5 9l7 7.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="grid h-[9cqw] w-[9cqw] shrink-0 place-items-center rounded-full bg-ink text-[3.2cqw] font-semibold text-paper">
        RT
      </span>
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
      <svg
        viewBox="0 0 24 24"
        className="h-[5cqw] w-[5cqw] text-[#0a84ff]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path
          d="M6.6 3.75h2.2l1.3 3.6-1.7 1.2a11 11 0 0 0 5.05 5.05l1.2-1.7 3.6 1.3v2.2a1.9 1.9 0 0 1-2.05 1.9A15.2 15.2 0 0 1 4.7 5.8a1.9 1.9 0 0 1 1.9-2.05z"
          strokeLinejoin="round"
        />
      </svg>
    </div>

    {/* Messages over a tech wallpaper; new ones push the rest up and out of view */}
    <div
      className="relative flex min-h-0 flex-1 flex-col justify-end overflow-hidden bg-[#eceff3] px-[3cqw] pb-[2.4cqw]"
      style={{ backgroundImage: WALLPAPER, backgroundSize: '36cqw 36cqw' }}
    >
      <BusinessCard />
      <span className="mx-auto mb-[2cqw] mt-[2.4cqw] rounded-[1.6cqw] bg-white/90 px-[2.4cqw] py-[0.8cqw] text-[2.7cqw] font-medium text-ink/55 shadow-sm">
        Hoje
      </span>
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
        <svg
          viewBox="0 0 24 24"
          className="h-[5cqw] w-[5cqw] shrink-0 text-[#0a84ff]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
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
          animate={{
            backgroundColor: state.composing ? '#25a244' : 'rgba(0,0,0,0)',
            color: state.composing ? '#ffffff' : '#0a84ff',
          }}
          transition={{ duration: 0.2 }}
        >
          {state.composing ? (
            <svg viewBox="0 0 24 24" className="h-[4.4cqw] w-[4.4cqw]" fill="currentColor" aria-hidden="true">
              <path d="M3.4 20.4 21 12 3.4 3.6l-.1 6.5L15 12 3.3 13.9z" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="h-[5cqw] w-[5cqw]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
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

export default ChatScreen;
