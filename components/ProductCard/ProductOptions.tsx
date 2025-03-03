import { useDisclosure } from "@mantine/hooks";
import { FileWithPath } from "@mantine/dropzone";
import {
  AspectRatio,
  Box,
  Button,
  Divider,
  Drawer,
  Flex,
  Grid,
  Group,
  Image,
  Text,
  Title,
  Select,
} from "@mantine/core";
import { CartBtn } from "../CartBtn";
import { Colors } from "../Colors";
import { Sizes } from "../Sizes";
import { Quantity } from "../Quantity";
import { ErrorText } from "../ErrorText";
import { useEffect, useState } from "react";
import {
  ICartItem,
  IOptionsErrors,
  IPrintProduct,
  SelectedProductOptions,
} from "@/types";
import { AdditionalDetails } from "../AdditionalDetails";
import { Gallery } from "@/features/product-details/Gallery";
import { BsCartPlus } from "react-icons/bs";
import { getProductOptionsErrors } from "@/functions";
import { useCart } from "@/store/cart";
import { toast } from "react-toastify";
import { useCheckout } from "@/store/checkout";
import { useRouter } from "next/navigation";
import { featureFlags } from "@/constants/feature-flags";
import { RatingStars } from "@/features/ratings/RatingStars";
import { useCustomEditor } from "@/hooks/useCustomEditor";
import { ArtworksDropzone } from "../Dropzone/ArtworksDropzone";
import { MultipleArtworksDropzone } from "../Dropzone/MultipleArtworksDropzone";
import { TextEditor } from "../TextEditor";
import { storeArtworkFiles, storeArtworkFilesMap } from "@/utils/storage";
import { SerializedFile } from "@/utils/storage";

