import { ICustomOrder, IOrder, OrderStatus } from "@/types/order";

interface GroupedOrders {
  [key: string]: any[];
}

export const groupOrdersByStatus = (
  orders: IOrder[] | ICustomOrder[]
): GroupedOrders => {
  const groupedOrders: GroupedOrders = {};

  orders.forEach((order) => {
    if (!groupedOrders[order.status]) {
      groupedOrders[order.status] = [];
    }
    groupedOrders[order.status].push(order);
  });

  return groupedOrders;
};

export const formatOrderStatus = (status: OrderStatus) => {
  switch (status) {
    case "pending":
      return "Pending";
    case "pending-cancellation":
      return "Pending Cancellation";
    case "cancelled":
      return "Cancelled";
    case "completed":
      return "Completed";
    case "delivered":
      return "Delivered";
    case "packaging":
      return "Packaging";
    case "placed":
      return "Placed";
    case "processing":
      return "Processing";
    case "ready":
      return "Ready";
    case "shipped":
      return "Shipped";
    case "requested":
      return "Requested";
    default:
      return status;
  }
};
