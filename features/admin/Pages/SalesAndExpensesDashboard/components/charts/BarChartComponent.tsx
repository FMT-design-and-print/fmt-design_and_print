/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CHART_COLORS } from "../../constants/chartConstants";
import { FilterValues } from "../Filters";

interface BarChartComponentProps {
  data: any[];
  filters: FilterValues;
}

export function BarChartComponent({ data, filters }: BarChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" style={{ fontSize: "12px" }} />
        <YAxis style={{ fontSize: "12px" }} />
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
        {(filters.type === "all" || filters.type === "orders") && (
          <Bar dataKey="orders" fill={CHART_COLORS.orders} name="Orders" />
        )}
        {(filters.type === "all" || filters.type === "customOrders") && (
          <Bar
            dataKey="customOrders"
            fill={CHART_COLORS.customOrders}
            name="Custom Orders"
          />
        )}
        {(filters.type === "all" || filters.type === "manualSales") && (
          <Bar
            dataKey="manualSales"
            fill={CHART_COLORS.manualSales}
            name="Manual Sales"
          />
        )}
        {filters.type === "all" && (
          <Bar
            dataKey="expenses"
            fill={CHART_COLORS.expenses}
            name="Expenses"
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}