const convertToSerializedFile = async (
  file: FileWithPath
): Promise<SerializedFile> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64Response = reader.result as string;
      const mimeType = base64Response.split(";")[0].split(":")[1];

      // Get the size from the base64 string if file.size is not available
      const size = file.size || Math.ceil((base64Response.length * 3) / 4);

      resolve({
        ...file,
        type: mimeType,
        url: base64Response,
        size: size,
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const defaultValue = {
  productId: "",
  color: undefined,
  image: "",
  size: "",
  quantity: 1,
  note: "",
  selectedProductType: "regular" as const,
  artworkFiles: [],
  artworkFilesMap: {},
  instructions: "",
};

interface Props {
  product: IPrintProduct;
  actionType: "buy" | "cart";
}
export const ProductOptions = ({ product, actionType }: Props) => {
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedProductOptions, setSelectedProductOptions] =
    useState<SelectedProductOptions>(defaultValue);
  const [errors, setErrors] = useState<IOptionsErrors>({});
  const addItem = useCart((state) => state.addItem);
  const { setItems } = useCheckout();
  const editor = useCustomEditor("");

  const isTshirt = product.type?.slug === "t-shirts";
  const adjustedPrice =
    isTshirt && selectedProductOptions.selectedProductType === "jersey"
      ? product.price - 5
      : product.price;

  // Determine if we should use the new multiple artworks dropzone
  const shouldUseMultipleArtworks =
    product.isCustomizable &&
    // Only use multiple artworks if:
    // 1. We have more than one side OR
    // 2. We have a specific number of artworks (not -1) that is greater than 1 OR
    // 3. We allow multiple artworks for each side
    ((product.numberOfSides && product.numberOfSides > 1) ||
      (product.numberOfArtworks != null &&
        product.numberOfArtworks > 1 &&
        product.numberOfArtworks !== -1) ||
      (product.allowMultipleArtworksForEachSide &&
        product.numberOfSides &&
        product.numberOfSides > 1));

  const handleConfirm = async () => {
    const errors = getProductOptionsErrors(selectedProductOptions, {
      sizes: product.sizes,
      isCustomizable: product.isCustomizable,
      disableMainColor: product.disableMainColor,
      numberOfSides: product.numberOfSides,
      numberOfArtworks: product.numberOfArtworks,
      enableArtworkLabels: product.enableArtworkLabels,
      artworkLabels: product.artworkLabels,
      allowMultipleArtworksForEachSide:
        product.allowMultipleArtworksForEachSide,
    });
    setErrors(errors);

    if (Object.keys(errors).length > 0) {
      return false;
    }

    try {
      let serializedFiles: SerializedFile[] | undefined;
      let serializedMap: Record<string, SerializedFile[]> | undefined;

      if (
        selectedProductOptions.artworkFilesMap &&
        Object.keys(selectedProductOptions.artworkFilesMap).length > 0
      ) {
        try {
          serializedMap = {};
          for (const [key, files] of Object.entries(
            selectedProductOptions.artworkFilesMap
          )) {
            serializedMap[key] = await Promise.all(
              files.map(convertToSerializedFile)
            );
          }
          await storeArtworkFilesMap(product.id, serializedMap, true);
        } catch (error) {
          console.error("Debug - Error in map serialization:", error);
          if (error instanceof Error && error.name === "QuotaExceededError") {
            toast.error(
              "Storage quota exceeded. Please remove some items from your cart first."
            );
            return;
          }
          console.error("Failed to store artwork files map:", error);
        }
      } else if (
        selectedProductOptions.artworkFiles &&
        selectedProductOptions.artworkFiles.length > 0
      ) {
        try {
          serializedFiles = await Promise.all(
            selectedProductOptions.artworkFiles.map(convertToSerializedFile)
          );
          await storeArtworkFiles(product.id, serializedFiles, true);
        } catch (error) {
          if (error instanceof Error && error.name === "QuotaExceededError") {
            toast.error(
              "Storage quota exceeded. Please remove some items from your cart first."
            );
            return;
          }
          console.error("Failed to store artwork files:", error);
        }
      }

      const item: ICartItem = {
        id: product.id,
        title: product.title,
        price: adjustedPrice,
        quantity: selectedProductOptions.quantity,
        image: selectedProductOptions.image || "",
        timestamp: new Date(),
        color: selectedProductOptions.color,
        size: selectedProductOptions.size,
        note: selectedProductOptions.note,
        selectedProductType: isTshirt
          ? selectedProductOptions.selectedProductType
          : undefined,
        isCustomizable: product.isCustomizable,
        hasArtworkFiles: serializedFiles && serializedFiles.length > 0,
        hasArtworkFilesMap:
          serializedMap && Object.keys(serializedMap).length > 0,
        artworkLabels: serializedMap ? product.artworkLabels : undefined,
        instructions: editor?.getHTML(),
        artworkFiles: serializedFiles || [],
        artworkFilesMap: serializedMap || {},
      };

      if (actionType === "cart") {
        addItem(item);
        toast.success("Item added to cart");
      }

      if (actionType === "buy") {
        setItems([item]);
        router.push("/checkout");
      }

      close();
    } catch (error) {
      console.error("Error storing artwork files:", error);
      toast.error("Failed to store artwork files. Please try again.");
    }
  };

  useEffect(() => {
    setSelectedProductOptions({
      productId: product.id,
      color: product.color,
      image: product.image,
      size: "",
      quantity: 1,
      note: "",
      selectedProductType: "regular" as const,
      artworkFiles: [],
      artworkFilesMap: {},
      instructions: "",
    });
  }, [product]);

  return (
    <>
      <Drawer
        size="lg"
        position="bottom"
        opened={opened}
        onClose={close}
        title="Select Product Options"
      >
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
          <Grid.Col
            span={{ base: 12, sm: 6, lg: 7 }}
            px="md"
            maw={700}
            style={{ overflowY: "auto" }}
          >
            <Title order={3}>{product.title}</Title>
            {product.productNumber && product.productNumber != null && (
              <Group>
                <Text>Item Number: </Text>
                <Title order={4} my="md" c="dimmed">
                  #{product.productNumber}
                </Title>
              </Group>
            )}

            {featureFlags.productRatings && (
              <RatingStars productId={product.id} size="sm" />
            )}

            {product.isCustomizable && (
              <Box mb="xl">
                {shouldUseMultipleArtworks ? (
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
                          product.allowMultipleArtworksForEachSide
                            ? 5
                            : product.numberOfArtworks != null &&
                                product.numberOfArtworks > 0
                              ? product.numberOfArtworks
                              : 1
                        }
                        maxSize={10 * 1024 ** 2}
                        dropzoneText={`Drag ${product.allowMultipleArtworksForEachSide || (product.numberOfArtworks != null && product.numberOfArtworks > 1) ? "images" : "image"} here or click to select ${product.allowMultipleArtworksForEachSide || (product.numberOfArtworks != null && product.numberOfArtworks > 1) ? "files" : "file"}`}
                        description={`File${product.allowMultipleArtworksForEachSide || (product.numberOfArtworks != null && product.numberOfArtworks > 1) ? "s" : ""} should not exceed 10MB (${selectedProductOptions.artworkFiles?.length || 0}/${product.allowMultipleArtworksForEachSide ? 5 : product.numberOfArtworks != null && product.numberOfArtworks > 0 ? product.numberOfArtworks : 1} files)`}
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

            {isTshirt && (
              <>
                <Select
                  label="T-Shirt Type"
                  value={
                    selectedProductOptions.selectedProductType || "regular"
                  }
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
                  <Title>
                    {adjustedPrice * selectedProductOptions.quantity}
                  </Title>
                </Group>
              </Box>
            </Flex>
            <Divider mb="md" maw={700} />

            <AdditionalDetails
              note={selectedProductOptions.note}
              setSelectedProductOptions={setSelectedProductOptions}
            />

            <Group justify="flex-end" my={16}>
              <Button
                onClick={handleConfirm}
                className="btn"
                leftSection={actionType === "cart" ? <BsCartPlus /> : null}
              >
                {actionType === "cart" ? "Add to cart" : "Buy now"}
              </Button>
            </Group>
          </Grid.Col>
        </Grid>
      </Drawer>

      {actionType === "cart" && (
        <CartBtn
          handler={open}
          productId={product.id}
          showLabel={false}
          disableRemove
          size="xs"
        />
      )}
      {actionType === "buy" && (
        <Button onClick={open} className="btn" size="xs" title="Buy now">
          Buy
        </Button>
      )}
    </>
  );
};
