import { DISPLAY, PRICE, SANS, SCREEN_H, SCREEN_W, button, roundRect, statusBar, text, type Ctx } from './canvas';

export const drawPaypal = (ctx: Ctx) => {
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
