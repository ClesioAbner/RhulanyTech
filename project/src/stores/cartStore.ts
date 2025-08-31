import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  brand?: string;
  model?: string;
  maxQuantity?: number;
}

interface CartStore {
  items: CartItem[];
  total: number;
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getItemById: (id: string) => CartItem | undefined;
  isInCart: (id: string) => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      addToCart: (item) => {
        const { items } = get();
        const existingItem = items.find((i) => i.id === item.id);
        
        if (existingItem) {
          const newQuantity = existingItem.quantity + (item.quantity || 1);
          const maxQuantity = item.maxQuantity || 99;
          
          if (newQuantity <= maxQuantity) {
            const updatedItems = items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: newQuantity }
                : i
            );
            
            set({
              items: updatedItems,
              total: updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
            });
          }
        } else {
          const newItem: CartItem = {
            ...item,
            quantity: item.quantity || 1
          };
          const newItems = [...items, newItem];
          
          set({
            items: newItems,
            total: newItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
          });
        }
      },

      removeFromCart: (id) => {
        const { items } = get();
        const newItems = items.filter((i) => i.id !== id);
        
        set({
          items: newItems,
          total: newItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
        });
      },

      updateQuantity: (id, quantity) => {
        const { items } = get();
        
        if (quantity <= 0) {
          get().removeFromCart(id);
          return;
        }
        
        const updatedItems = items.map((i) =>
          i.id === id ? { ...i, quantity: Math.min(quantity, i.maxQuantity || 99) } : i
        );
        
        set({
          items: updatedItems,
          total: updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
        });
      },

      clearCart: () => set({ items: [], total: 0 }),

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },

      getItemById: (id) => {
        const { items } = get();
        return items.find(item => item.id === id);
      },

      isInCart: (id) => {
        const { items } = get();
        return items.some(item => item.id === id);
      }
    }),
    {
      name: 'rhulany-tech-cart',
      partialize: (state) => ({
        items: state.items,
        total: state.total
      })
    }
  )
);