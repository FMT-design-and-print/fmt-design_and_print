import { LoadingOverlay } from "@/components/LoadingOverlay";
import {
  useOrderCount,
  useOrderCountByStatus,
} from "@/hooks/admin/useOrderCounts";
import {
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
  textColor?: StyleProp<DefaultMantineColor>;
  titleColor?: StyleProp<DefaultMantineColor>;
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
            bgColor="pink.8"
            textColor="white"
            titleColor="gray.2"
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
  textColor,
  titleColor,
}: StatRendererProps) =>
  data.map((stat) => {
    return (
      <Paper withBorder p="sm" radius="md" key={stat.title} bg={bgColor}>
        <Text size="xs" c={stat.color || titleColor || "dimmed"}>
          {stat.title}
        </Text>

        <Group align="flex-end" gap="xs" mt="xs">
          <Text size="lg" fw="bold" c={stat.color || textColor}>
            {stat.value}
          </Text>
        </Group>
      </Paper>
    );
  });
