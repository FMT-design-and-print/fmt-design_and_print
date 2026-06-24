import { Grid, Paper, Text, Group, ThemeIcon, Badge, Tooltip } from "@mantine/core";
import { IconCash, IconReceipt, IconPigMoney, IconWallet, IconInfoCircle } from "@tabler/icons-react";
import { formatCurrency } from "../utils/formatters";
import { useCurrentAdminUser } from "@/hooks/admin/useCurrentAdminUser";

interface StatCardsProps {
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  totalDebts: number;
  totalBadDebts: number;
  totalTips?: number;
  isLoading: boolean;
  type: "all" | "orders" | "customOrders" | "manualSales";
}

export default function StatCards({
  totalRevenue,
  totalExpenses,
  totalProfit,
  totalDebts,
  totalBadDebts,
  totalTips = 0,
  isLoading,
  type,
}: StatCardsProps) {
  const { adminUser } = useCurrentAdminUser();
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

  type Stat = {
    title: string;
    value: string;
    icon: typeof IconCash;
    color: string;
    subtle?: string;
    tooltip?: string;
  };

  const stats: Stat[] = [
    {
      title: getTitle(),
      value: formatCurrency(totalRevenue),
      icon: IconCash,
      color: "pink",
      tooltip:
        "Total value of all sales billed in the selected period — whether the customer has paid in full or still owes you. Tips are not included.",
    },
    {
      title: "Total Expenses",
      value: formatCurrency(totalExpenses),
      icon: IconReceipt,
      color: "red",
      subtle: `Includes ${formatCurrency(totalBadDebts)} in bad debts (spoilt items)`,
      tooltip:
        "Everything spent in the selected period — supplies, bills, salaries, and bad debts from spoilt items. Bad debts are already counted here.",
    },
    {
      title: "Customer Debts (Arrears)",
      value: formatCurrency(totalDebts),
      icon: IconWallet,
      color: "orange",
      tooltip:
        "Money customers still owe you from sales in this period. Part of Revenue, but not yet received as cash.",
    },
    {
      title: "Total Profit",
      value: formatCurrency(totalProfit),
      icon: IconPigMoney,
      color: "green",
      subtle: "Excludes tips",
      tooltip:
        "Revenue minus Expenses. Counts billed sales whether paid or not, so it shows profit on paper rather than cash in hand. Tips are not included.",
    },
  ];

  return (
    <Grid>
      {stats.map((stat) => (
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }} key={stat.title}>
          <Paper shadow="sm" p="md" radius="md" h="100%">
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <div>
                <Group gap={4} mb={5} wrap="nowrap">
                  <Text size="xs" c="dimmed" lh={1.2}>
                    {stat.title}
                  </Text>
                  {stat.tooltip && (
                    <Tooltip label={stat.tooltip} multiline w={260} withArrow>
                      <IconInfoCircle
                        size={13}
                        style={{ color: "var(--mantine-color-gray-5)", cursor: "help", flexShrink: 0 }}
                      />
                    </Tooltip>
                  )}
                </Group>
                <Text size="xl" fw={700}>
                  {isLoading ? "..." : stat.value}
                </Text>
                {stat.title.includes("Revenue") && (adminUser?.role === "super-admin" || adminUser?.role === "admin" || adminUser?.role === "manager") && totalTips > 0 && (
                  <Badge color="teal" variant="light" size="xs" mt={4}>
                    + {formatCurrency(totalTips)} Tips
                  </Badge>
                )}
                {stat.subtle && !isLoading && (
                  <Text size="xs" c="dimmed" mt={4} lh={1.3}>
                    {stat.subtle}
                  </Text>
                )}
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
