import { useEffect, useMemo, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useDragControls, type PanInfo } from 'framer-motion';
import { itemCountLabel, toCartLine, whatsappOrderUrl } from '../../lib/cart';
import { easeOutExpo } from '../../lib/motion';
import { useMediaQuery } from '../../lib/useMediaQuery';
import { useCartStore } from '../../stores/cartStore';
import { useCartUi } from '../../stores/cartUi';
import CartLineItem from './CartLineItem';
import RollingPrice from './RollingPrice';

const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 500;

/*
 * Slide-over cart. Desktop: a floating panel on the right, in the same language as the header.
 * Mobile: a bottom sheet with a grab handle. Adding anything in the store opens it on that line.
 */
const CartDrawer = () => {
  const { isOpen, lastAddedId, close } = useCartUi();
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total);
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const dragControls = useDragControls();

  const lines = useMemo(() => items.map(toCartLine), [items]);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  // Any navigation closes the drawer.
  useEffect(() => close(), [pathname, close]);

  // Lock the page, handle Escape, and move focus in and back out.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    const frame = requestAnimationFrame(() => panelRef.current?.focus({ preventScroll: true }));
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      cancelAnimationFrame(frame);
      previous?.focus?.({ preventScroll: true });
    };
  }, [isOpen, close]);

  // Bring the line that was just added into view.
  useEffect(() => {
    if (!isOpen || !lastAddedId) return;
    const timer = window.setTimeout(() => {
      listRef.current
        ?.querySelector(`[data-line="${CSS.escape(lastAddedId)}"]`)
        ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, 350);
    return () => window.clearTimeout(timer);
  }, [isOpen, lastAddedId, items.length]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > DISMISS_DISTANCE || info.velocity.y > DISMISS_VELOCITY) close();
  };

  const checkout = () => {
    close();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="cart-backdrop"
            className="fixed inset-0 z-[70] bg-ink/30 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.4 }}
            onClick={close}
          />
          <motion.div
            key="cart-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="carrinho-titulo"
            tabIndex={-1}
            className="fixed z-[71] flex flex-col bg-paper shadow-[0_40px_80px_-30px_rgba(12,12,13,0.5)] outline-none max-sm:inset-x-0 max-sm:bottom-0 max-sm:max-h-[92svh] max-sm:rounded-t-[28px] max-sm:pb-[env(safe-area-inset-bottom)] sm:bottom-3 sm:right-3 sm:top-3 sm:w-[440px] sm:rounded-[28px]"
            initial={isDesktop ? { x: '110%' } : { y: '100%' }}
            animate={isDesktop ? { x: 0 } : { y: 0 }}
            exit={
              isDesktop
                ? { x: '110%', transition: { duration: 0.4, ease: easeOutExpo } }
                : { y: '100%', transition: { duration: 0.35, ease: easeOutExpo } }
            }
            transition={{ duration: 0.6, ease: easeOutExpo }}
            drag={isDesktop ? false : 'y'}
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={onDragEnd}
          >
            {!isDesktop && (
              <div
                className="flex touch-none justify-center pb-1 pt-3"
                onPointerDown={(event) => dragControls.start(event)}
                aria-hidden="true"
              >
                <span className="h-1 w-10 rounded-full bg-ink/20" />
              </div>
            )}

            <div className="flex items-center justify-between gap-4 px-6 pb-4 pt-4 sm:pt-6">
              <h2 id="carrinho-titulo" className="font-display text-2xl font-medium tracking-tight">
                Carrinho
                {count > 0 && <span className="ml-2 text-base font-normal text-ink/40">{itemCountLabel(count)}</span>}
              </h2>
              <button
                type="button"
                onClick={close}
                className="h-9 rounded-full bg-ink/[0.05] px-4 text-sm transition-colors hover:bg-ink/[0.1]"
              >
                Fechar
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain pb-6">
              {lines.length > 0 ? (
                <ul ref={listRef} className="space-y-2 px-3">
                  <AnimatePresence>
                    {lines.map((line, index) => (
                      <motion.li
                        key={line.id}
                        data-line={line.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                          opacity: 1,
                          height: 'auto',
                          transition: { duration: 0.5, ease: easeOutExpo, delay: 0.15 + index * 0.04 },
                        }}
                        exit={{ opacity: 0, height: 0, transition: { duration: 0.35, ease: easeOutExpo } }}
                        className={`overflow-hidden rounded-[22px] transition-colors duration-700 ${line.id === lastAddedId ? 'bg-white' : ''}`}
                      >
                        <div className="px-3 py-4">
                          <CartLineItem line={line} isNew={line.id === lastAddedId} onNavigate={close} />
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              ) : (
                <motion.div
                  className="px-6 pt-6"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.15 }}
                >
                  <p className="font-display text-[1.75rem] font-medium leading-tight tracking-tight">
                    O seu carrinho está vazio
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink/60">Quando encontrar algo de que goste, junte-o aqui</p>
                  <Link
                    to="/loja"
                    onClick={close}
                    className="mt-6 inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper transition-colors hover:bg-ink-soft"
                  >
                    Ir para a loja
                  </Link>
                </motion.div>
              )}
            </div>

            {lines.length > 0 && (
              <div className="px-6 pb-6 pt-4">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-sm font-medium">Subtotal</p>
                  <p className="text-xl font-medium">
                    <RollingPrice value={total} />
                  </p>
                </div>
                <p className="mt-1 text-xs text-ink/45">Entrega e pagamento escolhidos no passo seguinte</p>
                <button
                  type="button"
                  onClick={checkout}
                  className="mt-5 h-14 w-full rounded-full bg-ink text-sm font-medium text-paper transition-[background-color,transform] duration-300 hover:bg-ink-soft active:scale-[0.98]"
                >
                  Finalizar compra
                </button>
                <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                  <Link to="/cart" onClick={close} className="link-underline text-ink/65 hover:text-ink">
                    Ver carrinho
                  </Link>
                  <a
                    href={whatsappOrderUrl(items, total)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-ink/65 hover:text-ink"
                  >
                    Pedir no WhatsApp
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
