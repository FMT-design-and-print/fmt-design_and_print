import { IPrintProduct } from "@/types";
import { Box, Card, Center, Group, Text } from "@mantine/core";
import Link from "next/link";
import { FavoriteBtn } from "./FavoriteBtn";
import classes from "./ProductCard.module.css";
import { ProductOptions } from "./ProductOptions";
import Image from "next/image";
import { shimmer, toBase64 } from "@/functions/shimmer";

interface Props {
  product: IPrintProduct;
  link: string;
  size?: "default" | "small" | "large";
}
export function ProductCard({ product, link = "", size = "default" }: Props) {
  return (
    <Card
      withBorder
      radius="md"
      className={classes.card}
      w={size === "small" ? "160px" : "250px"}
      mb={size === "small" ? "xs" : "sm"}
    >
      <Card.Section
        px={size === "small" ? "xs" : "md"}
        pt={size === "small" ? "5px" : "sm"}
        h={size === "small" ? "100px" : "200px"}
        style={{ overflowY: "hidden" }}
      >
        <Link href={link}>
          <Image
            src={product.image}
            alt={product.title}
            width={size === "small" ? 150 : 250}
            height={size === "small" ? 100 : 200}
            // objectPosition="top
            placeholder={`data:image/svg+xml;base64,${toBase64(
              shimmer(
                size === "small" ? 150 : 250,
                size === "small" ? 100 : 200
              )
            )}`}
            style={{
              width: size === "small" ? "100%" : "85%",
              height: "auto",
              margin: "auto",
            }}
          />
        </Link>
      </Card.Section>

      <FavoriteBtn
        productId={product.id}
        title={product.title}
        image={product.image}
        price={product.price}
      />

      <Text
        component={Link}
        href={link}
        mt="sm"
        mb={size === "small" ? 0 : "sm"}
        lineClamp={size === "small" ? 2 : 1}
        size={size === "small" ? "xs" : "sm"}
      >
        {product.title}
      </Text>

      <Group justify="space-between" mt={size === "small" ? "5px" : "md"}>
        <Box>
          <Text fw="bold" size={size === "small" ? "sm" : "md"}>
            GHS {product.price}
          </Text>
        </Box>
        {size !== "small" && (
          <Center>
            <ProductOptions product={product} actionType="cart" />
            <ProductOptions product={product} actionType="buy" />
          </Center>
        )}
      </Group>
    </Card>
  );
}
