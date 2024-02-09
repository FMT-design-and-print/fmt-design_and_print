import { ShippingAddress } from "@/components/ShippingAddress";
import { useCheckout } from "@/store/checkout";
import { Card, Title } from "@mantine/core";

export const DeliveryInformation = () => {
  const {
    details: { contactName, email, phone1, phone2, town, address, region },
    update,
  } = useCheckout((state) => state);

  return (
    <Card withBorder my="sm">
      <Title order={3} py={16} c="dimmed">
        Shipping Address
      </Title>

      <ShippingAddress
        contactName={contactName}
        phone1={phone1}
        phone2={phone2}
        email={email}
        address={address}
        town={town}
        region={region}
        update={update}
      />
    </Card>
  );
};
