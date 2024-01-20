"use client";
import { NoItemsFound } from "@/components/NoItemsFound";
import { PaginationRenderer } from "@/components/PaginationRenderer";
import { ProductCard } from "@/components/ProductCard";
import { filteredPrintProducts } from "@/functions/filter";
import { useTagsFilters } from "@/store/filters";
import { IPrintProduct } from "@/types";
import { Box, Flex, Input } from "@mantine/core";
import { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { SelectedTags } from "./SelectedTags";
import { FiltersDrawer } from "./TagsFilters/FiltersDrawer";
import { ProductLoaders } from "./ProductLoaders";

const itemsPerPage = 20;

interface Props {
  printProducts: IPrintProduct[];
}
export const PrintProducts = ({ printProducts }: Props) => {
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
    <>
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
          {(searchTerm || tags.length > 0) && filteredProducts.length === 0 ? (
            <NoItemsFound label="Sorry!. No items were found for your search" />
          ) : (
            filteredProducts.length === 0 && <ProductLoaders />
          )}
          {visibleProducts.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              link={`/services/print/${item.id}`}
            />
          ))}
        </Flex>

        {filteredProducts.length !== 0 &&
          filteredProducts.length > itemsPerPage &&
          visibleProducts.length !== 0 && (
            <PaginationRenderer
              itemsLength={filteredProducts.length}
              itemsPerPage={itemsPerPage}
              onPageChange={(start, end) =>
                setVisibleProducts(filteredProducts.slice(start, end))
              }
            />
          )}
      </Box>
    </>
  );
};
