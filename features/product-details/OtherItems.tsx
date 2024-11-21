import { FeaturedItemCard } from "@/components/FeaturedItemCard";
import { FeaturedItem } from "@/types";
import { Carousel } from "@mantine/carousel";
import { Box, Title } from "@mantine/core";
import React from "react";

interface Props {
  label: string;
  items: FeaturedItem[];
}

export const OtherItems = ({ items, label }: Props) => {
  return (
    <Box m="xl" py="xl">
      <Title order={3} mb="lg">
        {label}
      </Title>

      <Carousel
        withIndicators
        height={300}
        slideSize={{
          base: "100%",
          xs: "50%",
          sm: "33.33%",
          md: "25%",
          xl: "20%",
        }}
        slideGap="md"
        loop
        align="start"
        slidesToScroll={1}
      >
        {items?.map((item, i) => (
          <Carousel.Slide key={item.id} p="xs">
            <FeaturedItemCard item={item} />
          </Carousel.Slide>
        ))}
      </Carousel>
    </Box>
  );
};
