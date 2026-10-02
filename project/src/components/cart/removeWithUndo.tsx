import toast from 'react-hot-toast';
import { restoreCartItem } from '../../lib/cart';
import { useCartStore } from '../../stores/cartStore';

/** Removes a cart line straight away and offers "Anular" for a few seconds. */
export const removeWithUndo = (id: string) => {
  const { items, removeFromCart } = useCartStore.getState();
  const index = items.findIndex((item) => item.id === id);
  const item = items[index];
  if (!item) return;
  removeFromCart(id);

  toast(
    (t) => (
      <span className="flex items-center gap-4">
        <span>{item.name.split(' · ')[0]} removido</span>
        <button
          type="button"
          onClick={() => {
            restoreCartItem(item, index);
            toast.dismiss(t.id);
          }}
          className="font-medium underline underline-offset-4"
        >
          Anular
        </button>
      </span>
    ),
    { id: `remover-${id}`, duration: 5000 },
  );
};
