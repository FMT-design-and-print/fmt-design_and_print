import { LoadingOverlay } from "@/components/LoadingOverlay";
import { paystackPublicKey } from "@/constants";
import { getOrderId, verifyAddressDetails } from "@/functions";
import { useSession } from "@/store";
import { useCart } from "@/store/cart";
import { useCheckout } from "@/store/checkout";
import { createClient } from "@/utils/supabase/client";
import { Alert, Box, Button, Text } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
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
}
export const PayButton = ({ total }: IProps) => {
  const router = useRouter();
  const { details } = useCheckout((state) => state);
  const { clearItemsFromCart } = useCart((state) => state);
  const [emptyFields, setEmptyFields] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const initializePayment = usePaystackPayment(config);
  const user = useSession((state) => state.user);

  const onSuccess = async (ref: any) => {
    const supabase = createClient();

    setIsLoading(true);
    const { error } = await supabase
      .from("orders")
      .insert([
        {
          user_id: user?.id,
          orderId: ref.reference,
          items: details.items,
          totalAmount: total,
          status: "placed",
          deliveryType: details.deliveryType,
          paymentType: details.paymentType,
          deliveryFee: details.deliveryFee,
          reference: ref.reference,
          deliveryDetails: {
            contactName: details.contactName,
            phone1: details.phone1,
            phone2: details.phone2,
            email: details.email,
            country: details.country,
            address: details.address,
            region: details.region,
            town: details.town,
          },
          note: details.note,
        },
      ])
      .select();

    if (error) {
      console.error(error);
      setIsLoading(false);
      return;
    }

    if (details.saveAddress) {
      const { error } = await supabase
        .from("shipping-addresses")
        .insert([
          {
            user_id: user?.id,
            contactName: details.contactName,
            phone1: details.phone1,
            phone2: details.phone2,
            email: details.email,
            country: details.country,
            region: details.region,
            address: details.address,
            town: details.town,
          },
        ])
        .select();

      if (error) {
        // log address could not be saved
      }
    }

    clearItemsFromCart(details.items.map((item) => item.id));
    router.push(`/order-success?reference=${ref.reference}`);
  };

  const onClose = () => {
    // console.info("closed");
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
        email:
          details.email ||
          `${details.phone1.replaceAll(" ", "")}@fmtdesignprint.com`,
        label: details.contactName,
        amount: total * 100,
        phone: details.phone1,
        reference: getOrderId(),
        firstname: details.contactName.split(" ")[0] || "",
        lastname: details.contactName.split(" ")[1] || "",
      },
      onSuccess: (reference) => onSuccess(reference),
      onClose,
    });
  };

  return (
    <>
      <LoadingOverlay visible={isLoading} />
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
