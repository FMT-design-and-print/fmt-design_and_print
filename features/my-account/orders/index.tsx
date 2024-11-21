"use client";
import { NoItemsFound } from "@/components/NoItemsFound";
import { IOrder } from "@/types/order";
import { Box, Button, Title } from "@mantine/core";
import { IconPackage } from "@tabler/icons-react";
import Link from "next/link";
import { OrdersCard } from "./OrdersCard";
import { OrdersTable } from "./OrdersTable";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface Props {
  orders: IOrder[];
}
export const Orders = ({ orders }: Props) => {
  const [newOrders, setNewOrders] = useState(orders);

  useEffect(() => {
    const supabase = createClient();

    const channels = supabase
      .channel("custom-update-channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        (payload) => {
          setNewOrders((prevState) => {
            return prevState.map((obj) => {
              if (obj.id === (payload.new as IOrder).id) {
                return { ...obj, ...payload.new };
              }
              return obj;
            });
          });
        }
      )
      .subscribe();

    return () => {
      channels.unsubscribe();
    };
  }, []);
  return (
    <>
      <Title order={3} c="dimmed" mb="md">
        Orders
      </Title>
      {orders.length === 0 ? (
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
          <OrdersTable orders={newOrders} />
          <OrdersCard orders={newOrders} />
        </Box>
      )}
    </>
  );
};
