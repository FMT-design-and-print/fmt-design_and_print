"use client";
import { ProductTypeCard } from "@/components/ProductTypeCard";
import { useProductTypes } from "@/hooks/useProductTypes";
import {
  Center,
  Divider,
  Flex,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { LoadingTypes } from "./LoadingTypes";
import { HiSearch } from "react-icons/hi";
import { IProductType } from "@/types";
import { useEffect, useState } from "react";
import { useUrlSearchParams } from "@/hooks/useUpdateURLSearchParams";
import { useSearchParams } from "next/navigation";
import { SearchParamsProvider } from "@/components/SearchParamsProvider";

// Separate component that uses useSearchParams
const CustomRequestItemsContent = () => {
  const { productTypes, isLoading } = useProductTypes();
  const searchParams = useSearchParams();
  const searchText = searchParams.get("search");
  const [searchTerm, setSearchTerm] = useState(searchText || "");
  const updateSearchParams = useUrlSearchParams();
  const [searchedProductTypes, setSearchedProductTypes] = useState<
    IProductType[]
  >([]);

  const items =
    searchedProductTypes.length > 0 ? searchedProductTypes : productTypes;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchTerm) {
        updateSearchParams({ search: searchTerm });
      } else {
        updateSearchParams({ search: undefined });
      }
    }, 1000);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  useEffect(() => {
    if (searchText && productTypes) {
      setSearchedProductTypes(
        productTypes.filter((item) =>
          item.title.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    } else {
      setSearchedProductTypes(productTypes || []);
    }
  }, [searchText, productTypes]);

  return (
    <>
      <Center bg="gray.3" h={200}>
        <Stack>
          <Title c="gray.7" ta="center">
            Custom Request
          </Title>
          <Text c="dimmed" ta="center">
            Make a custom order request and receive a quote
          </Text>
        </Stack>
      </Center>

      <Flex
        justify="space-between"
        align="center"
        direction={{ base: "column", sm: "row" }}
      >
        <Title order={3} mb="lg" c="dimmed" mt="lg">
          Choose a product type
        </Title>

        <TextInput
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          leftSection={<HiSearch />}
          rightSectionWidth={"90px"}
          placeholder="search..."
        />
      </Flex>
      <Divider my="sm" />

      {isLoading ? (
        <LoadingTypes />
      ) : items ? (
        <Group>
          {items
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((item) => (
              <ProductTypeCard
                key={item.id}
                label={item.title}
                link={`/custom-request/${item.slug}`}
                image={item.image}
              />
            ))}
        </Group>
      ) : (
        <>No Products were found. Reload!</>
      )}

      <Divider my="xl" />
      <Group justify="flex-end">
        <Text>Can&apos;t find your product? </Text>
        <Text component={Link} href="/custom-request/custom-product" c="pink">
          Click here
        </Text>
      </Group>
    </>
  );
};

// Wrapper component with Suspense boundary
export const CustomRequestItems = () => {
  return (
    <SearchParamsProvider>
      <CustomRequestItemsContent />
    </SearchParamsProvider>
  );
};
