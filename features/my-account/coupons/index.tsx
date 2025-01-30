"use client";
import { NoItemsFound } from "@/components/NoItemsFound";
import { Container, Title } from "@mantine/core";
import { IconTicket } from "@tabler/icons-react";

interface Props {
  coupons: any[];
}
export const Coupons = ({ coupons }: Props) => {
  return (
    <Container size="lg">
      <Title order={3} c="dimmed" mb="md">
        Coupons
      </Title>

      {coupons.length === 0 ? (
        <NoItemsFound
          label="You have no coupons available"
          icon={<IconTicket size="6rem" color="var(--primary-300)" />}
        />
      ) : (
        <>{/* coupon list */}</>
      )}
    </Container>
  );
};
