import { ICartItem } from "@/types";
import { Table } from "@mantine/core";
import { CartItemTableRow } from "./CartItemTableRow";

interface Props {
  cartItems: ICartItem[];
}
export const CartItems = ({ cartItems }: Props) => {
  return (
    <>
      <Table verticalSpacing="sm" visibleFrom="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Product Name & Options</Table.Th>
            <Table.Th>Unit Price</Table.Th>
            <Table.Th>Quantity</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {cartItems.map((item) => (
            <CartItemTableRow key={item.id} cartItem={item} />
          ))}
        </Table.Tbody>
      </Table>
    </>
  );
};
