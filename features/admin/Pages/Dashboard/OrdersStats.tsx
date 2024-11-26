import { LoadingOverlay } from "@/components/LoadingOverlay";
import {
  useOrderCount,
  useOrderCountByStatus,
} from "@/hooks/admin/useOrderCounts";
import {
  Badge,
  Card,
  DefaultMantineColor,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  StyleProp,
  Text,
  Title,
} from "@mantine/core";

type Data = {
  title: string;
  value: number;
  color?: string;
};

interface StatRendererProps {
  data: Data[];
  bgColor?: StyleProp<DefaultMantineColor>;
  titleColor?: StyleProp<DefaultMantineColor>;
  showBadge?: boolean;
}

export function OrdersStats() {
  const {
    orders: ordersByStatus,
    customOrders: customOrdersByStatus,
    isLoading,
  } = useOrderCountByStatus();
  const { orders, isLoading: ordersLoading } = useOrderCount();

  return (
    <Stack>
      <Card padding={0}>
        <LoadingOverlay visible={ordersLoading} />
        <SimpleGrid cols={{ base: 1, xs: 2 }}>
          <StatRenderer
            data={orders || []}
            titleColor="pink.8"
            showBadge={false}
          />
        </SimpleGrid>
      </Card>

      <Card withBorder bg="gray.1">
        <LoadingOverlay visible={isLoading} />
        <Title order={3} mb="lg">
          Orders
        </Title>

        <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>
          <StatRenderer data={ordersByStatus || []} />
        </SimpleGrid>
      </Card>

      <Card withBorder bg="gray.1">
        <LoadingOverlay visible={isLoading} />
        <Title order={3} mb="lg">
          Custom Orders
        </Title>

        <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>
          <StatRenderer data={customOrdersByStatus || []} />
        </SimpleGrid>
      </Card>
    </Stack>
  );
}

const StatRenderer = ({
  data,
  bgColor,
  titleColor,
  showBadge = true,
}: StatRendererProps) =>
  data.map((stat) => {
    return (
      <Paper withBorder shadow="sm" p="sm" key={stat.title} bg={bgColor}>
        <Text size="xs" c={titleColor || "dimmed"}>
          {stat.title}
        </Text>

        <Group justify="space-between" gap="xs" mt="xs">
          <Text size="lg" fw="bold">
            {stat.value}
          </Text>
          {showBadge && (
            <Badge size="xs" color={stat.color} variant="light">
              {stat.title}
            </Badge>
          )}
        </Group>
      </Paper>
    );
  });
