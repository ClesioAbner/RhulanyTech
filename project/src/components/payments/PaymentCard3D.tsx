import { motion } from 'framer-motion';

const EMBOSS = {
  color: '#3d4048',
  textShadow: '0 1px 0 rgba(255,255,255,0.55), 0 -1px 0 rgba(0,0,0,0.18)',
};

// Visa wordmark: heavy italic letters in Visa blue, with the gold flick on the V.
const VisaMark = ({ width }: { width: number }) => (
  <svg viewBox="0 0 100 32" style={{ width, height: width * 0.32 }} role="img" aria-label="Visa">
    <text x="0" y="28" fontFamily="Arial Black, Arial, sans-serif" fontWeight="900" fontStyle="italic" fontSize="34" letterSpacing="-1" fill="#1A1F71">
      VISA
    </text>
    <path d="M3 4.5h10.5l-2.4 6.5H1.2z" fill="#F7B600" />
  </svg>
);

const RhulanyMark = ({ size }: { size: number }) => (
  <span className="flex items-baseline" style={{ gap: size * 0.3 }}>
    <span className="font-display font-semibold tracking-tight text-[#2f3239]" style={{ fontSize: size }}>
      Rhulany
    </span>
    <span className="italic text-[#5d6069]" style={{ fontSize: size * 0.62, fontFamily: 'Georgia, "Times New Roman", serif' }}>
      Classic
    </span>
  </span>
);

const face = { backfaceVisibility: 'hidden' as const, WebkitBackfaceVisibility: 'hidden' as const };

/*
 * The Rhulany Classic Visa debit card in CSS 3D: silver front with large soft shapes, embossed
 * number and name, a back with stripe and signature panel, and a thin edge. Sized by its width with
 * real card proportions; place it inside a parent with transform-style: preserve-3d.
 */
