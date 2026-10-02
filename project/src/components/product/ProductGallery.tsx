import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import type { CatalogProduct, Finish, ResolvedView } from '../../lib/catalog';
import { easeOutExpo } from '../../lib/motion';
import { LazyPhoneScene } from '../payments/LazyRealisticPhone';

const ANGLE_LABELS: Record<ResolvedView['angle'], string> = {
  frente: 'Frente',
  traseira: 'Traseira',
  lateral: 'Lateral',
  'tres-quartos': '3/4',
  camara: 'Câmara',
  detalhe: 'Detalhe',
  ambiente: 'Em contexto',
};

// Camera presets for 3D angles: rotation in degrees, scale, and offset (phone widths) to frame details.
const PRESETS: Partial<Record<ResolvedView['angle'], { rx: number; ry: number; s: number; ox: number; oy: number }>> = {
  frente: { rx: 0, ry: 0, s: 1, ox: 0, oy: 0 },
  traseira: { rx: 0, ry: 180, s: 1, ox: 0, oy: 0 },
  lateral: { rx: 4, ry: 80, s: 1, ox: 0, oy: 0 },
  'tres-quartos': { rx: 8, ry: -34, s: 1, ox: 0, oy: 0 },
  camara: { rx: 6, ry: 172, s: 2.1, ox: 0.4, oy: -1.5 },
};

const SWIPE_DISTANCE = 50;
const tween = { duration: 0.9, ease: [...easeOutExpo] as [number, number, number, number] };

interface ProductGalleryProps {
  product: CatalogProduct;
  /** Views for the selected colour (see galleryFor); defaults to the product gallery. */
  views?: ResolvedView[];
  finish?: Finish;
}

const ProductGallery = ({ product, views = product.gallery, finish }: ProductGalleryProps) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  // A new colour brings its own photos: start again from its hero shot with a straight crossfade.
  const [shownViews, setShownViews] = useState(views);
  if (shownViews !== views) {
    setShownViews(views);
    setIndex(0);
    setDirection(0);
  }
  const view = views[index];
  const uses3d = Boolean(product.scene3d);
  const is3dView = uses3d && !view?.url;
  const prefersReducedMotion = useReducedMotion();

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const scale = useMotionValue(1);
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);

  // Move the 3D camera to the selected angle.
  useEffect(() => {
    const preset = view && PRESETS[view.angle];
    if (!uses3d || !preset) return;
    const options = prefersReducedMotion ? { duration: 0 } : tween;
    const controls = [
      animate(rotateX, preset.rx, options),
      animate(rotateY, preset.ry, options),
      animate(scale, preset.s, options),
      animate(offsetX, preset.ox, options),
      animate(offsetY, preset.oy, options),
    ];
    return () => controls.forEach((control) => control.stop());
  }, [view, uses3d, prefersReducedMotion, rotateX, rotateY, scale, offsetX, offsetY]);

  const go = (next: number) => {
    if (!views.length) return;
    const target = (next + views.length) % views.length;
    setDirection(target > index ? 1 : -1);
    setIndex(target);
  };

  // Pointer: mouse drags rotate the 3D model; touch swipes change the angle (or photo).
  const drag = useRef<{ x: number; y: number; ry: number; rx: number; pointer: string } | null>(null);
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    drag.current = { x: event.clientX, y: event.clientY, ry: rotateY.get(), rx: rotateX.get(), pointer: event.pointerType };
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const start = drag.current;
    if (!start || start.pointer !== 'mouse' || !is3dView || !(event.buttons & 1)) return;
    rotateY.set(start.ry + (event.clientX - start.x) * 0.45);
    rotateX.set(Math.max(-25, Math.min(25, start.rx - (event.clientY - start.y) * 0.2)));
  };
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = drag.current;
    drag.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    if ((start.pointer !== 'mouse' || !is3dView) && Math.abs(dx) > SWIPE_DISTANCE) go(index + (dx < 0 ? 1 : -1));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') go(index + 1);
    if (event.key === 'ArrowLeft') go(index - 1);
  };

  const photoFallback = (
    <img src={product.primaryImage} alt={product.title} className="absolute inset-0 h-full w-full object-cover" />
  );

  return (
    <div>
      <div
        role="region"
        aria-roledescription="galeria"
        aria-label={`Imagens de ${product.title}`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (drag.current = null)}
        className={`relative aspect-[4/5] touch-pan-y select-none overflow-hidden rounded-[28px] bg-mist outline-offset-4 lg:aspect-auto lg:h-[min(78svh,780px)] ${
          is3dView ? 'cursor-grab active:cursor-grabbing' : ''
        }`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_90%,rgba(12,12,13,0.10),transparent_60%)]" />

        {uses3d && (
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: is3dView ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            aria-hidden={!is3dView}
          >
            <LazyPhoneScene
              rotateX={rotateX}
              rotateY={rotateY}
              scale={scale}
              offsetX={offsetX}
              offsetY={offsetY}
              finish={finish?.model}
              screen="lock"
              lockStage={0}
              fit={0.72}
              fallback={photoFallback}
            />
          </motion.div>
        )}

        <AnimatePresence initial={false} custom={direction}>
          {view?.url && (
            <motion.img
              key={view.url}
              src={view.url}
              alt={view.alt}
              draggable={false}
              custom={direction}
              className="absolute inset-0 h-full w-full object-cover"
              variants={{
                enter: (d: number) => ({ opacity: 0, x: d * 40, scale: 1.02 }),
                center: { opacity: 1, x: 0, scale: 1 },
                exit: (d: number) => ({ opacity: 0, x: d * -40 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: easeOutExpo }}
            />
          )}
        </AnimatePresence>

        {is3dView && (
          <p className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-ink/45 max-lg:hidden">
            Arraste para rodar
          </p>
        )}
        {views.length > 1 && (
          <p className="pointer-events-none absolute right-5 top-5 text-xs tabular-nums text-ink/50" aria-live="polite">
            {index + 1} / {views.length}
          </p>
        )}
      </div>

      {views.length > 1 && (
        <div
          role="tablist"
          aria-label="Escolher vista"
          className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {views.map((item, i) => {
            const isActive = i === index;
            return (
              <button
                key={`${item.angle}-${i}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => go(i)}
                className={`relative isolate shrink-0 overflow-hidden transition-colors duration-300 ${
                  item.url && !uses3d
                    ? `h-20 w-16 rounded-xl ring-1 ring-inset ${isActive ? 'ring-ink' : 'ring-transparent hover:ring-ink/30'}`
                    : `h-10 rounded-full px-4 text-sm ${isActive ? 'text-paper' : 'text-ink/60 hover:text-ink'}`
                }`}
              >
                {item.url && !uses3d ? (
                  <img src={item.url} alt={item.alt} className="h-full w-full object-cover" />
                ) : (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId={`gallery-tab-${product.id}`}
                        className="absolute inset-0 -z-10 rounded-full bg-ink"
                        transition={{ duration: 0.4, ease: easeOutExpo }}
                      />
                    )}
                    {ANGLE_LABELS[item.angle]}
                  </>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
