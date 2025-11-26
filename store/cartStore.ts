import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];

  addItem: (item: Omit<CartItem, "quantity">, quantity: number) => void;
  removeItem: (id: number) => void;
  increase: (id: number) => void;
  decrease: (id: number) => void;
  clearCart: () => void;

  totalItems: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, quantity) =>
        set((state) => {
          const exists = state.items.find((i) => i.id === item.id);

          if (exists) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: quantity } : i
              ),
            };
          }

          return {
            items: [...state.items, { ...item, quantity: quantity || 1 }],
          };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      increase: (id) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        })),

      decrease: (id) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
            .filter((i) => i.quantity > 0),
        })),

      clearCart: () => set({ items: [] }),

      totalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: "cart-storage",
    }
  )
);
