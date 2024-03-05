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
}
export function ProductCard({ product, link = "" }: Props) {
  return (
    <Card withBorder radius="md" className={classes.card} w="250px" mb="sm">
      <Card.Section>
        <Link href={link}>
          <Image
            src={product.image}
            alt={product.title}
            width={250}
            height={200}
            placeholder={`data:image/svg+xml;base64,${toBase64(
              shimmer(250, 200)
            )}`}
            style={{
              maxWidth: "100%",
              height: "auto",
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

      <Text component={Link} href={link} mt="md" mb="sm" lineClamp={1}>
        {product.title}
      </Text>

      <Group justify="space-between" mt="md">
        <Box>
          <Text fw="bold">GHS {product.price}</Text>
        </Box>
        <Center>
          <ProductOptions product={product} actionType="cart" />
          <ProductOptions product={product} actionType="buy" />
        </Center>
      </Group>
    </Card>
  );
}
