"use client";

import { useActivityLogs } from "@/hooks/admin/useActivityLogs";
import { 
  Box, 
  Paper, 
  Title, 
  Text, 
  Table, 
  Badge, 
  Group, 
  Avatar, 
  Loader, 
  Center,
  Select,
  Grid,
  Pagination,
  Stack,
} from "@mantine/core";
import { useState, useMemo } from "react";
import { formatDate } from "../SalesExpenses/utils";
import { IActivityLog, ActivityEntityType, ActivityAction } from "@/types/admin";
import { usePermission } from "@/hooks/admin/usePermission";
import { UserPermission } from "@/types/roles";

const ACTIVITY_COLORS: Record<string, string> = {
  SALE: "green",
  EXPENSE: "red",
  ORDER: "lime",
  CUSTOM_ORDER: "teal",
  CUSTOMER: "orange",
  PRODUCT_CATEGORY: "grape",
  PRODUCT_TYPE: "violet",
  AUTH: "blue",
};

export default function ActivitiesPage() {
  const { hasPermission } = usePermission();
  const { data: logs, isLoading } = useActivityLogs(500); // Fetch up to 500 recent logs
  
  const [activePage, setActivePage] = useState(1);
  const [entityFilter, setEntityFilter] = useState<string | null>(null);
  const [actionFilter, setActionFilter] = useState<string | null>(null);
  const itemsPerPage = 20;

  const filteredLogs = useMemo(() => {
    let result = logs || [];
    
    if (entityFilter) {
      result = result.filter(log => log.entity_type === entityFilter);
    }
    
    if (actionFilter) {
      result = result.filter(log => log.action === actionFilter);
    }
    
    return result;
  }, [logs, entityFilter, actionFilter]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );

  // Restrict to super admins
  if (!hasPermission(UserPermission.ADMIN_PERMISSIONS)) {
    return (
      <Center style={{ height: '50vh' }}>
        <Text c="red" fw={500}>You do not have permission to view this page.</Text>
      </Center>
    );
  }

  if (isLoading) {
    return (
      <Center style={{ height: '50vh' }}>
        <Loader color="pink" />
      </Center>
    );
  }

  return (
    <Box p="md">
      <Paper withBorder p="md" radius="md">
        <Stack gap="lg">
          <Group justify="space-between">
            <Box>
              <Title order={3}>Activity Logs</Title>
              <Text c="dimmed" size="sm">Complete audit trail of system activities</Text>
            </Box>
          </Group>

          <Grid>
            <Grid.Col span={{ base: 12, sm: 4, md: 3 }}>
              <Select
                label="Filter by Entity"
                placeholder="All Entities"
                data={[
                  { value: 'SALE', label: 'Sales' },
                  { value: 'EXPENSE', label: 'Expenses' },
                  { value: 'ORDER', label: 'Orders' },
                  { value: 'CUSTOM_ORDER', label: 'Custom Orders' },
                  { value: 'CUSTOMER', label: 'Customers' },
                  { value: 'PRODUCT_CATEGORY', label: 'Product Categories' },
                  { value: 'PRODUCT_TYPE', label: 'Product Types' },
                  { value: 'AUTH', label: 'Authentication' },
                ]}
                value={entityFilter}
                onChange={setEntityFilter}
                clearable
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 4, md: 3 }}>
              <Select
                label="Filter by Action"
                placeholder="All Actions"
                data={[
                  { value: 'CREATE', label: 'Create' },
                  { value: 'UPDATE', label: 'Update' },
                  { value: 'DELETE', label: 'Delete' },
                  { value: 'RECORD_PAYMENT', label: 'Record Payment' },
                  { value: 'PRINT_RECEIPT', label: 'Print Receipt' },
                  { value: 'LOGIN', label: 'Login' },
                ]}
                value={actionFilter}
                onChange={setActionFilter}
                clearable
              />
            </Grid.Col>
          </Grid>

          <Table striped highlightOnHover verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>User</Table.Th>
                <Table.Th>Action</Table.Th>
                <Table.Th>Entity</Table.Th>
                <Table.Th>Description</Table.Th>
                <Table.Th>Date & Time</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedLogs.map((log) => (
                <Table.Tr key={log.id}>
                  <Table.Td>
                    {log.user_details ? (
                      <Group gap="sm">
                        <Avatar size="sm" src={log.user_details.image} radius="xl" />
                        <Text size="sm" fw={500}>{log.user_details.name}</Text>
                      </Group>
                    ) : (
                      <Text size="sm" c="dimmed">System</Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Badge 
                      color={log.action === 'DELETE' ? 'red' : log.action === 'CREATE' ? 'green' : 'blue'} 
                      variant="light"
                    >
                      {log.action}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={ACTIVITY_COLORS[log.entity_type] || "gray"} variant="dot">
                      {log.entity_type}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{log.description}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">{formatDate(log.created_at)}</Text>
                  </Table.Td>
                </Table.Tr>
              ))}
              {paginatedLogs.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={5}>
                    <Text ta="center" c="dimmed" py="md">No activity logs found matching the filters.</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>

          {totalPages > 1 && (
            <Group justify="center">
              <Pagination
                total={totalPages}
                value={activePage}
                onChange={setActivePage}
                color="pink"
              />
            </Group>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
