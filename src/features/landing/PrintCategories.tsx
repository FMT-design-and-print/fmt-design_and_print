import React from "react";
import { HeroLink } from "./HeroLink";
import { useMediaQuery } from "@mantine/hooks";
import { Button, Center, Group, Loader, em } from "@mantine/core";
import { ICategory } from "@/types";
import { FaLongArrowAltRight } from "react-icons/fa";
import { useCategories } from "@/hooks/useCategories";

const gift: ICategory = {
  id: "",
  title: "Gift & Packages",
  image: "/gift-box.png",
  slug: "gifts-and-packages",
  icon: "/gift-box.png",
  tagline: "",
};

export const PrintCategories = () => {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  const { isLoading, categories } = useCategories();

  if (isLoading) {
    return (
      <Center>
        <Loader size="xs" color="pink" />
      </Center>
    );
  }

  return (
    <>
      {categories &&
        categories
          .filter((item) => item.slug !== "others")
          .map((item, i) => (
            <HeroLink
              key={item.id}
              item={item}
              isMobile={isMobile}
              link={`/services/print/categories/${item.slug}`}
            />
          ))}

      <HeroLink item={gift} isMobile={isMobile} link="/services/gifts" />

      <Group py={8} grow>
        <Button className="btn">
          View More <FaLongArrowAltRight style={{ margin: "0 10px" }} />
        </Button>
      </Group>
    </>
  );
};
