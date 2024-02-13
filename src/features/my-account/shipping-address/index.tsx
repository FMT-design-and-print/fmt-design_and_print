"use client";

import { Card, Center, Stack, Text, Title } from "@mantine/core";
import { NewAddress } from "./NewAddress";
import { AddressCard } from "./AddressCard";
import { IShippingAddress } from "@/types";
import { LiaShippingFastSolid } from "react-icons/lia";

interface Props {
  addresses: IShippingAddress[];
}

export const ShippingAddresses = ({ addresses }: Props) => {
  return (
    <>
      <Title order={3} c="dimmed" mb="md">
        My Shipping Addresses
      </Title>

      {addresses.length === 0 && (
        <Card withBorder mb="lg">
          <Center>
            <Stack justify="center" align="center" py="8rem">
              <LiaShippingFastSolid
                style={{ fontSize: "5rem", color: "var(--primary-300)" }}
              />

              <Text p="1rem" c="dimmed">
                No Shipping address found. Add one using the form below.
              </Text>
            </Stack>
          </Center>
        </Card>
      )}
      <Stack mb="xl" pb="lg">
        {addresses.map((address) => (
          <AddressCard key={address.id} address={address} />
        ))}
      </Stack>
      <NewAddress numberOfAddresses={addresses.length} />
    </>
  );
};
