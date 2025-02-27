/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { CartBtn } from "@/components/CartBtn";
import { getProductOptionsErrors } from "@/functions";
import { useCart } from "@/store/cart";
import {
  ICartItem,
  IOptionsErrors,
  IPrintProduct,
  SelectedProductOptions,
} from "@/types";
import {
  AspectRatio,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Group,
  Image,
  Text,
  Title,
  Select,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Gallery } from "./Gallery";
import { ProductDescription } from "./ProductDescription";
import { toast } from "react-toastify";
import { Colors } from "@/components/Colors";
import { Sizes } from "@/components/Sizes";
import { AdditionalDetails } from "@/components/AdditionalDetails";
import { Quantity } from "@/components/Quantity";
import { ErrorText } from "@/components/ErrorText";
import { useCheckout, useEditCheckoutItem } from "@/store/checkout";
import { useRouter } from "next/navigation";
import { OtherItems } from "./OtherItems";
import { useAnalytics } from "@/hooks/useAnalytics";
import { featureFlags } from "@/constants/feature-flags";
import { RatingStars } from "../ratings/RatingStars";
import { CopyIcon } from "@/components/CopyIcon";
import { ArtworksDropzone } from "@/components/Dropzone/ArtworksDropzone";
import { TextEditor } from "@/components/TextEditor";
import { useCustomEditor } from "@/hooks/useCustomEditor";
import { convertFilesToBase64 } from "@/functions/convert-files-to-base64";

const defaultValue = {
  productId: "",
  color: undefined,
  image: null,
  size: "",
  quantity: 1,
  note: "",
  selectedProductType: "regular",
  artworkFiles: [],
  instructions: "",
} as SelectedProductOptions;

