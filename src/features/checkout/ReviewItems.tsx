import { useCheckout } from "@/store/checkout";
import {
  Card,
  Flex,
  Group,
  Avatar,
  Button,
  Text,
  NumberInput,
  Title,
} from "@mantine/core";
import React from "react";

export const ReviewItems = () => {
  const {
    details: { items },
    increaseQuantity,
    decreaseQuantity,
  } = useCheckout((state) => state);

  return (
    <Card withBorder>
      <Title order={3} py={16} c="dimmed">
        Review Items
      </Title>

      {items.map((item) => (
        <Card key={item.id}>
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            wrap="nowrap"
          >
            <Group gap="sm" wrap="nowrap">
              <Avatar size="lg" src={item.image} radius="xs" />

              <div>
                <Text fz="sm" fw={500} lineClamp={1} mb="xs">
                  {item.title}
                </Text>

                <Group>
                  <Group gap="5px">
                    <Text fz="xs" c="dimmed">
                      Color:
                    </Text>
                    <Avatar src={item.color?.image} size="xs" />
                  </Group>
                  {item.size && (
                    <Text fz="xs" c="dimmed">
                      Size: {item.size}
                    </Text>
                  )}
                </Group>
              </div>
            </Group>

            <Flex
              gap={4}
              pt="xs"
              direction={{ base: "row", md: "column" }}
              justify="space-between"
              wrap="wrap"
            >
              <Group>
                <Button
                  onClick={() => decreaseQuantity(item.id)}
                  variant="light"
                  color="gray"
                  size="xs"
                >
                  -
                </Button>
                <NumberInput
                  w={40}
                  placeholder="1"
                  value={item.quantity}
                  min={1}
                  hideControls
                  size="xs"
                />
                <Button
                  onClick={() => increaseQuantity(item.id)}
                  variant="light"
                  color="gray"
                  size="xs"
                >
                  +
                </Button>
              </Group>

              <Group>
                <Text fz="sm" c="dimmed">
                  Price:
                </Text>
                <Text fz="sm" fw={500}>
                  GHS {item.price * item.quantity}
                </Text>
              </Group>
            </Flex>
          </Flex>
        </Card>
      ))}
    </Card>
  );
};
