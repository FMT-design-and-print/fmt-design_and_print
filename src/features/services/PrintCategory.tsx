import { Group } from "@mantine/core";
import React from "react";
import { ProductCard } from "./ProductCard";

const link = "services/print/categories/categoryID/productType";

const PrintCategory = () => {
  return (
    <div>
      <Group px="xl" my="lg">
        <ProductCard label="T-Shirts" link={link} image="" />
        <ProductCard label="Lacoste" link={link} image="" />
        <ProductCard label="Hoodies" link={link} image="" />
        <ProductCard label="Caps" link={link} image="" />
        <ProductCard label="Pillow Covers" link={link} image="" />
        <ProductCard label="Aprons" link={link} image="" />
      </Group>
    </div>
  );
};

export default PrintCategory;
