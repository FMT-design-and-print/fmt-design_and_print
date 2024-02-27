import { CheckoutDetails, ICartItem, IShippingAddress } from "@/types";
import { create } from "zustand";

type CheckoutStore = {
  details: CheckoutDetails;
  setItems: (items: ICartItem[]) => void;
  setDetails: (details: Partial<IShippingAddress>) => void;
  clearItems: () => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  update: (key: keyof CheckoutDetails, value: any) => void;
};

const initialState: CheckoutDetails = {
  orderId: "",
  paymentType: "",
  contactName: "",
  phone1: "",
  phone2: "",
  email: "",
  country: "Ghana",
  region: "",
  town: "",
  address: "",
  items: [],
  notes: "",
  deliveryType: "delivery",
  deliveryFee: 30,
};

export const useCheckout = create<CheckoutStore>((set) => ({
  details: { ...initialState },
  setItems: (items) => set(() => ({ details: { ...initialState, items } })),
  setDetails: (newDetails) =>
    set((prevState) => ({ details: { ...prevState.details, ...newDetails } })),
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
