import { Button, TextInput, TextInputProps } from "@mantine/core";

export function DiscountForm(props: TextInputProps) {
  return (
    <TextInput
      radius="xl"
      size="md"
      placeholder="Enter Coupon Code"
      rightSectionWidth={82}
      rightSection={
        <Button className="btn" radius="xl">
          Apply
        </Button>
      }
      {...props}
    />
  );
}
