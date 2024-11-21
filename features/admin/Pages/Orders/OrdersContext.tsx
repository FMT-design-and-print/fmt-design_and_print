import { createContext, useContext } from "react";

interface IAdminOrdersContext {
  type: "orders" | "custom-orders";
}

export const AdminOrdersContext = createContext<IAdminOrdersContext | null>(
  null
);

export const useAdminOrdersContext = () => {
  const context = useContext(AdminOrdersContext);

  if (!context) {
    throw new Error("useOrdersContext must be used within an OrdersContext");
  }

  return context;
};
