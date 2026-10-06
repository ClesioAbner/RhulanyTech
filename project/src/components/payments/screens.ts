import { getProductById } from '../../lib/catalog';
import { formatPrice } from '../../lib/format';

/*
 * The showcase phone's screens, painted on a 2D canvas. The canvas is shown on the front of the CSS 3D
 * phone, or used as a texture by the WebGL phone (see screenTexture.ts).
 * Coordinates below are in screen points (240 x 524); the canvas is rendered at 2x for sharpness.
 */

export const SCREEN_W = 240;
export const SCREEN_H = 524;
const DPR = 2;
const TRANSITION_MS = 450;
const NOTIFICATION_MS = 600;

const SANS = 'Inter, ui-sans-serif, system-ui, sans-serif';
const DISPLAY = '"Inter Tight", Inter, ui-sans-serif, system-ui, sans-serif';
const INK = '#0C0C0D';
const PAPER = '#F5F5F7';

// The phone on show is the iPhone 17 Pro in Deep Blue.
const showcase = getProductById('39');
const PRODUCT_NAME = showcase?.title ?? 'iPhone 17 Pro';
const PRICE = formatPrice(showcase?.price ?? 165000);

export type ScreenKey = 'lock' | 'checkout' | 'method-0' | 'method-1' | 'method-2' | 'method-3' | 'method-4' | 'card-paid';

type Ctx = CanvasRenderingContext2D;

const easeOut = (t: number) => 1 - (1 - t) ** 3;

const roundRect = (ctx: Ctx, x: number, y: number, w: number, h: number, r: number) => {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
};

interface TextOptions {
  size: number;
  weight?: number;
  color: string;
  family?: string;
  align?: CanvasTextAlign;
  spacing?: number;
  italic?: boolean;
}

const text = (ctx: Ctx, value: string, x: number, y: number, o: TextOptions) => {
  ctx.font = `${o.italic ? 'italic ' : ''}${o.weight ?? 400} ${o.size}px ${o.family ?? SANS}`;
  ctx.fillStyle = o.color;
  ctx.textAlign = o.align ?? 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.letterSpacing = `${o.spacing ?? 0}px`;
  ctx.fillText(value, x, y);
  ctx.letterSpacing = '0px';
};

// Greedy word wrap; returns the y of the last line.
const wrap = (ctx: Ctx, value: string, x: number, y: number, maxWidth: number, lineHeight: number, o: TextOptions) => {
  ctx.font = `${o.weight ?? 400} ${o.size}px ${o.family ?? SANS}`;
  let line = '';
  let cursor = y;
  for (const word of value.split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      text(ctx, line, x, cursor, o);
      line = word;
      cursor += lineHeight;
    } else {
      line = next;
    }
  }
  if (line) text(ctx, line, x, cursor, o);
  return cursor;
};

const statusBar = (ctx: Ctx, color: string) => {
  text(ctx, '9:41', 30, 28, { size: 10.5, weight: 600, color });
  text(ctx, '5G', SCREEN_W - 26, 28, { size: 10, weight: 600, color, align: 'right' });
};

const button = (ctx: Ctx, label: string, fill: string, color: string, y = 456) => {
  roundRect(ctx, 20, y, SCREEN_W - 40, 44, 22);
  ctx.fillStyle = fill;
  ctx.fill();
  text(ctx, label, SCREEN_W / 2, y + 27, { size: 13, weight: 500, color, align: 'center' });
};

// ---------- Screens ----------

