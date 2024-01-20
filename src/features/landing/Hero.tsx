"use client";
import { Button, Card, Grid, Group, Text, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Image from "next/image";
import { FaLongArrowAltRight } from "react-icons/fa";
import { CarouselCard } from "./CarouselCard";
import { PrintCategories } from "./PrintCategories";
import { featureFlags } from "@/constants/feature-flags";

const designItems = [
  {
    title: "Flyer Designs",
    image: "/flyer.png",
  },

  {
    title: "Logo Designs",
    image: "/logo_d.png",
  },
  {
    title: "Label Designs",
    image: "/label.png",
  },
  {
    title: "Brochures",
    image: "/brochure.png",
  },
  {
    title: "3D Designs",
    image: "/3d-modeling.png",
  },
];

export const Hero = () => {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  return (
    <Grid px={{ base: "md", sm: "xl" }}>
      <Grid.Col span={3} visibleFrom="sm">
        <Card withBorder h="100%">
          <PrintCategories />
        </Card>
      </Grid.Col>
      <Grid.Col span="auto">
        <CarouselCard />
      </Grid.Col>
      {featureFlags.design && (
        <Grid.Col span={3} visibleFrom="md">
          <Card withBorder h="100%">
            {designItems.map((item, i) => (
              <Group key={item.title + i} py="md" wrap="nowrap">
                <Image src={item.image} alt="" width={25} height={25} />
                <Text
                  lineClamp={1}
                  c="gray.7"
                  size={isMobile ? "sm" : "md"}
                  title={item.title}
                >
                  {item.title}
                </Text>
              </Group>
            ))}
            <Group py={8} grow>
              <Button className="btn">
                View More <FaLongArrowAltRight style={{ margin: "0 10px" }} />
              </Button>
            </Group>
          </Card>
        </Grid.Col>
      )}
    </Grid>
  );
};
