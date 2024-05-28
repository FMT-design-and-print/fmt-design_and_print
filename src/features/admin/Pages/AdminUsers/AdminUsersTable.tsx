import { formatRole } from "@/functions/permisions";
import { useLoadAdminUsers } from "@/hooks/admin/useLoadAdminUsers";
import {
  ActionIcon,
  Avatar,
  Box,
  Center,
  Divider,
  Group,
  ScrollArea,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { TableActions } from "./TableActions";
import { IconLock } from "@tabler/icons-react";

export function AdminUsersTable() {
  const { adminUsers } = useLoadAdminUsers();
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
      {item.role !== "super-admin" ? (
        <Table.Td>
          <TableActions />
        </Table.Td>
      ) : (
        <ActionIcon
          m="md"
          variant="transparent"
          color="gray.4"
          size="sm"
          h="100%"
        >
          <IconLock />
        </ActionIcon>
      )}
    </Table.Tr>
  ));

  return (
    <Box>
      <Title order={3}>Admin Users({data.length})</Title>
      <Divider my="sm" />

      <ScrollArea>
        <Table verticalSpacing="sm" striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>User</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Role</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </Box>
  );
}
