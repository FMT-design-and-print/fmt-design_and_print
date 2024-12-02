import { Grid, Paper, Text, Group, ThemeIcon } from "@mantine/core";
import { IconCash, IconReceipt, IconPigMoney } from "@tabler/icons-react";
import { formatCurrency } from "../utils/formatters";

interface StatCardsProps {
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  isLoading: boolean;
  type: "all" | "orders" | "customOrders" | "manualSales";
}

export default function StatCards({
  totalRevenue,
  totalExpenses,
  totalProfit,
  isLoading,
  type,
}: StatCardsProps) {
  const getTitle = () => {
    switch (type) {
      case "orders":
        return "Orders Revenue";
      case "customOrders":
        return "Custom Orders Revenue";
      case "manualSales":
        return "Manual Sales Revenue";
      default:
        return "Total Revenue";
    }
  };

  const stats = [
    {
      title: getTitle(),
      value: formatCurrency(totalRevenue),
      icon: IconCash,
      color: "pink",
    },
    {
      title: "Total Expenses",
      value: formatCurrency(totalExpenses),
      icon: IconReceipt,
      color: "red",
    },
    {
      title: "Total Profit",
      value: formatCurrency(totalProfit),
      icon: IconPigMoney,
      color: "green",
    },
  ];

  return (
    <Grid>
      {stats.map((stat) => (
        <Grid.Col span={{ base: 12, sm: 4 }} key={stat.title}>
          <Paper shadow="sm" p="md" radius="md">
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed">
                  {stat.title}
                </Text>
                <Text size="xl" fw={700}>
                  {isLoading ? "Loading..." : stat.value}
                </Text>
              </div>
              <ThemeIcon size="lg" color={stat.color} variant="light">
                <stat.icon size={20} />
              </ThemeIcon>
            </Group>
          </Paper>
        </Grid.Col>
      ))}
    </Grid>
  );
}
