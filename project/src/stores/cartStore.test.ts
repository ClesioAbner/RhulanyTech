import { beforeEach, describe, expect, it } from 'vitest';
import { useCartStore } from './cartStore';

const phone = {
  id: '39:Laranja cósmico:256GB',
  name: 'iPhone 17 Pro · 256GB · Laranja cósmico',
  price: 165000,
  image: '/x.webp',
  maxQuantity: 3,
};

describe('carrinho', () => {
  beforeEach(() => useCartStore.setState({ items: [], total: 0 }));

  it('junta o mesmo produto numa só linha e soma o total', () => {
    const { addToCart } = useCartStore.getState();
    addToCart(phone);
    addToCart(phone);
    const { items, total } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
    expect(total).toBe(330000);
  });

  it('nunca passa o stock disponível', () => {
    const { addToCart, updateQuantity } = useCartStore.getState();
    addToCart({ ...phone, quantity: 3 });
    addToCart(phone);
    expect(useCartStore.getState().items[0].quantity).toBe(3);
    updateQuantity(phone.id, 10);
    expect(useCartStore.getState().items[0].quantity).toBe(3);
  });

  it('remove a linha quando a quantidade chega a zero', () => {
    const { addToCart, updateQuantity } = useCartStore.getState();
    addToCart(phone);
    updateQuantity(phone.id, 0);
    expect(useCartStore.getState()).toMatchObject({ items: [], total: 0 });
  });

  it('esvazia de uma vez depois da compra', () => {
    const { addToCart, clearCart } = useCartStore.getState();
    addToCart(phone);
    addToCart({ ...phone, id: 'outro', price: 1000 });
    clearCart();
    expect(useCartStore.getState()).toMatchObject({ items: [], total: 0 });
  });
});
