import { verifyCheckoutDetails } from "@/functions";
import { useCheckout } from "@/store/checkout";
import { CheckoutDetails } from "@/types";
import { Button, Text } from "@mantine/core";
import React, { useState } from "react";
import { usePaystackPayment } from "react-paystack";
import { HookConfig } from "react-paystack/dist/types";

const config: HookConfig = {
  reference: new Date().getTime().toString(),
  email: "fmtdesignandprints@gmail.com",
  amount: 200 * 100,
  publicKey: "pk_test_0b33403d1f5c398b7a71de300472d27858572427",
  currency: "GHS",
};

interface IProps {
  total: number;
}
export const PayButton = ({ total }: IProps) => {
  const { details } = useCheckout((state) => state);
  const [emptyFields, setEmptyFields] = useState<(keyof CheckoutDetails)[]>([]);
  const initializePayment = usePaystackPayment(config);

  const onSuccess = (reference: any) => {
    // Implementation for whatever you want to do with reference and after success call.
    console.log(reference);
    // clear cart
    // save order details to database
    // redirect user to order-success page
  };

  const onClose = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    console.log("closed");
  };

  const handleMakePayment = () => {
    // const initializePayment = usePaystackPayment(config);
    const { isValid, fields } = verifyCheckoutDetails(details);
    if (!isValid) {
      setEmptyFields(fields);
    }

    // return initializePayment({ ...config, amount: total })
  };

  return (
    <>
      <Button variant="white" onClick={handleMakePayment}>
        <Text component="span" className="text-primary-500" fw={600}>
          Pay GHS {total.toFixed(1)}
        </Text>
      </Button>

      {emptyFields.length > 0 && <>These fields are required</>}
    </>
  );
};
