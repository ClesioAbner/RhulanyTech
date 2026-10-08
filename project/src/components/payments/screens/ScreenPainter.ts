import { SCREEN_H, SCREEN_W, easeOut, roundRect, type Ctx } from './canvas';
import { drawCard, drawCardPaid } from './card';
import { drawCheckout } from './checkout';
import { NOTIFICATIONS, drawLock } from './lock';
import { drawPaypal } from './paypal';
import { drawEmola, drawMkesh, drawMpesa } from './wallets';

const DPR = 2;
const TRANSITION_MS = 450;
const NOTIFICATION_MS = 600;

export type ScreenKey = 'lock' | 'checkout' | 'method-0' | 'method-1' | 'method-2' | 'method-3' | 'method-4' | 'card-paid';

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
