"use client";
import { IPrintProduct } from "@/types";
import {
  AspectRatio,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  Group,
  Image,
  NumberInput,
  Rating,
  Tabs,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BsCartPlus } from "react-icons/bs";
import { Colors } from "./Colors";
import { Gallery } from "./Gallery";
import classes from "./Style.module.css";
import { useEffect, useState } from "react";
import { PortableText } from "@portabletext/react";
import { RichTextComponents } from "@/components/RichTextComponent";

export const revalidate = 60;

interface Props {
  product: IPrintProduct;
}
export const ProductDetails = ({ product }: Props) => {
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
          <Group gap="xs">
            <Rating size="xs" value={4.5} fractions={2} readOnly color="pink" />
            <Text size="xs" my="md">
              (123)
            </Text>
          </Group>
          <Box mb="sm">
            <Text fw="bold">Color</Text>
            <Text size="sm" c="dimmed">
              Please choose color below
            </Text>
            <Colors mainColor={product.color} colors={product.colors || []} />
          </Box>
          <Box mb="sm">
            <Text fw="bold">Size</Text>
            <Text size="sm" c="dimmed">
              Please choose size below
            </Text>
            <Group gap="xs" my="xs">
              <Card w={35} h={35} p={4} className="text-center" withBorder>
                S
              </Card>
              <Card w={35} h={35} p={4} className="text-center" withBorder>
                M
              </Card>
              <Card w={35} h={35} p={4} className="text-center" withBorder>
                L
              </Card>
              <Card w={35} h={35} p={4} className="text-center" withBorder>
                XL
              </Card>
              <Card w={35} h={35} p={4} className="text-center" withBorder>
                2XL
              </Card>
            </Group>
          </Box>
          <Divider label="Quantity" labelPosition="left" mt="md" />
          <Flex my="sm" justify="space-between">
            <Group>
              <Button variant="light" color="gray">
                -
              </Button>
              <NumberInput
                w={50}
                placeholder="1"
                value={1}
                min={1}
                hideControls
              />
              <Button variant="light" color="gray">
                +
              </Button>
            </Group>

            <Group align="flex-start" gap={1}>
              <Text pt="5px">GHS</Text>
              <Title>55</Title>
            </Group>
          </Flex>
          <Divider mb="md" />
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
          <Badge variant="outline" color="gray">
            Search Term 1
          </Badge>
          <Badge variant="outline" color="gray">
            Term 2
          </Badge>
          <Badge variant="outline" color="gray">
            Screen printing
          </Badge>
          <Badge variant="outline" color="gray">
            Heat transfer printing
          </Badge>
        </Group>
      </Box>
    </Box>
  );
};
