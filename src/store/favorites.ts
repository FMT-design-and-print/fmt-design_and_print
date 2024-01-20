import { IPrintProduct } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type FavoritesStore = {
  items: IPrintProduct[];
  addItem: (item: IPrintProduct) => void;
  removeItem: (id: string) => void;
  clearFavorites: () => void;
};

export const useFavorites = create<
  FavoritesStore,
  [["zustand/persist", unknown]]
>(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((prevState) => ({ items: [...prevState.items, item] })),
      removeItem: (id) =>
        set((prevState) => ({
          items: prevState.items.filter((item) => item.id !== id),
        })),
      clearFavorites: () => set(() => ({ items: [] })),
    }),
    {
      name: "fmt_dp_favorites",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
