import { useCart } from "@/store/cart";
import { ICartItem } from "@/types";
import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Group,
  NumberInput,
  Text,
} from "@mantine/core";
import React from "react";

interface Props {
  cartItems: ICartItem[];
}
export const CartItemsMobile = ({ cartItems }: Props) => {
  return (
    <Box hiddenFrom="sm">
      {cartItems.map((item) => (
        <CartItem key={item.id} cartItem={item} />
      ))}
    </Box>
  );
};

interface ICartItemProps {
  cartItem: ICartItem;
}

const CartItem = ({ cartItem }: ICartItemProps) => {
  const { removeItem, increaseQuantity, decreaseQuantity } = useCart(
    (state) => state
  );

  return (
    <Card withBorder shadow="xs" my="sm">
      <Group gap="sm" wrap="nowrap">
        <Avatar size="lg" src={cartItem.image} radius="xs" />

        <div>
          <Text fz="sm" fw={500} lineClamp={2} mb="xs">
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

      <Group justify="space-between" my="sm">
        <Group>
          <Button
            onClick={() => decreaseQuantity(cartItem.id)}
            variant="light"
            color="gray"
            size="xs"
          >
            -
          </Button>
          <NumberInput
            w={40}
            placeholder="1"
            value={cartItem.quantity}
            min={1}
            hideControls
            size="xs"
          />
          <Button
            onClick={() => increaseQuantity(cartItem.id)}
            variant="light"
            color="gray"
            size="xs"
          >
            +
          </Button>
        </Group>

        <Text fw={500}>GHS {cartItem.price * cartItem.quantity}</Text>
      </Group>

      <Divider />
      <Group justify="flex-end" pt="sm">
        <Button
          onClick={() => removeItem(cartItem.id)}
          variant="outline"
          color="gray"
          size="compact-sm"
        >
          <Text size="xs" component="span">
            Remove
          </Text>
        </Button>
        <Button className="btn" size="compact-sm">
          <Text size="xs" component="span">
            Buy Now
          </Text>
        </Button>
      </Group>
    </Card>
  );
};
