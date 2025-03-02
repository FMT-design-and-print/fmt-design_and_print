"use client";
import { NumberInput, Text } from "@mantine/core";
import React, { useEffect } from "react";
import { useCustomRequest } from ".";

interface Props {
  minQty?: number;
  label?: string;
}
export const Quantity = ({ minQty = 1, label = "Quantity" }: Props) => {
  const context = useCustomRequest();

  useEffect(() => {
    if (minQty > 1) {
      context?.setQuantity(minQty);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minQty]);

  return (
    <NumberInput
      miw={250}
      label={
        <Text size="sm">
          {label}{" "}
          <Text component="span" c="dimmed">
            (minimum qty {minQty || 1})
          </Text>
        </Text>
      }
      defaultValue={minQty || 1}
      min={minQty || 1}
      value={context?.quantity}
      onChange={(quantity) => context?.setQuantity(Number(quantity))}
    />
  );
};
