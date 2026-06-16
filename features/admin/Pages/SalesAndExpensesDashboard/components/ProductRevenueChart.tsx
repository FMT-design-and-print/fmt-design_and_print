import { useMemo, useState } from "react";
import { Text, Group, SegmentedControl, Grid, Paper, Stack } from "@mantine/core";
import { FilterValues } from "./Filters";
import { useRevenueByProductType } from "@/hooks/admin/useRevenueByProductType";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { formatCurrency } from "../utils/formatters";

interface ProductRevenueChartProps {
  filters: FilterValues;
}

const COLORS = [
  "#e64980", // pink
  "#15aabf", // teal
  "#7950f2", // cyan
  "#4c6ef5", // violet
  "#be4bdb", // grape
  "#fa5252", // grape/pink
  "#fd7e14", // orange
  "#fab005", // yellow
  "#82c91e", // lime
  "#40c057", // green
];

export default function ProductRevenueChart({ filters }: ProductRevenueChartProps) {
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");
  
  const startDate = filters.dateRange[0] ? filters.dateRange[0].toISOString() : null;
  const endDate = filters.dateRange[1] ? filters.dateRange[1].toISOString() : null;

  const { data, isLoading } = useRevenueByProductType(startDate, endDate);

  const pieData = useMemo(() => {
    if (!data) return [];
    return data.map(item => ({
      name: item.product_type,
      value: item.total_revenue
    }));
  }, [data]);

  if (isLoading) return <Text>Loading product revenue data...</Text>;

  if (!data || data.length === 0) {
    return <Text c="dimmed" ta="center" py="xl">No product revenue data available for the selected period.</Text>;
  }

  return (
    <>
      <Group justify="space-between" align="center" mb="md">
        <Text fw={600}>Revenue by Product Type</Text>
        <SegmentedControl
          size="xs"
          data={[
            { label: "Bar", value: "bar" },
            { label: "Pie", value: "pie" },
          ]}
          value={chartType}
          onChange={(value) => setChartType(value as "bar" | "pie")}
          color="pink"
        />
      </Group>

      <Grid>
        <Grid.Col span={{ base: 12, md: chartType === "pie" ? 6 : 12 }}>
          <div style={{ width: "100%", height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "bar" ? (
                <BarChart data={data} layout="vertical" margin={{ left: 50, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} style={{ fontSize: "12px" }} />
                  <YAxis type="category" dataKey="product_type" width={100} style={{ fontSize: "12px" }} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="total_revenue" name="Total Revenue" fill="#e64980" radius={[0, 4, 4, 0]} />
                </BarChart>
              ) : (
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>
        </Grid.Col>
        
        {chartType === "pie" && (
          <Grid.Col span={{ base: 12, md: 6 }}>
             <Stack gap="xs" style={{ maxHeight: 350, overflowY: 'auto' }} pr="md">
              {data.map((item, index) => (
                <Paper key={item.product_type} p="sm" withBorder radius="md">
                  <Group justify="space-between">
                    <Group gap="sm">
                      <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }} />
                      <div>
                        <Text size="sm" fw={500}>{item.product_type}</Text>
                        <Text size="xs" c="dimmed">{item.category}</Text>
                      </div>
                    </Group>
                    <Text fw={600} size="sm">{formatCurrency(item.total_revenue)}</Text>
                  </Group>
                </Paper>
              ))}
            </Stack>
          </Grid.Col>
        )}
      </Grid>
    </>
  );
}
