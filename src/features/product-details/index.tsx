"use client";
import { RichTextComponents } from "@/components/RichTextComponent";
import { IPrintProduct } from "@/types";
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
  Rating,
  Tabs,
  Text,
  Title,
} from "@mantine/core";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BsCartPlus } from "react-icons/bs";
import { Colors } from "./Colors";
import { Gallery } from "./Gallery";
import { Quantity } from "./Quantity";
import { Sizes } from "./Sizes";
import classes from "./Style.module.css";

interface Props {
  product: IPrintProduct;
}
export const ProductDetails = ({ product }: Props) => {
  console.log(product);
  const searchParams = useSearchParams();
  const colorId = searchParams.get("colorId");
  const [selectedImage, setSelectedImage] = useState<string | undefined>("");

  useEffect(() => {
    if (colorId && colorId !== product.color?.id) {
      setSelectedImage(
        product.colors?.filter((c) => c.color.id === colorId)[0].image
      );
    } else {
      setSelectedImage(product.image);
    }
  }, [colorId, product.color?.id, product.colors, product.image]);

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
              <Image radius="md" src={selectedImage} alt={product.title} />
            </AspectRatio>
            {product.gallery && product.gallery.length > 0 && (
              <Gallery
                images={[product.image, ...product.gallery]}
                setSelectedImage={setSelectedImage}
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
          <Group gap="xs">
            <Rating size="xs" value={4.5} fractions={2} readOnly color="pink" />
            <Text size="xs" my="md">
              (123)
            </Text>
          </Group>
          <Colors mainColor={product.color} colors={product.colors || []} />
          <Sizes sizes={product.sizes} />

          <Divider label="Quantity" labelPosition="left" mt="md" maw={700} />
          <Flex my="sm" justify="space-between" maw={700}>
            <Quantity />
            <Group align="flex-start" gap={1}>
              <Text pt="5px">GHS</Text>
              <Title>{product.price}</Title>
            </Group>
          </Flex>
          <Divider mb="md" maw={700} />
          <Group my="xl">
            <Button
              size="md"
              miw={{ base: "100%", xs: 150 }}
              className={classes["cart-btn"]}
              leftSection={<BsCartPlus />}
            >
              Add to cart
            </Button>
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

      <Tabs
        variant="outline"
        color="gray"
        radius="sm"
        defaultValue="description"
        px="xl"
        mt="xl"
      >
        <Tabs.List py="md">
          <Tabs.Tab value="description" px="xl" py="md">
            Description
          </Tabs.Tab>
          <Tabs.Tab value="details" px="xl" py="md">
            Product Details
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="description" py="md">
          {product.description}
        </Tabs.Panel>
        <Tabs.Panel value="details" py="md">
          <PortableText
            value={product.details}
            components={RichTextComponents}
          />
        </Tabs.Panel>
      </Tabs>

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
