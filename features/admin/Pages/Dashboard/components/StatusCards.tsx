/* eslint-disable @typescript-eslint/no-unused-vars */
import { SimpleGrid, Paper, Text, Group } from "@mantine/core";
import { OrderStatusRenderer } from "@/components/OrderStatusRenderer";
import { OrderStatus } from "@/types/order";
import { getOrderStatusText } from "@/functions";

interface StatusCardsProps {
  statusCounts: Record<OrderStatus, number>;
}

export function StatusCards({ statusCounts }: StatusCardsProps) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
      {(Object.entries(statusCounts) as [OrderStatus, number][])
        .filter(([_, count]) => count > 0)
        .map(([status, count]) => (
          <Paper key={status} shadow="sm" p="md" withBorder>
            <Group justify="space-between" align="center">
              <div>
                <Text size="xs" c="dimmed">
                  {getOrderStatusText(status)}
                </Text>
                <Text fw={500} size="lg">
                  {count}
                </Text>
              </div>
              <OrderStatusRenderer status={status} />
            </Group>
          </Paper>
        ))}
    </SimpleGrid>
  );
}
