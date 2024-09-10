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
import { DesktopFiltersBtn } from "./TagsFilters/DesktopFiltersBtn";
import classes from "./Style.module.css";

const itemsPerPage = 50;

interface Props {
  printProducts: IPrintProduct[];
}
export const PrintProducts = ({ printProducts }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<IPrintProduct[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<IPrintProduct[]>([]);
  const { tags } = useTagsFilters();

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
        <DesktopFiltersBtn />
        <Input
          placeholder="Type to Search..."
          leftSection={<BsSearch size="14px" />}
          style={{ flex: 1 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
        />
        <FiltersDrawer />
      </Flex>
      <SelectedTags />
      <Box>
        {(searchTerm || tags.length > 0) && filteredProducts.length === 0 ? (
          <NoItemsFound label="Sorry!. No items were found for your search" />
        ) : (
          filteredProducts.length === 0 && <ProductLoaders />
        )}

        <div className={classes["items-grid"]}>
          {visibleProducts.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              link={`/services/print/${item.id}`}
            />
          ))}
        </div>

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
