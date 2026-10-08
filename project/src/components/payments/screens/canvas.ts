import { getProductById } from '../../../lib/catalog';
import { formatPrice } from '../../../lib/format';

/*
 * Shared pieces for the showcase phone's screens, painted on a 2D canvas.
 * Coordinates are in screen points (240 x 524); the canvas is rendered at 2x for sharpness.
 */

export const SCREEN_W = 240;
export const SCREEN_H = 524;

export const SANS = 'Inter, ui-sans-serif, system-ui, sans-serif';
export const DISPLAY = '"Inter Tight", Inter, ui-sans-serif, system-ui, sans-serif';
export const INK = '#0C0C0D';
export const PAPER = '#F5F5F7';

// The phone on show is the iPhone 17 Pro in Deep Blue.
const showcase = getProductById('39');
export const PRODUCT_NAME = showcase?.title ?? 'iPhone 17 Pro';
export const PRICE = formatPrice(showcase?.price ?? 165000);

export type Ctx = CanvasRenderingContext2D;

export const easeOut = (t: number) => 1 - (1 - t) ** 3;

export const roundRect = (ctx: Ctx, x: number, y: number, w: number, h: number, r: number) => {
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

export const text = (ctx: Ctx, value: string, x: number, y: number, o: TextOptions) => {
  ctx.font = `${o.italic ? 'italic ' : ''}${o.weight ?? 400} ${o.size}px ${o.family ?? SANS}`;
  ctx.fillStyle = o.color;
  ctx.textAlign = o.align ?? 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.letterSpacing = `${o.spacing ?? 0}px`;
  ctx.fillText(value, x, y);
  ctx.letterSpacing = '0px';
};

// Greedy word wrap; returns the y of the last line.
export const wrap = (ctx: Ctx, value: string, x: number, y: number, maxWidth: number, lineHeight: number, o: TextOptions) => {
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

export const statusBar = (ctx: Ctx, color: string) => {
  text(ctx, '9:41', 30, 28, { size: 10.5, weight: 600, color });
  text(ctx, '5G', SCREEN_W - 26, 28, { size: 10, weight: 600, color, align: 'right' });
};

export const button = (ctx: Ctx, label: string, fill: string, color: string, y = 456) => {
  roundRect(ctx, 20, y, SCREEN_W - 40, 44, 22);
  ctx.fillStyle = fill;
  ctx.fill();
  text(ctx, label, SCREEN_W / 2, y + 27, { size: 13, weight: 500, color, align: 'center' });
};
