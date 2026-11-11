import type { PaymentMethodId } from '../../../lib/checkout';

// Small marks for each way to pay, after each brand's own colours (the same ones the payments
// section draws on its phone). They scale with the box they are given.

const MPesa = () => (
  <svg viewBox="0 0 40 40">
    <rect width="40" height="40" rx="10" fill="#E60000" />
    <rect x="13" y="8" width="12" height="21" rx="2.6" fill="none" stroke="#fff" strokeWidth="2.2" />
    <path d="M8 19c6-4 13-4.6 21-2l-1.8 4.4c-6.6-2-12.6-1.4-17.8 1.6z" fill="#58B947" />
    <text x="20" y="36" textAnchor="middle" fontSize="7" fontWeight="700" fill="#fff">
      m-pesa
    </text>
  </svg>
);

const EMola = () => (
  <svg viewBox="0 0 40 40">
    <rect width="40" height="40" rx="10" fill="#F47B20" />
    <rect x="12" y="8" width="11" height="18" rx="2" fill="#fff" />
    <rect x="14" y="10" width="7" height="4.5" fill="#F47B20" />
    <rect x="23.5" y="12" width="7" height="11" rx="1.2" fill="#fff" transform="rotate(-24 27 17.5)" />
    <text x="20" y="36" textAnchor="middle" fontSize="7.4" fontWeight="800" fill="#fff">
      e-Mola
    </text>
  </svg>
);

const MKesh = () => (
  <svg viewBox="0 0 40 40">
    <rect width="40" height="40" rx="10" fill="#F9C300" />
    <rect x="13.5" y="7" width="13" height="21" rx="3" fill="#1E9EA3" />
    <rect x="15.5" y="10" width="9" height="13" rx="1.4" fill="#fff" />
    <text x="20" y="20" textAnchor="middle" fontSize="7" fontWeight="800" fill="#1E9EA3">
      :$
    </text>
    <text x="20" y="36" textAnchor="middle" fontSize="7.4" fontWeight="800" fill="#fff">
      m<tspan fill="#1E9EA3">kesh</tspan>
    </text>
  </svg>
);

const Card = () => (
  <svg viewBox="0 0 40 40">
    <rect width="40" height="40" rx="10" fill="#fff" stroke="#0C0C0D" strokeOpacity="0.1" />
    <circle cx="16" cy="17" r="7.5" fill="#EB001B" />
    <circle cx="24" cy="17" r="7.5" fill="#F79E1B" fillOpacity="0.92" />
    <text x="20" y="34" textAnchor="middle" fontSize="7.6" fontWeight="900" fontStyle="italic" fill="#1A1F71">
      VISA
    </text>
  </svg>
);

const PayPal = () => (
  <svg viewBox="0 0 40 40">
    <rect width="40" height="40" rx="10" fill="#F1F5FB" />
    <text x="17" y="27" textAnchor="middle" fontSize="20" fontWeight="800" fontStyle="italic" fill="#003087">
      P
    </text>
    <text x="22" y="30" textAnchor="middle" fontSize="20" fontWeight="800" fontStyle="italic" fill="#009CDE" fillOpacity="0.9">
      P
    </text>
  </svg>
);

const MARKS: Record<PaymentMethodId, () => JSX.Element> = {
  mpesa: MPesa,
  emola: EMola,
  mkesh: MKesh,
  card: Card,
  paypal: PayPal,
};

const PaymentMark = ({ method, className = '' }: { method: PaymentMethodId; className?: string }) => {
  const Mark = MARKS[method];
  return (
    <span aria-hidden="true" className={`block shrink-0 font-sans [&>svg]:h-full [&>svg]:w-full ${className}`}>
      <Mark />
    </span>
  );
};

export default PaymentMark;