// Lock screen wallpaper in the phone's own blue.
const drawWallpaper = (ctx: Ctx) => {
  const bg = ctx.createLinearGradient(0, 0, 0, SCREEN_H);
  bg.addColorStop(0, '#16233f');
  bg.addColorStop(0.5, '#0a1020');
  bg.addColorStop(1, '#101a33');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

  const glow = ctx.createRadialGradient(190, 130, 0, 190, 130, 160);
  glow.addColorStop(0, 'rgba(84,132,255,0.5)');
  glow.addColorStop(1, 'rgba(84,132,255,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

  const arc = (cx: number, cy: number, rx: number, ry: number, rotation: number, fill: string) => {
    const stroke = ctx.createLinearGradient(cx - rx, cy - ry, cx + rx, cy + ry);
    stroke.addColorStop(0, '#b9d0ff');
    stroke.addColorStop(0.5, '#4a7bff');
    stroke.addColorStop(1, '#0d2a7a');
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, (rotation * Math.PI) / 180, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.shadowColor = 'rgba(90,140,255,0.9)';
    ctx.shadowBlur = 14;
    ctx.lineWidth = 3;
    ctx.strokeStyle = stroke;
    ctx.stroke();
    ctx.restore();
  };

  arc(168, 96, 72, 115, -28, '#1a2747');
  arc(232, 308, 106, 168, 0, '#0e1630');
  arc(144, 456, 86, 139, 32, '#142042');
};

interface NotificationSpec {
  body: string;
  emphasis?: string;
}

const NOTIFICATIONS: NotificationSpec[] = [
  { body: `${PRODUCT_NAME} já disponível em Maputo` },
  { body: 'Preço de lançamento', emphasis: PRICE },
  { body: 'Pague com M-Pesa, e-Mola, mKesh, cartão ou PayPal' },
];

const drawLock = (ctx: Ctx, notificationProgress: number[]) => {
  drawWallpaper(ctx);
  text(ctx, 'Rhulany', 30, 28, { size: 10.5, weight: 600, color: 'rgba(255,255,255,0.85)' });
  text(ctx, '5G', SCREEN_W - 26, 28, { size: 10, weight: 600, color: 'rgba(255,255,255,0.85)', align: 'right' });

  const date = new Intl.DateTimeFormat('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
  text(ctx, date.charAt(0).toUpperCase() + date.slice(1), SCREEN_W / 2, 82, {
    size: 11,
    weight: 500,
    color: 'rgba(255,255,255,0.88)',
    align: 'center',
  });
  text(ctx, '9:41', SCREEN_W / 2, 148, { size: 66, weight: 600, color: '#fff', family: DISPLAY, align: 'center', spacing: -1 });

  // Notifications stack upwards from just above the home indicator.
  let bottom = SCREEN_H - 34;
  const visible = NOTIFICATIONS.map((spec, i) => ({ spec, p: notificationProgress[i] ?? 0 })).filter((n) => n.p > 0);
  for (const { spec, p } of visible.reverse()) {
    const height = spec.emphasis ? 70 : 54;
    const t = easeOut(p);
    const y = bottom - height + (1 - t) * 24;
    ctx.save();
    ctx.globalAlpha = t;
    roundRect(ctx, 12, y, SCREEN_W - 24, height, 14);
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fill();
    text(ctx, 'RHULANY TECH', 24, y + 18, { size: 8.5, weight: 600, color: 'rgba(255,255,255,0.75)', spacing: 1 });
    text(ctx, 'agora', SCREEN_W - 24, y + 18, { size: 9, color: 'rgba(255,255,255,0.75)', align: 'right' });
    wrap(ctx, spec.body, 24, y + 35, SCREEN_W - 48, 14, { size: 11.5, color: '#fff' });
    if (spec.emphasis) {
      text(ctx, spec.emphasis, 24, y + 58, { size: 16, weight: 600, color: '#fff', family: DISPLAY });
    }
    ctx.restore();
    bottom -= height * t + 8 * t;
  }

  roundRect(ctx, SCREEN_W / 2 - 40, SCREEN_H - 16, 80, 4, 2);
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.fill();
};

const drawCheckout = (ctx: Ctx) => {
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  statusBar(ctx, 'rgba(12,12,13,0.7)');
  text(ctx, 'RHULANY TECH', 22, 74, { size: 10, weight: 600, color: 'rgba(12,12,13,0.45)', spacing: 1.6 });
  text(ctx, 'Total da encomenda', 22, 104, { size: 13, color: 'rgba(12,12,13,0.6)' });
  text(ctx, PRICE, 22, 134, { size: 27, weight: 500, color: INK, family: DISPLAY, spacing: -0.5 });
  ['M-Pesa', 'e-Mola', 'mKesh', 'Cartão', 'PayPal'].forEach((label, i) => {
    const y = 160 + i * 46;
    roundRect(ctx, 22, y, SCREEN_W - 44, 38, 10);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = 'rgba(12,12,13,0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();
    text(ctx, label, 36, y + 24, { size: 12, color: INK });
    ctx.beginPath();
    ctx.arc(SCREEN_W - 40, y + 19, 6, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(12,12,13,0.25)';
    ctx.stroke();
  });
  text(ctx, 'Escolha como pagar', SCREEN_W / 2, 486, { size: 11, color: 'rgba(12,12,13,0.45)', align: 'center' });
};

// ---------- Wallet marks, drawn after each brand's logo ----------

// M-Pesa: a white phone outline with a green banknote across it, and the "m-pesa" wordmark.
const mpesaMark = (ctx: Ctx, x: number, y: number) => {
  ctx.save();
  roundRect(ctx, x, y, 22, 38, 4);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2.6;
  ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.fillRect(x + 8, y + 3.2, 6, 1.6);
  for (let i = 0; i < 3; i++) ctx.fillRect(x + 5.5 + i * 4.2, y + 33, 2.4, 1.8);
  // Banknote, curling across the phone
  ctx.beginPath();
  ctx.moveTo(x - 5, y + 17);
  ctx.bezierCurveTo(x + 6, y + 9, x + 18, y + 9, x + 30, y + 13);
  ctx.lineTo(x + 27, y + 21);
  ctx.bezierCurveTo(x + 16, y + 18, x + 6, y + 19, x - 3, y + 24);
  ctx.closePath();
  ctx.fillStyle = '#58B947';
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 30, y + 13);
  ctx.lineTo(x + 27, y + 21);
  ctx.lineTo(x + 33, y + 17);
  ctx.closePath();
  ctx.fillStyle = '#2F7D2A';
  ctx.fill();
  ctx.restore();
  text(ctx, 'm-pesa', x + 40, y + 29, { size: 22, weight: 700, color: '#fff', family: DISPLAY, spacing: -0.3 });
};

// e-Mola: a white keypad phone with an antenna and a banknote, and the "e-Mola" wordmark.
const emolaMark = (ctx: Ctx, x: number, y: number, orange: string) => {
  ctx.save();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(x + 4, y + 7);
  ctx.lineTo(x + 4, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + 4, y + 1, 3.5, -Math.PI * 0.85, -Math.PI * 0.15);
  ctx.stroke();
  roundRect(ctx, x, y + 6, 20, 32, 3);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.fillStyle = orange;
  ctx.fillRect(x + 3, y + 9, 14, 8);
  for (let row = 0; row < 4; row++) for (let col = 0; col < 3; col++) ctx.fillRect(x + 3.5 + col * 4.8, y + 20 + row * 4.3, 3.2, 2.8);
  // Banknote leaning on the phone
  ctx.translate(x + 23, y + 18);
  ctx.rotate(-0.5);
  roundRect(ctx, -6, -8, 14, 22, 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.strokeStyle = orange;
  ctx.lineWidth = 1;
  ctx.stroke();
  text(ctx, '$', 1, 7, { size: 10, weight: 800, color: orange, align: 'center' });
  ctx.restore();
  text(ctx, 'e-Mola', x + 40, y + 31, { size: 22, weight: 800, color: '#fff', family: DISPLAY, spacing: -0.3 });
};

// mKesh: a teal phone with ":$" on its screen, and "m" in white with "kesh" in teal.
const MKESH_TEAL = '#1E9EA3';
const mkeshMark = (ctx: Ctx, x: number, y: number) => {
  roundRect(ctx, x, y, 24, 38, 5);
  ctx.fillStyle = MKESH_TEAL;
  ctx.fill();
  roundRect(ctx, x + 3.5, y + 5, 17, 25, 2.5);
  ctx.fillStyle = '#fff';
  ctx.fill();
  roundRect(ctx, x + 9, y + 32.5, 6, 2.5, 1.2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  text(ctx, ':$', x + 12, y + 23.5, { size: 13, weight: 800, color: MKESH_TEAL, align: 'center' });
  text(ctx, 'm', x + 34, y + 30, { size: 24, weight: 800, color: '#fff', family: DISPLAY });
  ctx.font = `800 24px ${DISPLAY}`;
  text(ctx, 'kesh', x + 34 + ctx.measureText('m').width, y + 30, { size: 24, weight: 800, color: MKESH_TEAL, family: DISPLAY });
};

const drawMpesa = (ctx: Ctx) => {
  ctx.fillStyle = '#E60000';
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  statusBar(ctx, 'rgba(255,255,255,0.85)');
  mpesaMark(ctx, 26, 50);
  text(ctx, 'Vodacom Moçambique', 22, 106, { size: 11, color: 'rgba(255,255,255,0.75)' });
  roundRect(ctx, 22, 118, SCREEN_W - 44, 104, 12);
  ctx.fillStyle = '#fff';
  ctx.fill();
  text(ctx, 'Pagar a', 38, 142, { size: 11, color: 'rgba(12,12,13,0.5)' });
  text(ctx, 'Rhulany Tech', 38, 160, { size: 14, weight: 500, color: INK });
  text(ctx, 'Montante', 38, 184, { size: 11, color: 'rgba(12,12,13,0.5)' });
  text(ctx, PRICE, 38, 207, { size: 20, weight: 500, color: INK, family: DISPLAY });
  text(ctx, 'Introduza o seu PIN', SCREEN_W / 2, 266, { size: 12, color: 'rgba(255,255,255,0.88)', align: 'center' });
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.arc(SCREEN_W / 2 - 30 + i * 20, 286, 5, 0, Math.PI * 2);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    if (i < 3) {
      ctx.fillStyle = '#fff';
      ctx.fill();
    }
  }
  button(ctx, 'Confirmar', '#fff', '#E60000');
};

const drawEmola = (ctx: Ctx) => {
  ctx.fillStyle = '#F47B20';
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  statusBar(ctx, 'rgba(255,255,255,0.85)');
  emolaMark(ctx, 26, 46, '#F47B20');
  text(ctx, 'Movitel', 22, 106, { size: 11, color: 'rgba(255,255,255,0.8)' });
  roundRect(ctx, 22, 118, SCREEN_W - 44, 112, 12);
  ctx.fillStyle = 'rgba(255,255,255,0.16)';
  ctx.fill();
  text(ctx, 'Pedido de pagamento', 38, 142, { size: 11, color: 'rgba(255,255,255,0.75)' });
  text(ctx, 'Rhulany Tech', 38, 160, { size: 14, weight: 500, color: '#fff' });
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillRect(38, 174, SCREEN_W - 76, 1);
  text(ctx, 'Total', 38, 194, { size: 11, color: 'rgba(255,255,255,0.75)' });
  text(ctx, PRICE, 38, 217, { size: 19, weight: 500, color: '#fff', family: DISPLAY });
  roundRect(ctx, 22, 244, SCREEN_W - 44, 62, 12);
  ctx.fillStyle = 'rgba(255,255,255,0.16)';
  ctx.fill();
  wrap(ctx, 'O saldo da carteira é actualizado logo após a aprovação.', 38, 268, SCREEN_W - 76, 15, {
    size: 11,
    color: 'rgba(255,255,255,0.88)',
  });
  button(ctx, 'Aprovar pagamento', '#fff', '#F47B20');
};

// mKesh, the Tmcel wallet: yellow, with its teal phone and wordmark.
const drawMkesh = (ctx: Ctx) => {
  ctx.fillStyle = '#F9C300';
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  statusBar(ctx, 'rgba(12,12,13,0.75)');
  mkeshMark(ctx, 26, 50);
  text(ctx, 'Tmcel', 22, 106, { size: 11, color: 'rgba(12,12,13,0.6)' });
  roundRect(ctx, 22, 118, SCREEN_W - 44, 104, 12);
  ctx.fillStyle = '#fff';
  ctx.fill();
  text(ctx, 'Pedido de pagamento de', 38, 142, { size: 11, color: 'rgba(12,12,13,0.5)' });
  text(ctx, 'Rhulany Tech', 38, 160, { size: 14, weight: 500, color: INK });
  text(ctx, 'Montante', 38, 184, { size: 11, color: 'rgba(12,12,13,0.5)' });
  text(ctx, PRICE, 38, 207, { size: 20, weight: 500, color: INK, family: DISPLAY });
  roundRect(ctx, 22, 238, SCREEN_W - 44, 58, 12);
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.fill();
  wrap(ctx, 'Aprove com o seu PIN mKesh e receba o recibo por SMS.', 38, 262, SCREEN_W - 76, 15, {
    size: 11,
    color: 'rgba(12,12,13,0.78)',
  });
  button(ctx, 'Aprovar', MKESH_TEAL, '#fff');
};

const VISA_FONT = '"Arial Black", Arial, sans-serif';

// Contactless waves, as on cards and terminals.
const contactless = (ctx: Ctx, cx: number, cy: number, color: string) => {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(cx - 14, cy, 10 + i * 9, -0.85, 0.85);
    ctx.stroke();
  }
  ctx.restore();
};

const cardHeader = (ctx: Ctx) => {
  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  statusBar(ctx, 'rgba(255,255,255,0.85)');
  text(ctx, 'PAGAMENTO COM CARTÃO', 22, 74, { size: 9.5, weight: 600, color: 'rgba(255,255,255,0.5)', spacing: 1.4 });
};

const cardDetails = (ctx: Ctx) => {
  text(ctx, 'Comerciante', 22, 330, { size: 12, color: 'rgba(255,255,255,0.6)' });
  text(ctx, 'Rhulany Tech', SCREEN_W - 22, 330, { size: 12, color: '#fff', align: 'right' });
  text(ctx, 'Montante', 22, 354, { size: 12, color: 'rgba(255,255,255,0.6)' });
  text(ctx, PRICE, SCREEN_W - 22, 354, { size: 12, color: '#fff', align: 'right' });
};

// Waiting for the card: the visitor's card is out of the phone, about to tap it.
const drawCard = (ctx: Ctx) => {
  cardHeader(ctx);
  const cx = SCREEN_W / 2;
  const cy = 176;
  [58, 42].forEach((r, i) => {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = i ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)';
    ctx.fill();
  });
  contactless(ctx, cx, cy, '#fff');
  text(ctx, 'Aproxime o cartão', cx, 266, { size: 16, weight: 500, color: '#fff', align: 'center' });
  text(ctx, 'Visa, Mastercard ou Rhulany Classic', cx, 286, { size: 11, color: 'rgba(255,255,255,0.55)', align: 'center' });
  cardDetails(ctx);
  roundRect(ctx, 20, 456, SCREEN_W - 40, 44, 22);
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 1;
  ctx.stroke();
  text(ctx, 'A aguardar o cartão', cx, 483, { size: 13, weight: 500, color: 'rgba(255,255,255,0.75)', align: 'center' });
};

// Approved after the tap.
const drawCardPaid = (ctx: Ctx) => {
  cardHeader(ctx);
  const cx = SCREEN_W / 2;
  const cy = 176;
  ctx.beginPath();
  ctx.arc(cx, cy, 44, 0, Math.PI * 2);
  ctx.fillStyle = '#22B36B';
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx - 17, cy + 1);
  ctx.lineTo(cx - 5, cy + 13);
  ctx.lineTo(cx + 18, cy - 12);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
  text(ctx, 'Pagamento aprovado', cx, 266, { size: 16, weight: 600, color: '#fff', align: 'center' });
  text(ctx, 'Rhulany Classic •••• 4821', cx - 18, 288, { size: 11, color: 'rgba(255,255,255,0.6)', align: 'center' });
  text(ctx, 'VISA', cx + 66, 288, { size: 11, weight: 900, color: '#fff', italic: true, align: 'center', family: VISA_FONT });
  cardDetails(ctx);
  button(ctx, 'Concluir', '#fff', INK);
};

