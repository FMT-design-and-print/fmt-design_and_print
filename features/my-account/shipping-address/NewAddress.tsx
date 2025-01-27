/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { ShippingAddress } from "@/components/ShippingAddress";
import { verifyAddressDetails } from "@/functions";
import { IShippingAddress } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { Card, Button, Group, Title } from "@mantine/core";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const initialAddressState: IShippingAddress = {
  contactName: "",
  phone1: "",
  phone2: "",
  email: "",
  address: "",
  town: "",
  region: { id: 7, name: "Greater Accra" },
  country: "Ghana",
};

interface Props {
  numberOfAddresses: number;
}

export const NewAddress = ({ numberOfAddresses }: Props) => {
  const { refresh } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [newAddress, setNewAddress] =
    useState<IShippingAddress>(initialAddressState);

  const update = (key: keyof IShippingAddress, value: any) => {
    setNewAddress({ ...newAddress, [key]: value });
  };

  const addAddressToDB = async () => {
    const { isValid } = verifyAddressDetails(newAddress);
    if (!isValid) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (numberOfAddresses === 5) {
      toast.info("You cannot add more than 5 addresses");
      return;
    }

    setIsLoading(true);
    const supabase = createClient();
    const { session } = (await supabase.auth.getSession()).data;

    const { error } = await supabase
      .from("shipping-addresses")
      .insert([{ ...newAddress, user_id: session?.user.id }]);

    setIsLoading(false);
    if (error) {
      console.error(error);
    } else {
      toast.success("Address added successfully");
      setNewAddress({ ...initialAddressState });
      refresh();
    }
  };

  return (
    <Card withBorder>
      <LoadingOverlay visible={isLoading} />
      <Title order={3} c="dimmed" py="lg">
        New Shipping Address
      </Title>
      <ShippingAddress
        address={{
          contactName: newAddress.contactName,
          phone1: newAddress.phone1,
          phone2: newAddress.phone2,
          email: newAddress.email,
          address: newAddress.address,
          town: newAddress.town,
          region: newAddress.region,
          country: newAddress.country,
        }}
        update={update}
        deliveryType="delivery"
      />
      <Group justify="flex-end" grow>
        <Button onClick={addAddressToDB} className="btn" maw={100} my="md">
          Save
        </Button>
      </Group>
    </Card>
  );
};
