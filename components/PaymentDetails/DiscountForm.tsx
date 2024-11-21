import { Button, TextInput, TextInputProps } from "@mantine/core";
import { useEffect, useState } from "react";

interface Props extends TextInputProps {
  setDiscount?: (value: number) => void;
}

export function DiscountForm({ setDiscount, ...rest }: Props) {
  const [discountCode, setDiscountCode] = useState("");
  const [message, setMessage] = useState("");

  const handleApplyDiscount = () => {
    if (discountCode.trim().length) {
      setMessage("Invalid coupon code");
    } else {
      // load discount details from db using code
      // calculate discount
      const discount = 0;
      setDiscount?.(discount);
      setMessage("");
      setDiscountCode("");
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMessage("");
    }, 1000);

    return () => clearTimeout(timeout);
  }, [discountCode]);

  return (
    <>
      <TextInput
        value={discountCode}
        onChange={(e) => setDiscountCode(e.currentTarget.value)}
        radius="xl"
        size="md"
        placeholder="Enter Coupon Code"
        rightSectionWidth={80}
        rightSection={
          <Button onClick={handleApplyDiscount} className="btn" radius="xl">
            Apply
          </Button>
        }
        {...rest}
      />
      {message && <p className="px-4 pt-4 text-sm">{message}</p>}
    </>
  );
}
