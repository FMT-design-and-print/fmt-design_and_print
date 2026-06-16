import { Container, Grid, Paper, Space } from "@mantine/core";
import StatCards from "./components/StatCards";
import RevenueChart from "./components/RevenueChart";
import ProductRevenueChart from "./components/ProductRevenueChart";
import RecentActivities from "./components/RecentActivities";
import Filters, { FilterValues } from "./components/Filters";
import { useDashboardData } from "./hooks/useDashboardData";
import { useState, useCallback } from "react";

export default function SalesAndExpensesDashboard() {
  const [filters, setFilters] = useState<FilterValues>({
    dateRange: [null, null],
    type: "all",
  });

  const { totalRevenue, totalExpenses, totalProfit, totalDebts, totalBadDebts, isLoading, error } =
    useDashboardData(filters);

  const handleFilterChange = useCallback((newFilters: FilterValues) => {
    setFilters(newFilters);
  }, []);

  if (error) return <div>Error loading dashboard data</div>;

  return (
    <Container fluid>
      <Filters onFilterChange={handleFilterChange} />
      <Space h="md" />
      <Grid>
        <Grid.Col span={{ base: 12 }}>
          <StatCards
            totalRevenue={totalRevenue}
            totalExpenses={totalExpenses}
            totalProfit={totalProfit}
            totalDebts={totalDebts}
            totalBadDebts={totalBadDebts}
            isLoading={isLoading}
            type={filters.type}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper shadow="sm" p="md" radius="md">
            <RevenueChart filters={filters} />
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper shadow="sm" p="md" radius="md">
            <RecentActivities filters={filters} />
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12 }}>
          <Paper shadow="sm" p="md" radius="md">
            <ProductRevenueChart filters={filters} />
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
