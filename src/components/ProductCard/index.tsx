import { IPrintProduct } from "@/types";
import { Box, Card, Center, Group, Text } from "@mantine/core";
import Link from "next/link";
import { FavoriteBtn } from "./FavoriteBtn";
import classes from "./ProductCard.module.css";
import { ProductOptions } from "./ProductOptions";

interface Props {
  product: IPrintProduct;
  link: string;
}
export function ProductCard({ product, link = "" }: Props) {
  return (
    <Card withBorder radius="md" className={classes.card} w="250px" mb="sm">
      <Card.Section>
        <Link href={link}>
          <Box
            style={{
              backgroundImage: `url(${product.image})`,
              backgroundPosition: "top -15px right 0px",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              width: "100%",
              height: "200px",
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
