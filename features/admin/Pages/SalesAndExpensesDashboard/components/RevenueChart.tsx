import { useMemo, useState } from "react";
import { Text, Group, SegmentedControl } from "@mantine/core";
import { useDashboardData } from "../hooks/useDashboardData";
import { groupDataByDate } from "../utils/chartHelpers";
import { FilterValues } from "./Filters";
import { ChartType } from "../constants/chartConstants";
import { LineChartComponent } from "./charts/LineChartComponent";
import { BarChartComponent } from "./charts/BarChartComponent";
import { PieChartComponent } from "./charts/PieChartComponent";

interface RevenueChartProps {
  filters: FilterValues;
}

export default function RevenueChart({ filters }: RevenueChartProps) {
  const [chartType, setChartType] = useState<ChartType>("line");
  const { orders, customOrders, sales, expenses, isLoading } =
    useDashboardData(filters);

  const chartData = useMemo(() => {
    if (!orders || !customOrders || !sales || !expenses) return [];
    return groupDataByDate({ orders, customOrders, sales, expenses });
  }, [orders, customOrders, sales, expenses]);

  const pieChartData = useMemo(() => {
    if (chartData.length === 0) return [];
    const totals = chartData.reduce(
      (acc, item) => ({
        orders: acc.orders + item.orders,
        customOrders: acc.customOrders + item.customOrders,
        manualSales: acc.manualSales + item.manualSales,
        expenses: acc.expenses + item.expenses,
      }),
      { orders: 0, customOrders: 0, manualSales: 0, expenses: 0 }
    );

    return Object.entries(totals).map(([key, value]) => ({
      name: key,
      value: Math.abs(value),
    }));
  }, [chartData]);

  if (isLoading) return <Text>Loading chart data...</Text>;

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return <BarChartComponent data={chartData} filters={filters} />;
      case "pie":
        return <PieChartComponent data={pieChartData} filters={filters} />;
      default:
        return <LineChartComponent data={chartData} filters={filters} />;
    }
  };

  return (
    <>
      <Group justify="space-between" align="center" mb="md">
        <Text fw={600}>Revenue & Expenses Trend</Text>
        <SegmentedControl
          size="xs"
          data={[
            { label: "Line", value: "line" },
            { label: "Bar", value: "bar" },
            { label: "Pie", value: "pie" },
          ]}
          value={chartType}
          onChange={(value) => setChartType(value as ChartType)}
          color="pink"
        />
      </Group>
      <div style={{ width: "100%", height: 400 }}>{renderChart()}</div>
    </>
  );
}
