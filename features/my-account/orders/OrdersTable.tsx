import { IOrder } from "@/types/order";
import { Table } from "@mantine/core";
import { OrderTableRow } from "./OrderTableRow";
// import { CartItemTableRow } from "./CartItemTableRow";

interface Props {
  orders: IOrder[];
}

export const OrdersTable = ({ orders }: Props) => {
  return (
    <>
      <Table.ScrollContainer minWidth={500} type="native">
        <Table
          striped
          highlightOnHover
          withRowBorders={false}
          verticalSpacing="sm"
          visibleFrom="sm"
          bg="white"
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Order ID</Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th>Time</Table.Th>
              <Table.Th>Amount</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Items</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {orders.map((order) => (
              <OrderTableRow key={order.id} order={order} />
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </>
  );
};