interface Props {
  product: IPrintProduct;
}
export const ProductDetails = ({ product }: Props) => {
  const router = useRouter();
  const { addItem } = useCart((state) => state);
  const { setItems, details: checkoutDetails } = useCheckout();
  const { isEditingProduct, setIsEditingProduct } = useEditCheckoutItem();
  const { trackProductView, trackAddToCart } = useAnalytics();
  const [errors, setErrors] = useState<IOptionsErrors>({});
  const editor = useCustomEditor("");
  const [selectedProductOptions, setSelectedProductOptions] =
    useLocalStorage<SelectedProductOptions>({
      key: "fmt_dp_selected_product_options",
      defaultValue,
    });

  useEffect(() => {
    // Track product view when component mounts
    trackProductView(product.id, product.title);
  }, [product.id, product.title, trackProductView]);

  useEffect(() => {
    // If we're editing a product, find it in the checkout items and set the options
    if (isEditingProduct) {
      const itemToEdit = checkoutDetails.items.find(
        (item) => item.id === product.id
      );

      if (itemToEdit) {
        // Convert base64 artwork files back to File objects if they exist
        const artworkFiles = itemToEdit.artworkFiles
          ? itemToEdit.artworkFiles.map((file) => {
              // Create a File object from the base64 string
              const byteString = atob(file.url.split(",")[1]);
              const ab = new ArrayBuffer(byteString.length);
              const ia = new Uint8Array(ab);

              for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
              }

              return new File([ab], file.name, { type: file.type });
            })
          : [];

        // Set the selected options from the item
        setSelectedProductOptions({
          productId: product.id,
          image: product.image,

          color: itemToEdit.color,
          size: itemToEdit.size || "",
          quantity: itemToEdit.quantity,
          note: itemToEdit.note || "",
          selectedProductType:
            (itemToEdit.selectedProductType as "regular" | "jersey") ||
            "regular",
          artworkFiles: artworkFiles,
          instructions: itemToEdit.instructions || "",
        });

        // Set the editor content if instructions exist
        if (editor && itemToEdit.instructions) {
          editor.commands.setContent(itemToEdit.instructions);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, isEditingProduct]);

  const handleBuyOrAddItemToCart = async (actionType: "buy" | "cart") => {
    const errors = getProductOptionsErrors(selectedProductOptions, {
      sizes: product.sizes,
      isCustomizable: product.isCustomizable,
    });
    setErrors(errors);

    if (Object.keys(errors).length > 0) {
      // Scroll to the first error if it's about artwork
      if (errors.artworkFiles) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return false;
    }

    const isTshirt = product.type.slug === "t-shirts";
    const adjustedPrice =
      isTshirt && selectedProductOptions.selectedProductType === "jersey"
        ? product.price - 5
        : product.price;

    // Convert files to base64
    const serializedArtworkFiles = await convertFilesToBase64(
      selectedProductOptions.artworkFiles || []
    );

    const item: ICartItem = {
      id: product.id,
      title: product.title,
      price: adjustedPrice,
      productNumber: product.productNumber,
      quantity: selectedProductOptions.quantity,
      image: selectedProductOptions.image || "",
      timestamp: new Date(),
      color: selectedProductOptions.color,
      size: selectedProductOptions.size,
      note: selectedProductOptions.note,
      selectedProductType: isTshirt
        ? selectedProductOptions.selectedProductType
        : product.type.slug || undefined,
      isCustomizable: product.isCustomizable,
      instructions: editor?.getHTML(),
      artworkFiles: serializedArtworkFiles,
    };

    if (actionType === "buy") {
      if (isEditingProduct) {
        const itemIndex = checkoutDetails.items.findIndex(
          (existingItem) => existingItem.id === item.id
        );

        if (itemIndex !== -1) {
          const updatedItems = [...checkoutDetails.items];

          updatedItems[itemIndex] = item;

          setItems(updatedItems);
          router.push("/checkout");
          setIsEditingProduct(false);
          return;
        }

        setItems([item]);
        router.push("/checkout");
        return;
      }
    }

    addItem(item);
    // Track add to cart event
    trackAddToCart(product.id, product.title, product.price);
    toast.success("Item added to cart");
  };

  const isTshirt = product.type.slug === "t-shirts";
  const adjustedPrice =
    isTshirt && selectedProductOptions.selectedProductType === "jersey"
      ? product.price - 5
      : product.price;

  return (
    <Box px="xl" py="lg">
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, lg: 5 }}>
          <Box>
            <AspectRatio
              ratio={1 / 1.2}
              maw={450}
              mx={{ base: "sm", sm: "auto" }}
            >
              <Image
                radius="md"
                src={selectedProductOptions.image}
                alt={product.title}
              />
            </AspectRatio>
            {product.gallery && product.gallery.length > 0 && (
              <Gallery
                images={[product.image, ...product.gallery]}
                setSelectedProductOptions={setSelectedProductOptions}
              />
            )}
          </Box>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, lg: 7 }} px="md" maw={700}>
          <Title order={3}>{product.title}</Title>
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

          {product.isCustomizable && (
            <Box mb="xl">
              <Title order={4} mb="xs">
                Upload Your Artwork
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
                  maxFiles={5}
                  maxSize={10 * 1024 ** 2}
                  dropzoneText="Drag images here or click to select files"
                  description={`Files should not exceed 10MB (${selectedProductOptions.artworkFiles?.length || 0}/5 files)`}
                />

                {selectedProductOptions.artworkFiles?.length === 0 &&
                  errors.artworkFiles && (
                    <Box mt="xs">
                      <ErrorText text={errors.artworkFiles} />
                    </Box>
                  )}
              </Box>
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
              <Divider />
            </>
          )}

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
          <Sizes
            sizes={product.sizes}
            selectedSize={selectedProductOptions.size}
            setSelectedProductOptions={setSelectedProductOptions}
          />
          {!selectedProductOptions.size && errors.size && (
            <ErrorText text={errors.size} />
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

      <ProductDescription
        description={product.description}
        details={product.details}
      />

      <OtherItems
        label="Related Items"
        items={product.relatedProducts.filter((item) => item.id !== product.id)}
      />
      <OtherItems
        label="You may also like"
        items={product.otherProducts.filter((item) => item.id !== product.id)}
      />

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
    </Box>
  );
};
