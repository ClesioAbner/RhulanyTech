import { STORE } from '../data/store';
import { useCartStore, type CartItem } from '../stores/cartStore';
import { getProductById, productPath, type CatalogProduct } from './catalog';
import { formatPrice } from './format';

export interface CartLine extends CartItem {
  product?: CatalogProduct;
  title: string;
  /** Chosen storage and finish, e.g. "256GB · Titânio Deserto". */
  variant: string;
  href: string;
}

// Cart line names are "Title · Option · Finish" (see useAddToCart); ids start with the product id.
export const toCartLine = (item: CartItem): CartLine => {
  const product = getProductById(item.id.split(':')[0]);
  const [title, ...variant] = item.name.split(' · ');
  return { ...item, product, title, variant: variant.join(' · '), href: product ? productPath(product) : '/loja' };
};

export const itemCountLabel = (count: number) => `${count} ${count === 1 ? 'artigo' : 'artigos'}`;

const sum = (items: CartItem[]) => items.reduce((total, item) => total + item.price * item.quantity, 0);

/** Puts a removed line back where it was (used by "Anular"). */
export const restoreCartItem = (item: CartItem, index: number) =>
  useCartStore.setState((state) => {
    if (state.items.some((existing) => existing.id === item.id)) return state;
    const items = [...state.items];
    items.splice(Math.min(index, items.length), 0, item);
    return { items, total: sum(items) };
  });

/** A ready-to-send WhatsApp message with every line and the total. */
export const whatsappOrderUrl = (items: CartItem[], total: number) => {
  const lines = items.map((item) => `${item.quantity} × ${item.name} (${formatPrice(item.price * item.quantity)})`);
  const message = ['Olá Rhulany Tech, gostaria de encomendar:', '', ...lines, '', `Total: ${formatPrice(total)}`].join('\n');
  return `${STORE.whatsappUrl}?text=${encodeURIComponent(message)}`;
};
