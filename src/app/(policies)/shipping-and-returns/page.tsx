import React from "react";
import { Container, Text, Divider, Title } from "@mantine/core";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Returns | FMT Design and Print",
};

const ShippingAndReturnsPolicyPage = () => {
  return (
    <Container size="sm">
      <Title order={1} ta="center" my={20}>
        Shipping and Returns Policy
      </Title>
      <Divider style={{ margin: "0 auto 20px" }} />

      <Text size="md" style={{ marginBottom: 20 }}>
        At FMT Design and Print, we want you to be completely satisfied with
        your purchase. This Shipping and Returns Policy outlines our procedures
        for shipping, returns, and exchanges.
      </Text>

      <Text size="lg" fw={700} style={{ marginBottom: 10 }}>
        Shipping Information
      </Text>
      <Text size="md" style={{ marginBottom: 20 }}>
        We offer shipping to addresses within Ghana. Shipping costs and delivery
        times may vary depending on the destination and the size of your order.
        You will receive a shipping confirmation email with tracking information
        once your order has been dispatched.
      </Text>

      <Text size="lg" fw={700} style={{ marginBottom: 10 }}>
        Returns and Exchanges
      </Text>
      <Text size="md" style={{ marginBottom: 20 }}>
        If you are not satisfied with your purchase, you may return or exchange
        the item(s) within 7 days of receipt. To be eligible for a return or
        exchange, the item(s) must be unused, in the same condition as received,
        and in the original packaging. You will be responsible for return
        shipping costs unless the return is due to an error on our part.
      </Text>

      <Text size="md" style={{ marginBottom: 20 }}>
        To initiate a return or exchange, please contact our customer service
        team at support@fmtdesignandprint.com. Once your return is received and
        inspected, we will process your refund or exchange as promptly as
        possible.
      </Text>

      <Text size="lg" fw={700} style={{ marginBottom: 10 }}>
        Damaged or Defective Items
      </Text>
      <Text size="md" style={{ marginBottom: 20 }}>
        If you receive a damaged or defective item, please contact us
        immediately at support@fmtdesignandprint.com. We will arrange for a
        replacement or refund, depending on the nature of the issue.
      </Text>

      <Text size="md" style={{ marginBottom: 20 }}>
        If you have any questions or concerns about our Shipping and Returns
        Policy, please contact us at policy@fmtdesignandprint.com.
      </Text>
    </Container>
  );
};

export default ShippingAndReturnsPolicyPage;
