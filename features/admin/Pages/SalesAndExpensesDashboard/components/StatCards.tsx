import { Grid, Paper, Text, Group, ThemeIcon } from "@mantine/core";
import { IconCash, IconReceipt, IconPigMoney, IconWallet, IconAlertTriangle } from "@tabler/icons-react";
import { formatCurrency } from "../utils/formatters";

interface StatCardsProps {
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  totalDebts: number;
  totalBadDebts: number;
  isLoading: boolean;
  type: "all" | "orders" | "customOrders" | "manualSales";
}

export default function StatCards({
  totalRevenue,
  totalExpenses,
  totalProfit,
  totalDebts,
  totalBadDebts,
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
      title: "Total Profit",
      value: formatCurrency(totalProfit),
      icon: IconPigMoney,
      color: "green",
    },
    {
      title: "Customer Debts (Arrears)",
      value: formatCurrency(totalDebts),
      icon: IconWallet,
      color: "orange",
    },
    {
      title: "Total Expenses",
      value: formatCurrency(totalExpenses),
      icon: IconReceipt,
      color: "red",
    },
    {
      title: "Bad Debts (Spoilt Items)",
      value: formatCurrency(totalBadDebts),
      icon: IconAlertTriangle,
      color: "red",
    },
  ];

  return (
    <Grid>
      {stats.map((stat) => (
        <Grid.Col span={{ base: 12, sm: 4, md: 2.4 }} key={stat.title}>
          <Paper shadow="sm" p="md" radius="md" h="100%">
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <div>
                <Text size="xs" c="dimmed" lh={1.2} mb={5}>
                  {stat.title}
                </Text>
                <Text size="xl" fw={700}>
                  {isLoading ? "..." : stat.value}
                </Text>
              </div>
              <ThemeIcon size="md" color={stat.color} variant="light">
                <stat.icon size={18} />
              </ThemeIcon>
            </Group>
          </Paper>
        </Grid.Col>
      ))}
    </Grid>
  );
}
