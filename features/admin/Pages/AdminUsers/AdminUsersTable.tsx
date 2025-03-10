import { formatRole } from "@/functions/permisions";
import { useLoadAdminUsers } from "@/hooks/admin/useLoadAdminUsers";
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Divider,
  Group,
  LoadingOverlay,
  ScrollArea,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { IconLock, IconReload } from "@tabler/icons-react";
import { TableActions } from "./TableActions";
import { useQueryClient } from "@tanstack/react-query";

export function AdminUsersTable() {
  const queryClient = useQueryClient();
  const { adminUsers, isLoading } = useLoadAdminUsers();
  const data = adminUsers || [];

  const rows = data.map((item) => (
    <Table.Tr key={item.id}>
      <Table.Td>
        <Group gap="sm" wrap="nowrap">
          <Avatar size={26} src={item.avatar} radius={26} />
          <Text size="sm" lineClamp={1}>
            {item.firstName + " " + item.lastName}
          </Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Text size="sm" lineClamp={1}>
          {item.email}
        </Text>
      </Table.Td>
      <Table.Td bg={item.role === "super-admin" ? "red.1" : ""}>
        {formatRole(item.role)}
      </Table.Td>
      <Table.Td>
        <Group gap="sm" wrap="nowrap">
          <Badge
            size="xs"
            color={item.confirmed ? "green" : "red"}
            variant="light"
          >
            {item.confirmed ? "Confirmed" : "Unconfirmed"}
          </Badge>
        </Group>
      </Table.Td>
      {item.role !== "super-admin" ? (
        <Table.Td>
          <TableActions />
        </Table.Td>
      ) : (
        <Table.Td>
          <ActionIcon
            mx="md"
            variant="transparent"
            color="gray.4"
            size="sm"
            h="100%"
          >
            <IconLock />
          </ActionIcon>
        </Table.Td>
      )}
    </Table.Tr>
  ));

  const handleReload = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
  };

  return (
    <Box pos="relative">
      <LoadingOverlay visible={isLoading} />
      <Group justify="space-between">
        <Title order={3}>Admin Users({data.length})</Title>
        <ActionIcon variant="light" onClick={handleReload}>
          <IconReload size={"1rem"} />
        </ActionIcon>
      </Group>
      <Divider my="sm" />

      <ScrollArea>
        <Table verticalSpacing="sm" striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>User</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Role</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </Box>
  );
}
