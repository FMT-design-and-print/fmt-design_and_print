"use client";
import { useTagsFilters } from "@/store/filters";
import { IPrintProduct } from "@/types";
import { Box, Grid } from "@mantine/core";
import { PrintProducts } from "./PrintProducts";
import { DesktopFilters } from "./TagsFilters/DesktopFilters";

interface Props {
  products: IPrintProduct[];
}

export const ProductType = ({ products }: Props) => {
  const { isExpanded } = useTagsFilters();
  return (
    <Box px="xl">
      <Grid>
        {isExpanded && (
          <Grid.Col span={{ base: 4, lg: 3 }} visibleFrom="md">
            <DesktopFilters />
          </Grid.Col>
        )}
        <Grid.Col span="auto">
          <PrintProducts printProducts={products} />
        </Grid.Col>
      </Grid>
    </Box>
  );
};
