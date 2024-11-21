import { Title, Text, Button, Container, Group } from "@mantine/core";
import classes from "./HeroText.module.css";
import Link from "next/link";

interface Props {
  orderId: string;
}

export function OrderSuccessHero({ orderId }: Props) {
  return (
    <Container className={classes.wrapper} size={1400}>
      <div className={classes.inner}>
        <Container p={0} size={600} py="xl">
          <Title order={2} ta="center" c="green" mb="lg">
            Order Success!
          </Title>
          <Text ta="center" c="dimmed">
            Thank you for your order. Your payment has been successfully
            processed and your order number is #{orderId}.
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
            <Button component={Link} href="/services" className="btn" size="sm">
              Continue Shopping
            </Button>
          </Group>
        </Container>
      </div>
    </Container>
  );
}
