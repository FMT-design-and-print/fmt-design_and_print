import { Box, Group, Input } from "@mantine/core";
import React from "react";
import { ProductCard } from "./ProductCard";

const link = "services/design/productType";

export const DesignServices = () => {
  return (
    <Box py="lg">
      <Input placeholder="Type to search print service..." maw={600} />

      <Group my="lg">
        <ProductCard label="Logos" link={link} image="" />
        <ProductCard label="Flyers Frames" link={link} image="" />
        <ProductCard label="3D" link={link} image="" />
        <ProductCard label="Labels" link={link} image="" />
        <ProductCard label="Brochure" link={link} image="" />
        <ProductCard label="Business Cards" link={link} image="" />
        <ProductCard label="Mockups" link={link} image="" />
      </Group>
    </Box>
  );
};
