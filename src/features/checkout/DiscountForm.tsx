import { Button, TextInput, TextInputProps } from "@mantine/core";
import { useEffect, useState } from "react";

export function DiscountForm(props: TextInputProps) {
  const [discountCode, setDiscountCode] = useState("");
  const [message, setMessage] = useState("");

  const handleApplyDiscount = () => {
    if (discountCode.trim().length) {
      setMessage("Invalid coupon code");
    } else {
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
        rightSectionWidth={82}
        rightSection={
          <Button onClick={handleApplyDiscount} className="btn" radius="xl">
            Apply
          </Button>
        }
        {...props}
      />
      {message && <p className="px-4 pt-4 text-sm text-white">{message}</p>}
    </>
  );
}
