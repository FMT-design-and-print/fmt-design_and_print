/* eslint-disable @typescript-eslint/no-explicit-any */
import { Stack, Group, Title } from "@mantine/core";
import { useState } from "react";
import { OrderStatus } from "@/types/order";
import { StatusCards } from "./components/StatusCards";
import { OrdersTable } from "./components/OrdersTable";
import { OrdersChart } from "./components/OrdersChart";
import { useRealtimeOrders } from "./hooks/useRealtimeOrders";

export function CustomOrdersDashboard() {
  const [dateFilter, setDateFilter] = useState<string>("7days");
  const [selectedStatuses, setSelectedStatuses] = useState<OrderStatus[]>([
    "requested",
    "placed",
    "processing",
    "completed",
  ]);

  const { orders, statusCounts } = useRealtimeOrders(
    "custom-orders",
    dateFilter as any
  );

  return (
    <Stack gap="xl">
      <StatusCards statusCounts={statusCounts} />

      <div>
        <Title order={3} mb="md">
          Custom Orders Overview
        </Title>
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
          <Title order={3}>Recent Custom Orders</Title>
        </Group>
        <OrdersTable orders={orders} />
      </div>
    </Stack>
  );
}
