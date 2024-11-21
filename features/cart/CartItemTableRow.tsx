import { useCart } from "@/store/cart";
import { useCheckout } from "@/store/checkout";
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
import { useRouter } from "next/navigation";
import classes from "./Style.module.css";

interface Props {
  cartItem: ICartItem;
}
export const CartItemTableRow = ({ cartItem }: Props) => {
  const { push } = useRouter();
  const { removeItem, increaseQuantity, decreaseQuantity } = useCart(
    (state) => state
  );
  const { setItems } = useCheckout((state) => state);

  const handleCheckout = () => {
    setItems([cartItem]);
    return push("/checkout");
  };

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
              <Group gap="5px">
                <Text fz="xs" c="dimmed">
                  Color:
                </Text>
                <Avatar src={cartItem.color?.image} size="xs" />
              </Group>

              {cartItem.size && (
                <Text fz="xs" c="dimmed">
                  Size: {cartItem.size}
                </Text>
              )}
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
          <Button onClick={handleCheckout} className="btn" size="xs" maw={100}>
            Buy Now
          </Button>
        </Stack>
      </Table.Td>
    </Table.Tr>
  );
};