const PaymentCard3D = ({ width }: { width: number }) => {
  const height = width / 1.586;
  const radius = width * 0.045;
  const depth = Math.max(2, width * 0.011);
  const u = width / 100; // one hundredth of the card width

  return (
    <div className="relative [transform-style:preserve-3d]" style={{ width, height }}>
      {/* Edge */}
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          aria-hidden="true"
          className="absolute inset-0"
          style={{ borderRadius: radius, background: '#a9acb3', transform: `translateZ(${-depth / 2 + (depth * (i + 0.5)) / 3}px)` }}
        />
      ))}

      {/* Front */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          ...face,
          borderRadius: radius,
          transform: `translateZ(${depth / 2 + 0.3}px)`,
          background: 'linear-gradient(125deg, #f2f3f5 0%, #d6d8dc 38%, #eceef0 62%, #c4c7cc 100%)',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.6)',
        }}
      >
        {/* Brushed metal and a slow glint across the surface */}
        <span
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, rgba(0,0,0,0.02) 1px, rgba(0,0,0,0.02) 2px)' }}
        />
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-soft-light"
          style={{ backgroundImage: 'linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.9) 48%, transparent 62%)', backgroundSize: '260% 100%' }}
          animate={{ backgroundPositionX: ['120%', '-20%'] }}
          transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 3.2, ease: 'easeInOut' }}
        />
        {/* Large soft shapes, like petals catching the light */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 160 101" preserveAspectRatio="none" aria-hidden="true">
          <ellipse cx="112" cy="70" rx="70" ry="44" transform="rotate(-32 112 70)" fill="rgba(110,114,124,0.22)" />
          <ellipse cx="128" cy="30" rx="58" ry="30" transform="rotate(28 128 30)" fill="rgba(255,255,255,0.45)" />
          <ellipse cx="60" cy="96" rx="52" ry="26" transform="rotate(-12 60 96)" fill="rgba(120,124,134,0.16)" />
        </svg>
        <span className="absolute" style={{ left: 7 * u, top: 5.5 * u }}>
          <RhulanyMark size={6.4 * u} />
        </span>
        {/* Chip */}
        <span
          className="absolute overflow-hidden"
          style={{
            left: 8 * u,
            top: 18.5 * u,
            width: 12.5 * u,
            height: 9.5 * u,
            borderRadius: 1.6 * u,
            background: 'linear-gradient(135deg, #e9e9e9 0%, #b7b9bd 45%, #dcdde0 100%)',
            boxShadow: 'inset 0 0 0 0.6px rgba(60,60,70,0.45)',
          }}
        >
          <span className="absolute inset-y-0 left-1/3 w-px bg-[rgba(60,60,70,0.35)]" />
          <span className="absolute inset-y-0 left-2/3 w-px bg-[rgba(60,60,70,0.35)]" />
          <span className="absolute inset-x-0 top-1/2 h-px bg-[rgba(60,60,70,0.35)]" />
        </span>
        {/* Contactless */}
        <svg className="absolute text-[#4a4d55]" style={{ left: 23 * u, top: 19 * u, width: 6.5 * u, height: 8.5 * u }} viewBox="0 0 13 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
          <path d="M2 5.5c1.3 1.5 1.3 3.5 0 5" />
          <path d="M5.2 3.5c2.4 2.7 2.4 6.3 0 9" />
          <path d="M8.4 1.5c3.4 3.9 3.4 9.1 0 13" />
        </svg>
        <span className="absolute whitespace-nowrap font-display font-semibold tabular-nums" style={{ ...EMBOSS, left: 8 * u, top: 31.5 * u, fontSize: 6.4 * u, letterSpacing: 0.85 * u }}>
          4258 0417 3902 4821
        </span>
        <span className="absolute" style={{ ...EMBOSS, left: 8 * u, top: 40.5 * u, fontSize: 2.5 * u }}>
          4258
        </span>
        <span className="absolute flex items-center" style={{ left: 40 * u, top: 40 * u, gap: 1.4 * u }}>
          <span className="uppercase leading-tight text-[#5d6069]" style={{ fontSize: 1.7 * u }}>
            Válido
            <br />
            até
          </span>
          <span className="font-semibold tabular-nums" style={{ ...EMBOSS, fontSize: 4 * u }}>
            09/29
          </span>
        </span>
        <span className="absolute font-semibold uppercase" style={{ ...EMBOSS, left: 8 * u, bottom: 6 * u, fontSize: 4 * u, letterSpacing: 0.45 * u }}>
          Rhulany Tech
        </span>
        <span className="absolute" style={{ right: 6.5 * u, bottom: 5 * u }}>
          <VisaMark width={17 * u} />
        </span>
      </div>

      {/* Back */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ ...face, borderRadius: radius, transform: `rotateY(180deg) translateZ(${depth / 2 + 0.3}px)`, background: 'linear-gradient(135deg, #e3e5e8, #c3c6cb)' }}
      >
        <span className="absolute inset-x-0 bg-[#1b1c20]" style={{ top: 6 * u, height: 11 * u }} />
        <span
          className="absolute flex items-center justify-end"
          style={{ left: 7 * u, right: 24 * u, top: 22 * u, height: 8 * u, borderRadius: 1 * u, background: 'repeating-linear-gradient(135deg, #f6f5f1 0px, #f6f5f1 4px, #e6e4dd 4px, #e6e4dd 8px)' }}
        >
          <span className="mr-[0.6em] italic text-[#3d4048]" style={{ fontSize: 3.6 * u, fontFamily: '"Courier New", monospace' }}>
            •••
          </span>
        </span>
        <span
          className="absolute"
          style={{ right: 7 * u, top: 21 * u, width: 12 * u, height: 10 * u, borderRadius: 1.4 * u, background: 'linear-gradient(120deg, #d9e8ff, #f3d6ff, #d6fff0, #fff3c9)' }}
        />
        <span className="absolute text-[#5d6069]" style={{ left: 7 * u, right: 7 * u, top: 35 * u, fontSize: 2.5 * u, lineHeight: 1.45 }}>
          Cartão de débito Rhulany Classic. Em caso de perda ou roubo contacte a Rhulany Tech de imediato.
        </span>
        <span className="absolute" style={{ left: 7 * u, bottom: 5 * u }}>
          <RhulanyMark size={4 * u} />
        </span>
        <span className="absolute" style={{ right: 6.5 * u, bottom: 5 * u }}>
          <VisaMark width={12 * u} />
        </span>
      </div>
    </div>
  );
};

export default PaymentCard3D;
