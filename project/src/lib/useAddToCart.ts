import { useCallback } from 'react';
import { useCartStore } from '../stores/cartStore';
import { useCartUi } from '../stores/cartUi';
import type { CatalogProduct, Finish, OptionChoice } from './catalog';

// Cart lines are keyed by product + finish + option, e.g. "1:Titânio Deserto:256GB".
export const cartLineId = (product: CatalogProduct, finish?: Finish, option?: OptionChoice) =>
  [product.id, finish?.name, option?.label].filter(Boolean).join(':');

/** Adds a configured product to the cart and opens the cart drawer on it. */
export const useAddToCart = () => {
  const addToCart = useCartStore((state) => state.addToCart);
  const openDrawer = useCartUi((state) => state.open);

  return useCallback(
    (product: CatalogProduct, finish?: Finish, option?: OptionChoice, { openDrawer: shouldOpen = true } = {}) => {
      const id = cartLineId(product, finish, option);
      addToCart({
        id,
        name: [product.title, option?.label, finish?.name].filter(Boolean).join(' · '),
        price: product.price + (option?.priceDelta ?? 0),
        image: product.primaryImage,
        brand: product.brand,
        model: product.model,
        maxQuantity: product.stockQuantity,
      });
      if (shouldOpen) openDrawer(id);
      return id;
    },
    [addToCart, openDrawer],
  );
};
