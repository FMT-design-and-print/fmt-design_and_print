"use client";

import { useVisitorAnalytics } from "@/hooks/admin/useVisitorAnalytics";
import {
  Card,
  Center,
  Grid,
  Group,
  Loader,
  Paper,
  ScrollArea,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
  Alert,
  Popover,
  ActionIcon,
} from "@mantine/core";
import {
  IconEye,
  IconMapPin,
  IconUsers,
  IconAlertCircle,
  IconInfoCircle,
  IconLink,
} from "@tabler/icons-react";
import { usePermission } from "@/hooks/admin/usePermission";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageViews } from "./PageViews";

export const Analytics = () => {
  const { visitors, pageViews, stats, isLoading } = useVisitorAnalytics();
  const [view, setView] = useState<"analytics" | "page_views">("analytics");

  // Process data for charts
  const visitsByDate = useMemo(() => {
    if (!visitors) return [];
    const counts: Record<string, number> = {};
    visitors.forEach((v) => {
      const date = new Date(v.last_visit).toLocaleDateString();
      counts[date] = (counts[date] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7); // Last 7 days
  }, [visitors]);

  const topCountries = useMemo(() => {
    if (!visitors) return [];
    const counts: Record<string, number> = {};
    visitors.forEach((v) => {
      if (v.country) {
        counts[v.country] = (counts[v.country] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [visitors]);

  if (isLoading) {
    return (
      <Center h={400}>
        <Loader color="pink" />
      </Center>
    );
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={2}>Visitor Analytics</Title>
        <SegmentedControl
          value={view}
          onChange={(value) => setView(value as "analytics" | "page_views")}
          data={[
            { label: "Analytics", value: "analytics" },
            { label: "Page Views", value: "page_views" },
          ]}
        />
      </Group>

      {view === "analytics" ? (
        <>
      {/* Stats Cards */}
      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        <StatsCard
          title="Total Visitors"
          value={stats.totalVisitors}
          icon={<IconUsers size={24} />}
          color="blue"
        />
        <StatsCard
          title="Total Page Views"
          value={stats.totalPageViews}
          icon={<IconEye size={24} />}
          color="green"
        />
        <StatsCard
          title="Countries Reach"
          value={stats.uniqueCountries}
          icon={<IconMapPin size={24} />}
          color="orange"
        />
      </SimpleGrid>

      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper p="md" withBorder radius="md">
            <Title order={4} mb="md">
              Visits (Last 7 Days)
            </Title>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={visitsByDate}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#e64980" name="Visitors" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper p="md" withBorder radius="md" h="100%">
            <Title order={4} mb="md">
              Top Countries
            </Title>
            <Stack>
              {topCountries.map((item) => (
                <Group key={item.country} justify="space-between">
                  <Text>{item.country}</Text>
                  <Text fw={700}>{item.count}</Text>
                </Group>
              ))}
              {topCountries.length === 0 && (
                <Text c="dimmed" size="sm">No data available</Text>
              )}
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Recent Visitors Table */}
      <Paper p="md" withBorder radius="md">
        <Title order={4} mb="md">
          Recent Visitors
        </Title>
        <ScrollArea h={300}>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>IP</Table.Th>
                <Table.Th>Location</Table.Th>
                <Table.Th>Last Visit</Table.Th>
                <Table.Th>User Agent</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {visitors?.slice(0, 20).map((visitor) => (
                <Table.Tr key={visitor.id}>
                  <Table.Td>{visitor.ip_address || "N/A"}</Table.Td>
                  <Table.Td>
                    {visitor.country} {visitor.region ? `- ${visitor.region}` : ""}
                  </Table.Td>
                  <Table.Td>
                    {visitor.last_visit ? format(new Date(visitor.last_visit), "yyyy MMM dd HH:mm:aa") : "N/A"}
                  </Table.Td>
                  <Table.Td>
                    <Popover width={300} position="bottom" withArrow shadow="md">
                      <Popover.Target>
                        <Text
                          size="xs"
                          truncate
                          style={{ maxWidth: 200, cursor: "pointer" }}
                          c="blue"
                        >
                          {visitor.user_agent}
                        </Text>
                      </Popover.Target>
                      <Popover.Dropdown>
                        <Text size="xs">{visitor.user_agent}</Text>
                      </Popover.Dropdown>
                    </Popover>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Paper>
      </>
      ) : (
        <PageViews pageViews={pageViews} visitors={visitors} />
      )}
    </Stack>
  );
};

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

const StatsCard = ({ title, value, icon, color }: StatsCardProps) => (
  <Card withBorder radius="md" p="md">
    <Group justify="space-between">
      <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
        {title}
      </Text>
      <div style={{ color: `var(--mantine-color-${color}-6)` }}>{icon}</div>
    </Group>
    <Group align="flex-end" gap="xs" mt={25}>
      <Text fw={700} size="xl" truncate title={value.toString()}>
        {value}
      </Text>
    </Group>
  </Card>
);
