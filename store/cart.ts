import { ICartItem } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type CartStore = {
  items: ICartItem[];
  addItem: (item: ICartItem) => void;
  removeItem: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
  clearItemsFromCart: (selectedIds: string[]) => void;
};

export const useCart = create<CartStore, [["zustand/persist", unknown]]>(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((prevState) => ({ items: [...prevState.items, item] })),
      removeItem: (id) =>
        set((prevState) => ({
          items: prevState.items.filter((item) => item.id !== id),
        })),
      increaseQuantity: (id) =>
        set((prevState) => ({
          items: prevState.items.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        })),

      decreaseQuantity: (id) =>
        set((prevState) => ({
          items: prevState.items.map((item) =>
            item.id === id && item.quantity > 1
              ? { ...item, quantity: item.quantity - 1 }
              : item
          ),
        })),

      clearCart: () => set(() => ({ items: [] })),
      clearItemsFromCart: (ids) =>
        set((prevItems) => ({
          items: prevItems.items.filter((item) => !ids.includes(item.id)),
        })),
    }),
    {
      name: "fmt_dp_cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
