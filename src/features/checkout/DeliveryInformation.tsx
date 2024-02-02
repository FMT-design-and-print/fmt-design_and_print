import { CheckoutDetails } from "@/types";
import { Card, Select, TextInput, Title } from "@mantine/core";
import React, { Dispatch, SetStateAction } from "react";

interface Props {
  details: CheckoutDetails;
  setDetails: Dispatch<SetStateAction<CheckoutDetails>>;
}

export const DeliveryInformation = ({ details, setDetails }: Props) => {
  // set state using details key
  const handleChange = (key: keyof CheckoutDetails, value: string) => {
    setDetails((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Card withBorder my="sm">
      <Title order={3} py={16} c="dimmed">
        Delivery Information
      </Title>

      <TextInput
        value={details.fullName}
        onChange={(e) => handleChange("fullName", e.currentTarget.value)}
        label="Full name"
        placeholder="John Doe"
      />
      <TextInput
        value={details.email}
        onChange={(e) => handleChange("email", e.currentTarget.value)}
        label="Email"
        placeholder="qI8gM@example.com"
      />
      <TextInput
        value={details.phone}
        onChange={(e) => handleChange("phone", e.currentTarget.value)}
        label="Phone"
        placeholder="+233 55 555 5555"
      />

      <Select
        value={details.country}
        onChange={(value) => handleChange("country", value || "")}
        my="md"
        comboboxProps={{ withinPortal: true }}
        data={["Ghana"]}
        placeholder="Ghana"
        label="Country"
      />

      <TextInput
        value={details.region}
        onChange={(e) => handleChange("region", e.currentTarget.value)}
        label="Region"
        placeholder="Greater Accra"
      />

      <TextInput
        value={details.address}
        onChange={(e) => handleChange("address", e.currentTarget.value)}
        my="md"
        label="Home address"
        placeholder="Soko Park, Tantra Hills, Accra"
      />
    </Card>
  );
};
