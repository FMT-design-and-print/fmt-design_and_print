import { useDisclosure } from "@mantine/hooks";
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

const defaultValue = {
  productId: "",
  color: undefined,
  image: "",
  size: "",
  quantity: 1,
  note: "",
  selectedProductType: "regular" as const,
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

  const isTshirt = product.type?.slug === "t-shirts";
  const adjustedPrice =
    isTshirt && selectedProductOptions.selectedProductType === "jersey"
      ? product.price - 5
      : product.price;

  const handleConfirm = () => {
    const errors = getProductOptionsErrors(selectedProductOptions, {
      sizes: product.sizes,
    });
    setErrors(errors);

    if (Object.keys(errors).length > 0) return false;

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
          <Grid.Col span={{ base: 12, sm: 6, lg: 7 }} px="md">
            <Title order={3}>{product.title}</Title>
            {product.productNumber && product.productNumber != null && (
              <Group>
                <Text>Item Number: </Text>
                <Title order={4} my="md" c="dimmed">
                  #{product.productNumber}
                </Title>
              </Group>
            )}

            {featureFlags.productRatings && <RatingStars />}

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
