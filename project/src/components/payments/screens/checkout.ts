import { DISPLAY, INK, PAPER, PRICE, SCREEN_H, SCREEN_W, roundRect, statusBar, text, type Ctx } from './canvas';

export const drawCheckout = (ctx: Ctx) => {
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
