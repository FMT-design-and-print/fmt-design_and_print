/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { PayButton } from "@/components/PaymentDetails/PayButton";
import { PaymentDetailsCard } from "@/components/PaymentDetails/PaymentDetailsCard";
import { ShippingAddress } from "@/components/ShippingAddress";
import { baseShippingFeeByRegion } from "@/constants/gh-regions";
import { calculateEstimatedFulfillmentDate } from "@/functions";
import { sendMessage } from "@/functions/send-message";
import { IShippingAddress } from "@/types";
import { DeliveryType } from "@/types/order";
import { createClient } from "@/utils/supabase/client";
import { Alert, Box, Button, Card, Flex, Text, Title } from "@mantine/core";
import { IconExclamationCircle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { toast } from "react-toastify";

interface Props {
  quoteId: string;
  orderId: string;
  subTotal: number;
  clientName?: string;
  contact?: string;
  email?: string;
  specifiedDeliveryFee?: number;
  setScreen?: Dispatch<SetStateAction<"review" | "payment">>;
}

const initialAddress: IShippingAddress = {
  contactName: "",
  phone1: "",
  phone2: "",
  email: "",
  address: "",
  town: { name: "", lat: 0, long: 0, regionId: 0, regionName: "" },
  region: { id: 7, name: "Greater Accra" },
  country: "Ghana",
};

export const QuotePayment = ({
  quoteId,
  orderId,
  subTotal,
  clientName,
  contact,
  email,
  specifiedDeliveryFee,
  setScreen,
}: Props) => {
  const router = useRouter();
  const [shippingAddress, setShippingAddress] = useState<IShippingAddress>({
    ...initialAddress,
    contactName: clientName || initialAddress.contactName,
    email: email || initialAddress.email,
    phone1: contact || initialAddress.phone1,
  });
  const [note, setNote] = useState("");
  const [discount, setDisCount] = useState(0);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("delivery");
  const [emptyRequiredFields, setEmptyRequiredFields] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(
    specifiedDeliveryFee ||
      baseShippingFeeByRegion[shippingAddress.region?.id || 7] ||
      0
  );

  const total = subTotal + deliveryFee - discount;

  const handleOnPaymentSuccess = async (ref: any) => {
    const supabase = createClient();

    const detailsToUpdate = {
      status: "placed",
      totalAmount: total,
      deliveryType,
      deliveryDetails: { ...shippingAddress },
      deliveryFee,
      estimatedFulfillmentDate: calculateEstimatedFulfillmentDate(
        5,
        new Date()
      ).toISOString(),
      updated_at: new Date().toISOString(),
      orderId: ref.reference,
    };
    setIsLoading(true);
    try {
      const [customOrdersRes, quoteRes] = await Promise.all([
        supabase
          .from("custom-orders")
          .update(detailsToUpdate)
          .eq("id", orderId),
        supabase.from("quotes").update({ status: "paid" }).eq("id", quoteId),
      ]);

      if (customOrdersRes.error || quoteRes.error) {
        throw new Error(
          customOrdersRes.error?.message || quoteRes.error?.message
        );
      }

      // Send a message after successful payment update
      try {
        await sendMessage({
          subject: "Payment for Quote",
          content: `Quote payment has been made for an order with id (${ref.reference})`,
          source: "payment",
          metadata: {
            orderId: ref.reference,
            quoteId,
            totalAmount: total,
            deliveryType,
            deliveryDetails: shippingAddress,
            deliveryFee,
            note,
          },
        });
      } catch (messageError) {
        console.error(
          "Failed to send payment confirmation message:",
          messageError
        );
      }

      router.push(`/order-success?reference=${ref.reference}`);
    } catch (error) {
      toast.error(
        "Payment was successful, but there was an issue updating details."
      );
      console.error(error);
      // send error to sentry
      setIsLoading(false);
    }
  };

  return (
    <Box pos="relative">
      <LoadingOverlay visible={isLoading} />
      <Title order={2} py="sm">
        Make Payment
      </Title>
      <Card withBorder my="md" bg="gray.1">
        <PaymentDetailsCard
          subTotal={subTotal}
          deliveryFee={deliveryFee}
          note={note}
          isLoading={false}
          discount={0}
          setNote={setNote}
          deliveryType={deliveryType}
          setDeliveryType={setDeliveryType}
          setDiscount={setDisCount}
        />
      </Card>

      <Card withBorder my="md">
        <Title order={3} mb="md">
          {deliveryType === "delivery" ? "Delivery Address" : "Contact Details"}
        </Title>
        <ShippingAddress
          address={{
            contactName: shippingAddress.contactName,
            phone1: shippingAddress.phone1,
            phone2: shippingAddress.phone2,
            email: shippingAddress.email,
            address: shippingAddress.address,
            town: shippingAddress.town,
            region: shippingAddress.region,
            country: shippingAddress.country,
          }}
          deliveryType={deliveryType}
          setDeliveryFee={specifiedDeliveryFee ? () => {} : setDeliveryFee}
          update={(key, value) =>
            setShippingAddress((prev) => ({ ...prev, [key]: value }))
          }
        />
      </Card>

      {shippingAddress.region && shippingAddress.region.id !== 7 && (
        <Box>
          <Text fz="xs" fs="italic" c="gray.7">
            Your region is outside Greater Accra. Delivery fee is not finalized
            and will be confirmed later
          </Text>
        </Box>
      )}

      <Flex
        justify="space-between"
        align="center"
        direction={{ base: "column", sm: "row" }}
        py="sm"
        wrap="wrap"
        gap={16}
      >
        <Button
          variant="outline"
          onClick={() => setScreen?.("review")}
          leftSection={<BsArrowLeft />}
          w={{ base: "100%", sm: "fit-content" }}
        >
          Review Items
        </Button>

        <PayButton
          total={total}
          shippingAddress={shippingAddress}
          deliveryType={deliveryType}
          onSuccess={handleOnPaymentSuccess}
          setEmptyRequiredFields={setEmptyRequiredFields}
        />
      </Flex>

      <Box bg="white">
        {emptyRequiredFields.length > 0 && (
          <Alert
            variant="light"
            color="red"
            title={<Text size="xs">Please fill out the following fields:</Text>}
            icon={<IconExclamationCircle />}
          >
            {emptyRequiredFields.join(", ")}
          </Alert>
        )}
      </Box>
    </Box>
  );
};
