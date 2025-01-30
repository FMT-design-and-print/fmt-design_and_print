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
  Loader,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useQuery, useMutation } from "@tanstack/react-query";
import { client, writableClient } from "@/sanity/lib/client";
import { IconPercentage, IconSearch } from "@tabler/icons-react";
import debounce from "lodash/debounce";

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

interface UpdateSummary {
  totalProducts: number;
  oldPrices: { [key: string]: number };
  newPrices: { [key: string]: number };
  updateType: PriceUpdateType;
  categoryName?: string;
  productTypeName?: string;
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

  // Update prices mutation
  const updatePricesMutation = useMutation({
    mutationFn: async () => {
      let productsToUpdate: string[] = [];
      const updateSummary: UpdateSummary = {
        totalProducts: 0,
        oldPrices: {},
        newPrices: {},
        updateType,
      };

      if (
        updateScope === "category" &&
        selectedCategory &&
        selectedProductType
      ) {
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
        updateSummary.categoryName = products[0]?.category?.title;
        updateSummary.productTypeName = products[0]?.type?.title;
      } else if (updateScope === "selected") {
        productsToUpdate = selectedProducts;
      }

      if (productsToUpdate.length === 0) {
        throw new Error("No products selected for update");
      }

      updateSummary.totalProducts = productsToUpdate.length;

      // For percentage updates, we need to fetch current prices first
      if (updateType === "percentage") {
        const currentPrices = await Promise.all(
          productsToUpdate.map(async (id) => {
            const doc = await writableClient.getDocument(id);
            if (!doc) {
              throw new Error(`Product with ID ${id} not found`);
            }
            updateSummary.oldPrices[doc.title] = doc.price || 0;
            const newPrice = (doc.price || 0) * (1 + priceValue / 100);
            updateSummary.newPrices[doc.title] =
              Math.round(newPrice * 100) / 100;
            return {
              id,
              currentPrice: doc.price || 0,
            };
          })
        );

        // Update each product with calculated price
        await Promise.all(
          currentPrices.map(({ id, currentPrice }) => {
            const newPrice = currentPrice * (1 + priceValue / 100);
            return writableClient
              .patch(id)
              .set({ price: Math.round(newPrice * 100) / 100 })
              .commit();
          })
        );
      } else {
        // For fixed price updates
        await Promise.all(
          productsToUpdate.map(async (id) => {
            const doc = await writableClient.getDocument(id);
            if (!doc) {
              throw new Error(`Product with ID ${id} not found`);
            }
            updateSummary.oldPrices[doc.title] = doc.price || 0;
            updateSummary.newPrices[doc.title] = priceValue;
            return writableClient.patch(id).set({ price: priceValue }).commit();
          })
        );
      }

      return updateSummary;
    },
    onSuccess: (summary) => {
      const sampleProducts = Object.keys(summary.oldPrices).slice(0, 3);
      const hasMoreProducts = Object.keys(summary.oldPrices).length > 3;

      const priceChangeExamples = sampleProducts
        .map((title) => {
          const oldPrice = summary.oldPrices[title];
          const newPrice = summary.newPrices[title];
          return `${title}: GH₵${oldPrice} → GH₵${newPrice}`;
        })
        .join("\n");

      notifications.show({
        title: "Prices Updated Successfully",
        message: (
          <>
            <Text>
              Updated {summary.totalProducts} products{" "}
              {summary.categoryName
                ? `in ${summary.categoryName} (${summary.productTypeName})`
                : ""}{" "}
              with{" "}
              {summary.updateType === "fixed"
                ? `fixed price of GH₵${priceValue}`
                : `${priceValue}% change`}
            </Text>
            <Text size="sm" mt="xs">
              Sample changes:
            </Text>
            <Text size="sm" component="pre" mt={5}>
              {priceChangeExamples}
              {hasMoreProducts && "\n...and more"}
            </Text>
          </>
        ),
        color: "green",
        autoClose: 8000,
      });
    },
    onError: (error) => {
      console.error("Error updating prices:", error);
      notifications.show({
        title: "Error",
        message: "Failed to update prices",
        color: "red",
      });
    },
  });

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

            <Button
              onClick={() => updatePricesMutation.mutate()}
              loading={updatePricesMutation.isPending}
              disabled={
                priceValue === 0 ||
                (updateScope === "category" &&
                  (!selectedCategory || !selectedProductType)) ||
                (updateScope === "selected" && selectedProducts.length === 0)
              }
              className="btn"
            >
              Update Prices
            </Button>
          </Group>
        </Stack>

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
      </Stack>
    </Paper>
  );
}
