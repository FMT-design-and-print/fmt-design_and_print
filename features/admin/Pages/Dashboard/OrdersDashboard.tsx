/* eslint-disable @typescript-eslint/no-explicit-any */
import { OrderStatus } from "@/types/order";
import { Box, Group, Stack, Title } from "@mantine/core";
import { useState } from "react";
import { OrdersChart } from "./components/OrdersChart";
import { OrdersTable } from "./components/OrdersTable";
import { StatusCards } from "./components/StatusCards";
import { useRealtimeOrders } from "./hooks/useRealtimeOrders";

export function OrdersDashboard() {
  const [dateFilter, setDateFilter] = useState<string>("7days");
  const [selectedStatuses, setSelectedStatuses] = useState<OrderStatus[]>([
    "pending",
    "placed",
    "processing",
    "completed",
  ]);

  const { orders, statusCounts } = useRealtimeOrders(
    "orders",
    dateFilter as any
  );

  return (
    <Stack gap="xl">
      <div>
        <Title order={3} mb="md">
          Orders Overview
        </Title>
        <Box mb="md">
          <StatusCards statusCounts={statusCounts} />
        </Box>

        <OrdersChart
          data={orders}
          selectedStatuses={selectedStatuses}
          onStatusChange={setSelectedStatuses}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
        />
      </div>

      <div>
        <Group justify="space-between" mb="md">
          <Title order={3}>Recent Orders</Title>
        </Group>
        <OrdersTable orders={orders} />
      </div>
    </Stack>
  );
}
