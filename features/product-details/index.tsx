/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { CartBtn } from "@/components/CartBtn";
import { IOptionsErrors, IPrintProduct, SelectedProductOptions } from "@/types";
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Group,
  Text,
  Title,
  Select,
} from "@mantine/core";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import { Gallery } from "./Gallery";
import { ProductDescription } from "./ProductDescription";
import { Colors } from "@/components/Colors";
import { Sizes } from "@/components/Sizes";
import { AdditionalDetails } from "@/components/AdditionalDetails";
import { Quantity } from "@/components/Quantity";
import { ErrorText } from "@/components/ErrorText";
import { OtherItems } from "./OtherItems";
import { useAnalytics } from "@/hooks/useAnalytics";
import { featureFlags } from "@/constants/feature-flags";
import { RatingStars } from "../ratings/RatingStars";
import { CopyIcon } from "@/components/CopyIcon";
import { ArtworksDropzone } from "@/components/Dropzone/ArtworksDropzone";
import { MultipleArtworksDropzone } from "@/components/Dropzone/MultipleArtworksDropzone";
import { TextEditor } from "@/components/TextEditor";
import { useCustomEditor } from "@/hooks/useCustomEditor";
import { useEditProductEffect } from "./useEditProductEffect";
import { useBuyOrAddToCart } from "./useBuyOrAddToCart";
import { getDefaultProductImage, shouldUseMultipleArtworks } from "@/functions";

const defaultValue = {
  productId: "",
  color: undefined,
  image: null,
  size: "",
  quantity: 1,
  note: "",
  selectedProductType: "regular",
  artworkFiles: [],
  artworkFilesMap: {},
  instructions: "",
} as SelectedProductOptions;

