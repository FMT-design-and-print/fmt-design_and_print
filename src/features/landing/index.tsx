"use client";
import { Faq } from "@/components/FAQ/FAQ";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { useFeaturedProducts } from "@/hooks/useFeaturedProducts";
import { useSaveInitialUserDetails } from "@/hooks/useSaveInitialUserDetails";
import { IFeaturedProducts } from "@/types";
import {
  Box,
  Button,
  Container,
  Group,
  Notification,
  rem,
  Stack,
  Title,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import Link from "next/link";
import { FaLongArrowAltRight } from "react-icons/fa";
import { FeaturedItems } from "./FeaturedItems";
import { Hero } from "./Hero";

const defaultFeaturedProducts = {
  tShirts: [],
  hoodies: [],
  mugs: [],
  frames: [],
};

export const Landing = () => {
  useSaveInitialUserDetails();
  const { data: products, isLoading, isError } = useFeaturedProducts();
  const featuredProducts: IFeaturedProducts =
    products?.[0] || defaultFeaturedProducts;

  return (
    <Container size="xl">
      <Hero />

      <Box p={{ base: "md", sm: "xl" }} pos="relative">
        <LoadingOverlay visible={isLoading} />
        {isError && (
          <Notification
            icon={<IconX style={{ width: rem(20), height: rem(20) }} />}
            color="red"
            title="Error loading featured products"
          >
            An error occurred while fetching the featured products.
          </Notification>
        )}
        <Group my="xl" justify="space-between">
          <Title order={3} c="gray.8">
            Shop Our Top Products
          </Title>
          <Button
            component={Link}
            href="/services"
            variant="outline"
            color="pink.6"
          >
            Browse All Products{" "}
            <FaLongArrowAltRight style={{ margin: "0 10px" }} />
          </Button>
        </Group>

        <Stack>
          {featuredProducts.tShirts && (
            <FeaturedItems
              title="T-SHIRTS"
              description="Discover a diverse collection of high-quality T-shirts,  showcasing customizable printable designs."
              items={featuredProducts.tShirts}
              link={`/services/print/categories/${featuredProducts.tShirts[0]?.category.slug}/${featuredProducts.tShirts[0]?.type.slug}`}
            />
          )}
          {featuredProducts.hoodies && (
            <FeaturedItems
              title="HOODIES"
              description="Wrap yourself in warmth and style with our custom hoodies – your go-to for comfort and fashion-forward designs."
              items={featuredProducts.hoodies}
              link={`/services/print/categories/${featuredProducts.hoodies[0]?.category.slug}/${featuredProducts.hoodies[0]?.type.slug}`}
            />
          )}
          {featuredProducts.mugs && (
            <FeaturedItems
              title="MUGS"
              description="Sip in style with our curated collection of mugs – where every design tells a story."
              items={featuredProducts.mugs}
              link={`/services/print/categories/${featuredProducts.mugs[0]?.category.slug}/${featuredProducts.mugs[0]?.type.slug}`}
            />
          )}
          {featuredProducts.frames && (
            <FeaturedItems
              title="FRAMES"
              description="Capture and cherish your moments with our exquisite photo frames, turning memories into timeless treasures."
              items={featuredProducts.frames}
              link={`/services/print/categories/${featuredProducts.frames[0]?.category.slug}/${featuredProducts.frames[0]?.type.slug}`}
            />
          )}
        </Stack>
      </Box>

      <Box my="xl">
        <Faq isOverview />
      </Box>
    </Container>
  );
};
