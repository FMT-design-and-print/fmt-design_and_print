import { CheckoutDetails, ICartItem, IShippingAddress } from "@/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  storeArtworkFiles,
  storeArtworkFilesMap,
  removeArtworkFiles,
  SerializedFile,
} from "@/utils/storage";

type CheckoutStore = {
  details: CheckoutDetails;
  setItems: (items: ICartItem[]) => void;
  setDetails: (details: Partial<IShippingAddress>) => void;
  clearItems: () => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update: (key: keyof CheckoutDetails, value: any) => void;
};

const initialState: CheckoutDetails = {
  orderId: "",
  paymentType: "momo",
  contactName: "",
  phone1: "",
  phone2: "",
  email: "",
  country: "Ghana",
  region: { id: 7, name: "Greater Accra" },
  town: null,
  address: "",
  items: [],
  note: "",
  deliveryType: "delivery",
  deliveryFee: 0,
  discount: 0,
};

// Custom storage to optimize data before persisting
const customStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const value = sessionStorage.getItem(name);
    return value;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      // Parse the value to optimize it
      const parsed = JSON.parse(value);

      // Optimize the items array by only keeping essential fields
      if (parsed.state?.details?.items) {
        parsed.state.details.items = parsed.state.details.items.map(
          (item: ICartItem) => {
            // Store artwork files in IndexedDB if they exist
            if (item.artworkFiles && item.artworkFiles.length > 0) {
              const filesWithSize = item.artworkFiles.map((file) => ({
                ...file,
                size: file.size || 0,
              })) as SerializedFile[];
              storeArtworkFiles(item.id, filesWithSize);
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
              storeArtworkFilesMap(item.id, filesMapWithSize);
            }

            // Return item without artwork data in sessionStorage
            const { artworkFiles, artworkFilesMap, ...rest } = item;
            return {
              ...rest,
              hasArtworkFiles: !!artworkFiles?.length,
              hasArtworkFilesMap:
                !!artworkFilesMap && Object.keys(artworkFilesMap).length > 0,
            };
          }
        );
      }

      // Store the optimized data
      sessionStorage.setItem(name, JSON.stringify(parsed));
    } catch (error) {
      console.error("Failed to optimize and store checkout data:", error);
      // Fallback to storing original value if optimization fails
      sessionStorage.setItem(name, value);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    // Clean up artwork files when removing checkout data
    const value = sessionStorage.getItem(name);
    if (value) {
      try {
        const parsed = JSON.parse(value);
        const items = parsed.state?.details?.items || [];
        items.forEach((item: ICartItem) => {
          removeArtworkFiles(item.id);
        });
      } catch (error) {
        console.error("Failed to clean up artwork files:", error);
      }
    }
    sessionStorage.removeItem(name);
  },
};

export const useCheckout = create<
  CheckoutStore,
  [["zustand/persist", unknown]]
>(
  persist(
    (set, get) => ({
      details: { ...initialState },
      setItems: (items) => {
        // Clean up artwork files for removed items
        const currentItems = get().details.items;
        const removedItems = currentItems.filter(
          (item) => !items.find((newItem) => newItem.id === item.id)
        );
        removedItems.forEach((item) => {
          removeArtworkFiles(item.id);
        });

        set(() => ({ details: { ...initialState, items } }));
      },
      setDetails: (newDetails) =>
        set((prevState) => ({
          details: { ...prevState.details, ...newDetails },
        })),
      clearItems: () => {
        // Clean up all artwork files
        const currentItems = get().details.items;
        currentItems.forEach((item) => {
          removeArtworkFiles(item.id);
        });

        set(() => ({ details: { ...initialState, items: [] } }));
      },
      increaseQuantity: (id) =>
        set((prevState) => ({
          details: {
            ...prevState.details,
            items: prevState.details.items.map((item) =>
              item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            ),
          },
        })),
      decreaseQuantity: (id) =>
        set((prevState) => ({
          details: {
            ...prevState.details,
            items: prevState.details.items.map((item) =>
              item.id === id && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : item
            ),
          },
        })),
      update: (key, value) =>
        set((prevState) => ({
          details: { ...prevState.details, [key]: value },
        })),
    }),
    {
      name: "fmt_dp_checkout",
      storage: createJSONStorage(() => customStorage),
    }
  )
);

export const useEditCheckoutItem = create<{
  isEditingProduct: boolean;
  setIsEditingProduct: (isEditing: boolean) => void;
}>((set) => ({
  isEditingProduct: false,
  setIsEditingProduct: (isEditing) =>
    set(() => ({ isEditingProduct: isEditing })),
}));
