import { INK, PRICE, SCREEN_H, SCREEN_W, button, roundRect, statusBar, text, type Ctx } from './canvas';

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
export const drawCard = (ctx: Ctx) => {
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
export const drawCardPaid = (ctx: Ctx) => {
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
