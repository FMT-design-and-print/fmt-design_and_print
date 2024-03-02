import { IPrintProduct } from "@/types";
import { ActionIcon, Box, Card, Center, Group, Text, rem } from "@mantine/core";
import Link from "next/link";
import { HiOutlineHeart } from "react-icons/hi";
import classes from "./ProductCard.module.css";
import { ProductOptions } from "./ProductOptions";

interface Props {
  product: IPrintProduct;
  link: string;
}
export function ProductCard({ product, link = "" }: Props) {
  return (
    <Card withBorder radius="md" className={classes.card} w={250}>
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

      <ActionIcon
        className={classes.favIcon}
        size={36}
        variant="transparent"
        aria-label="Add to favorites"
      >
        <HiOutlineHeart style={{ width: rem(24), height: rem(24) }} />
      </ActionIcon>

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
