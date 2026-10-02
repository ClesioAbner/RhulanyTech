import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { categoryPath, getCategory, productsIn, subcategoryCover } from '../../lib/catalog';
import { easeOutExpo } from '../../lib/motion';
import { useShopMenu } from './ShopMenu';

const DISMISS_DISTANCE = 120; // px dragged down before the sheet closes
const DISMISS_VELOCITY = 500;

/** Mobile counterpart of CategoryMenu: a bottom sheet that can be swiped away. */
const MobileCategorySheet = () => {
  const { openCategory, close } = useShopMenu();
  const category = getCategory(openCategory ?? undefined);

  useEffect(() => {
    if (!category) return;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [category, close]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > DISMISS_DISTANCE || info.velocity.y > DISMISS_VELOCITY) close();
  };

  return (
    <AnimatePresence>
      {category && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Subcategorias de ${category.name}`}
            className="fixed inset-x-0 bottom-0 z-[61] flex max-h-[85svh] flex-col rounded-t-[28px] bg-paper pb-[env(safe-area-inset-bottom)]"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%', transition: { duration: 0.3, ease: easeOutExpo } }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={onDragEnd}
          >
            <div className="flex justify-center pt-3" aria-hidden="true">
              <span className="h-1 w-10 rounded-full bg-ink/20" />
            </div>
            <div className="flex items-end justify-between px-6 pb-4 pt-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink/45">Explorar</p>
                <p className="mt-1 font-display text-3xl font-medium tracking-tight">{category.name}</p>
              </div>
              <button type="button" onClick={close} className="link-underline text-sm">
                Fechar
              </button>
            </div>

            <ul className="flex-1 overflow-y-auto overscroll-contain px-3">
              {category.subcategories.map((subcategory, index) => {
                const count = productsIn(category.slug, subcategory.slug).length;
                const cover = subcategoryCover(category.slug, subcategory);
                return (
                  <motion.li
                    key={subcategory.slug}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: easeOutExpo, delay: 0.08 + index * 0.035 }}
                  >
                    <Link
                      to={categoryPath(category.slug, subcategory.slug)}
                      onClick={close}
                      className="flex items-center gap-4 rounded-2xl px-3 py-3 active:bg-ink/[0.05]"
                    >
                      <span className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-mist">
                        {cover && <img src={cover} alt="" className="h-full w-full object-cover" />}
                      </span>
                      <span className="flex-1">
                        <span className="block text-base font-medium">{subcategory.name}</span>
                        <span className="block text-xs text-ink/45">
                          {count > 0 ? `${count} ${count === 1 ? 'produto' : 'produtos'}` : 'Brevemente'}
                        </span>
                      </span>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>

            <div className="border-t border-ink/10 px-6 py-4">
              <Link
                to={categoryPath(category.slug)}
                onClick={close}
                className="flex h-12 items-center justify-center rounded-full bg-ink text-sm font-medium text-paper"
              >
                Ver tudo em {category.name}
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileCategorySheet;
