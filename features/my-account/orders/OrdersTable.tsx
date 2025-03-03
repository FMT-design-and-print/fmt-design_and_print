import { IOrder } from "@/types/order";
import { Table } from "@mantine/core";
import { OrderTableRow } from "./OrderTableRow";

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
              <Table.Th>Amount</Table.Th>
              <Table.Th>Payment Status</Table.Th>
              <Table.Th>Order Status</Table.Th>
              <Table.Th>Details</Table.Th>
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
