import { Center, Box, Avatar, Text } from "@mantine/core";
import React from "react";

export const EmptyCart = () => {
  return (
    <Center bg="gray.2" w="80%" mx="auto" py="xl" mt="xl">
      <Box py="xl">
        <Avatar src="./empty-cart.svg" size="350px"></Avatar>
        <Text fw="bold" size="lg" ta="center" c="dimmed" my="lg">
          Your cart is empty.
        </Text>
        <Text ta="center" c="dimmed">
          You need to add some items to your cart.
        </Text>
      </Box>
    </Center>
  );
};
