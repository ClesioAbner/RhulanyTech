import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DeliveryMethod, PaymentMethodId } from '../lib/checkout';

export interface OrderLine {
  id: string;
  /** Full cart name, e.g. "iPhone 17 Pro · 256GB · Prateado". */
  name: string;
  title: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
}

export type OrderStatus = 'confirmada' | 'em-preparacao' | 'enviada' | 'entregue';

export interface Order {
  number: string;
  /** ISO date. */
  createdAt: string;
  customer: { name: string; email: string; phone: string };
  delivery: {
    method: DeliveryMethod;
    province?: string;
    city?: string;
    neighbourhood?: string;
    street?: string;
    reference?: string;
    notes?: string;
  };
  payment: { method: PaymentMethodId; detail?: string; reference?: string };
  lines: OrderLine[];
  subtotal: number;
  status: OrderStatus;
  userId?: string;
}

interface OrderStore {
  orders: Order[];
  addOrder: (order: Order) => void;
}

/** Orders placed on this device; the confirmation page and the account read from here. */
export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
    }),
    { name: 'rhulany-tech-orders' },
  ),
);

export const ORDER_STEPS: { id: OrderStatus; label: string }[] = [
  { id: 'confirmada', label: 'Confirmada' },
  { id: 'em-preparacao', label: 'Em preparação' },
  { id: 'enviada', label: 'A caminho' },
  { id: 'entregue', label: 'Entregue' },
];
