import { useCart } from "@/store/cart";
import { ICartItem } from "@/types";
import {
  Avatar,
  Button,
  Group,
  NumberInput,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import classes from "./Style.module.css";

interface Props {
  cartItem: ICartItem;
}
export const CartItemTableRow = ({ cartItem }: Props) => {
  const { removeItem, increaseQuantity, decreaseQuantity } = useCart(
    (state) => state
  );

  return (
    <Table.Tr className={classes["cart-item"]}>
      <Table.Td>
        <Group gap="sm" wrap="nowrap">
          <Avatar size="lg" src={cartItem.image} radius="xs" />
          <div>
            <Text fz="sm" fw={500} lineClamp={1} mb="sm">
              {cartItem.title}
            </Text>
            <Group>
              <Group>
                <Text fz="xs" c="dimmed">
                  Color:
                </Text>
                <Avatar src={cartItem.color?.image} size="xs" />
              </Group>

              <Text fz="xs" c="dimmed">
                Size: {cartItem.size}
              </Text>
            </Group>
          </div>
        </Group>
      </Table.Td>

      <Table.Td>GHS {cartItem.price}</Table.Td>
      <Table.Td>
        <Group>
          <Button
            onClick={() => decreaseQuantity(cartItem.id)}
            variant="light"
            color="gray"
          >
            -
          </Button>
          <NumberInput
            w={50}
            placeholder="1"
            value={cartItem.quantity}
            min={1}
            hideControls
          />
          <Button
            onClick={() => increaseQuantity(cartItem.id)}
            variant="light"
            color="gray"
          >
            +
          </Button>
        </Group>
      </Table.Td>
      <Table.Td>
        <Stack>
          <Button
            onClick={() => removeItem(cartItem.id)}
            variant="outline"
            color="gray"
            size="xs"
            maw={100}
          >
            Remove
          </Button>
          <Button className="btn" size="xs" maw={100}>
            Buy Now
          </Button>
        </Stack>
      </Table.Td>
    </Table.Tr>
  );
};
