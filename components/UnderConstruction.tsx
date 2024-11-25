"use client";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Carousel } from "@mantine/carousel";
import { Container, Stack, Text, Title } from "@mantine/core";
import Image from "next/image";
import { useMediaQuery } from "@mantine/hooks";

const images = [
  "https://res.cloudinary.com/dnbmynikp/image/upload/v1732527296/Under_construction-bro_sxqqqf.svg",
  "https://res.cloudinary.com/dnbmynikp/image/upload/v1732527296/Under_construction-cuate_namsqi.svg",
  "https://res.cloudinary.com/dnbmynikp/image/upload/v1732527296/Under_construction-pana_rqn6ih.svg",
  "https://res.cloudinary.com/dnbmynikp/image/upload/v1732527296/Under_construction-amico_m6udpq.svg",
];

function SiteUnderConstruction() {
  const autoplay = useRef(Autoplay({ delay: 10000 }));
  const sm = useMediaQuery("(max-width: 36em)");
  const md = useMediaQuery("(max-width: 48em)");

  return (
    <Container
      size="lg"
      py="4rem"
      px={{ base: "1rem", sm: "2rem", md: "4rem" }}
    >
      <Stack align="center">
        <Title order={2} ta="center">
          Website under construction
        </Title>
        <Text c="dimmed" ta="center" size="sm">
          We are currently working on our website. Please check back soon for
          updates.
        </Text>
      </Stack>
      <Carousel
        withIndicators
        height={sm ? 300 : md ? 400 : 600}
        plugins={[autoplay.current]}
        onMouseEnter={autoplay.current.stop}
        onMouseLeave={autoplay.current.reset}
        loop
        align="center"
      >
        {images.map((image) => (
          <Carousel.Slide key={image}>
            <Image src={image} alt="Under Construction" layout="fill" />
          </Carousel.Slide>
        ))}
      </Carousel>
    </Container>
  );
}

export default SiteUnderConstruction;
