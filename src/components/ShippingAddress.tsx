import { regionsInGhana } from "@/constants/gh-regions";
import { IShippingAddress } from "@/types";
import { SimpleGrid, Select, Textarea, TextInput } from "@mantine/core";
import React from "react";

interface Props {
  contactName: string;
  phone1: string;
  phone2?: string;
  email?: string;
  address?: string;
  town?: string;
  region?: string;
  update: (key: keyof IShippingAddress, value: any) => void;
}

export const ShippingAddress = ({
  contactName,
  phone1,
  phone2,
  email,
  address,
  town,
  region,
  update,
}: Props) => {
  return (
    <SimpleGrid cols={{ base: 1, md: 2 }}>
      <TextInput
        value={contactName}
        onChange={(e) => update("contactName", e.currentTarget.value)}
        label="Contact Name"
        placeholder="Ezra Nasir"
      />

      <TextInput
        value={phone1}
        onChange={(e) => update("phone1", e.currentTarget.value)}
        label="Phone 1"
        placeholder="0555555555"
      />
      <TextInput
        value={phone2}
        onChange={(e) => update("phone2", e.currentTarget.value)}
        label="Phone 2 (Optional)"
        placeholder="optional"
      />

      <TextInput
        type="email"
        value={email}
        onChange={(e) => update("email", e.currentTarget.value)}
        label="Email Address (Optional)"
        placeholder="qI8gM@example.com"
      />

      <Select
        value={region}
        onChange={(value) => update("region", value || "")}
        comboboxProps={{ withinPortal: true }}
        data={regionsInGhana}
        label="Region"
        placeholder="choose region"
      />

      <TextInput
        value={town}
        onChange={(e) => update("town", e.currentTarget.value)}
        label="Town"
        placeholder="town"
      />

      <Textarea
        value={address}
        onChange={(e) => update("address", e.currentTarget.value)}
        label="Street address"
        placeholder="Soko Park, Tantra Hills, Accra"
      />
    </SimpleGrid>
  );
};
