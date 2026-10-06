import { STORE } from '../data/store';
import type { Order } from '../stores/orderStore';
import { PAYMENTS_LIVE, deliveryLine, formatOrderDate, paymentName } from './checkout';
import { formatPrice } from './format';

// jsPDF's built-in fonts cover Latin-1; Intl uses narrow no-break spaces in numbers, so normalise them.
const pdfText = (text: string) => text.replace(/[\u00A0\u202F]/g, ' ');
const money = (value: number) => pdfText(formatPrice(value));

/** Plain text in the receipt's QR code, readable by any phone camera. */
const receiptQrText = (order: Order) =>
  ['Rhulany Tech', `Encomenda ${order.number}`, formatOrderDate(order.createdAt), `Total ${formatPrice(order.subtotal)}`]
    .map(pdfText)
    .join('\n');

export const receiptQrDataUrl = async (order: Order) => {
  const { toDataURL } = await import('qrcode');
  return toDataURL(receiptQrText(order), { margin: 1, width: 360, color: { dark: '#0C0C0D', light: '#FFFFFF' } });
};

/** Builds an A4 receipt with vector text (sharp at any zoom) and saves it. */
export const downloadReceiptPdf = async (order: Order) => {
  const [{ jsPDF }, qr] = await Promise.all([import('jspdf'), receiptQrDataUrl(order)]);
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  const left = 18;
  const right = 192;
  const ink: [number, number, number] = [12, 12, 13];
  const muted: [number, number, number] = [120, 120, 125];
  let y = 24;

  const text = (
    value: string,
    x: number,
    size = 10,
    color = ink,
    style: 'normal' | 'bold' = 'normal',
    align: 'left' | 'right' = 'left',
  ) => {
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
    doc.text(pdfText(value), x, y, { align });
  };
  const rule = (weight = 0.2) => {
    doc.setDrawColor(225, 225, 230);
    doc.setLineWidth(weight);
    doc.line(left, y, right, y);
  };

  // Header
  text('Rhulany', left, 18, ink, 'bold');
  doc.setTextColor(...muted);
  doc.text('Tech', left + doc.getTextWidth('Rhulany') + 0.6, y);
  text('RECIBO', right, 9, muted, 'normal', 'right');
  y += 6;
  text(order.number, right, 13, ink, 'bold', 'right');
  text(`${STORE.address}  |  ${STORE.phone}  |  ${STORE.email}`, left, 8.5, muted);
  y += 10;
  rule(0.3);

  // Details in two columns
  y += 10;
  const details: [string, string][] = [
    ['Data', formatOrderDate(order.createdAt)],
    ['Pagamento', [paymentName(order.payment.method), order.payment.detail].filter(Boolean).join(', ')],
    ['Cliente', `${order.customer.name}, ${order.customer.phone}`],
    ['Email', order.customer.email],
    ['Entrega', [deliveryLine(order), order.delivery.reference].filter(Boolean).join('. ')],
    ['Ref. de pagamento', order.payment.reference ?? ''],
  ];
  details.forEach(([label, value], index) => {
    const x = index % 2 === 0 ? left : 108;
    if (index % 2 === 0 && index > 0) y += 13;
    text(label.toUpperCase(), x, 7.5, muted);
    // Measure with the value's own size so long addresses wrap inside their column.
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(pdfText(value), 82) as string[];
    doc.setTextColor(...ink);
    doc.text(lines.slice(0, 2), x, y + 5);
  });
  y += 20;
  rule(0.3);

  // Items
  y += 9;
  text('PRODUTO', left, 7.5, muted);
  text('QTD', 132, 7.5, muted, 'normal', 'right');
  text('PREÇO', 160, 7.5, muted, 'normal', 'right');
  text('TOTAL', right, 7.5, muted, 'normal', 'right');
  y += 4;
  rule();
  order.lines.forEach((line) => {
    y += 8;
    text(line.title, left, 10.5, ink, 'bold');
    text(String(line.quantity), 132, 10, ink, 'normal', 'right');
    text(money(line.price), 160, 10, ink, 'normal', 'right');
    text(money(line.price * line.quantity), right, 10, ink, 'normal', 'right');
    if (line.variant) {
      y += 5;
      text(line.variant, left, 8.5, muted);
    }
    y += 4;
    rule();
  });

  // Totals
  y += 9;
  const total = (label: string, value: string, strong = false) => {
    text(label, 140, strong ? 11 : 9.5, strong ? ink : muted, strong ? 'bold' : 'normal');
    text(value, right, strong ? 12 : 9.5, ink, strong ? 'bold' : 'normal', 'right');
    y += strong ? 0 : 7;
  };
  total('Subtotal', money(order.subtotal));
  total('Entrega', order.delivery.method === 'levantamento' ? 'Grátis' : 'A confirmar');
  y += 2;
  total('Total pago', money(order.subtotal), true);

  // QR and closing note
  const qrTop = Math.max(y + 16, 222);
  doc.addImage(qr, 'PNG', left, qrTop, 30, 30, undefined, 'FAST');
  y = qrTop + 8;
  text('Obrigado pela sua compra', left + 36, 12, ink, 'bold');
  y += 6;
  text('Produtos originais com garantia oficial do fabricante', left + 36, 9, muted);
  y += 5;
  text(`Dúvidas: ${STORE.phone} ou ${STORE.email}`, left + 36, 9, muted);
  if (!PAYMENTS_LIVE) {
    y += 5;
    text('Pagamento simulado em modo de demonstração, nenhum valor foi cobrado', left + 36, 8, muted);
  }

  doc.save(`Recibo ${order.number}.pdf`);
};
