"use client";

import { useState, useEffect } from "react";
import {
  Paper,
  Title,
  Stack,
  Group,
  Button,
  Select,
  Text,
  MultiSelect,
  NumberInput,
  TextInput,
  Progress,
  Loader,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { client, writableClient } from "@/sanity/lib/client";
import { IconPercentage, IconSearch } from "@tabler/icons-react";
import debounce from "lodash/debounce";
import { usePriceUpdate } from "../../hooks/usePriceUpdate";

type PriceUpdateType = "fixed" | "percentage";
type UpdateScope = "category" | "selected";

interface Product {
  id: string;
  title: string;
  price: number;
  productNumber?: string;
  category: {
    id: string;
    title: string;
  };
}

interface ProductType {
  id: string;
  title: string;
  productCount: number;
}

interface Category {
  id: string;
  title: string;
  productCount: number;
  productTypes: ProductType[];
}

export function ProductPriceManager() {
  const [updateType, setUpdateType] = useState<PriceUpdateType>("fixed");
  const [updateScope, setUpdateScope] = useState<UpdateScope>("category");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProductType, setSelectedProductType] = useState<string | null>(
    null
  );
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [priceValue, setPriceValue] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const { updatePrices, progress, isUpdating } = usePriceUpdate() || {
    updatePrices: undefined,
    progress: { totalProducts: 0, processedProducts: 0, percentage: 0 },
    isUpdating: false,
  };

  const handleNumberInputChange = (value: string | number | undefined) => {
    if (typeof value === "undefined") {
      setPriceValue(0);
    } else if (typeof value === "string") {
      setPriceValue(parseFloat(value) || 0);
    } else {
      setPriceValue(value);
    }
  };

  // Fetch categories with product types and counts
  const { data: categories } = useQuery({
    queryKey: ["categories-with-types"],
    queryFn: async () => {
      const query = `*[_type == "printCategories"] {
        "id": _id,
        title,
        "productCount": count(*[_type == "printService" && references(^._id)]),
        "productTypes": *[_type == "productTypes" && references(^._id)] {
          "id": _id,
          title,
          "productCount": count(*[_type == "printService" && references(^._id)])
        }
      }`;
      const results = await client.fetch(query);
      return results.filter((cat: Category) => cat.productCount > 0);
    },
  });

  // Get product types for selected category
  const productTypes = selectedCategory
    ? categories
        ?.find((cat: Category) => cat.id === selectedCategory)
        ?.productTypes.filter((type: ProductType) => type.productCount > 0) ||
      []
    : [];

  // Reset product type when category changes
  useEffect(() => {
    setSelectedProductType(null);
  }, [selectedCategory]);

  // Search products
  const { data: searchResults, isLoading: isSearching } = useQuery<Product[]>({
    queryKey: ["product-search", searchQuery],
    enabled: updateScope === "selected" && searchQuery.length >= 2,
    queryFn: async () => {
      const query = `*[_type == "printService" && (
        title match $searchQuery + "*" ||
        number match $searchQuery + "*" ||
        string(price) match $searchQuery + "*"
      )] {
        "id": _id,
        title,
        "productNumber": number,
        price,
        category->{
          "id": _id,
          title
        }
      }[0...10]`;
      return client.fetch(query, { searchQuery });
    },
  });

  // Fetch selected products for preview
  const { data: selectedProductsData } = useQuery<Product[]>({
    queryKey: ["selected-products", selectedProducts],
    enabled: selectedProducts.length > 0,
    queryFn: async () => {
      const query = `*[_type == "printService" && _id in $ids] {
        "id": _id,
        title,
        "productNumber": number,
        price,
        category->{
          "id": _id,
          title
        }
      }`;
      return client.fetch(query, { ids: selectedProducts });
    },
  });

  const handlePriceUpdate = async () => {
    let productsToUpdate: string[] = [];
    let categoryName: string | undefined;
    let productTypeName: string | undefined;

    if (updateScope === "category" && selectedCategory && selectedProductType) {
      const query = `*[_type == "printService" && references("${selectedCategory}") && references("${selectedProductType}")]{
        "id": _id,
        title,
        price,
        category->{
          title
        },
        type->{
          title
        }
      }`;
      const products = await client.fetch(query);
      productsToUpdate = products.map((p: { id: string }) => p.id);
      categoryName = products[0]?.category?.title;
      productTypeName = products[0]?.type?.title;
    } else if (updateScope === "selected") {
      productsToUpdate = selectedProducts;
    }

    updatePrices({
      products: productsToUpdate,
      updateType,
      priceValue,
      categoryName,
      productTypeName,
      client: writableClient,
    });
  };

  // Debounced search handler
  const debouncedSearch = debounce((value: string) => {
    setSearchQuery(value);
  }, 300);

  return (
    <Paper p="xl" radius="md">
      <Stack gap="xl">
        <Title order={2}>Product Price Manager</Title>

        <Stack>
          <Select
            label="Update Type"
            value={updateType}
            onChange={(value) => setUpdateType(value as PriceUpdateType)}
            data={[
              { value: "fixed", label: "Fixed Amount" },
              { value: "percentage", label: "Percentage" },
            ]}
          />

          <Select
            label="Update Scope"
            value={updateScope}
            onChange={(value) => {
              setUpdateScope(value as UpdateScope);
              setSelectedProducts([]);
              setSearchQuery("");
              setSelectedCategory(null);
              setSelectedProductType(null);
            }}
            data={[
              { value: "category", label: "By Category" },
              { value: "selected", label: "Selected Products" },
            ]}
          />

          {updateScope === "category" ? (
            <>
              <Select
                label="Select Category"
                placeholder="Choose a category"
                value={selectedCategory}
                onChange={setSelectedCategory}
                data={
                  categories?.map((cat: Category) => ({
                    value: cat.id,
                    label: `${cat.title} (${cat.productCount} products)`,
                  })) || []
                }
              />

              {selectedCategory && (
                <Select
                  label="Select Product Type"
                  placeholder="Choose a product type"
                  value={selectedProductType}
                  onChange={setSelectedProductType}
                  data={productTypes.map((type: ProductType) => ({
                    value: type.id,
                    label: `${type.title} (${type.productCount} products)`,
                  }))}
                />
              )}
            </>
          ) : (
            <>
              <TextInput
                label="Search Products"
                placeholder="Search by title, product number, or price..."
                rightSection={
                  isSearching ? <Loader size="xs" /> : <IconSearch size={16} />
                }
                onChange={(e) => debouncedSearch(e.currentTarget.value)}
              />
              {searchResults && searchResults.length > 0 && (
                <MultiSelect
                  label="Select Products"
                  placeholder="Choose products from search results"
                  value={selectedProducts}
                  onChange={setSelectedProducts}
                  data={searchResults.map((product) => ({
                    value: product.id,
                    label: `${product.title} ${
                      product.productNumber ? `(${product.productNumber})` : ""
                    } - GH₵${product.price}`,
                  }))}
                />
              )}
            </>
          )}

          <Group align="flex-end">
            {updateType === "fixed" ? (
              <NumberInput
                label="New Price"
                value={priceValue}
                onChange={handleNumberInputChange}
                min={0}
                decimalScale={2}
                prefix="GH₵"
                w={200}
              />
            ) : (
              <NumberInput
                label="Percentage Change"
                value={priceValue}
                onChange={handleNumberInputChange}
                min={-100}
                max={1000}
                rightSection={<IconPercentage size={16} />}
                w={200}
              />
            )}
          </Group>
        </Stack>

        {isUpdating && (
          <Stack gap="xs">
            <Text size="sm" fw={500}>
              Updating {progress.processedProducts} of {progress.totalProducts}{" "}
              products
            </Text>
            <Progress
              value={progress.percentage}
              size="xl"
              radius="xl"
              striped
              animated
            >
              {`${progress.percentage}%`}
            </Progress>
          </Stack>
        )}

        {/* Preview Section - Only for selected products */}
        {updateScope === "selected" &&
          selectedProductsData &&
          selectedProductsData.length > 0 && (
            <Stack>
              <Title order={4}>Selected Products</Title>
              {selectedProductsData.map((product) => (
                <Group key={product.id} justify="space-between">
                  <Text>
                    {product.title}{" "}
                    {product.productNumber && (
                      <Text span c="dimmed">
                        ({product.productNumber})
                      </Text>
                    )}
                  </Text>
                  <Text fw={500}>GH₵{product.price}</Text>
                </Group>
              ))}
            </Stack>
          )}

        <Group justify="flex-end">
          <Button
            onClick={handlePriceUpdate}
            disabled={
              isUpdating ||
              (updateScope === "category" &&
                (!selectedCategory || !selectedProductType)) ||
              (updateScope === "selected" && selectedProducts.length === 0)
            }
            loading={isUpdating}
          >
            Update Prices
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}
