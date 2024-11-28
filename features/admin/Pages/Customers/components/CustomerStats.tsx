import { Grid, Paper, Text } from "@mantine/core";

interface CustomerStatsProps {
  totalCustomers: number;
  genderStats: { [key: string]: number };
}

export function CustomerStats({
  totalCustomers,
  genderStats,
}: CustomerStatsProps) {
  return (
    <Grid mb="lg">
      <Grid.Col span={3}>
        <Paper p="md" radius="md" withBorder>
          <Text size="sm" fw={500}>
            Total Customers
          </Text>
          <Text size="xl" fw={700}>
            {totalCustomers}
          </Text>
        </Paper>
      </Grid.Col>
      {Object.entries(genderStats).map(([gender, count]) => (
        <Grid.Col span={3} key={gender}>
          <Paper p="md" radius="md" withBorder>
            <Text size="sm" fw={500} tt="capitalize">
              {gender}
            </Text>
            <Text size="xl" fw={700}>
              {count}
            </Text>
          </Paper>
        </Grid.Col>
      ))}
    </Grid>
  );
}
