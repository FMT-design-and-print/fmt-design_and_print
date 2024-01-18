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
import { BsCartPlus } from "react-icons/bs";
import { HiOutlineHeart } from "react-icons/hi";
import classes from "./ProductCard.module.css";

interface Props {
  image: string;
  title: string;
  price: number;
  link: string;
}
export function ProductCard({ title, image, price, link = "" }: Props) {
  return (
    <Card withBorder radius="md" className={classes.card} w={300}>
      <Card.Section>
        <Link href={link}>
          <Box
            style={{
              backgroundImage: `url(${image})`,
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
        {title}
      </Text>

      <Group justify="space-between" mt="md">
        <Box>
          <Text fw="bold">GHS {price}</Text>
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
