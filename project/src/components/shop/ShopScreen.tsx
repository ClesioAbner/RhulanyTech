import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { getProductById, priceFrom, resolveImage, type CatalogProduct } from '../../lib/catalog';
import { formatPrice } from '../../lib/format';
import { easeOutExpo } from '../../lib/motion';
import { StatusBar } from '../content/chat/ChatScreen';

// The new phones, as the shop shows them first.
const PRODUCTS = ['91', '92', '93']
  .map((id) => getProductById(id))
  .filter((product): product is CatalogProduct => Boolean(product));
const EVERY = 2800;

/*
 * Rhulany Tech on a phone screen, for the shop page: the new phones go by one at a time, each on
 * its studio stage with name, price and colours, and the buy button is pressed now and then.
 * Sized in container units (cqw), so it fits any phone it is drawn on.
 */
const ShopScreen = () => {
  const still = useReducedMotion();
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (still) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % PRODUCTS.length), EVERY);
    return () => window.clearInterval(timer);
  }, [still]);
  const product = PRODUCTS[index];
  if (!product) return null;

  return (
    <div className="flex h-full flex-col bg-paper font-sans text-ink">
      <StatusBar />
      <div className="flex items-center justify-between px-[5cqw] pt-[2cqw]">
        <span className="font-display text-[4.6cqw] font-semibold tracking-tight">
          Rhulany<span className="text-ink/40">Tech</span>
        </span>
        <span className="grid h-[8cqw] min-w-[8cqw] place-items-center rounded-full bg-ink px-[2cqw] text-[3cqw] font-medium tabular-nums text-paper">
          {index + 1}
        </span>
      </div>

      <div className="flex items-baseline justify-between px-[5cqw] pt-[6cqw]">
        <p className="font-display text-[7.4cqw] font-medium leading-none tracking-tight">Novidades</p>
        <p className="text-[2.8cqw] text-ink/45">Ver tudo</p>
      </div>

      {/* The product on show, sliding in from the right */}
      <div className="relative mx-[5cqw] mt-[4cqw] flex-1 overflow-hidden rounded-[5cqw] bg-white">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={product.id}
            className="absolute inset-0 flex flex-col"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: '0%', opacity: 1 }}
            exit={{ x: '-40%', opacity: 0 }}
            transition={{ duration: 0.7, ease: easeOutExpo }}
          >
            <div className="stage relative flex-1">
              <motion.img
                src={resolveImage(product.finishes[0].images![0], 600)}
                alt=""
                className="stage-shadow absolute inset-[10%] h-[80%] w-[80%] object-contain"
                initial={{ scale: 0.9, rotate: -4 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.9, ease: easeOutExpo, delay: 0.1 }}
              />
              <span className="absolute left-[4cqw] top-[4cqw] text-[2.5cqw] font-semibold uppercase tracking-[0.14em] text-[#bf4800]">
                Novo
              </span>
            </div>
            <div className="px-[4cqw] pb-[4cqw] pt-[3cqw]">
              <p className="text-[2.6cqw] uppercase tracking-[0.14em] text-ink/45">{product.brand}</p>
              <p className="mt-[0.8cqw] text-[4.2cqw] font-medium leading-tight">{product.title}</p>
              <div className="mt-[2.4cqw] flex items-center justify-between">
                <p className="text-[3.4cqw] tabular-nums">
                  <span className="text-ink/45">Desde </span>
                  {formatPrice(priceFrom(product))}
                </p>
                <span className="flex gap-[1.2cqw]">
                  {product.finishes.slice(0, 4).map((finish) => (
                    <span
                      key={finish.name}
                      className="h-[3cqw] w-[3cqw] rounded-full ring-[0.3cqw] ring-inset ring-ink/15"
                      style={{ backgroundColor: finish.hex }}
                    />
                  ))}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* The buy button, pressed shortly before each change */}
      <motion.span
        key={`comprar-${index}`}
        className="mx-[5cqw] mb-[3cqw] mt-[3cqw] block rounded-full bg-ink py-[3.6cqw] text-center text-[3.6cqw] font-medium text-paper"
        animate={still ? undefined : { scale: [1, 1, 0.95, 1] }}
        transition={{ duration: 0.45, delay: (EVERY - 700) / 1000, times: [0, 0.2, 0.5, 1] }}
      >
        Comprar
      </motion.span>
      <span className="mx-auto mb-[2.4cqw] block h-[1.3cqw] w-[34%] shrink-0 rounded-full bg-ink/80" aria-hidden="true" />
    </div>
  );
};

export default ShopScreen;
