import { STORE } from '../data/store';
import { formatPrice } from './format';
import type { Order } from '../stores/orderStore';

/*
 * Checkout rules and helpers.
 *
 * PAYMENTS_LIVE is false while no payment gateway is connected: payments are simulated, nothing is
 * charged and the checkout says so. Connecting M-Pesa (Vodacom), e-Mola (Movitel), mKesh (Tmcel), a card processor
 * and PayPal means replacing `processPayment` with calls to a server that talks to those providers.
 */
export const PAYMENTS_LIVE = false;

export const PROVINCES = [
  'Maputo Cidade',
  'Maputo Província',
  'Gaza',
  'Inhambane',
  'Sofala',
  'Manica',
  'Tete',
  'Zambézia',
  'Nampula',
  'Cabo Delgado',
  'Niassa',
];

export type PaymentMethodId = 'mpesa' | 'emola' | 'mkesh' | 'card' | 'paypal';
export type WalletId = 'mpesa' | 'emola' | 'mkesh';
export type DeliveryMethod = 'entrega' | 'levantamento';

export const PAYMENT_OPTIONS: { id: PaymentMethodId; name: string; note: string }[] = [
  { id: 'mpesa', name: 'M-Pesa', note: 'Confirma com o PIN no telemóvel' },
  { id: 'emola', name: 'e-Mola', note: 'Aprova o pedido na carteira Movitel' },
  { id: 'mkesh', name: 'mKesh', note: 'Aprova o pedido na carteira Tmcel' },
  { id: 'card', name: 'Visa ou Mastercard', note: 'Débito ou crédito' },
  { id: 'paypal', name: 'PayPal', note: 'Para quem paga do estrangeiro' },
];

/** Mobile wallets: paid by approving a request on the customer's phone number. */
export const isWallet = (id: PaymentMethodId): id is WalletId => id === 'mpesa' || id === 'emola' || id === 'mkesh';

export const paymentName = (id: PaymentMethodId) => PAYMENT_OPTIONS.find((option) => option.id === id)?.name ?? id;

// ---------- Phone numbers ----------

export const digits = (value: string) => value.replace(/\D/g, '');

/** Local mobile number without the country code: 84 123 4567. */
export const localNumber = (value: string) => {
  const d = digits(value);
  return d.startsWith('258') && d.length > 9 ? d.slice(3) : d;
};

export const formatMobile = (value: string) => {
  const d = localNumber(value).slice(0, 9);
  return [d.slice(0, 2), d.slice(2, 5), d.slice(5, 9)].filter(Boolean).join(' ');
};

export const isMobile = (value: string) => /^8[2-7]\d{7}$/.test(localNumber(value));

// M-Pesa runs on Vodacom (84, 85), e-Mola on Movitel (86, 87) and mKesh on Tmcel (82, 83).
export const WALLET_PREFIXES: Record<WalletId, string[]> = { mpesa: ['84', '85'], emola: ['86', '87'], mkesh: ['82', '83'] };

const WALLET_NETWORK: Record<WalletId, string> = {
  mpesa: 'O M-Pesa usa números Vodacom, começados por 84 ou 85',
  emola: 'O e-Mola usa números Movitel, começados por 86 ou 87',
  mkesh: 'O mKesh usa números Tmcel, começados por 82 ou 83',
};

export const walletError = (method: WalletId, value: string) => {
  const number = localNumber(value);
  if (!/^\d{9}$/.test(number)) return 'Indique os 9 dígitos do número';
  if (!WALLET_PREFIXES[method].some((prefix) => number.startsWith(prefix))) return WALLET_NETWORK[method];
  return undefined;
};

export const maskMobile = (value: string) => {
  const number = localNumber(value);
  return `${number.slice(0, 2)} ••• ${number.slice(-4)}`;
};

// ---------- Cards ----------

export const formatCardNumber = (value: string) =>
  digits(value)
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ');

export const cardBrand = (value: string) => {
  const d = digits(value);
  if (/^4/.test(d)) return 'Visa';
  if (/^(5[1-5]|2[2-7])/.test(d)) return 'Mastercard';
  return null;
};

/** Luhn checksum, the check every card number passes. */
export const isValidCardNumber = (value: string) => {
  const d = digits(value);
  if (d.length < 13 || d.length > 19) return false;
  let sum = 0;
  for (let i = 0; i < d.length; i += 1) {
    let n = Number(d[d.length - 1 - i]);
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  }
  return sum % 10 === 0;
};

export const formatExpiry = (value: string) => {
  const d = digits(value).slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

export const isValidExpiry = (value: string, now = new Date()) => {
  const [mm, yy] = value.split('/').map(Number);
  if (!mm || !yy || mm < 1 || mm > 12) return false;
  const expiry = new Date(2000 + yy, mm, 0, 23, 59);
  return expiry >= now;
};

// ---------- Orders ----------

export const newOrderNumber = (date = new Date()) => {
  const stamp = `${String(date.getFullYear()).slice(2)}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  return `RT${stamp}-${Math.floor(1000 + Math.random() * 9000)}`;
};

/** Simulated payment while PAYMENTS_LIVE is false: waits like a real confirmation would. */
export const processPayment = async (method: PaymentMethodId) => {
  const wait = isWallet(method) ? 4200 : 2400;
  await new Promise((resolve) => setTimeout(resolve, wait));
  return { reference: `${method.toUpperCase()}-${Date.now().toString(36).toUpperCase()}` };
};

export const orderPath = (order: Pick<Order, 'number'>) => `/encomenda/${order.number}`;

const dateTime = new Intl.DateTimeFormat('pt-PT', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
export const formatOrderDate = (iso: string) => dateTime.format(new Date(iso));

export const deliveryLine = (order: Order) =>
  order.delivery.method === 'levantamento'
    ? `Levantamento na loja, ${STORE.address}`
    : [order.delivery.street, order.delivery.neighbourhood, order.delivery.city, order.delivery.province].filter(Boolean).join(', ');

/** WhatsApp message that sends the whole order to the store. */
export const orderWhatsappUrl = (order: Order) => {
  const lines = order.lines.map((line) => `${line.quantity} × ${line.name} (${formatPrice(line.price * line.quantity)})`);
  const message = [
    `Olá Rhulany Tech, segue a minha encomenda ${order.number}`,
    '',
    ...lines,
    '',
    `Total: ${formatPrice(order.subtotal)}`,
    `Pagamento: ${paymentName(order.payment.method)}`,
    `Entrega: ${deliveryLine(order)}`,
    order.delivery.reference ? `Referência: ${order.delivery.reference}` : '',
    '',
    `${order.customer.name}, ${order.customer.phone}`,
  ].filter((line, index, all) => line !== '' || all[index - 1] !== '');
  return `${STORE.whatsappUrl}?text=${encodeURIComponent(message.join('\n'))}`;
};
