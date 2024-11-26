import { Container, Tabs, Title } from "@mantine/core";
import { CustomOrdersDashboard } from "./CustomOrdersDashboard";
import { OrdersDashboard } from "./OrdersDashboard";
import { OrdersStats } from "./OrdersStats";

export function Dashboard() {
  return (
    <Container size="xl">
      <Title order={2} mb="lg">
        Dashboard
      </Title>

      <Tabs defaultValue="orders">
        <Tabs.List>
          <Tabs.Tab value="all">All</Tabs.Tab>
          <Tabs.Tab value="orders">Orders</Tabs.Tab>
          <Tabs.Tab value="custom-orders">Custom Orders</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="all" pt="xl">
          <OrdersStats />
        </Tabs.Panel>

        <Tabs.Panel value="orders" pt="xl">
          <OrdersDashboard />
        </Tabs.Panel>
        <Tabs.Panel value="custom-orders" pt="xl">
          <CustomOrdersDashboard />
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}
