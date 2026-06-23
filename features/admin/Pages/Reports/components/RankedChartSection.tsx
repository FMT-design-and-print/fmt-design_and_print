"use client";

import { useMemo } from "react";
import {
  Paper,
  Title,
  Group,
  SegmentedControl,
  Box,
  Table,
  Text,
} from "@mantine/core";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { usePersistedState } from "../hooks/usePersistedState";

export type ChartType = "bar" | "line" | "pie";
export type ValueMode = "absolute" | "percentage";

const PIE_COLORS = [
  "#339af0",
  "#845ef7",
  "#51cf66",
  "#ff922b",
  "#ff6b6b",
  "#868e96",
];

export interface RankedDatum {
  label: string;
  value: number;
}

interface Props {
  title: string;
  /** Used as the localStorage namespace for this section's chart/value-mode prefs. */
  storageKey: string;
  /** Full dataset (already sorted desc by value). The component slices to top N internally. */
  data: RankedDatum[];
  labelHeader: string;
  valueHeader: string;
  primaryColor: string;
  formatAbsolute: (value: number) => string;
  topN?: number;
}

export function RankedChartSection({
  title,
  storageKey,
  data,
  labelHeader,
  valueHeader,
  primaryColor,
  formatAbsolute,
  topN = 5,
}: Props) {
  const [chartType, setChartType] = usePersistedState<ChartType>(
    `reports.${storageKey}.chartType`,
    "bar",
  );
  const [valueMode, setValueMode] = usePersistedState<ValueMode>(
    `reports.${storageKey}.valueMode`,
    "absolute",
  );

  const totalSum = useMemo(
    () => data.reduce((acc, d) => acc + d.value, 0),
    [data],
  );
  const topData = useMemo(() => data.slice(0, topN), [data, topN]);
  const pieData = useMemo(() => {
    if (data.length <= topN) return topData;
    const otherSum = data
      .slice(topN)
      .reduce((acc, d) => acc + d.value, 0);
    return [...topData, { label: "Other", value: otherSum }];
  }, [data, topData, topN]);

  const toPercent = (v: number) =>
    totalSum > 0 ? (v / totalSum) * 100 : 0;
  const formatValue = (v: number) =>
    valueMode === "percentage"
      ? `${toPercent(v).toFixed(1)}%`
      : formatAbsolute(v);
  const formatAxis = (v: number) =>
    valueMode === "percentage" ? `${toPercent(v).toFixed(0)}%` : `${v}`;

  const renderChart = () => {
    if (topData.length === 0) {
      return (
        <Box ta="center" py="xl">
          <Text c="dimmed">No data for this period</Text>
        </Box>
      );
    }

    if (chartType === "pie") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius={95}
              isAnimationActive={false}
              label={(entry: { label?: string; value?: number }) =>
                `${entry.label}: ${formatValue(entry.value ?? 0)}`
              }
            >
              {pieData.map((_, i) => (
                <Cell
                  key={i}
                  fill={PIE_COLORS[i % PIE_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(v: number) => formatValue(v)} />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === "line") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={topData}
            margin={{ top: 20, right: 30, left: 10, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              angle={-25}
              textAnchor="end"
              interval={0}
              tick={{ fontSize: 11 }}
              height={60}
            />
            <YAxis tickFormatter={formatAxis} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => formatValue(v)} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={primaryColor}
              strokeWidth={2}
              dot={{ r: 5, fill: primaryColor }}
              isAnimationActive={false}
            >
              <LabelList
                dataKey="value"
                position="top"
                formatter={(v: number) => formatValue(v)}
                style={{ fill: "#495057", fontSize: 11 }}
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      );
    }

    // bar (default)
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={topData}
          layout="vertical"
          margin={{ top: 5, right: 60, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tickFormatter={formatAxis} />
          <YAxis
            dataKey="label"
            type="category"
            width={180}
            tick={{ fontSize: 12 }}
          />
          <Tooltip formatter={(v: number) => formatValue(v)} />
          <Bar
            dataKey="value"
            fill={primaryColor}
            radius={[0, 4, 4, 0]}
            isAnimationActive={false}
          >
            <LabelList
              dataKey="value"
              position="right"
              formatter={(v: number) => formatValue(v)}
              style={{ fill: "#495057", fontSize: 12 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Paper withBorder p="md" radius="md" h="100%">
      <Group justify="space-between" mb="md" wrap="wrap" gap="xs">
        <Title order={4}>{title}</Title>
        <Group gap="xs" className="hide-in-print">
          <SegmentedControl
            size="xs"
            value={chartType}
            onChange={(v) => setChartType(v as ChartType)}
            data={[
              { label: "Bar", value: "bar" },
              { label: "Line", value: "line" },
              { label: "Pie", value: "pie" },
            ]}
          />
          <SegmentedControl
            size="xs"
            value={valueMode}
            onChange={(v) => setValueMode(v as ValueMode)}
            data={[
              { label: "Value", value: "absolute" },
              { label: "%", value: "percentage" },
            ]}
          />
        </Group>
      </Group>

      <Box h={300} mb="md">
        {renderChart()}
      </Box>

      <Table striped highlightOnHover mt="lg">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{labelHeader}</Table.Th>
            <Table.Th ta="right">{valueHeader}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {topData.map((item, i) => (
            <Table.Tr key={i}>
              <Table.Td>{item.label}</Table.Td>
              <Table.Td ta="right" fw={500}>
                {formatValue(item.value)}
              </Table.Td>
            </Table.Tr>
          ))}
          {topData.length === 0 && (
            <Table.Tr>
              <Table.Td colSpan={2} ta="center">
                No data for this period
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </Paper>
  );
}
