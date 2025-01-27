import { PaymentDetailsCard } from "@/components/PaymentDetails/PaymentDetailsCard";
import { calculateTotalPrice } from "@/functions";
import { useCheckout } from "@/store/checkout";
import { Card } from "@mantine/core";

export const PaymentDetails = () => {
  const { details, update } = useCheckout((state) => state);

  const subTotal = calculateTotalPrice(details.items);

  return (
    <>
      <Card withBorder my="md" bg="gray.1">
        <PaymentDetailsCard
          subTotal={subTotal}
          deliveryFee={details.deliveryFee || 0}
          note={details.note || ""}
          isLoading={false}
          discount={details.discount || 0}
          setNote={(value) => update("note", value)}
          deliveryType={details.deliveryType}
          setDeliveryType={(value) => update("deliveryType", value)}
          setDiscount={(value) => update("discount", value)}
          paymentType={details.paymentType}
          setPaymentType={(value) => update("paymentType", value)}
        />
      </Card>
    </>
  );
};
