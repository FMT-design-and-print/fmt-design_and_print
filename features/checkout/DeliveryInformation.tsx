import { ShippingAddress } from "@/components/ShippingAddress";
import { useSession } from "@/store";
import { useCheckout } from "@/store/checkout";
import { CheckoutDetails, IShippingAddress } from "@/types";
import { Card, Checkbox, Title } from "@mantine/core";
import { AvailableShippingAddresses } from "./AvailableShippingAddresses";
import { useEffect } from "react";
import { shippingFeeByRegion } from "@/constants/gh-regions";

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

  const handleUpdate = (key: keyof CheckoutDetails, value: any) => {
    if (key === "region") {
      update(key, value);
      update("deliveryFee", shippingFeeByRegion[value] || 0);
      return;
    }

    update(key, value);
  };

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
        update={handleUpdate}
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
              handleUpdate("saveAddress", event.currentTarget.checked)
            }
          />
        )}
    </Card>
  );
};
