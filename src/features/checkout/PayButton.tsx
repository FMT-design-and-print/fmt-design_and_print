import { LoadingOverlay } from "@/components/LoadingOverlay";
import { getOrderId } from "@/functions";
import { useSession } from "@/store";
import { useCart } from "@/store/cart";
import { useCheckout } from "@/store/checkout";
import { CheckoutDetails } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { Alert, Box } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PaystackButton } from "react-paystack";
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
  const [emptyFields] = useState<(keyof CheckoutDetails)[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const initializePayment = usePaystackPayment(config);
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
          status: "pending",
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
        },
      ])
      .select();

    if (error) {
      console.log(error);
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

    setIsLoading(false);
    clearCart();
    router.push("/order-success?reference=1707236374090");
  };

  const onClose = () => {
    console.log("closed");
  };

  const componentProps = {
    ...config,
    email: "test@gmail.com",
    label: details.contactName,
    amount: total * 100,
    phone: details.phone1,
    reference: getOrderId(),
    text: `Pay GHS ${total.toFixed(1)}`,
    onSuccess: (ref: any) => onSuccess(ref),
    onClose: () => onClose(),
  };

  // const handleMakePayment = () => {
  //   if (total === 0) {
  //     setEmptyFields(["Amount" as any]);
  //     return;
  //   }

  //   const { isValid, fields } = verifyAddressDetails(details);
  //   if (!isValid) {
  //     setEmptyFields(fields);
  //     return;
  //   }

  //   setEmptyFields([]);

  //   return initializePayment({
  //     config: {
  //       ...config,
  //       email: details.email || `${details.phone1}@fmtdesignprint.com`,
  //       label: details.contactName,
  //       amount: total * 100,
  //       phone: details.phone1,
  //       reference: getOrderId(),
  //     },
  //     onSuccess: (reference) => onSuccess(reference),
  //     onClose,
  //   });
  // };

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      {/* <Button variant="white" onClick={handleMakePayment}>
        <Text component="span" className="text-primary-500" fw={600}>
          Pay GHS {total.toFixed(1)}
        </Text>
      </Button> */}

      <PaystackButton {...componentProps} />

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
