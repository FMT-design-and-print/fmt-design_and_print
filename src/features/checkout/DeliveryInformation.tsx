import { ShippingAddress } from "@/components/ShippingAddress";
import { useSession } from "@/store";
import { useCheckout } from "@/store/checkout";
import { IShippingAddress } from "@/types";
import { Card, Checkbox, Title } from "@mantine/core";
import { AvailableShippingAddresses } from "./AvailableShippingAddresses";
import { useEffect } from "react";

interface Props {
  shippingAddresses?: IShippingAddress[];
}

export const DeliveryInformation = ({ shippingAddresses }: Props) => {
  const {
    details: {
      contactName,
      email,
      phone1,
      phone2,
      town,
      address,
      region,
      saveAddress,
      deliveryType,
    },
    update,
  } = useCheckout((state) => state);

  const { session } = useSession();

  useEffect(() => {
    if (session && (shippingAddresses?.length ?? 0) < 5) {
      update("saveAddress", true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, shippingAddresses?.length]);

  return (
    <Card withBorder my="sm">
      <Title order={3} pt={16} c="dimmed">
        {deliveryType === "delivery" ? "Delivery Address" : "Contact Details"}
      </Title>
      {session && shippingAddresses && shippingAddresses?.length !== 0 && (
        <AvailableShippingAddresses shippingAddresses={shippingAddresses} />
      )}
      <ShippingAddress
        contactName={contactName}
        phone1={phone1}
        phone2={phone2}
        email={email}
        address={address}
        town={town}
        region={region}
        deliveryType={deliveryType}
        update={update}
      />

      {session &&
        deliveryType === "delivery" &&
        (shippingAddresses?.length ?? 0) < 5 && (
          <Checkbox
            checked={saveAddress || false}
            label="Save shipping address"
            color="pink"
            my="lg"
            onChange={(event) =>
              update("saveAddress", event.currentTarget.checked)
            }
          />
        )}
    </Card>
  );
};