const drawPaypal = (ctx: Ctx) => {
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  statusBar(ctx, 'rgba(0,28,100,0.7)');
  text(ctx, 'Pay', 22, 80, { size: 24, weight: 800, color: '#001C64', italic: true });
  ctx.font = `italic 800 24px ${SANS}`;
  text(ctx, 'Pal', 22 + ctx.measureText('Pay').width, 80, { size: 24, weight: 800, color: '#0070E0', italic: true });
  text(ctx, 'Olá! Está a pagar a', 22, 128, { size: 13, color: 'rgba(0,28,100,0.7)' });
  text(ctx, 'Rhulany Tech', 22, 148, { size: 15, weight: 500, color: '#001C64' });
  roundRect(ctx, 22, 168, SCREEN_W - 44, 88, 12);
  ctx.fillStyle = '#F1F5FB';
  ctx.fill();
  text(ctx, 'Montante', 38, 192, { size: 11, color: 'rgba(0,28,100,0.6)' });
  text(ctx, PRICE, 38, 216, { size: 20, weight: 500, color: '#001C64', family: DISPLAY });
  text(ctx, '≈ convertido na sua moeda', 38, 238, { size: 11, color: 'rgba(0,28,100,0.6)' });
  button(ctx, 'Pagar agora', '#0070E0', '#fff');
};

