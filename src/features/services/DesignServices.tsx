import { Box, Group, Input } from "@mantine/core";
import React from "react";
import { ProductTypeCard } from "../../components/ProductTypeCard";

const link = "services/design/productType";

export const DesignServices = () => {
  return (
    <Box py="lg">
      <Input placeholder="Type to search print service..." maw={600} />

      <Group my="lg">
        <ProductTypeCard label="Logos" link={link} image="" />
        <ProductTypeCard label="Flyers Frames" link={link} image="" />
        <ProductTypeCard label="3D" link={link} image="" />
        <ProductTypeCard label="Labels" link={link} image="" />
        <ProductTypeCard label="Brochure" link={link} image="" />
        <ProductTypeCard label="Business Cards" link={link} image="" />
        <ProductTypeCard label="Mockups" link={link} image="" />
      </Group>
    </Box>
  );
};
