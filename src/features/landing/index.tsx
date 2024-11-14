"use client";
// import { Faq } from "@/components/FAQ/FAQ";
// import { Container } from "@mantine/core";
// import { Hero } from "./Hero";
// import { useSaveInitialUserDetails } from "@/hooks/useSaveInitialUserDetails";
import { IFeaturedProducts } from "@/types";
// import { Box } from "@mantine/core";

const defaultFeaturedProducts = {
  tShirts: [],
  hoodies: [],
  mugs: [],
  frames: [],
};

interface Props {
  featuredProducts: IFeaturedProducts;
}
export const Landing = ({
  featuredProducts = defaultFeaturedProducts,
}: Props) => {
  // useSaveInitialUserDetails();

  return (
    <div>
      Hello
      {/* <Hero /> */}
      {/* <Box p={{ base: "md", sm: "xl" }}>
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
      </Box> */}
      {/* <Box my="xl">
        <Faq isOverview />
      </Box> */}
    </div>
  );
};
