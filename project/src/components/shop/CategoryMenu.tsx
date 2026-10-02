import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { categoryPath, getCategory, productsIn, subcategoryCover } from '../../lib/catalog';
import { easeOutExpo } from '../../lib/motion';
import { useShopMenu } from './ShopMenu';

/*
 * Desktop contextual menu: drops down under the shop navigation with the selected category's
 * subcategories as visual tiles, and gets out of the way as soon as a choice is made.
 */
const CategoryMenu = () => {
  const { openCategory, close } = useShopMenu();
  const category = getCategory(openCategory ?? undefined);
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape closes; focus moves into the panel so keyboard users land on the choices.
  useEffect(() => {
    if (!category) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    const frame = requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true }));
    return () => {
      window.removeEventListener('keydown', onKey);
      cancelAnimationFrame(frame);
    };
  }, [category, close]);

  return (
    <AnimatePresence>
      {category && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-30 bg-ink/15"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
          />
          <motion.div
            key="panel"
            ref={panelRef}
            id="shop-category-menu"
            role="dialog"
            aria-label={`Subcategorias de ${category.name}`}
            className="absolute inset-x-0 top-full z-40 border-b border-ink/10 bg-paper shadow-[0_40px_60px_-40px_rgba(12,12,13,0.35)]"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.35, ease: easeOutExpo } }}
            transition={{ duration: 0.55, ease: easeOutExpo }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={category.slug}
                className="container-site grid gap-10 py-10 lg:grid-cols-12"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: easeOutExpo }}
              >
                <div className="lg:col-span-3">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink/45">Explorar</p>
                  <p className="mt-3 font-display text-3xl font-medium tracking-tight">{category.name}</p>
                  <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink/60">{category.description}</p>
                  <Link
                    to={categoryPath(category.slug)}
                    onClick={close}
                    className="mt-6 inline-flex h-10 items-center rounded-full border border-ink/15 px-5 text-sm font-medium transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                  >
                    Ver tudo em {category.name}
                  </Link>
                </div>

                <motion.ul
                  className="grid grid-cols-3 gap-4 lg:col-span-9 xl:grid-cols-5"
                  initial="hidden"
                  animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.04, delayChildren: 0.08 } } }}
                >
                  {category.subcategories.map((subcategory) => {
                    const count = productsIn(category.slug, subcategory.slug).length;
                    const cover = subcategoryCover(category.slug, subcategory);
                    return (
                      <motion.li
                        key={subcategory.slug}
                        variants={{
                          hidden: { opacity: 0, y: 14 },
                          visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOutExpo } },
                        }}
                      >
                        <Link
                          to={categoryPath(category.slug, subcategory.slug)}
                          onClick={close}
                          className="group block rounded-xl outline-offset-4"
                        >
                          <div className="aspect-[4/3] overflow-hidden rounded-xl bg-mist">
                            {cover && (
                              <img
                                src={cover}
                                alt=""
                                className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.05]"
                              />
                            )}
                          </div>
                          <p className="mt-3 text-sm font-medium">{subcategory.name}</p>
                          <p className="mt-0.5 text-xs text-ink/45">
                            {count > 0 ? `${count} ${count === 1 ? 'produto' : 'produtos'}` : 'Brevemente'}
                          </p>
                        </Link>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CategoryMenu;
