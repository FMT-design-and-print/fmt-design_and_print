import { Group, Rating, Text } from "@mantine/core";
import React from "react";

export const ItemRating = () => {
  return (
    <Group gap="xs">
      <Rating size="xs" value={4.5} fractions={2} readOnly color="pink" />
      <Text size="xs" my="md">
        (123)
      </Text>
    </Group>
  );
};
