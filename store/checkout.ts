import { CheckoutDetails, ICartItem, IShippingAddress } from "@/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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

export const useCheckout = create<
  CheckoutStore,
  [["zustand/persist", unknown]]
>(
  persist(
    (set) => ({
      details: { ...initialState },
      setItems: (items) => set(() => ({ details: { ...initialState, items } })),
      setDetails: (newDetails) =>
        set((prevState) => ({
          details: { ...prevState.details, ...newDetails },
        })),
      clearItems: () =>
        set(() => ({ details: { ...initialState, items: [] } })),
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
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
