import { DISPLAY, PRICE, PRODUCT_NAME, SCREEN_H, SCREEN_W, easeOut, roundRect, text, wrap, type Ctx } from './canvas';

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

export const NOTIFICATIONS: NotificationSpec[] = [
  { body: `${PRODUCT_NAME} já disponível em Maputo` },
  { body: 'Preço de lançamento', emphasis: PRICE },
  { body: 'Pague com M-Pesa, e-Mola, mKesh, cartão ou PayPal' },
];

export const drawLock = (ctx: Ctx, notificationProgress: number[]) => {
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
