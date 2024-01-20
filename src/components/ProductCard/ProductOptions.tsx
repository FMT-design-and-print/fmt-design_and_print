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
} from "@mantine/core";
import { CartBtn } from "../CartBtn";
import { Colors } from "../Colors";
import { Sizes } from "../Sizes";
import { Quantity } from "../Quantity";
import { ErrorText } from "../ErrorText";
import { useEffect, useState } from "react";
import { IOptionsErrors, IPrintProduct, SelectedProductOptions } from "@/types";
import { AdditionalDetails } from "../AdditionalDetails";
import { Gallery } from "@/features/product-details/Gallery";
import { BsCartPlus } from "react-icons/bs";
import { getProductOptionsErrors } from "@/functions";
import { useCart } from "@/store/cart";
import { toast } from "react-toastify";

const defaultValue = {
  productId: "",
  color: undefined,
  image: "",
  size: "",
  quantity: 1,
  note: "",
};

interface Props {
  product: IPrintProduct;
}
export const ProductOptions = ({ product }: Props) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedProductOptions, setSelectedProductOptions] =
    useState<SelectedProductOptions>(defaultValue);
  const [errors, setErrors] = useState<IOptionsErrors>({});
  const addItem = useCart((state) => state.addItem);

  const handleAddItemToCart = () => {
    const errors = getProductOptionsErrors(selectedProductOptions);
    setErrors(errors);

    // TODO: Check if product does not have sizes

    if (Object.keys(errors).length > 0) return false;
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: selectedProductOptions.quantity,
      image: selectedProductOptions.image,
      timestamp: new Date(),
      color: selectedProductOptions.color,
      size: selectedProductOptions.size,
      notes: selectedProductOptions.note,
    });
    close();
    toast.success("Item added to cart");
  };

  useEffect(() => {
    setSelectedProductOptions({
      productId: product.id,
      color: product.color,
      image: product.image,
      size: "",
      quantity: 1,
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
              <Title order={4} my="md" c="dimmed">
                #{product.productNumber}
              </Title>
            )}

            <Colors
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
                    {product.price} x {selectedProductOptions.quantity} =
                  </Text>
                )}
                <Group align="flex-start" gap={1}>
                  <Text pt="5px">GHS</Text>
                  <Title>
                    {product.price * selectedProductOptions.quantity}
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
                onClick={handleAddItemToCart}
                className="btn"
                leftSection={<BsCartPlus />}
              >
                Confirm
              </Button>
            </Group>
          </Grid.Col>
        </Grid>
      </Drawer>

      <CartBtn
        handler={open}
        productId={product.id}
        showLabel={false}
        size="xs"
      />
    </>
  );
};
