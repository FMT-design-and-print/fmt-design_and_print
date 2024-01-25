"use client";
import { CartBtn } from "@/components/CartBtn";
import { getProductOptionsErrors } from "@/functions";
import { useCart } from "@/store/cart";
import { IOptionsErrors, IPrintProduct, SelectedProductOptions } from "@/types";
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
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Gallery } from "./Gallery";
import { ProductDescription } from "./ProductDescription";
import { ItemRating } from "./Rating";
import { toast } from "react-toastify";
import { Colors } from "@/components/Colors";
import { Sizes } from "@/components/Sizes";
import { AdditionalDetails } from "@/components/AdditionalDetails";
import { Quantity } from "@/components/Quantity";
import { ErrorText } from "@/components/ErrorText";

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
export const ProductDetails = ({ product }: Props) => {
  const addItem = useCart((state) => state.addItem);
  const [errors, setErrors] = useState<IOptionsErrors>({});
  const [selectedProductOptions, setSelectedProductOptions] =
    useLocalStorage<SelectedProductOptions>({
      key: "fmt_dp_selected_product_options",
      defaultValue,
    });

  const handleAddItemToCart = () => {
    const errors = getProductOptionsErrors(selectedProductOptions, {
      sizes: product.sizes,
    });
    setErrors(errors);

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
    toast.success("Item added to cart");
  };

  useEffect(() => {
    if (product.id !== selectedProductOptions.productId) {
      setSelectedProductOptions({
        productId: product.id,
        color: product.color,
        image: product.image,
        size: "",
        quantity: 1,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

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

        <Grid.Col span={{ base: 12, sm: 6, lg: 7 }} px="md">
          <Title order={3}>{product.title}</Title>
          {product.productNumber && product.productNumber != null && (
            <Title order={4} my="md" c="dimmed">
              #{product.productNumber}
            </Title>
          )}
          <ItemRating />
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
                <Title>{product.price * selectedProductOptions.quantity}</Title>
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
              handler={handleAddItemToCart}
              productId={product.id}
              miw={{ base: "100%", xs: 150 }}
            />
            <Button size="md" miw={{ base: "100%", xs: 150 }} className="btn">
              Buy now
            </Button>
          </Group>
          <Text>
            Click{" "}
            <Link href="/custom-request">
              <Text component="span" c="pink">
                here
              </Text>
            </Link>{" "}
            to request for custom print service.
          </Text>
        </Grid.Col>
      </Grid>

      <ProductDescription
        description={product.description}
        details={product.details}
      />

      <Box my="xl">
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
