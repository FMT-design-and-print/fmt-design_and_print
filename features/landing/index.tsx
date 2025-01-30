"use client";
import {
  Box,
  Button,
  Container,
  Group,
  Stack,
  Title,
  Text,
  Paper,
  Avatar,
  Flex,
} from "@mantine/core";
import { FaLongArrowAltRight } from "react-icons/fa";
import { FeaturedItems } from "./FeaturedItems";
import { Hero } from "./Hero";
import Link from "next/link";
import { IFeaturedProducts } from "@/types";
import { Faq } from "@/components/FAQ/FAQ";
import { useSaveInitialUserDetails } from "@/hooks/useSaveInitialUserDetails";
import { orderSteps, paymentOptions } from "@/constants/order-steps";
import Image from "next/image";

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
  useSaveInitialUserDetails();

  return (
    <Container size="xl">
      <Hero />
      <Box p={{ base: "md", sm: "xl" }}>
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

      {/* How It Works Section */}
      <Box my={50}>
        <Title order={3} c="gray.8" ta="center" mb="xl">
          How It Works
        </Title>
        <Box pos="relative">
          <Group gap={30} justify="center" wrap="wrap">
            {orderSteps.map((step, index) => (
              <Paper
                withBorder
                key={index}
                style={{
                  width: 280,
                  position: "relative",
                  zIndex: 1,
                  backgroundColor: "white",
                }}
                p="md"
                ta="center"
              >
                {/* Step number badge */}
                <Box
                  pos="absolute"
                  top={-15}
                  left="50%"
                  style={{
                    transform: "translateX(-50%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                  }}
                  bg="pink.6"
                  c="white"
                  w={30}
                  h={30}
                >
                  {index + 1}
                </Box>
                <Box
                  mb="md"
                  style={{
                    height: 150,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    src={step.icon}
                    size="xl"
                    radius="xs"
                    style={{
                      width: "80%",
                      height: "80%",
                      maxWidth: "130px",
                      maxHeight: "120px",
                    }}
                  />
                </Box>
                <Title order={4} mb="sm">
                  {step.title}
                </Title>
                <Text c="dimmed" size="sm">
                  {step.description}
                </Text>
              </Paper>
            ))}
          </Group>
        </Box>
      </Box>

      {/* Payment Options Section */}
      <Box my={50}>
        <Title order={3} c="gray.8" ta="center" mb="xl">
          Payment Options
        </Title>
        <Group justify="center" gap={30}>
          {paymentOptions.map((option, index) => (
            <Paper
              key={index}
              shadow="sm"
              p="xl"
              style={{ maxWidth: 250 }}
              withBorder
            >
              <Stack align="center">
                <Image
                  src={option.icon || ""}
                  width={80}
                  height={70}
                  alt={option.title}
                />
                <Title order={4}>{option.title}</Title>
                <Text c="dimmed" size="sm" ta="center">
                  {option.description}
                </Text>
              </Stack>
            </Paper>
          ))}
        </Group>
      </Box>

      {/* Delivery Banner */}
      <Paper my={50} p="xl" bg="pink.1" style={{ borderRadius: 12 }}>
        <Group justify="center" gap="xl">
          <Flex gap={16} style={{ maxWidth: 700 }}>
            <Avatar
              src="./order-steps/receive-order.svg"
              size="xl"
              radius="xs"
              style={{
                width: "80%",
                height: "80%",
                maxWidth: "130px",
                maxHeight: "120px",
              }}
            />
            <Box>
              <Title order={3} c="pink.8">
                We Deliver to Your Doorstep
              </Title>
              <Text c="gray.7" mt="md">
                Enjoy convenient and reliable delivery service right to your
                location. Our trusted delivery partners ensure your orders
                arrive safely and on time.
              </Text>
            </Box>
          </Flex>
          {/* Add delivery illustration SVG here */}
        </Group>
      </Paper>
    </Container>
  );
};
