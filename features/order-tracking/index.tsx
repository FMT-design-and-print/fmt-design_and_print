"use client";
import { IOrder } from "@/types/order";
import { createClient } from "@/utils/supabase/client";
import { Card } from "@mantine/core";
import { useEffect, useState } from "react";
import { OrderStatus } from "./OrderStatus";
import { Channels } from "@/constants/channels";

interface Props {
  orders: IOrder[];
}
export const OrderStatuses = ({ orders }: Props) => {
  const [newOrders, setNewOrders] = useState(orders);

  useEffect(() => {
    const supabase = createClient();

    const orderChannel = supabase
      .channel(Channels.OrdersUpdate)
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

    const customOrderChannel = supabase
      .channel(Channels.CustomOrdersUpdate)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "custom-orders" },
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
      orderChannel.unsubscribe();
      customOrderChannel.unsubscribe();
    };
  }, []);

  return (
    <>
      {newOrders.map((order) => (
        <Card withBorder key={order.id} my="lg">
          <OrderStatus order={order} />
        </Card>
      ))}
    </>
  );
};
