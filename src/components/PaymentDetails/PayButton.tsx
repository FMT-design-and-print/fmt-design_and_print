"use client";
import { paystackPublicKey } from "@/constants";
import { getOrderId, verifyAddressDetails } from "@/functions";
import { CheckoutDetails, IShippingAddress } from "@/types";
import { Alert, Box, Button, Text } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { useState } from "react";
import { usePaystackPayment } from "react-paystack";
import { HookConfig } from "react-paystack/dist/types";

const config: HookConfig = {
  reference: new Date().getTime().toString(),
  publicKey: paystackPublicKey,
  currency: "GHS",
};

interface IProps {
  total: number;
  shippingAddress: IShippingAddress;
  onSuccess?: (ref: any) => void;
}

export const PayButton = ({ total, shippingAddress, onSuccess }: IProps) => {
  const [emptyFields, setEmptyFields] = useState<(keyof CheckoutDetails)[]>([]);
  const initializePayment = usePaystackPayment(config);

  const handleOnSuccess = async (ref: any) => {
    if (onSuccess && typeof onSuccess === "function") {
      onSuccess(ref);
    }
  };

  const handleOnClose = () => {
    // console.info("closed");
  };

  const handleMakePayment = () => {
    if (total === 0) {
      setEmptyFields(["Amount" as any]);
      return;
    }

    const { isValid, fields } = verifyAddressDetails(shippingAddress);
    if (!isValid) {
      setEmptyFields(fields);
      return;
    }

    setEmptyFields([]);

    return initializePayment({
      config: {
        ...config,
        email:
          shippingAddress.email ||
          `${shippingAddress.phone1.replaceAll(" ", "")}@fmtdesignprint.com`,
        label: shippingAddress.contactName,
        amount: total * 100,
        phone: shippingAddress.phone1,
        reference: getOrderId(),
        firstname: shippingAddress.contactName.split(" ")[0] || "",
        lastname: shippingAddress.contactName.split(" ")[1] || "",
      },
      onSuccess: (reference) => handleOnSuccess(reference),
      onClose: () => handleOnClose(),
    });
  };

  return (
    <>
      <Button onClick={handleMakePayment} className="btn">
        <Text component="span" fw={600}>
          Pay GHS {total.toFixed(1)}
        </Text>
      </Button>

      <Box bg="white">
        {emptyFields.length > 0 && (
          <Alert
            variant="light"
            color="red"
            title={"Empty fields"}
            icon={<IconInfoCircle />}
          >
            {emptyFields.join(", ").toUpperCase()}
          </Alert>
        )}
      </Box>
    </>
  );
};
