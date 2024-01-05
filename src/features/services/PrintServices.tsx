import { Box, Button, Group, Input, Title } from "@mantine/core";
import { BsArrowRight } from "react-icons/bs";
import { ProductTypeCard } from "./ProductTypeCard";
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
          <ProductTypeCard label="T-Shirts" link={link} image="" />
          <ProductTypeCard label="Lacoste" link={link} image="" />
          <ProductTypeCard label="Hoodies" link={link} image="" />
          <ProductTypeCard label="Caps" link={link} image="" />
          <ProductTypeCard label="Pillow Covers" link={link} image="" />
          <ProductTypeCard label="Aprons" link={link} image="" />
        </Group>
      </Box>

      <Box mt={32}>
        <CategoryHeader
          title="Cups, Mugs & Bottles"
          slug="cups-mugs-and-bottles"
          customRequestLink="#"
        />
        <Group>
          <ProductTypeCard label="Cups" link={link} image="" />
          <ProductTypeCard label="Mugs" link={link} image="" />
          <ProductTypeCard label="Bottles" link={link} image="" />
        </Group>
      </Box>

      <Box mt={32}>
        <CategoryHeader
          title="Souvenirs and Everyday Essentials"
          slug="souvenirs-and-everyday-essentials"
          customRequestLink="#"
        />
        <Group>
          <ProductTypeCard label="Keyholders" link={link} image="" />
          <ProductTypeCard label="Pens" link={link} image="" />
          <ProductTypeCard label="Diaries" link={link} image="" />
          <ProductTypeCard label="Stickers" link={link} image="" />
          <ProductTypeCard label="Tags" link={link} image="" />
        </Group>
      </Box>

      <Box mt={32}>
        <CategoryHeader
          title="Branding"
          slug="branding"
          customRequestLink="#"
        />
        <Group>
          <ProductTypeCard label="Flyers" link={link} image="" />
          <ProductTypeCard label="Labels" link={link} image="" />
          <ProductTypeCard label="Brochures" link={link} image="" />
          <ProductTypeCard label="Posters" link={link} image="" />
          <ProductTypeCard label="Car Decals" link={link} image="" />
          <ProductTypeCard label="Signage" link={link} image="" />
          <ProductTypeCard label="Cards" link={link} image="" />
        </Group>
      </Box>

      <Box mt={32}>
        <CategoryHeader title="Others" slug="others" customRequestLink="#" />
        <Group>
          <ProductTypeCard label="Phone Cases" link={link} image="" />
          <ProductTypeCard label="Bags" link={link} image="" />
          <ProductTypeCard label="Puzzle" link={link} image="" />
          <ProductTypeCard label="Photo Frames" link={link} image="" />
          <ProductTypeCard label="{Plaques}" link={link} image="" />
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
