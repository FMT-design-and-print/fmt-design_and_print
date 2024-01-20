import {
  ActionIcon,
  Box,
  Button,
  Card,
  Center,
  Group,
  Text,
  rem,
} from "@mantine/core";
import Link from "next/link";
import { HiOutlineHeart } from "react-icons/hi";
import classes from "./ProductCard.module.css";
import { ProductOptions } from "./ProductOptions";
import { IPrintProduct } from "@/types";

interface Props {
  product: IPrintProduct;
  link: string;
}
export function ProductCard({ product, link = "" }: Props) {
  return (
    <Card withBorder radius="md" className={classes.card} w={300}>
      <Card.Section>
        <Link href={link}>
          <Box
            style={{
              backgroundImage: `url(${product.image})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              width: "100%",
              height: "250px",
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
          <ProductOptions product={product} />
          <Button
            component={Link}
            href="/checkout"
            className="btn"
            size="xs"
            title="Buy now"
          >
            Buy
          </Button>
        </Center>
      </Group>
    </Card>
  );
}
