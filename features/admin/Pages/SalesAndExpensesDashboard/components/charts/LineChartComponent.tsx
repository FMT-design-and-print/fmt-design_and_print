/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CHART_COLORS } from "../../constants/chartConstants";
import { FilterValues } from "../Filters";

interface LineChartComponentProps {
  data: any[];
  filters: FilterValues;
}

export function LineChartComponent({ data, filters }: LineChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" style={{ fontSize: "12px" }} />
        <YAxis style={{ fontSize: "12px" }} />
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
        {(filters.type === "all" || filters.type === "orders") && (
          <Line
            type="monotone"
            dataKey="orders"
            stroke={CHART_COLORS.orders}
            name="Orders"
          />
        )}
        {(filters.type === "all" || filters.type === "customOrders") && (
          <Line
            type="monotone"
            dataKey="customOrders"
            stroke={CHART_COLORS.customOrders}
            name="Custom Orders"
          />
        )}
        {(filters.type === "all" || filters.type === "manualSales") && (
          <Line
            type="monotone"
            dataKey="manualSales"
            stroke={CHART_COLORS.manualSales}
            name="Manual Sales"
          />
        )}
        {filters.type === "all" && (
          <Line
            type="monotone"
            dataKey="expenses"
            stroke={CHART_COLORS.expenses}
            name="Expenses"
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
