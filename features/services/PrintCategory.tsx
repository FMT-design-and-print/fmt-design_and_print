"use client";
import { IPrintProduct, IProductType } from "@/types";
import { Box, Grid, Group } from "@mantine/core";
import { PrintProducts } from "./PrintProducts";
import { ProductTypeCard } from "../../components/ProductTypeCard";
import { DesktopFilters } from "./TagsFilters/DesktopFilters";
import { useTagsFilters } from "@/store/filters";

interface Props {
  productTypes: IProductType[];
  printProducts: IPrintProduct[];
}

const PrintCategory = ({ productTypes, printProducts }: Props) => {
  const { isExpanded } = useTagsFilters();

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
              <DesktopFilters />
            </Grid.Col>
          )}
          <Grid.Col span="auto">
            <PrintProducts printProducts={printProducts} />
          </Grid.Col>
        </Grid>
      </Box>
    </div>
  );
};

export default PrintCategory;
