import { PageHero } from "@/components/PageHero";
import { Container, Text, Title } from "@mantine/core";
import { WhatWeOffer } from "./WhatWeOffer";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About US| FMT Design and Print",
};

const AboutUsPage = () => {
  return (
    <>
      <PageHero
        title="About Us"
        description=" At FMT Design and Print, we're passionate about providing
        high-quality custom printing solutions to elevate your style and express
        your unique identity. With a focus on creativity, craftsmanship, and
        customer satisfaction, we strive to offer a diverse range of
        personalized products that inspire individuality and make every moment
        memorable."
      />
      <Container size={800} py="xl" my="xl">
        <Title>Our Mission</Title>

        <Text c="dimmed" mt="lg">
          Our mission is simple: to empower you to create and celebrate your
          personal style through customized products that reflect your
          personality, passions, and preferences. We believe that
          self-expression is a form of art, and our goal is to provide you with
          the tools and opportunities to express yourself authentically, whether
          it&apos;s through custom apparel, accessories, or home decor.
        </Text>
      </Container>

      <WhatWeOffer />

      <Container size={800} py="xl" my="xl">
        <Title>Get in Touch</Title>

        <Text c="dimmed" mt="lg">
          Have a question or need assistance with your order? Our friendly and
          knowledgeable customer service team is here to help! Contact us{" "}
          <Link href="/contact-us" className="text-primary-400">
            here
          </Link>{" "}
          and we&apos;ll be happy to assist you.
          <br />
          Thank you for choosing FMT Design and Print for your custom printing
          needs. We look forward to helping you create something truly unique!
        </Text>
      </Container>
    </>
  );
};

export default AboutUsPage;
