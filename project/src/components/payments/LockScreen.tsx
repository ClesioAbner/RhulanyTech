import { AnimatePresence, motion } from 'framer-motion';
import { easeOutExpo } from '../../lib/motion';

const dateFormatter = new Intl.DateTimeFormat('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' });
const capitalise = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

interface LockScreenProps {
  /** 0 = just the clock; each step reveals one more notification as the phone falls. */
  stage: number;
  productName: string;
  price: string;
}

const Notification = ({ title, body, emphasis }: { title: string; body: string; emphasis?: string }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 24, scale: 0.94 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.96 }}
    transition={{ duration: 0.6, ease: easeOutExpo }}
    className="rounded-[14px] bg-white/25 px-3 py-2.5 text-white shadow-[0_8px_20px_-10px_rgba(0,0,0,0.5)] backdrop-blur-md"
  >
    <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.12em] text-white/75">
      <span>{title}</span>
      <span className="normal-case tracking-normal">agora</span>
    </div>
    <p className="mt-1 text-[11.5px] leading-snug">{body}</p>
    {emphasis && <p className="mt-0.5 font-display text-[15px] font-semibold tabular-nums">{emphasis}</p>}
  </motion.div>
);

// Dark wallpaper with glowing copper arcs, in the spirit of the iPhone 16 Pro launch wallpaper.
const Wallpaper = () => (
  <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 100 210" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="wp-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3a2622" />
        <stop offset="0.5" stopColor="#1a1110" />
        <stop offset="1" stopColor="#2a1510" />
      </linearGradient>
      <linearGradient id="wp-arc" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffb08a" />
        <stop offset="0.5" stopColor="#ff5a1f" />
        <stop offset="1" stopColor="#7a1d08" />
      </linearGradient>
      <radialGradient id="wp-glow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#ff6a2b" stopOpacity="0.55" />
        <stop offset="1" stopColor="#ff6a2b" stopOpacity="0" />
      </radialGradient>
      <filter id="wp-blur"><feGaussianBlur stdDeviation="1.2" /></filter>
    </defs>
    <rect width="100" height="210" fill="url(#wp-bg)" />
    <ellipse cx="78" cy="60" rx="40" ry="62" fill="url(#wp-glow)" />
    <ellipse cx="70" cy="40" rx="30" ry="48" transform="rotate(-28 70 40)" fill="#3b2420" stroke="url(#wp-arc)" strokeWidth="1.6" />
    <ellipse cx="70" cy="40" rx="30" ry="48" transform="rotate(-28 70 40)" fill="none" stroke="#ff7a3d" strokeWidth="3" opacity="0.5" filter="url(#wp-blur)" />
    <ellipse cx="96" cy="128" rx="44" ry="70" fill="#22130f" stroke="url(#wp-arc)" strokeWidth="1.4" />
    <ellipse cx="60" cy="190" rx="36" ry="58" transform="rotate(32 60 190)" fill="#2d1712" stroke="url(#wp-arc)" strokeWidth="1.6" />
    <ellipse cx="60" cy="190" rx="36" ry="58" transform="rotate(32 60 190)" fill="none" stroke="#ff7a3d" strokeWidth="3" opacity="0.45" filter="url(#wp-blur)" />
  </svg>
);

// What the phone shows while it is on display in the shop: a lock screen with store notifications.
const LockScreen = ({ stage, productName, price }: LockScreenProps) => (
  <div className="relative flex h-full flex-col overflow-hidden bg-[#140d0b] text-white">
    <Wallpaper />

    <div className="relative flex justify-between px-5 pt-3 text-[10px] font-medium tabular-nums text-white/85">
      <span>Rhulany</span>
      <span>5G</span>
    </div>

    <div className="relative mt-7 text-center">
      <p className="text-[11px] font-medium text-white/85">{capitalise(dateFormatter.format(new Date()))}</p>
      <p className="font-display text-[64px] font-semibold leading-none tracking-tight">9:41</p>
    </div>

    <div className="relative mt-auto space-y-2 px-3 pb-6">
      <AnimatePresence initial={false}>
        {stage >= 1 && (
          <Notification key="arrival" title="Rhulany Tech" body={`${productName} já disponível em Maputo`} />
        )}
        {stage >= 2 && (
          <Notification key="price" title="Rhulany Tech" body="Preço de lançamento" emphasis={price} />
        )}
        {stage >= 3 && (
          <Notification key="pay" title="Rhulany Tech" body="Pague com M-Pesa, e-Mola, cartão ou PayPal" />
        )}
      </AnimatePresence>
      <div className="mx-auto mt-3 h-1 w-1/3 rounded-full bg-white/70" />
    </div>
  </div>
);

export default LockScreen;
