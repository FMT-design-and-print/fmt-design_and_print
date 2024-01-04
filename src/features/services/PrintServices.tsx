import { Box, Button, Group, Input, Title } from "@mantine/core";
import { BsArrowRight } from "react-icons/bs";
import { ProductCard } from "./ProductCard";
import Link from "next/link";

const link = "services/print/categories/categoryID/productType";

export const PrintServices = () => {
  return (
    <Box py="lg">
      <Input placeholder="Type to search print service..." maw={600} />
      <Box>
        <CategoryHeader
          title="T-Shirts and Apparels"
          slug="t-shirts-and-apparels"
          customRequestLink="#"
        />
        <Group>
          <ProductCard label="T-Shirts" link={link} image="" />
          <ProductCard label="Lacoste" link={link} image="" />
          <ProductCard label="Hoodies" link={link} image="" />
          <ProductCard label="Caps" link={link} image="" />
          <ProductCard label="Pillow Covers" link={link} image="" />
          <ProductCard label="Aprons" link={link} image="" />
        </Group>
      </Box>

      <Box mt={32}>
        <CategoryHeader
          title="Cups, Mugs & Bottles"
          slug="cups-mugs-and-bottles"
          customRequestLink="#"
        />
        <Group>
          <ProductCard label="Cups" link={link} image="" />
          <ProductCard label="Mugs" link={link} image="" />
          <ProductCard label="Bottles" link={link} image="" />
        </Group>
      </Box>

      <Box mt={32}>
        <CategoryHeader
          title="Souvenirs and Everyday Essentials"
          slug="souvenirs-and-everyday-essentials"
          customRequestLink="#"
        />
        <Group>
          <ProductCard label="Keyholders" link={link} image="" />
          <ProductCard label="Pens" link={link} image="" />
          <ProductCard label="Diaries" link={link} image="" />
          <ProductCard label="Stickers" link={link} image="" />
          <ProductCard label="Tags" link={link} image="" />
        </Group>
      </Box>

      <Box mt={32}>
        <CategoryHeader
          title="Branding"
          slug="branding"
          customRequestLink="#"
        />
        <Group>
          <ProductCard label="Flyers" link={link} image="" />
          <ProductCard label="Labels" link={link} image="" />
          <ProductCard label="Brochures" link={link} image="" />
          <ProductCard label="Posters" link={link} image="" />
          <ProductCard label="Car Decals" link={link} image="" />
          <ProductCard label="Signage" link={link} image="" />
          <ProductCard label="Cards" link={link} image="" />
        </Group>
      </Box>

      <Box mt={32}>
        <CategoryHeader title="Others" slug="others" customRequestLink="#" />
        <Group>
          <ProductCard label="Phone Cases" link={link} image="" />
          <ProductCard label="Bags" link={link} image="" />
          <ProductCard label="Puzzle" link={link} image="" />
          <ProductCard label="Photo Frames" link={link} image="" />
          <ProductCard label="{Plaques}" link={link} image="" />
        </Group>
      </Box>
    </Box>
  );
};

const CategoryHeader = ({
  title,
  slug,
  customRequestLink,
}: {
  title: string;
  slug: string;
  customRequestLink: string;
}) => {
  return (
    <Group bg="gray.2" wrap="nowrap" p={8} justify="space-between" my="lg">
      <Link href={`/services/print/categories/${slug}`}>
        <Title order={5} p="sm" tt="uppercase" lineClamp={1} title={title}>
          {title}
        </Title>
      </Link>

      <Button
        size="xs"
        className="btn"
        radius="xs"
        miw={100}
        visibleFrom="sm"
        rightSection={<BsArrowRight />}
        component={Link}
        href={customRequestLink}
      >
        Custom Request
      </Button>
    </Group>
  );
};
