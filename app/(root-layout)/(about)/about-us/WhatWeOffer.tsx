"use client";
import {
  Box,
  Card,
  Container,
  SimpleGrid,
  Space,
  Text,
  Title,
  rem,
} from "@mantine/core";
import {
  Icon,
  IconCalendarTime,
  IconCircleCheck,
  IconPaperBag,
  IconPencil,
  IconPrinter,
  IconProps,
  IconShirt,
  IconUser,
} from "@tabler/icons-react";
import React from "react";
import classes from "./FeaturesCards.module.css";

export type Data = {
  title: string;
  description: string;
  icon: any;
};

const offers = [
  {
    title: "Apparels",
    description:
      "Explore our collection of custom-designed T-shirts, hoodies, caps, socks, and more, crafted to your specifications and tailored to your style.",
    icon: IconShirt,
  },
  {
    title: "Souvenirs",
    description:
      "Discover unique souvenirs and keepsakes that capture special moments and memories, perfect for commemorating events, trips, or milestones.",
    icon: IconPencil,
  },
  {
    title: "Branding",
    description:
      "Elevate your brand identity with custom branding solutions, including logo printing, promotional products, and corporate gifts that leave a lasting impression.",
    icon: IconPaperBag,
  },

  {
    title: "Engraving",
    description:
      " Personalize your items with precision engraving services, adding a touch of elegance and sophistication to gifts, awards, and accessories",
    icon: IconPrinter,
  },
];

const commitments: Data[] = [
  {
    title: "Quality",
    description:
      "We take pride in delivering products of the highest quality, using premium materials and cutting-edge printing techniques to ensure vibrant colors, crisp details, and long-lasting durability.",
    icon: IconCircleCheck,
  },
  {
    title: "Flexibility",
    description:
      "Whether you have a specific vision in mind or need assistance bringing your ideas to life, we offer flexible customization options and personalized service to meet your unique needs and preferences",
    icon: IconUser,
  },
  {
    title: "On-time Delivery",
    description:
      "Your satisfaction is our priority, and we're dedicated to delivering your orders with speed and efficiency, ensuring that you receive your customized products on time, every time.",
    icon: IconCalendarTime,
  },
];

export function WhatWeOffer() {
  const features = (data: Data[]) =>
    data.map((feature) => (
      <Card
        key={feature.title}
        shadow="md"
        radius="md"
        className={classes.card}
        padding="xl"
      >
        <feature.icon
          style={{ width: rem(50), height: rem(50) }}
          stroke={2}
          color="var(--primary-300)"
        />
        <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">
          {feature.title}
        </Text>
        <Text fz="sm" c="dimmed" mt="sm">
          {feature.description}
        </Text>
      </Card>
    ));

  return (
    <Container size="full" py="xl" bg="gray.1" my="xl">
      <Box w={{ base: "100%", sm: "90%", lg: "80%" }} mx="auto">
        <Title order={2} ta="center" mt="sm">
          What we offer
        </Title>

        <Text c="dimmed" className={classes.description} ta="center" mt="md">
          We offer you the best services with the best prices and quality
          products in the market.
        </Text>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl" mt={50}>
          {features(offers)}
        </SimpleGrid>

        <Space my="xl" py="xl" />
        <Title order={2} ta="center" mt="sm">
          Our Commitment
        </Title>

        <Text c="dimmed" className={classes.description} ta="center" mt="md">
          We are very committed to our customers by providing quality,
          flexibility and on-time services.
        </Text>
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" my={50}>
          {features(commitments)}
        </SimpleGrid>
      </Box>
    </Container>
  );
}
