"use client";
import { IPrintProduct, IProductType } from "@/types";
import { Box, Grid, Group } from "@mantine/core";
import { PrintProducts } from "./PrintProducts";
import { ProductTypeCard } from "../../components/ProductTypeCard";
import { DesktopFilters } from "./TagsFilters/DesktopFilters";
import { useTagsFilters } from "@/store/filters";
import React from "react";

interface Props {
  productTypes: IProductType[];
  printProducts: IPrintProduct[];
}

const PrintCategory = ({ productTypes = [], printProducts = [] }: Props) => {
  const { isExpanded } = useTagsFilters();

  // Extract unique tags from products
  const availableTags = React.useMemo(() => {
    const tagSet = new Set<string>();
    if (Array.isArray(printProducts)) {
      printProducts.forEach((product) => {
        if (product?.tags && Array.isArray(product.tags)) {
          product.tags.forEach((tag) => {
            if (tag) {
              tagSet.add(tag);
            }
          });
        }
      });
    }
    const tags = Array.from(tagSet);
    return tags;
  }, [printProducts]);

  return (
    <div>
      <Group px="xl" gap="sm" my="lg">
        {productTypes.map((item) => (
          <ProductTypeCard
            key={item.id}
            label={item.title}
            link={`/services/print/categories/${item.category.slug}/${item.slug}`}
            image={item.image}
          />
        ))}
      </Group>

      <Box px="xl">
        <Grid>
          {isExpanded && (
            <Grid.Col span={{ base: 4, lg: 3 }} visibleFrom="md">
              <DesktopFilters availableTags={availableTags} />
            </Grid.Col>
          )}
          <Grid.Col span="auto">
            <PrintProducts
              printProducts={printProducts}
              availableTags={availableTags}
            />
          </Grid.Col>
        </Grid>
      </Box>
    </div>
  );
};

export default PrintCategory;
