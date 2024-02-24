"use client";
import { IOrder } from "@/types/order";
import { createClient } from "@/utils/supabase/client";
import { Card } from "@mantine/core";
import { useEffect, useState } from "react";
import { OrderStatus } from "./OrderStatus";

interface Props {
  orders: IOrder[];
}
export const OrderStatuses = ({ orders }: Props) => {
  const [newOrders, setNewOrders] = useState(orders);

  useEffect(() => {
    const supabase = createClient();

    const channels = supabase
      .channel("custom-update-channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        (payload) => {
          console.log("Change received!", payload);

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
      {newOrders.map((order, i) => (
        <Card withBorder key={order.id} my="lg">
          <OrderStatus order={order} />
        </Card>
      ))}
    </>
  );
};
