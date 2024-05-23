import React from "react";
import { Container, Text, Divider, Title } from "@mantine/core";
import { Metadata } from "next";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";

export const metadata: Metadata = {
  title: "Privacy Policy | FMT Design and Print",
};

const PrivacyPolicyPage = async () => {
  await redirectAdminUser();

  return (
    <Container size="sm">
      <Title order={1} ta="center" my={20}>
        Privacy Policy
      </Title>
      <Divider style={{ margin: "0 auto 20px" }} />

      <Text size="md" style={{ marginBottom: 20 }}>
        At FMT Design and Print, we are committed to protecting your privacy and
        ensuring the security of your personal information. This Privacy Policy
        outlines how we collect, use, and protect the information you provide to
        us.
      </Text>

      <Text size="lg" fw={700} style={{ marginBottom: 10 }}>
        Information We Collect
      </Text>
      <Text size="md" style={{ marginBottom: 20 }}>
        When you use our platform or services, we may collect personal
        information such as your name, email address, shipping address, and
        payment details. We may also collect non-personal information such as
        your IP address, browser type, and device information.
      </Text>

      <Text size="lg" fw={700} style={{ marginBottom: 10 }}>
        How We Use Your Information
      </Text>
      <Text size="md" style={{ marginBottom: 20 }}>
        We use the information we collect to process your orders, communicate
        with you about your orders, and improve our services. Your personal
        information may also be used for marketing purposes, such as sending you
        promotional offers or newsletters. We do not sell or share your personal
        information with third parties for their marketing purposes.
      </Text>

      <Text size="lg" fw={700} style={{ marginBottom: 10 }}>
        Data Security
      </Text>
      <Text size="md" style={{ marginBottom: 20 }}>
        We take the security of your personal information seriously and
        implement measures to protect it from unauthorized access, alteration,
        or disclosure. However, no method of transmission over the internet or
        electronic storage is 100% secure, so we cannot guarantee absolute
        security.
      </Text>

      <Text size="lg" fw={700} style={{ marginBottom: 10 }}>
        Your Choices
      </Text>
      <Text size="md" style={{ marginBottom: 20 }}>
        You have the right to access, update, or delete your personal
        information at any time. You may also opt-out of receiving marketing
        communications from us by following the unsubscribe instructions
        included in our emails.
      </Text>

      <Text size="lg" fw={700} style={{ marginBottom: 10 }}>
        Changes to This Policy
      </Text>
      <Text size="md" style={{ marginBottom: 20 }}>
        We reserve the right to update or change this Privacy Policy at any
        time. Any changes will be effective immediately upon posting the revised
        policy on our website. We encourage you to review this Privacy Policy
        periodically for any updates.
      </Text>

      <Text size="md" style={{ marginBottom: 20 }}>
        If you have any questions or concerns about our Privacy Policy, please
        contact us at privacy@fmtdesignandprint.com.
      </Text>
    </Container>
  );
};

export default PrivacyPolicyPage;
