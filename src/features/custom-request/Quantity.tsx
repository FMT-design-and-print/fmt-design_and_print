"use client";
import { NumberInput, Text } from "@mantine/core";
import React from "react";
import { useCustomRequest } from ".";

export const Quantity = () => {
  const context = useCustomRequest();

  return (
    <NumberInput
      miw={250}
      label={
        <Text size="sm">
          Quantity{" "}
          <Text component="span" c="dimmed">
            (minimum qty 1)
          </Text>
        </Text>
      }
      defaultValue={1}
      min={1}
      value={context?.quantity}
      onChange={(quantity) => context?.setQuantity(Number(quantity))}
    />
  );
};
