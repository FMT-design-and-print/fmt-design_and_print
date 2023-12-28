import React from "react";
import { Hero } from "./Hero";
import { Box, Button, Group, Stack, Title } from "@mantine/core";
import { FaLongArrowAltRight } from "react-icons/fa";
import { FeaturedItems } from "./FeaturedItems";

export const Landing = () => {
  return (
    <>
      <Hero />

      <Box p={{ base: "md", sm: "xl" }}>
        <Group my="xl" justify="space-between">
          <Title order={3} c="gray.8">
            Shop Our Top Categories
          </Title>
          <Button variant="outline" color="pink.6">
            Browse All Categories{" "}
            <FaLongArrowAltRight style={{ margin: "0 10px" }} />
          </Button>
        </Group>

        <Stack>
          <FeaturedItems
            title="T-SHIRTS"
            description="Discover a diverse collection of high-quality T-shirts,  showcasing customizable printable designs."
          />
          <FeaturedItems
            title="HOODIES"
            description="Wrap yourself in warmth and style with our custom hoodies – your go-to for comfort and fashion-forward designs."
          />
          <FeaturedItems
            title="MUGS"
            description="Sip in style with our curated collection of mugs – where every design tells a story."
          />
        </Stack>
      </Box>
    </>
  );
};
