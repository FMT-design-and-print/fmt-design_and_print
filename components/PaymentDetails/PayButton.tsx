/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { getOrderId, verifyAddressDetails } from "@/functions";
import { IShippingAddress, PaymentType } from "@/types";
import { DeliveryType } from "@/types/order";
import { Button, Text } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";
import { usePaystackPayment } from "react-paystack";
import { HookConfig } from "react-paystack/dist/types";

const config: HookConfig = {
  reference: new Date().getTime().toString(),
  publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
  currency: "GHS",
};

interface IProps {
  orderNumber?: string;
  total: number;
  shippingAddress: IShippingAddress;
  deliveryType: DeliveryType;
  setEmptyRequiredFields?: Dispatch<SetStateAction<string[]>>;
  onSuccess?: (ref: any) => void;
  paymentType?: PaymentType;
}

export const PayButton = ({
  orderNumber,
  total,
  shippingAddress,
  deliveryType,
  onSuccess,
  setEmptyRequiredFields,
  paymentType,
}: IProps) => {
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
      setEmptyRequiredFields?.(["Amount" as any]);
      return;
    }

    const { isValid, fields } = verifyAddressDetails(
      shippingAddress,
      deliveryType
    );
    if (!isValid) {
      setEmptyRequiredFields?.(fields);
      return;
    }

    setEmptyRequiredFields?.([]);

    return initializePayment({
      config: {
        ...config,
        email:
          shippingAddress.email ||
          `${shippingAddress.phone1.replaceAll(" ", "")}@fmtdesignprint.com`,
        label: shippingAddress.contactName,
        amount: total * 100,
        phone: shippingAddress.phone1,
        reference: orderNumber || getOrderId(),
        firstname: shippingAddress.contactName.split(" ")[0] || "",
        lastname: shippingAddress.contactName.split(" ")[1] || "",
        channels:
          paymentType === "momo"
            ? ["mobile_money"]
            : paymentType === "card"
              ? ["card"]
              : ["mobile_money", "card"],
      },
      onSuccess: (reference) => handleOnSuccess(reference),
      onClose: () => handleOnClose(),
    });
  };

  return (
    <>
      <Button
        onClick={handleMakePayment}
        className="btn"
        w={{ base: "100%", sm: "fit-content" }}
      >
        <Text component="span" fw={600}>
          Pay GHS {total.toFixed(1)}
        </Text>
      </Button>
    </>
  );
};
