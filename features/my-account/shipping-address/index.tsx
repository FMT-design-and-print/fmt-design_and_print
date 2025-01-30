"use client";

import { NoItemsFound } from "@/components/NoItemsFound";
import { IShippingAddress } from "@/types";
import { Button, Container, Stack, Title } from "@mantine/core";
import { LiaShippingFastSolid } from "react-icons/lia";
import { AddressCard } from "./AddressCard";
import { NewAddress } from "./NewAddress";
import { IconPlus } from "@tabler/icons-react";
import { Link, Element } from "react-scroll";

interface Props {
  addresses: IShippingAddress[];
}

export const ShippingAddresses = ({ addresses }: Props) => {
  return (
    <Container size="lg">
      <Title order={3} c="dimmed" mb="md">
        My Shipping Addresses
      </Title>

      {addresses.length === 0 && (
        <NoItemsFound
          icon={
            <LiaShippingFastSolid
              style={{ fontSize: "5rem", color: "var(--primary-300)" }}
            />
          }
          label="No Shipping address found. Add one using the form below."
        >
          <Link to="new-shipping-address" smooth>
            <Button size="xs" className="btn" leftSection={<IconPlus />}>
              Add shipping address
            </Button>
          </Link>
        </NoItemsFound>
      )}
      <Stack mb="xl" pb="lg">
        {addresses.map((address) => (
          <AddressCard key={address.id} address={address} />
        ))}
      </Stack>
      <Element name="new-shipping-address">
        <NewAddress numberOfAddresses={addresses.length} />
      </Element>
    </Container>
  );
};
