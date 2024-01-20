"use client";
import { calculateTotalPrice } from "@/functions";
import { useCart } from "@/store/cart";
import {
  Avatar,
  Box,
  Button,
  Card,
  Group,
  NumberInput,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { EmptyCart } from "./EmptyCart";
import classes from "./Style.module.css";

// TODO: fix hydration error
// Ability to buy product

export const Cart = () => {
  const {
    items: cartItems,
    clearCart,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
  } = useCart((state) => state);

  const rows = cartItems.map((item) => (
    <Table.Tr key={item.id} className={classes["cart-item"]}>
      <Table.Td>
        <Group gap="sm">
          <Avatar size="lg" src={item.image} radius="xs" />
          <div>
            <Text fz="sm" fw={500} lineClamp={1} mb="sm">
              {item.title}
            </Text>
            <Group>
              <Group>
                <Text fz="xs" c="dimmed">
                  Color:
                </Text>
                <Avatar src={item.color?.image} size="xs" />
              </Group>

              <Text fz="xs" c="dimmed">
                Size: {item.size}
              </Text>
            </Group>
          </div>
        </Group>
      </Table.Td>

      <Table.Td>GHS {item.price}</Table.Td>
      <Table.Td>
        <Group>
          <Button
            onClick={() => decreaseQuantity(item.id)}
            variant="light"
            color="gray"
          >
            -
          </Button>
          <NumberInput
            w={50}
            placeholder="1"
            value={item.quantity}
            min={1}
            hideControls
          />
          <Button
            onClick={() => increaseQuantity(item.id)}
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
            onClick={() => removeItem(item.id)}
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
  ));

  return cartItems.length === 0 ? (
    <EmptyCart />
  ) : (
    <Box w="80%" mx="auto">
      <Title order={2} mt="xl" mb="sm">
        Cart ({cartItems.length})
      </Title>

      <Table verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Product Name & Options</Table.Th>
            <Table.Th>Unit Price</Table.Th>
            <Table.Th>Quantity</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Card withBorder my="xl">
        <Group justify="space-between">
          <Button variant="light" color="gray" onClick={clearCart}>
            Clear Cart
          </Button>

          <Group>
            <Text c="dimmed">Subtotal:</Text>
            <Text fw={600}>GHS {calculateTotalPrice(cartItems)}</Text>
            <Button className="btn" size="lg" miw={200}>
              Checkout
            </Button>
          </Group>
        </Group>
      </Card>
    </Box>
  );
};
