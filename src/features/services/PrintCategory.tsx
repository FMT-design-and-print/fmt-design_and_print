"use client";
import { PaginationRenderer } from "@/components/PaginationRenderer";
import { ProductCard } from "@/components/ProductCard";
import { filteredPrintProducts } from "@/functions/filter";
import { useTagsFilters } from "@/store/filters";
import { IPrintProduct, IProductType } from "@/types";
import { Box, Flex, Grid, Group, Input } from "@mantine/core";
import { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { ProductTypeCard } from "./ProductTypeCard";
import { SelectedTags } from "./SelectedTags";
import { TagsFilters } from "./TagsFilters";
import { FiltersDrawer } from "./TagsFilters/FiltersDrawer";
import { NoItemsFound } from "@/components/NoItemsFound";

interface Props {
  productTypes: IProductType[];
  printProducts: IPrintProduct[];
}

const itemsPerPage = 10;

const PrintCategory = ({ productTypes, printProducts }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<IPrintProduct[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<IPrintProduct[]>([]);
  const tags = useTagsFilters((state) => state.tags);

  useEffect(() => {
    // Adding debounce behavior to search
    const timeout = setTimeout(() => {
      setFilteredProducts(
        filteredPrintProducts(printProducts, tags, searchTerm)
      );
    }, 1000);

    return () => clearTimeout(timeout);
  }, [searchTerm, printProducts, tags]);

  useEffect(() => {
    setVisibleProducts(filteredProducts.slice(0, itemsPerPage));
  }, [filteredProducts]);

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
            <Flex
              gap={8}
              align="center"
              justify={{ base: "center", sm: "flex-start" }}
              wrap="nowrap"
            >
              <Input
                placeholder="Type to Search..."
                leftSection={<BsSearch size="14px" />}
                maw={600}
                miw={{ base: "fit-content", sm: "80%", lg: 600 }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.currentTarget.value)}
              />
              <FiltersDrawer />
            </Flex>
            <SelectedTags />
            <Box>
              <Flex
                wrap="wrap"
                align="center"
                py="lg"
                justify={{ base: "center", md: "flex-start" }}
                gap={{ base: "md", md: 26, xl: 40 }}
              >
                {filteredProducts.length === 0 && (
                  <NoItemsFound label="Sorry!. No items were found for your search" />
                )}
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

              {filteredProducts.length !== 0 &&
                filteredProducts.length > itemsPerPage && (
                  <PaginationRenderer
                    itemsLength={filteredProducts.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={(start, end) =>
                      setVisibleProducts(filteredProducts.slice(start, end))
                    }
                  />
                )}
            </Box>
          </Grid.Col>
        </Grid>
      </Box>
    </div>
  );
};

export default PrintCategory;
