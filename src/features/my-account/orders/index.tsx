"use client";
import { NoItemsFound } from "@/components/NoItemsFound";
import { IOrder } from "@/types/order";
import { Box, Button, Title } from "@mantine/core";
import { IconPackage } from "@tabler/icons-react";
import Link from "next/link";
import { OrdersCard } from "./OrdersCard";
import { OrdersTable } from "./OrdersTable";

interface Props {
  orders: IOrder[];
}
export const Orders = ({ orders }: Props) => {
  return (
    <>
      <Title order={3} c="dimmed" mb="md">
        Orders
      </Title>
      {orders.length !== 0 ? (
        <NoItemsFound
          icon={<IconPackage size="6rem" color="var(--primary-300)" />}
          label="You have no orders"
        >
          <Button component={Link} href="/services" className="btn">
            Shop Now
          </Button>
        </NoItemsFound>
      ) : (
        <Box>
          <OrdersTable orders={orders} />
          <OrdersCard orders={orders} />
        </Box>
      )}
    </>
  );
};
