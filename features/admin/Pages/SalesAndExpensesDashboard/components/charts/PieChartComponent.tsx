/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Pie,
  PieChart,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FilterValues } from "../Filters";
import { CHART_COLORS } from "../../constants/chartConstants";

interface PieChartComponentProps {
  data: any[];
  filters: FilterValues;
}

export function PieChartComponent({ data, filters }: PieChartComponentProps) {
  const filteredData = data.filter(
    (entry) => filters.type === "all" || entry.name !== "expenses"
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={filteredData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={150}
          label
        >
          {filteredData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={CHART_COLORS[entry.name as keyof typeof CHART_COLORS]}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
