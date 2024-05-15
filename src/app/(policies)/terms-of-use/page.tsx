import React from "react";
import { Container, Text, Divider, Title } from "@mantine/core";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | FMT Design and Print",
};

const TermsOfUsePage = () => {
  return (
    <Container size="sm">
      <Title order={1} ta="center" my={20}>
        Terms of Use
      </Title>
      <Divider style={{ margin: "0 auto 20px" }} />

      <Text size="md" my={20}>
        Welcome to FMT Design and Print. By accessing our website, you agree to
        comply with these Terms of Use and all applicable laws and regulations.
        If you do not agree with these terms, please do not use our website.
      </Text>

      <Text size="lg" fw={700} my={10}>
        Intellectual Property
      </Text>
      <Text size="md" my={20}>
        All content on this website, including text, graphics, logos, button
        icons, images, audio clips, digital downloads, and data compilations, is
        the property of FMT Design and Print or its content suppliers and is
        protected by international copyright laws.
      </Text>

      <Text size="lg" fw={700} my={10}>
        User Conduct
      </Text>
      <Text size="md" my={20}>
        You agree not to use our website for any unlawful or prohibited purpose.
        You may not use our website in any manner that could damage, disable,
        overburden, or impair the site or interfere with any other party&apos;s
        use and enjoyment of the website.
      </Text>

      <Text size="lg" fw={700} my={10}>
        Governing Law
      </Text>
      <Text size="md" my={20}>
        These Terms of Use shall be governed by and construed in accordance with
        the laws of Ghana. Any dispute arising under these terms shall be
        subject to the exclusive jurisdiction of the courts in Ghana.
      </Text>

      <Text size="md" my={20}>
        If you have any questions or concerns about our Terms of Use, please
        contact us at policy@fmtdesignandprint.com.
      </Text>
    </Container>
  );
};

export default TermsOfUsePage;
