import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CATEGORIES } from '../../lib/catalog';
import { easeOutExpo } from '../../lib/motion';
import { useMediaQuery } from '../../lib/useMediaQuery';
import CategoryMenu from './CategoryMenu';
import MobileCategorySheet from './MobileCategorySheet';
import { useShopMenu } from './ShopMenu';

/*
 * The shop's category bar. Desktop: text tabs that open the contextual CategoryMenu below.
 * Mobile: a horizontally scrollable row of chips that open a bottom sheet.
 */
const ShopNavigation = () => {
  const { openCategory, toggle, close } = useShopMenu();
  const { pathname } = useLocation();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const currentCategory = pathname.startsWith('/loja/') ? pathname.split('/')[2] : null;

  // Navigating anywhere closes the menu.
  useEffect(() => close(), [pathname, close]);

  return (
    <div className="relative z-40">
      <nav aria-label="Categorias da loja" className="relative z-50 border-b border-ink/10 bg-paper">
        <div className="container-site flex items-center gap-8">
          <Link
            to="/loja"
            className={`hidden shrink-0 py-4 text-sm font-medium transition-colors lg:block ${
              pathname === '/loja' ? 'text-ink' : 'text-ink/50 hover:text-ink'
            }`}
          >
            Loja
          </Link>
          <span aria-hidden="true" className="hidden h-4 w-px bg-ink/15 lg:block" />
          <ul className="-mx-5 flex snap-x gap-2 overflow-x-auto px-5 py-3 [scrollbar-width:none] lg:mx-0 lg:gap-7 lg:overflow-visible lg:px-0 lg:py-0 [&::-webkit-scrollbar]:hidden">
            {CATEGORIES.map((category) => {
              const isOpen = openCategory === category.slug;
              const isCurrent = currentCategory === category.slug;
              return (
                <li key={category.slug} className="snap-start">
                  <button
                    type="button"
                    onClick={() => toggle(category.slug)}
                    aria-expanded={isOpen}
                    aria-controls={isDesktop ? 'shop-category-menu' : undefined}
                    className={`relative whitespace-nowrap text-sm transition-colors duration-300 max-lg:h-10 max-lg:rounded-full max-lg:border max-lg:px-4 lg:py-4 ${
                      isOpen || isCurrent
                        ? 'text-ink max-lg:border-ink max-lg:bg-ink max-lg:text-paper'
                        : 'text-ink/55 hover:text-ink max-lg:border-ink/15'
                    }`}
                  >
                    {category.name}
                    {isDesktop && (isOpen || (isCurrent && !openCategory)) && (
                      <motion.span
                        layoutId="shop-nav-indicator"
                        className="absolute inset-x-0 -bottom-px h-px bg-ink"
                        transition={{ duration: 0.45, ease: easeOutExpo }}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
      {isDesktop ? <CategoryMenu /> : <MobileCategorySheet />}
    </div>
  );
};

export default ShopNavigation;
