import { ICartItem } from "@/types";
import { create } from "zustand";

type CheckoutStore = {
  items: ICartItem[];
  setItems: (items: ICartItem[]) => void;
  clearItems: () => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
};

export const useCheckout = create<CheckoutStore>((set) => ({
  items: [],
  setItems: (items) => set(() => ({ items: [...items] })),
  clearItems: () => set(() => ({ items: [] })),
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
}));
