"use client";
import { Carousel } from "@mantine/carousel";
import { Box, Button, Group, Text, Title, rem } from "@mantine/core";
import classes from "./Style.module.css";
import { FeaturedItemCard } from "./FeaturedItemCard";

interface Props {
  title: string;
  description: string;
}
export const FeaturedItems = ({ title, description }: Props) => {
  return (
    <Box mb="lg">
      <Group bg="gray.2" wrap="nowrap" pr={8} justify="space-between" mb="sm">
        <Group wrap="nowrap">
          <Title
            order={5}
            p="sm"
            w={rem(150)}
            c="white"
            className={classes["featured-item-title"]}
          >
            {title}
          </Title>

          <Text lineClamp={1} size="sm" title={description} visibleFrom="sm">
            {description}
          </Text>
        </Group>

        <Button
          size="xs"
          className="btn"
          radius="xs"
          miw={100}
          visibleFrom="sm"
        >
          Browse All
        </Button>
      </Group>

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
        <Carousel.Slide p="xs">
          <FeaturedItemCard />
        </Carousel.Slide>
        <Carousel.Slide p="xs">
          <FeaturedItemCard />
        </Carousel.Slide>
        <Carousel.Slide p="xs">
          <FeaturedItemCard />
        </Carousel.Slide>
        <Carousel.Slide p="xs">
          <FeaturedItemCard />
        </Carousel.Slide>
        <Carousel.Slide p="xs">
          <FeaturedItemCard />
        </Carousel.Slide>
        <Carousel.Slide p="xs">
          <FeaturedItemCard />
        </Carousel.Slide>
        <Carousel.Slide p="xs">
          <FeaturedItemCard />
        </Carousel.Slide>
        <Carousel.Slide p="xs">
          <FeaturedItemCard />
        </Carousel.Slide>
        <Carousel.Slide p="xs">
          <FeaturedItemCard />
        </Carousel.Slide>
      </Carousel>
    </Box>
  );
};
