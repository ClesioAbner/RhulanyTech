import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface ShopMenuState {
  /** Slug of the category whose subcategory menu is open, or null. */
  openCategory: string | null;
  open: (slug: string) => void;
  close: () => void;
  toggle: (slug: string) => void;
}

const ShopMenuContext = createContext<ShopMenuState | null>(null);

// One menu state for the whole shop: the navigation bar and the category tiles both open the same panel.
export const ShopMenuProvider = ({ children }: { children: ReactNode }) => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const open = useCallback((slug: string) => setOpenCategory(slug), []);
  const close = useCallback(() => setOpenCategory(null), []);
  const toggle = useCallback((slug: string) => setOpenCategory((current) => (current === slug ? null : slug)), []);
  const value = useMemo(() => ({ openCategory, open, close, toggle }), [openCategory, open, close, toggle]);
  return <ShopMenuContext.Provider value={value}>{children}</ShopMenuContext.Provider>;
};

export const useShopMenu = () => {
  const context = useContext(ShopMenuContext);
  if (!context) throw new Error('useShopMenu must be used inside <ShopMenuProvider>');
  return context;
};
