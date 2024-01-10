"use client";
import { PaginationRenderer } from "@/components/PaginationRenderer";
import { ProductCard } from "@/components/ProductCard";
import { IPrintProduct, IProductType } from "@/types";
import { Box, Flex, Grid, Group, Input } from "@mantine/core";
import { useState } from "react";
import { BsSearch } from "react-icons/bs";
import { ProductTypeCard } from "./ProductTypeCard";
import { SelectedTags } from "./SelectedTags";
import { TagsFilters } from "./TagsFilters";

interface Props {
  productTypes: IProductType[];
  printProducts: IPrintProduct[];
}

const itemsPerPage = 10;

const PrintCategory = ({ productTypes, printProducts }: Props) => {
  const [visibleProducts, setVisibleProducts] = useState(
    printProducts.slice(0, itemsPerPage)
  );

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
          <Grid.Col span={{ base: 4, lg: 3 }} visibleFrom="md">
            <TagsFilters />
          </Grid.Col>
          <Grid.Col span="auto">
            <Input
              placeholder="Type to Search..."
              leftSection={<BsSearch size="14px" />}
              maw={600}
            />
            <SelectedTags />
            <Box>
              <Flex
                wrap="wrap"
                align="center"
                py="lg"
                justify={{ base: "center", md: "flex-start" }}
                gap={{ base: "md", md: 26, xl: 40 }}
              >
                {visibleProducts.map((item) => (
                  <ProductCard
                    key={item.id}
                    title={item.title}
                    image={item.image}
                    price={item.price}
                    link={`/services/print/${item.slug}`}
                  />
                ))}
              </Flex>
              <PaginationRenderer
                itemsLength={printProducts.length}
                itemsPerPage={itemsPerPage}
                onPageChange={(start, end) =>
                  setVisibleProducts(printProducts.slice(start, end))
                }
              />
            </Box>
          </Grid.Col>
        </Grid>
      </Box>
    </div>
  );
};

export default PrintCategory;
