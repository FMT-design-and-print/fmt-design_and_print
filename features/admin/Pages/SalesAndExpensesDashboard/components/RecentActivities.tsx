import { useActivityLogs } from "@/hooks/admin/useActivityLogs";
import { useCurrentAdminUser } from "@/hooks/admin/useCurrentAdminUser";
import { useAdminStore } from "@/store/admin";
import { Avatar, Badge, Button, Group, Paper, Stack, Text } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { formatDate } from "../utils/formatters";
import { FilterValues } from "./Filters";

const ACTIVITY_COLORS: Record<string, string> = {
  SALE: "#008000", // Green
  EXPENSE: "#FF4136", // Red
  ORDER: "#32CD32", // Lime Green
  CUSTOM_ORDER: "#008080", // Teal
  CUSTOMER: "#FF851B", // Orange
  PRODUCT_CATEGORY: "#B10DC9", // Purple
  PRODUCT_TYPE: "#85144b", // Dark Purple
  AUTH: "#0074D9", // Blue
};

interface RecentActivitiesProps {
  filters: FilterValues;
}

export default function RecentActivities({ filters }: RecentActivitiesProps) {
  const { data: logs, isLoading } = useActivityLogs(5);
  const { adminUser } = useCurrentAdminUser();
  const { setSelectedNavValue } = useAdminStore();

  if (isLoading) {
    return <Text>Loading recent activities...</Text>;
  }

  // Frontend filter for activities based on dashboard segment (optional, but requested to keep consistent)
  const filteredLogs = (logs || []).filter(log => {
    if (filters.type === "all") return true;
    if (filters.type === "orders" && log.entity_type === "ORDER") return true;
    if (filters.type === "customOrders" && log.entity_type === "CUSTOM_ORDER") return true;
    if (filters.type === "manualSales" && log.entity_type === "SALE") return true;
    return false;
  }).slice(0, 5);

  return (
    <Stack gap="md">
      <Text fw={600}>
        Recent {filters.type !== "all" ? filters.type : ""} Activities (
        {filteredLogs.length})
      </Text>
      {filteredLogs.map((activity) => (
        <Paper
          key={activity.id}
          shadow="xs"
          p="sm"
          withBorder
          style={{
            borderLeft: `4px solid ${ACTIVITY_COLORS[activity.entity_type] || "#aaa"}`,
          }}
        >
          <Group justify="space-between" wrap="nowrap" grow>
            <Stack gap={4}>
              <Group justify="space-between" wrap="nowrap" align="flex-start">
                <Group gap={8} style={{ flex: 1 }}>
                  <Badge
                    color={activity.action === "DELETE" ? "red" : activity.action === "CREATE" ? "green" : "blue"}
                    variant="light"
                    size="sm"
                  >
                    {activity.action}
                  </Badge>
                  <Text size="xs" fw={600} c="dimmed">
                    {activity.entity_type}
                  </Text>
                </Group>
                <Text size="0.6rem" c="dimmed">
                  {formatDate(activity.created_at)}
                </Text>
              </Group>

              <Text size="sm" fw={500}>
                {activity.description}
              </Text>

              {activity.user_details && (
                <Group gap={6} mt={4}>
                  <Avatar size={16} src={activity.user_details.image} radius="xl" />
                  <Text size="xs" c="dimmed">
                    {activity.user_details.name}
                  </Text>
                </Group>
              )}
            </Stack>
          </Group>
        </Paper>
      ))}

      {filteredLogs.length === 0 && (
        <Text c="dimmed" ta="center" py="md">
          No recent activities found.
        </Text>
      )}

      {adminUser?.role === "super-admin" && (
        <Button
          variant="light"
          color="pink"
          rightSection={<IconArrowRight size={14} />}
          fullWidth
          mt="sm"
          onClick={() => setSelectedNavValue("activities")}
        >
          View All Activities
        </Button>
      )}
    </Stack>
  );
}