interface Props {
  product: IPrintProduct;
}
export const ProductDetails = ({ product }: Props) => {
  const { trackProductView } = useAnalytics();
  const [errors, setErrors] = useState<IOptionsErrors>({});
  const editor = useCustomEditor("");

  // Use useState instead of useLocalStorage to prevent flickering issues
  const [selectedProductOptions, setSelectedProductOptions] =
    useState<SelectedProductOptions>({
      ...defaultValue,
      productId: product.id,
      image: getDefaultProductImage(product),
    });

  // Memoize the default image to prevent unnecessary re-renders
  const defaultImage = useMemo(
    () => getDefaultProductImage(product),
    [product]
  );

  useEffect(() => {
    // Track product view when component mounts
    trackProductView(product.id, product.title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id, product.title]);

  // Reset selected product options when product changes
  useEffect(() => {
    // Only update if the product ID has changed
    if (selectedProductOptions.productId !== product.id) {
      setSelectedProductOptions({
        ...defaultValue,
        productId: product.id,
        image: defaultImage,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id, defaultImage]);

  // Use our custom hook for editing product
  useEditProductEffect(product, setSelectedProductOptions, editor);

  // Use our custom hook for buying or adding to cart
  const { handleBuyOrAddItemToCart } = useBuyOrAddToCart(
    product,
    selectedProductOptions,
    editor,
    setErrors
  );

  const isTshirt = product.type.slug === "t-shirts";
  const adjustedPrice =
    isTshirt && selectedProductOptions.selectedProductType === "jersey"
      ? product.price - 5
      : product.price;

  // Determine if we should use the new multiple artworks dropzone
  const useMultipleArtworks = shouldUseMultipleArtworks(product);

  return (
    <Box px="xl" py="lg">
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, lg: 7 }}>
          <Box>
            <Box
              maw={700}
              mx={{ base: "sm", sm: "auto" }}
              h={{ base: 300, sm: 600 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                position: "relative",
                borderRadius: "var(--mantine-radius-md)",
              }}
            >
              {selectedProductOptions.image && (
                <Image
                  src={selectedProductOptions.image}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 450px"
                  priority
                  style={{
                    objectFit: "contain",
                    borderRadius: "var(--mantine-radius-sm)",
                  }}
                />
              )}
            </Box>
            {product.gallery && product.gallery.length > 0 && (
              <Gallery
                images={[product.image, ...product.gallery]}
                setSelectedProductOptions={setSelectedProductOptions}
              />
            )}
          </Box>
          <Box visibleFrom="sm">
            <ProductDescription
              description={product.description}
              details={product.details}
            />
          </Box>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, lg: 5 }} px="md" maw={700}>
          <Title order={3} visibleFrom="sm">
            {product.title}
          </Title>
          <Title order={4} hiddenFrom="sm">
            {product.title}
          </Title>
          {product.productNumber && product.productNumber != null && (
            <Group>
              <Text>Item no: </Text>
              <Flex align="center">
                <Title order={4} my="md" c="dimmed">
                  #{product.productNumber}
                </Title>
                <CopyIcon value={product.productNumber} />
              </Flex>
            </Group>
          )}

          {featureFlags.productRatings && (
            <Box mb="md">
              <RatingStars productId={product.id} size="sm" />
            </Box>
          )}

          {isTshirt && (
            <>
              <Select
                label="T-Shirt Type"
                value={selectedProductOptions.selectedProductType || "regular"}
                onChange={(value) =>
                  setSelectedProductOptions((prev) => ({
                    ...prev,
                    selectedProductType:
                      (value as "regular" | "jersey") || "regular",
                  }))
                }
                data={[
                  { value: "regular", label: "Regular T-Shirt" },
                  { value: "jersey", label: "Jersey Shirt" },
                ]}
                mb="md"
              />
              <Divider my="sm" />
            </>
          )}

          {!product.disableMainColor && (
            <>
              <Colors
                mainImage={product.image}
                mainColor={product.color}
                colors={product.colors || []}
                selectedColor={selectedProductOptions.color}
                setSelectedProductOptions={setSelectedProductOptions}
              />
              {!selectedProductOptions.color && errors.color && (
                <ErrorText text={errors.color} />
              )}
            </>
          )}

          <Sizes
            sizes={product.sizes}
            selectedSize={selectedProductOptions.size}
            setSelectedProductOptions={setSelectedProductOptions}
          />
          {!selectedProductOptions.size && errors.size && (
            <ErrorText text={errors.size} />
          )}

          {product.isCustomizable && (
            <Box mb="xl">
              {useMultipleArtworks ? (
                <MultipleArtworksDropzone
                  product={{
                    numberOfSides: product.numberOfSides,
                    numberOfArtworks: product.numberOfArtworks,
                    enableArtworkLabels: product.enableArtworkLabels,
                    artworkLabels: product.artworkLabels || [],
                    allowMultipleArtworksForEachSide:
                      product.allowMultipleArtworksForEachSide,
                  }}
                  artworkFilesMap={selectedProductOptions.artworkFilesMap}
                  setSelectedProductOptions={setSelectedProductOptions}
                  errors={{ artworkFiles: errors.artworkFiles }}
                />
              ) : (
                // Legacy single dropzone for backward compatibility
                <Box>
                  <Title order={4} mb="xs">
                    {product.enableArtworkLabels &&
                    product.artworkLabels &&
                    product.artworkLabels.length > 0
                      ? product.artworkLabels[0]
                      : "Upload Your Artwork"}
                  </Title>
                  <Box mb="md">
                    <ArtworksDropzone
                      files={selectedProductOptions.artworkFiles || []}
                      onFilesChange={(files) =>
                        setSelectedProductOptions((prev) => ({
                          ...prev,
                          artworkFiles: files,
                        }))
                      }
                      maxFiles={
                        product.numberOfArtworks != null &&
                        product.numberOfArtworks > 0
                          ? product.numberOfArtworks
                          : 5
                      }
                      maxSize={10 * 1024 ** 2}
                      dropzoneText={`Drag ${
                        product.numberOfArtworks != null &&
                        product.numberOfArtworks > 1
                          ? "images"
                          : "image"
                      } here or click to select ${
                        product.numberOfArtworks != null &&
                        product.numberOfArtworks > 1
                          ? "files"
                          : "file"
                      }`}
                      description={`Files should not exceed 10MB (${
                        selectedProductOptions.artworkFiles?.length || 0
                      }/${
                        product.numberOfArtworks != null &&
                        product.numberOfArtworks > 0
                          ? product.numberOfArtworks
                          : 5
                      } ${
                        product.numberOfArtworks != null &&
                        product.numberOfArtworks > 1
                          ? "files"
                          : "file"
                      })`}
                    />

                    {selectedProductOptions.artworkFiles?.length === 0 &&
                      errors.artworkFiles && (
                        <Box mt="xs">
                          <ErrorText text={errors.artworkFiles} />
                        </Box>
                      )}
                  </Box>
                </Box>
              )}
              <Box>
                <Text fw="bold" mb="xs">
                  Instructions
                </Text>
                <Text size="sm" c="dimmed" mb="md">
                  Add any specific instructions for your artwork. NB:
                  Instructions that demand extra work may be subject to
                  additional charges.
                </Text>
                <TextEditor editor={editor} />
              </Box>
            </Box>
          )}

          <Divider label="Quantity" labelPosition="left" mt="md" maw={700} />
          <Flex my="sm" justify="space-between" maw={700}>
            <Box>
              <Quantity
                quantity={selectedProductOptions.quantity}
                setSelectedProductOptions={setSelectedProductOptions}
              />
              {!selectedProductOptions.quantity && errors.quantity && (
                <ErrorText text={errors.quantity} />
              )}
            </Box>
            <Box>
              {selectedProductOptions.quantity > 1 && (
                <Text size="xs" ta="right">
                  {adjustedPrice} x {selectedProductOptions.quantity} =
                </Text>
              )}
              <Group align="flex-start" gap={1}>
                <Text pt="5px">GHS</Text>
                <Title>{adjustedPrice * selectedProductOptions.quantity}</Title>
              </Group>
            </Box>
          </Flex>
          <Divider mb="md" maw={700} />

          <AdditionalDetails
            note={selectedProductOptions.note}
            setSelectedProductOptions={setSelectedProductOptions}
          />

          <Group my="xl">
            <CartBtn
              handler={() => handleBuyOrAddItemToCart("cart")}
              productId={product.id}
              miw={{ base: "100%", xs: 150 }}
            />
            <Button
              onClick={() => handleBuyOrAddItemToCart("buy")}
              size="md"
              miw={{ base: "100%", xs: 150 }}
              className="btn"
            >
              Checkout
            </Button>
          </Group>
          <Text>
            Click{" "}
            <Link href={`/custom-request/${product.type.slug}`}>
              <Text component="span" c="pink">
                here
              </Text>
            </Link>{" "}
            to make custom {product.type.title} print request.
          </Text>
        </Grid.Col>
      </Grid>
      <Box hiddenFrom="sm">
        <ProductDescription
          description={product.description}
          details={product.details}
        />
      </Box>

      {product.relatedProducts &&
        product.relatedProducts.filter((item) => item.id !== product.id)
          .length > 0 && (
          <OtherItems
            label="Related Items"
            items={product.relatedProducts.filter(
              (item) => item.id !== product.id
            )}
          />
        )}

      {product.otherProducts &&
        product.otherProducts.filter((item) => item.id !== product.id).length >
          0 && (
          <OtherItems
            label="You may also like"
            items={product.otherProducts.filter(
              (item) => item.id !== product.id
            )}
          />
        )}
      {product.tags && product.tags.length > 0 && (
        <Box m="xl">
          <Text fw="bold" my="sm">
            Related search terms
          </Text>
          <Group>
            {product.tags.map((tag, i) => (
              <Badge key={tag + i} variant="outline" color="gray">
                {tag}
              </Badge>
            ))}
          </Group>
        </Box>
      )}
    </Box>
  );
};
