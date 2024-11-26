/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Select, MultiSelect, Stack, Card } from "@mantine/core";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { OrderStatus } from "@/types/order";
import { getOrderStatusText } from "@/functions";
import { useMemo } from "react";
import { orderStatuses } from "@/constants/order-statuses";

interface OrdersChartProps {
  data: any[];
  selectedStatuses: OrderStatus[];
  onStatusChange: (values: OrderStatus[]) => void;
  dateFilter: string;
  onDateFilterChange: (value: string) => void;
}

const dateFilterOptions = [
  { value: "today", label: "Today" },
  { value: "3days", label: "Last 3 Days" },
  { value: "7days", label: "Last 7 Days" },
  { value: "15days", label: "Last 15 Days" },
  { value: "30days", label: "Last 30 Days" },
];

const statusColors: Record<OrderStatus, string> = {
  pending: "#FFA500",
  placed: "#1E90FF",
  processing: "#9370DB",
  shipped: "#32CD32",
  delivered: "#228B22",
  packaging: "#FF69B4",
  ready: "#4169E1",
  completed: "#008000",
  "pending-cancellation": "#FF4500",
  cancelled: "#DC143C",
  requested: "#FFD700",
};

export function OrdersChart({
  data,
  selectedStatuses,
  onStatusChange,
  dateFilter,
  onDateFilterChange,
}: OrdersChartProps) {
  const statusOptions = useMemo(
    () =>
      orderStatuses.map((status) => ({
        value: status,
        label: getOrderStatusText(status),
      })),
    []
  );

  const chartData = useMemo(() => {
    // Group orders by date
    const groupedByDate = data.reduce(
      (acc, order) => {
        const date = new Date(order.created_at).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = {
            date,
            ...orderStatuses.reduce(
              (statusAcc, status) => ({
                ...statusAcc,
                [status]: 0,
              }),
              {}
            ),
          };
        }
        acc[date][order.status] = (acc[date][order.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, any>
    );

    // Convert to array and sort by date
    return Object.values(groupedByDate).sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [data]);

  return (
    <Box>
      <Stack gap="md" mb="lg">
        <Select
          label="Time Period"
          value={dateFilter}
          onChange={(value) => onDateFilterChange(value as string)}
          data={dateFilterOptions}
        />
        <MultiSelect
          label="Order Statuses"
          value={selectedStatuses}
          onChange={(values) => onStatusChange(values as OrderStatus[])}
          data={statusOptions}
          placeholder="Select statuses to display"
        />
      </Stack>
      <Card withBorder shadow="xs" my="md">
        <Box h={400}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" style={{ fontSize: "12px" }} />
              <YAxis style={{ fontSize: "12px" }} />
              <Tooltip />
              <Legend
                wrapperStyle={{
                  fontSize: "12px",
                  paddingTop: "10px",
                }}
              />
              {selectedStatuses.map((status) => (
                <Line
                  key={status}
                  type="monotone"
                  dataKey={status}
                  stroke={statusColors[status]}
                  name={getOrderStatusText(status)}
                  dot={true}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Card>
    </Box>
  );
}
