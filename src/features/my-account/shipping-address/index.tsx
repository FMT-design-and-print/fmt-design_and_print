"use client";

import { Stack, Title } from "@mantine/core";
import { NewAddress } from "./NewAddress";
import { AddressCard } from "./AddressCard";
import { IShippingAddress } from "@/types";

interface Props {
  addresses: IShippingAddress[];
}

export const ShippingAddresses = ({ addresses }: Props) => {
  return (
    <>
      <Title order={3} c="dimmed" mb="md">
        My Shipping Addresses
      </Title>
      <Stack mb="xl" pb="lg">
        {addresses.map((address) => (
          <AddressCard key={address.id} address={address} />
        ))}
      </Stack>
      <NewAddress numberOfAddresses={addresses.length} />;
    </>
  );
};