const DRAWERS: Record<Exclude<ScreenKey, 'lock'>, (ctx: Ctx) => void> = {
  checkout: drawCheckout,
  'method-0': drawMpesa,
  'method-1': drawEmola,
  'method-2': drawMkesh,
  'method-3': drawCard,
  'card-paid': drawCardPaid,
  'method-4': drawPaypal,
};

const drawIsland = (ctx: Ctx) => {
  roundRect(ctx, SCREEN_W / 2 - 39, 11, 78, 25, 12.5);
  ctx.fillStyle = '#000';
  ctx.fill();
};

/** Owns the screen canvas and animates between screens; call `update` every frame. */
export class ScreenPainter {
  readonly canvas: HTMLCanvasElement;
  private readonly ctx: Ctx;
  private current: ScreenKey = 'lock';
  private previous: ScreenKey | null = null;
  private transitionStart = 0;
  private lockStage = 0;
  private notificationStart: number[] = [];
  private dirty = true;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = SCREEN_W * DPR;
    this.canvas.height = SCREEN_H * DPR;
    this.ctx = this.canvas.getContext('2d')!;
    // Redraw once web fonts are ready so the first frame doesn't keep fallback glyphs.
    void document.fonts?.ready.then(() => {
      this.dirty = true;
    });
  }

  setScreen(key: ScreenKey, lockStage: number, now: number) {
    if (key !== this.current) {
      this.previous = this.current;
      this.current = key;
      this.transitionStart = now;
      this.dirty = true;
    }
    if (lockStage !== this.lockStage) {
      for (let i = 0; i < NOTIFICATIONS.length; i++) {
        if (i < lockStage && this.notificationStart[i] === undefined) this.notificationStart[i] = now;
        if (i >= lockStage) delete this.notificationStart[i];
      }
      this.lockStage = lockStage;
      this.dirty = true;
    }
  }

  private paint(key: ScreenKey, now: number) {
    if (key === 'lock') {
      const progress = NOTIFICATIONS.map((_, i) => {
        const start = this.notificationStart[i];
        return start === undefined ? 0 : Math.min(1, (now - start) / NOTIFICATION_MS);
      });
      drawLock(this.ctx, progress);
    } else {
      DRAWERS[key](this.ctx);
    }
  }

  /** Repaints when something changed; returns whether it did. */
  update(now: number) {
    const transition = this.previous ? Math.min(1, (now - this.transitionStart) / TRANSITION_MS) : 1;
    const animatingNotifications = this.notificationStart.some((start) => start !== undefined && now - start < NOTIFICATION_MS);
    if (!this.dirty && transition >= 1 && !animatingNotifications) return false;

    const ctx = this.ctx;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, SCREEN_W, SCREEN_H);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

    if (this.previous && transition < 1) {
      const t = easeOut(transition);
      ctx.save();
      ctx.globalAlpha = 1 - t;
      ctx.translate(0, -12 * t);
      this.paint(this.previous, now);
      ctx.restore();
      ctx.save();
      ctx.globalAlpha = t;
      ctx.translate(0, 18 * (1 - t));
      this.paint(this.current, now);
      ctx.restore();
    } else {
      this.previous = null;
      this.paint(this.current, now);
    }
    drawIsland(ctx);
    this.dirty = false;
    return true;
  }
}
