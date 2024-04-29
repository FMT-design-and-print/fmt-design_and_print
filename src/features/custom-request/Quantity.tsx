"use client";
import { NumberInput, Text } from "@mantine/core";
import React from "react";
import { useCustomRequest } from ".";

interface Props {
  minQty?: number;
}
export const Quantity = ({ minQty = 1 }: Props) => {
  const context = useCustomRequest();

  return (
    <NumberInput
      miw={250}
      label={
        <Text size="sm">
          Quantity{" "}
          <Text component="span" c="dimmed">
            (minimum qty {minQty || 1})
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
