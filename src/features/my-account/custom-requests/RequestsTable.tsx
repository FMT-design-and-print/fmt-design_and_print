import { ICustomOrder } from "@/types/order";
import { Table } from "@mantine/core";
import { TableRow } from "./TableRow";

interface Props {
  requests: ICustomOrder[];
}

export const RequestsTable = ({ requests }: Props) => {
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
              <Table.Th>Item Type</Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Amount</Table.Th>
              <Table.Th>Details</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {requests.map((order) => (
              <TableRow key={order.id} order={order} />
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </>
  );
};
