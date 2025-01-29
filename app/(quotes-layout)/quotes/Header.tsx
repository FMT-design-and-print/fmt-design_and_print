"use client";

import { FMTLogo } from "@/components/FMTLogo";
import { Group, Title } from "@mantine/core";
import React from "react";
import { useQuoteDetails } from "../QuoteTypeProvider";

export const Header = () => {
  const { type } = useQuoteDetails();

  return (
    <Group py="lg" bg="gray.1" justify="center">
      <FMTLogo image="https://res.cloudinary.com/dnbmynikp/image/upload/v1703264782/FMT/logo1_tpiges.png" />
      <Title order={2}>Review {type === "quote" ? "Quote" : "Invoice"}</Title>
    </Group>
  );
};
