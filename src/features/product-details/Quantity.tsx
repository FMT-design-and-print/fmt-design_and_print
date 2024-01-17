import { useCreateQueryString } from "@/hooks/useCreateQueryString";
import { Group, Button, NumberInput } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

export const Quantity = () => {
  const searchParams = useSearchParams();
  const createQueryString = useCreateQueryString();
  const { push } = useRouter();
  const quantity = searchParams.get("qty");

  const handleQuantityChange = (value: number) => {
    const newParams = createQueryString("qty", value.toString());
    push("?" + newParams);
  };

  return (
    <Group>
      <Button
        variant="light"
        color="gray"
        onClick={() => {
          if (quantity && parseInt(quantity) > 1) {
            handleQuantityChange(parseInt(quantity) - 1);
          }
        }}
      >
        -
      </Button>
      <NumberInput
        w={50}
        placeholder="1"
        value={quantity ? parseInt(quantity) : 1}
        readOnly
        min={1}
        hideControls
      />
      <Button
        variant="light"
        color="gray"
        onClick={() => {
          if (quantity) {
            handleQuantityChange(parseInt(quantity) + 1);
          } else {
            handleQuantityChange(1);
          }
        }}
      >
        +
      </Button>
    </Group>
  );
};
