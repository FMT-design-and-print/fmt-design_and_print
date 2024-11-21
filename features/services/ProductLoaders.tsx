import { ProductsLoader } from "@/components/ProductsLoader";
import { Flex } from "@mantine/core";
import React from "react";

export const ProductLoaders = () => {
  return (
    <Flex
      wrap="wrap"
      align="center"
      py="lg"
      justify={{ base: "center", md: "flex-start" }}
      gap={{ base: "md", md: 26, xl: 40 }}
    >
      <ProductsLoader />
      <ProductsLoader />
      <ProductsLoader />
      <ProductsLoader />
      <ProductsLoader />
      <ProductsLoader />
      <ProductsLoader />
      <ProductsLoader />
    </Flex>
  );
};
