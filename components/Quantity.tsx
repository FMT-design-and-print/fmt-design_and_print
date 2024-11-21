import { SelectedProductOptions } from "@/types";
import { Button, Group, NumberInput } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";

interface Props {
  quantity: number;
  setSelectedProductOptions: Dispatch<SetStateAction<SelectedProductOptions>>;
}
export const Quantity = ({ quantity, setSelectedProductOptions }: Props) => {
  return (
    <Group>
      <Button
        variant="light"
        color="gray"
        onClick={() => {
          if (quantity > 1) {
            setSelectedProductOptions((prevState) => ({
              ...prevState,
              quantity: prevState.quantity - 1,
            }));
          }
        }}
      >
        -
      </Button>
      <NumberInput
        w={50}
        placeholder="1"
        value={quantity}
        onChange={(value) => {
          if (value == null) return;
          setSelectedProductOptions((prevState) => ({
            ...prevState,
            quantity: Number(value),
          }));
        }}
        min={1}
        hideControls
      />
      <Button
        variant="light"
        color="gray"
        onClick={() => {
          setSelectedProductOptions((prevState) => ({
            ...prevState,
            quantity: prevState.quantity + 1,
          }));
        }}
      >
        +
      </Button>
    </Group>
  );
};
