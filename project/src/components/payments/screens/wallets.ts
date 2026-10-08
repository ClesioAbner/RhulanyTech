import { DISPLAY, INK, PRICE, SCREEN_H, SCREEN_W, button, roundRect, statusBar, text, wrap, type Ctx } from './canvas';

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
  for (let row = 0; row < 4; row++)
    for (let col = 0; col < 3; col++) ctx.fillRect(x + 3.5 + col * 4.8, y + 20 + row * 4.3, 3.2, 2.8);
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

export const drawMpesa = (ctx: Ctx) => {
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

export const drawEmola = (ctx: Ctx) => {
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
export const drawMkesh = (ctx: Ctx) => {
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
