"use client";
import { calculateTotalPrice } from "@/functions";
import { useCart } from "@/store/cart";
import { useCheckout } from "@/store/checkout";
import { ICartItem } from "@/types";
import { Box, Button, Card, Group, Text, Title } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CartItems } from "./CartItems";
import { CartItemsMobile } from "./CartItemsMobile";
import { EmptyCart } from "./EmptyCart";

export const Cart = () => {
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const { items, clearCart } = useCart((state) => state);
  const { setItems } = useCheckout((state) => state);
  const { push } = useRouter();

  const handleCheckout = () => {
    if (items.length === 0) return;
    setItems(items);
    return push("/checkout");
  };

  useEffect(() => {
    // re-set cart items as local state to avoid hydration error because of the if check
    setCartItems(items);
  }, [items]);

  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <>
      <Box w={{ base: "95%", md: "80%" }} mx="auto">
        <Title order={2} mt="xl" mb="sm">
          Cart ({cartItems.length})
        </Title>
        <Box bg="gray.1" p="sm">
          <CartItems cartItems={cartItems} />
          <CartItemsMobile cartItems={cartItems} />
        </Box>

        <Card withBorder my="xl" bg="gray.1">
          <Group justify="space-between">
            <Button variant="light" color="gray" onClick={clearCart}>
              Clear Cart
            </Button>
            <Group visibleFrom="sm">
              <Text c="dimmed">Subtotal:</Text>
              <Text fw={600}>
                GHS {calculateTotalPrice(cartItems).toFixed(1)}
              </Text>
              <Button
                onClick={handleCheckout}
                className="btn"
                size="md"
                miw={150}
              >
                Checkout
              </Button>
            </Group>

            <Button
              onClick={handleCheckout}
              size="sm"
              className="btn"
              hiddenFrom="sm"
            >
              Checkout (GHS {calculateTotalPrice(cartItems).toFixed(1)})
            </Button>
          </Group>
        </Card>
      </Box>
    </>
  );
};
