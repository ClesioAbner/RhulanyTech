import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categoryPath, productsIn, type Category } from '../../lib/catalog';
import { easeOutExpo } from '../../lib/motion';

interface CategoryTabsProps {
  category: Category;
  activeSubcategory?: string;
}

/** Subcategory switcher on category pages; sticks under the floating header while browsing the lineup. */
const CategoryTabs = ({ category, activeSubcategory }: CategoryTabsProps) => {
  const listRef = useRef<HTMLUListElement>(null);

  // Keep the active tab in view on small screens, where the row scrolls sideways.
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>('[aria-current="page"]')
      ?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [activeSubcategory]);

  const tabs = [
    { slug: undefined, name: 'Tudo', count: productsIn(category.slug).length },
    ...category.subcategories.map((sub) => ({
      slug: sub.slug,
      name: sub.name,
      count: productsIn(category.slug, sub.slug).length,
    })),
  ];

  return (
    <div className="sticky top-[76px] z-20 border-b border-ink/10 bg-paper/90 backdrop-blur-md sm:top-[84px]">
      <nav aria-label={`Gamas de ${category.name}`} className="container-site">
        <ul ref={listRef} className="-mx-5 flex gap-1 overflow-x-auto px-5 py-3 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => {
            const isActive = tab.slug === activeSubcategory;
            return (
              <li key={tab.slug ?? 'tudo'}>
                <Link
                  to={categoryPath(category.slug, tab.slug)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative isolate flex h-10 items-center gap-2 whitespace-nowrap rounded-full px-4 text-sm transition-colors duration-300 ${
                    isActive ? 'text-paper' : 'text-ink/60 hover:text-ink'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId={`tabs-${category.slug}`}
                      className="absolute inset-0 -z-10 rounded-full bg-ink"
                      transition={{ duration: 0.45, ease: easeOutExpo }}
                    />
                  )}
                  {tab.name}
                  <span className={`tabular-nums ${isActive ? 'text-paper/55' : 'text-ink/35'}`}>{tab.count}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default CategoryTabs;
