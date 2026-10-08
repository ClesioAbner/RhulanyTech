import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { STORE } from '../../data/store';
import type { AssistantRequest } from '../../lib/assistant/types';
import { useCartStore } from '../../stores/cartStore';

/** The page and cart sent with each message, so the backend can answer in context. */
export const useChatContext = (): AssistantRequest['context'] => {
  const { pathname } = useLocation();
  const items = useCartStore((state) => state.items);
  return useMemo(
    () => ({ path: pathname, cart: items.map(({ id, name, price, quantity }) => ({ id, name, price, quantity })) }),
    [pathname, items],
  );
};

/** WhatsApp with the visitor's last question already written, for a person to pick up. */
export const whatsappHandoff = (question?: string) =>
  `${STORE.whatsappUrl}?text=${encodeURIComponent(question ? `Olá Rhulany Tech, ${question}` : 'Olá Rhulany Tech')}`;
