"use client";
import { IPrintProduct } from "@/types";
import { Box, Grid } from "@mantine/core";
import { PrintProducts } from "./PrintProducts";
import { TagsFilters } from "./TagsFilters";

interface Props {
  products: IPrintProduct[];
}

export const ProductType = ({ products }: Props) => {
  return (
    <Box px="xl">
      <Grid>
        <Grid.Col span={{ base: 4, lg: 3 }} visibleFrom="md">
          <TagsFilters />
        </Grid.Col>
        <Grid.Col span="auto">
          <PrintProducts printProducts={products} />
        </Grid.Col>
      </Grid>
    </Box>
  );
};
