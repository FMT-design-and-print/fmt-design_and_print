import { Button, Container, Group, Text, Title } from "@mantine/core";
import Link from "next/link";
import React from "react";
import classes from "./Style.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Success | FMT Design and Print",
};

interface Props {
  searchParams: {
    reference: string;
  };
}

const CustomRequestSuccessPage = ({
  searchParams: { reference: orderId },
}: Props) => {
  return (
    <Container className={classes.wrapper} size={1400}>
      <div className={classes.inner}>
        <Container p={0} size={600} py="xl">
          <Title order={2} ta="center" c="green" mb="lg">
            Custom Request Success!
          </Title>
          <Text ta="center" c="dimmed">
            Thank you for your request. We will reach out to you with a final
            quote shortly. Your request number is <b>#{orderId}</b>.
          </Text>{" "}
          <Group justify="center" mt="xl">
            <Button
              component={Link}
              href={`/order-tracking/${orderId}`}
              size="sm"
              variant="default"
              color="gray"
            >
              Check order status
            </Button>
            <Button
              component={Link}
              href="/custom-request"
              className="btn"
              size="sm"
            >
              Make a new custom request
            </Button>
            <Button
              component={Link}
              href="/services"
              size="sm"
              variant="default"
              color="gray"
            >
              Shop our products
            </Button>
          </Group>
        </Container>
      </div>
    </Container>
  );
};

export default CustomRequestSuccessPage;
