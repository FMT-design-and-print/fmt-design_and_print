import { OrderStatus } from "@/types/order";

export const orderStatuses: OrderStatus[] = [
  "pending",
  "placed",
  "processing",
  "packaging",
  "shipped",
  "ready",
  "delivered",
  "completed",
  "pending-cancellation",
  "cancelled",
];
