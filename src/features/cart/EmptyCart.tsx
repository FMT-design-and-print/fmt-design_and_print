import { Center, Box, Avatar, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React from "react";

export const EmptyCart = () => {
  const sm = useMediaQuery("(max-width: 56.25em)");

  return (
    <Center
      bg="gray.2"
      w={{ base: "95%", md: "70%", lg: "60%" }}
      mx="auto"
      py={{ base: "sm", sm: "xl" }}
      mt="xl"
    >
      <Box py={{ base: "sm", md: "xl" }}>
        <Avatar
          src="./empty-cart.svg"
          size={sm ? "200px" : "350px"}
          mx="auto"
        />
        <Text fw="bold" size="lg" ta="center" c="dimmed">
          Your cart is empty.
        </Text>
        <Text ta="center" c="dimmed" mb="lg">
          You need to add some items to your cart.
        </Text>
      </Box>
    </Center>
  );
};
