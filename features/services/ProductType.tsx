"use client";
import { useTagsFilters } from "@/store/filters";
import { IPrintProduct } from "@/types";
import { Box, Grid } from "@mantine/core";
import { PrintProducts } from "./PrintProducts";
import { DesktopFilters } from "./TagsFilters/DesktopFilters";
import React from "react";

interface Props {
  products: IPrintProduct[];
}

export const ProductType = ({ products = [] }: Props) => {
  const { isExpanded } = useTagsFilters();

  // Extract unique tags from products
  const availableTags = React.useMemo(() => {
    const tagSet = new Set<string>();
    if (Array.isArray(products)) {
      products.forEach((product) => {
        if (product?.tags && Array.isArray(product.tags)) {
          product.tags.forEach((tag) => {
            if (tag) {
              tagSet.add(tag);
            }
          });
        }
      });
    }
    return Array.from(tagSet);
  }, [products]);

  return (
    <Box px="xl">
      <Grid>
        {isExpanded && (
          <Grid.Col span={{ base: 4, lg: 3 }} visibleFrom="md">
            <DesktopFilters availableTags={availableTags} />
          </Grid.Col>
        )}
        <Grid.Col span="auto">
          <PrintProducts
            printProducts={products}
            availableTags={availableTags}
          />
        </Grid.Col>
      </Grid>
    </Box>
  );
};
