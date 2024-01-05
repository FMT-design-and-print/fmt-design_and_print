import {
  ActionIcon,
  Box,
  Button,
  Card,
  Center,
  Group,
  Rating,
  Text,
  rem,
} from "@mantine/core";
import Link from "next/link";
import { HiOutlineHeart } from "react-icons/hi";
import classes from "./ProductCard.module.css";
import { BsCartPlus } from "react-icons/bs";

export function ProductCard() {
  return (
    <Card withBorder radius="md" className={classes.card} w={300}>
      <Card.Section>
        <Link href="/services/print/product-slug">
          <Box
            style={{
              backgroundImage:
                "url(https://res.cloudinary.com/dnbmynikp/image/upload/v1703781261/FMT/tshirt-mockup_ppflhq.png)",
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

      <Text
        component={Link}
        href="/services/print/product-slug"
        mt="md"
        mb="sm"
        lineClamp={1}
      >
        Black T-Shirt geometric print pattern
      </Text>

      <Group gap="xs">
        <Rating size="xs" value={4.5} fractions={2} readOnly color="pink" />
        <Text size="xs">(123)</Text>
      </Group>

      <Group justify="space-between" mt="md">
        <Box>
          <Text fw="bold">GHS 45</Text>
        </Box>
        <Center>
          <Button
            className={classes["cart-btn"]}
            size="xs"
            mx={4}
            title="Add to Cart"
          >
            <BsCartPlus />
          </Button>
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
