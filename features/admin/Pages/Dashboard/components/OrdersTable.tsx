import { Table, Group, Pagination, Box, TextInput, Badge } from "@mantine/core";
import { OrderStatusRenderer } from "@/components/OrderStatusRenderer";
import { ICustomOrder, IOrder } from "@/types/order";
import { useState, useMemo } from "react";
import { IconSearch } from "@tabler/icons-react";
import { getFormattedDurationFromNow } from "@/functions/durations";
import { dateOptions } from "@/constants";

interface OrdersTableProps {
  orders: (IOrder | ICustomOrder)[];
  pageSize?: number;
}

export function OrdersTable({ orders, pageSize = 5 }: OrdersTableProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const filteredOrders = useMemo(() => {
    if (!search.trim()) return orders;

    return orders.filter((order) =>
      order.orderId.toLowerCase().includes(search.toLowerCase())
    );
  }, [orders, search]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Reset to first page when search changes
  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <Box>
      <TextInput
        placeholder="Search by Order ID"
        mb="md"
        leftSection={<IconSearch size={16} />}
        value={search}
        onChange={(event) => handleSearch(event.currentTarget.value)}
        size="xs"
      />

      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Order ID</Table.Th>
            <Table.Th>Created</Table.Th>
            <Table.Th>Updated</Table.Th>
            <Table.Th>Amount</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {paginatedOrders.map((order) => (
            <Table.Tr key={order.id}>
              <Table.Td>{order.orderId}</Table.Td>
              <Table.Td>
                <DateBadge date={order.created_at} />
              </Table.Td>
              <Table.Td>
                <DateBadge date={order.updated_at ?? order.created_at} />
              </Table.Td>
              <Table.Td>${order.totalAmount}</Table.Td>
              <Table.Td>
                <OrderStatusRenderer status={order.status} />
              </Table.Td>
            </Table.Tr>
          ))}
          {paginatedOrders.length === 0 && (
            <Table.Tr>
              <Table.Td colSpan={4} style={{ textAlign: "center" }}>
                No orders found
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>

      <Group justify="center" mt="md">
        <Pagination
          value={page}
          onChange={setPage}
          total={totalPages}
          size="sm"
        />
      </Group>
    </Box>
  );
}

export const DateBadge = ({ date }: { date: Date | string }) => {
  const newDate = new Date(date);

  return (
    <Badge
      size="xs"
      variant="light"
      color="gray"
      title={newDate.toLocaleString("en-US", dateOptions)}
    >
      {getFormattedDurationFromNow(newDate)}
    </Badge>
  );
};
