import { create } from 'zustand';

interface CartUiState {
  isOpen: boolean;
  /** Cart line id that was just added, highlighted in the drawer. */
  lastAddedId: string | null;
  open: (lastAddedId?: string) => void;
  close: () => void;
}

export const useCartUi = create<CartUiState>((set) => ({
  isOpen: false,
  lastAddedId: null,
  open: (lastAddedId) => set({ isOpen: true, lastAddedId: lastAddedId ?? null }),
  close: () => set({ isOpen: false }),
}));
