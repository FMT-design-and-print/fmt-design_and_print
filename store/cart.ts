import { ICartItem } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  storeArtworkFiles,
  storeArtworkFilesMap,
  removeArtworkFiles,
  SerializedFile,
} from "@/utils/storage";

// Custom storage to handle artwork files in IndexedDB
const customStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const value = localStorage.getItem(name);
    return value;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      const parsed = JSON.parse(value);

      // Store artwork files in IndexedDB if they exist
      if (parsed.state?.items) {
        parsed.state.items = await Promise.all(
          parsed.state.items.map(async (item: ICartItem) => {
            try {
              let hasArtworkFiles = false;
              let hasArtworkFilesMap = false;

              if (item.artworkFiles && item.artworkFiles.length > 0) {
                const filesWithSize = item.artworkFiles.map((file) => ({
                  ...file,
                  size: file.size || 0,
                })) as SerializedFile[];
                await storeArtworkFiles(item.id, filesWithSize);
                hasArtworkFiles = true;
              }
              if (
                item.artworkFilesMap &&
                Object.keys(item.artworkFilesMap).length > 0
              ) {
                const filesMapWithSize = Object.fromEntries(
                  Object.entries(item.artworkFilesMap).map(([key, files]) => [
                    key,
                    files.map((file) => ({
                      ...file,
                      size: file.size || 0,
                    })) as SerializedFile[],
                  ])
                );
                await storeArtworkFilesMap(item.id, filesMapWithSize);
                hasArtworkFilesMap = true;
              }

              // Return item without artwork data in localStorage but preserve flags
              const { ...rest } = item;
              return {
                ...rest,
                hasArtworkFiles,
                hasArtworkFilesMap,
              };
            } catch (error) {
              console.error(
                `Failed to store artwork files for item ${item.id}:`,
                error
              );
              return item;
            }
          })
        );
      }

      localStorage.setItem(name, JSON.stringify(parsed));
    } catch (error) {
      console.error("Failed to store cart data:", error);
      localStorage.setItem(name, value);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    const value = localStorage.getItem(name);
    if (value) {
      try {
        const parsed = JSON.parse(value);
        const items = parsed.state?.items || [];
        items.forEach((item: ICartItem) => {
          removeArtworkFiles(item.id);
        });
      } catch (error) {
        console.error("Failed to clean up artwork files:", error);
      }
    }
    localStorage.removeItem(name);
  },
};

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
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((prevState) => ({ items: [...prevState.items, item] })),
      removeItem: (id) => {
        removeArtworkFiles(id);
        set((prevState) => ({
          items: prevState.items.filter((item) => item.id !== id),
        }));
      },
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
      clearCart: () => {
        const currentItems = get().items;
        currentItems.forEach((item) => {
          removeArtworkFiles(item.id);
        });
        set(() => ({ items: [] }));
      },
      clearItemsFromCart: (ids) => {
        ids.forEach((id) => {
          removeArtworkFiles(id);
        });
        set((prevItems) => ({
          items: prevItems.items.filter((item) => !ids.includes(item.id)),
        }));
      },
    }),
    {
      name: "fmt_dp_cart",
      storage: createJSONStorage(() => customStorage),
    }
  )
);
