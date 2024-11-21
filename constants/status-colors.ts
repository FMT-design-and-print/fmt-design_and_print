import { OrderStatus } from "@/types/order";
import { MantineColor } from "@mantine/core";

type IStatusColors = Record<OrderStatus, MantineColor>;

export const statusColor: IStatusColors = {
  pending: "yellow",
  cancelled: "red",
  completed: "green",
  shipped: "indigo",
  delivered: "lime",
  packaging: "orange",
  "pending-cancellation": "pink",
  ready: "cyan",
  processing: "blue",
  placed: "cyan",
  requested: "cyan",
};
