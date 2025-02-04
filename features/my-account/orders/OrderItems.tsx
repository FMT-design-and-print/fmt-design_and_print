"use client";
import { IOrderItem } from "@/types/order";
import { Button, Drawer, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useUser } from "@/hooks/useUser";
import { OrderItem } from "./OrderItem";

interface Props {
  orderId: string;
  items: IOrderItem[];
  btnLabel?: string;
}

export const OrderItems = ({ orderId, items, btnLabel }: Props) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { user } = useUser();

  return (
    <>
      <Drawer
        position="right"
        size="lg"
        opened={opened}
        onClose={close}
        title={<Title order={4}> ORDER: {orderId}</Title>}
      >
        <Title order={5} mb="sm">
          Items
        </Title>
        {items.map((item) => (
          <OrderItem key={item.id} item={item} user={user ?? null} />
        ))}
      </Drawer>

      <Button onClick={open} size="xs" variant="subtle" color="pink">
        {btnLabel || "View"}
      </Button>
    </>
  );
};
