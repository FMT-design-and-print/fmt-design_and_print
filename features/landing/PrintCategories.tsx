import React from "react";
import { HeroLink } from "./HeroLink";
import { useMediaQuery } from "@mantine/hooks";
import { Box, Button, Group, Skeleton, em } from "@mantine/core";
import { ICategory } from "@/types";
import { FaLongArrowAltRight } from "react-icons/fa";
import { useCategories } from "@/hooks/useCategories";
import { featureFlags } from "@/constants/feature-flags";
import Link from "next/link";

const gift: ICategory = {
  id: "",
  title: "Gift & Packages",
  image: "/gift-box.png",
  slug: "gifts-and-packages",
  icon: "/gift-box.png",
  tagline: "",
};

const LoadingItem = () => (
  <Group my="sm">
    <Skeleton height={35} width={35} radius="sm" />
    <Skeleton height={30} style={{ flex: 1 }} radius="sm" />
  </Group>
);

export const PrintCategories = () => {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  const { isLoading, categories } = useCategories();

  if (isLoading) {
    return (
      <Box>
        <LoadingItem />
        <LoadingItem />
      </Box>
    );
  }

  return (
    <>
      {categories &&
        categories
          .filter((item) => item.slug !== "others")
          .map((item) => (
            <HeroLink
              key={item.id}
              item={item}
              isMobile={isMobile}
              link={`/services/print/categories/${item.slug}`}
            />
          ))}

      {featureFlags.gifts && (
        <HeroLink item={gift} isMobile={isMobile} link="/services/gifts" />
      )}

      <Group py={8} grow>
        <Button component={Link} href="/services" className="btn" maw={250}>
          View More <FaLongArrowAltRight style={{ margin: "0 10px" }} />
        </Button>
      </Group>
    </>
  );
};
