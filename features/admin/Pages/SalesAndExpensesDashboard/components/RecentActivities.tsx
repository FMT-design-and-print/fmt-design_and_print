import { Stack, Text, Paper, Group, Badge } from "@mantine/core";
import { useOrders, useCustomOrders } from "@/hooks/admin/useOrders";
import { useSales } from "@/hooks/admin/useSales";
import { useExpenses } from "@/hooks/admin/useExpenses";
import { formatCurrency } from "../utils/formatters";
import { formatDate } from "../utils/formatters";
import { useMemo } from "react";
import { FilterValues } from "./Filters";
import { OrderStatus } from "@/types/order";

const ACTIVITY_COLORS = {
  Order: "#32CD32", // Lime Green
  "Custom Order": "#008080", // Teal
  "Manual Sale": "#008000", // Green
  Expense: "#FF4136", // Red
} as const;

type ActivityType = keyof typeof ACTIVITY_COLORS;

interface Activity {
  id: string;
  type: ActivityType;
  amount: number;
  date: Date;
  description?: string;
}

interface RecentActivitiesProps {
  filters: FilterValues;
}

const INACTIVE_STATUSES: OrderStatus[] = [
  "pending",
  "requested",
  "pending-cancellation",
  "cancelled",
] as const;

export default function RecentActivities({ filters }: RecentActivitiesProps) {
  const { data: orders } = useOrders();
  const { data: customOrders } = useCustomOrders();
  const { data: sales } = useSales();
  const { data: expenses } = useExpenses();

  // Combine and sort all activities
  const activities: Activity[] = useMemo(() => {
    const allActivities = [];

    // Add activities based on selected type
    if (filters.type === "all" || filters.type === "orders") {
      allActivities.push(
        ...(orders
          ?.filter((order) => !INACTIVE_STATUSES.includes(order.status))
          ?.map((order) => ({
            id: order.id,
            type: "Order" as ActivityType,
            amount: order.totalAmount,
            date: new Date(order.created_at),
            description: `Order #${order.orderId}`,
          })) || [])
      );
    }

    if (filters.type === "all" || filters.type === "customOrders") {
      allActivities.push(
        ...(customOrders
          ?.filter((order) => !INACTIVE_STATUSES.includes(order.status))
          ?.map((order) => ({
            id: order.id,
            type: "Custom Order" as ActivityType,
            amount: order.totalAmount,
            date: new Date(order.created_at),
            description: `Custom Order #${order.orderId}`,
          })) || [])
      );
    }

    if (filters.type === "all" || filters.type === "manualSales") {
      allActivities.push(
        ...(sales?.map((sale) => ({
          id: sale.id,
          type: "Manual Sale" as ActivityType,
          amount: sale.totalAmount,
          date: new Date(sale.created_at),
          description: sale.description,
        })) || [])
      );
    }

    // Only show expenses in "all" view
    if (filters.type === "all") {
      allActivities.push(
        ...(expenses?.map((expense) => ({
          id: expense.id,
          type: "Expense" as ActivityType,
          amount: -expense.amount,
          date: new Date(expense.created_at),
          description: expense.description,
        })) || [])
      );
    }

    return allActivities
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);
  }, [orders, customOrders, sales, expenses, filters.type]);

  if (!orders || !customOrders || !sales || !expenses) {
    return <Text>Loading recent activities...</Text>;
  }

  return (
    <Stack gap="md">
      <Text fw={600}>
        Recent {filters.type !== "all" ? filters.type : ""} Activities (
        {activities.length})
      </Text>
      {activities.map((activity) => (
        <Paper
          key={activity.id}
          shadow="xs"
          p="sm"
          withBorder
          style={{
            borderLeft: `4px solid ${ACTIVITY_COLORS[activity.type]}`,
          }}
        >
          <Group justify="space-between" wrap="nowrap" grow>
            <Stack gap={4}>
              <Group justify="space-between" wrap="nowrap" align="flex-start">
                <Group gap={8} style={{ flex: 1 }}>
                  <Text size="sm" fw={500}>
                    {activity.type}
                  </Text>
                  <Badge
                    color={activity.amount >= 0 ? "green" : "red"}
                    variant="light"
                    size="sm"
                  >
                    {formatCurrency(activity.amount)}
                  </Badge>
                </Group>
                <Text size="0.6rem" c="dimmed">
                  {formatDate(activity.date)}
                </Text>
              </Group>
              {activity.description && (
                <Text size="xs" c="dimmed">
                  {activity.description}
                </Text>
              )}
            </Stack>
          </Group>
        </Paper>
      ))}
      {activities.length === 0 && (
        <Text c="dimmed" ta="center">
          No recent activities
        </Text>
      )}
    </Stack>
  );
}
