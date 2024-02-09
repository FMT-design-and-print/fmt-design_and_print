import { getOrderId, verifyAddressDetails } from "@/functions";
import { useCart } from "@/store/cart";
import { useCheckout } from "@/store/checkout";
import { CheckoutDetails } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { Alert, Box, Button, Text } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { usePaystackPayment } from "react-paystack";
import { HookConfig } from "react-paystack/dist/types";

const config: HookConfig = {
  reference: new Date().getTime().toString(),
  publicKey: "pk_test_0b33403d1f5c398b7a71de300472d27858572427",
  currency: "GHS",
};

interface IProps {
  total: number;
}
export const PayButton = ({ total }: IProps) => {
  const router = useRouter();
  const { details } = useCheckout((state) => state);
  const { clearCart } = useCart((state) => state);
  const [emptyFields, setEmptyFields] = useState<(keyof CheckoutDetails)[]>([]);
  const initializePayment = usePaystackPayment(config);

  const onSuccess = async (ref: any) => {
    const supabase = createClient();

    const { error } = await supabase
      .from("orders")
      .insert([
        {
          orderId: ref.reference,
          items: details.items,
          totalAmount: total,
          status: "pending",
          shippingMethod: "",
          couponCode: "",
          discount: 0,
          reference: ref.reference,
          shippingAddress: {
            contactName: details.contactName,
            phone1: details.phone1,
            phone2: details.phone2,
            email: details.email,
            country: details.country,
            address: details.address,
            region: details.region,
            town: details.town,
          },
        },
      ])
      .select();

    if (error) {
      console.log(error);
    }

    clearCart();
    router.push("/order-success?reference=1707236374090");
  };

  const onClose = () => {
    console.log("closed");
  };

  const handleMakePayment = () => {
    if (total === 0) {
      setEmptyFields(["Amount" as any]);
      return;
    }

    const { isValid, fields } = verifyAddressDetails(details);
    if (!isValid) {
      setEmptyFields(fields);
      return;
    }

    setEmptyFields([]);

    return initializePayment({
      config: {
        ...config,
        email: details.email || `${details.phone1}@fmtdesignprint.com`,
        label: details.contactName,
        amount: total * 100,
        phone: details.phone1,
        reference: getOrderId(),
        metadata: {
          custom_fields: [
            {
              display_name: "Order ID",
              variable_name: "orderId",
              value: getOrderId(),
            },
          ],
        },
      },
      onSuccess: (reference) => onSuccess(reference),
      onClose,
    });
  };

  return (
    <>
      <Button variant="white" onClick={handleMakePayment}>
        <Text component="span" className="text-primary-500" fw={600}>
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
