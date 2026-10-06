import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useCartStore } from '../../stores/cartStore';
import { useUserStore } from '../../stores/userStore';
import { useCartUi } from '../../stores/cartUi';
import { easeOutExpo } from '../../lib/motion';
import { CartIcon } from '../ui/Icons';

const NAV_ITEMS = [
  { to: '/', label: 'Início' },
  { to: '/loja', label: 'Loja' },
  { to: '/blog', label: 'Blog' },
  { to: '/sobre', label: 'Sobre' },
  { to: '/contacto', label: 'Contacto' },
];

// "Início" is only active on the homepage; product pages belong to the shop.
const isNavItemActive = (to: string, pathname: string) =>
  to === '/' ? pathname === '/' : pathname.startsWith(to) || (to === '/loja' && pathname.startsWith('/produto/'));

const COMPACT_AFTER = 48; // px scrolled before the bar contracts
// Minimal contraction on scroll: the bar stays full-featured, it just tightens and lifts.
const barTransition = { duration: 0.5, ease: easeOutExpo };

const Header = () => {
  const { currentUser, logout } = useUserStore();
  const itemCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const openCart = useCartUi((state) => state.open);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const { pathname, hash } = useLocation();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => setIsCompact(y > COMPACT_AFTER));

  useEffect(() => setIsMenuOpen(false), [pathname, hash]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const compact = isCompact && !isMenuOpen;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <motion.div
        className="mx-auto flex items-center justify-between gap-6 rounded-full border border-ink/[0.07] bg-paper/80 backdrop-blur-xl backdrop-saturate-150"
        initial={false}
        animate={{
          maxWidth: compact ? 1200 : 1360,
          height: compact ? 58 : 64,
          paddingLeft: compact ? 24 : 28,
          paddingRight: compact ? 8 : 10,
          boxShadow: compact ? '0 18px 40px -24px rgba(12,12,13,0.35)' : '0 0px 0px 0px rgba(12,12,13,0)',
        }}
        transition={barTransition}
      >
        <Link
          to="/"
          className="shrink-0 font-display text-[17px] font-semibold tracking-tight"
          aria-label="Rhulany Tech, página inicial"
        >
          Rhulany<span className="text-ink/40">Tech</span>
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {NAV_ITEMS.map((item) => {
              const isActive = isNavItemActive(item.to, pathname);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`relative block py-2 text-[13.5px] transition-colors duration-300 ${isActive ? 'text-ink' : 'text-ink/60 hover:text-ink'}`}
                  >
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-0 bottom-0.5 h-px bg-ink"
                        transition={{ duration: 0.5, ease: easeOutExpo }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-1 text-[13.5px]">
          <Link
            to={currentUser ? '/conta' : `/entrar?voltar=${encodeURIComponent(pathname)}`}
            className="hidden h-10 items-center rounded-full px-4 transition-colors hover:bg-ink/[0.05] sm:inline-flex"
          >
            {currentUser ? currentUser.name.split(' ')[0] : 'Entrar'}
          </Link>

          <button
            type="button"
            onClick={() => openCart()}
            aria-haspopup="dialog"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-ink pl-3.5 pr-2 text-paper transition-colors duration-300 hover:bg-ink-soft"
            aria-label={`Carrinho, ${itemCount} ${itemCount === 1 ? 'artigo' : 'artigos'}`}
          >
            {/* Re-keyed on every change so the cart gives a small nudge when something is added */}
            <motion.span
              key={itemCount}
              className="block"
              initial={{ scale: 0.82, rotate: -8 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 520, damping: 14 }}
            >
              <CartIcon className="h-[19px] w-[19px]" />
            </motion.span>
            <span className="grid h-6 min-w-[1.5rem] place-items-center overflow-hidden rounded-full bg-paper/15 px-1.5 text-xs tabular-nums">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={itemCount}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.35, ease: easeOutExpo }}
                >
                  {itemCount}
                </motion.span>
              </AnimatePresence>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="inline-flex h-10 items-center rounded-full px-4 transition-colors hover:bg-ink/[0.05] lg:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? 'Fechar' : 'Menu'}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 -z-10 bg-paper lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3 }}
          >
            <motion.nav
              aria-label="Menu móvel"
              className="container-site flex h-full flex-col justify-between pb-10 pt-28"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } } }}
            >
              <ul className="space-y-1">
                {NAV_ITEMS.map((item) => (
                  <motion.li
                    key={item.to}
                    variants={{
                      hidden: { opacity: 0, y: 16 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOutExpo } },
                    }}
                  >
                    <Link
                      to={item.to}
                      className={`block py-2 font-display text-4xl font-medium tracking-tight ${isNavItemActive(item.to, pathname) ? 'text-ink' : 'text-ink/50'}`}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="flex gap-6 border-t border-ink/10 pt-6 text-base">
                {currentUser ? (
                  <>
                    <Link to="/conta">A minha conta</Link>
                    <button type="button" onClick={logout} className="text-ink/60">
                      Sair
                    </button>
                  </>
                ) : (
                  <Link to={`/entrar?voltar=${encodeURIComponent(pathname)}`}>Entrar ou criar conta</Link>
                )}
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
