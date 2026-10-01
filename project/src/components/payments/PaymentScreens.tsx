import type { ReactNode } from 'react';

// Illustrative checkout screens shown inside the 3D phone. Plain HTML so they stay crisp at any size.

const AMOUNT = '180 000,00 MT';

const StatusBar = ({ light = false }: { light?: boolean }) => (
  <div className={`flex justify-between px-5 pt-3 text-[10px] font-medium tabular-nums ${light ? 'text-white/80' : 'text-ink/70'}`}>
    <span>9:41</span>
    <span>5G</span>
  </div>
);

const Screen = ({ className, children, light }: { className: string; children: ReactNode; light?: boolean }) => (
  <div className={`flex h-full flex-col ${className}`}>
    <StatusBar light={light} />
    <div className="flex flex-1 flex-col px-5 pb-6 pt-6">{children}</div>
  </div>
);

const PinDots = ({ filled, tone }: { filled: number; tone: string }) => (
  <div className="flex justify-center gap-3">
    {Array.from({ length: 4 }, (_, i) => (
      <span key={i} className={`h-2.5 w-2.5 rounded-full border ${tone} ${i < filled ? 'bg-current' : ''}`} />
    ))}
  </div>
);

export const CheckoutScreen = () => (
  <Screen className="bg-paper text-ink">
    <p className="text-[11px] uppercase tracking-[0.16em] text-ink/45">Rhulany Tech</p>
    <p className="mt-6 text-[13px] text-ink/60">Total da encomenda</p>
    <p className="mt-1 font-display text-[26px] font-medium leading-none tracking-tight">{AMOUNT}</p>
    <div className="mt-8 space-y-2.5 text-[12px]">
      {['M-Pesa', 'e-Mola', 'Cartão', 'PayPal'].map((method) => (
        <div key={method} className="flex items-center justify-between rounded-lg border border-ink/10 bg-white px-3.5 py-3">
          <span>{method}</span>
          <span className="h-3 w-3 rounded-full border border-ink/25" />
        </div>
      ))}
    </div>
    <p className="mt-auto text-center text-[11px] text-ink/45">Escolha como pagar</p>
  </Screen>
);

export const MpesaScreen = () => (
  <Screen className="bg-[#E60000] text-white" light>
    <p className="font-display text-[22px] font-semibold tracking-tight">M-Pesa</p>
    <p className="mt-1 text-[11px] text-white/75">Vodacom Moçambique</p>
    <div className="mt-8 rounded-xl bg-white p-4 text-ink">
      <p className="text-[11px] text-ink/50">Pagar a</p>
      <p className="text-[14px] font-medium">Rhulany Tech</p>
      <p className="mt-3 text-[11px] text-ink/50">Montante</p>
      <p className="whitespace-nowrap font-display text-[20px] font-medium tracking-tight">{AMOUNT}</p>
    </div>
    <p className="mt-8 text-center text-[12px] text-white/85">Introduza o seu PIN</p>
    <div className="mt-3 text-white">
      <PinDots filled={3} tone="border-white" />
    </div>
    <div className="mt-auto rounded-full bg-white py-3 text-center text-[13px] font-medium text-[#E60000]">Confirmar</div>
  </Screen>
);

export const EmolaScreen = () => (
  <Screen className="bg-[#F47B20] text-white" light>
    <p className="font-display text-[22px] font-semibold tracking-tight">e-Mola</p>
    <p className="mt-1 text-[11px] text-white/75">Movitel</p>
    <div className="mt-8 rounded-xl bg-white/15 p-4">
      <p className="text-[11px] text-white/70">Pedido de pagamento</p>
      <p className="mt-1 text-[14px] font-medium">Rhulany Tech</p>
      <div className="my-3 h-px bg-white/25" />
      <p className="text-[11px] text-white/70">Total</p>
      <p className="whitespace-nowrap font-display text-[18px] font-medium">{AMOUNT}</p>
    </div>
    <div className="mt-4 rounded-xl bg-white/15 p-4 text-[11px] text-white/85">
      Saldo disponível após pagamento é actualizado de imediato.
    </div>
    <div className="mt-auto rounded-full bg-white py-3 text-center text-[13px] font-medium text-[#F47B20]">Aprovar pagamento</div>
  </Screen>
);

export const CardScreen = () => (
  <Screen className="bg-ink text-white" light>
    <p className="text-[11px] uppercase tracking-[0.16em] text-white/50">Pagamento com cartão</p>
    <div className="mt-6 aspect-[1.586] rounded-xl bg-gradient-to-br from-[#2B2B30] to-[#0E0E10] p-4 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/10">
      <div className="flex h-full flex-col justify-between">
        <div className="h-6 w-8 rounded-md bg-gradient-to-br from-[#E8D9A8] to-[#B89B5E]" />
        <div>
          <p className="font-mono text-[13px] tracking-[0.18em] text-white/85">•••• 4821</p>
          <div className="mt-2 flex items-end justify-between">
            <span className="text-[10px] uppercase tracking-[0.14em] text-white/50">Titular</span>
            <span className="font-display text-[16px] font-semibold italic tracking-tight">VISA</span>
          </div>
        </div>
      </div>
    </div>
    <div className="mt-6 space-y-2 text-[12px]">
      <div className="flex justify-between text-white/60">
        <span>Comerciante</span>
        <span className="text-white">Rhulany Tech</span>
      </div>
      <div className="flex justify-between text-white/60">
        <span>Montante</span>
        <span className="text-white">{AMOUNT}</span>
      </div>
    </div>
    <div className="mt-auto rounded-full bg-white py-3 text-center text-[13px] font-medium text-ink">Pagamento aprovado</div>
  </Screen>
);

export const PaypalScreen = () => (
  <Screen className="bg-white text-[#001C64]">
    <p className="font-display text-[22px] font-semibold italic tracking-tight">
      Pay<span className="text-[#0070E0]">Pal</span>
    </p>
    <p className="mt-8 text-[13px] text-[#001C64]/70">Olá! Está a pagar a</p>
    <p className="text-[15px] font-medium">Rhulany Tech</p>
    <div className="mt-6 rounded-xl bg-[#F1F5FB] p-4">
      <p className="text-[11px] text-[#001C64]/60">Montante</p>
      <p className="whitespace-nowrap font-display text-[20px] font-medium tracking-tight">{AMOUNT}</p>
      <p className="mt-1 text-[11px] text-[#001C64]/60">≈ convertido na sua moeda</p>
    </div>
    <div className="mt-auto rounded-full bg-[#0070E0] py-3 text-center text-[13px] font-medium text-white">Pagar agora</div>
  </Screen>
);
