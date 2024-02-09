import { CheckoutDetails, ICartItem } from "@/types";
import { create } from "zustand";

type CheckoutStore = {
  details: CheckoutDetails;
  setItems: (items: ICartItem[]) => void;
  clearItems: () => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  update: (key: keyof CheckoutDetails, value: any) => void;
};

const initialState: CheckoutDetails = {
  orderId: "",
  paymentType: "",
  fullName: "John Test",
  email: "yopamif362@flexvio.com",
  phone: "0205667673",
  country: "Ghana",
  region: "Greater Accra",
  address: "Mile 7, Achimota, Accra",
  items: [],
};

export const useCheckout = create<CheckoutStore>((set) => ({
  details: { ...initialState },
  setItems: (items) => set(() => ({ details: { ...initialState, items } })),
  clearItems: () => set(() => ({ details: { ...initialState, items: [] } })),
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
    set((prevState) => ({ details: { ...prevState.details, [key]: value } })),
}));
