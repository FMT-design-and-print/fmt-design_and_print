"use client";
import { IOrderItem } from "@/types/order";
import { Button, Drawer, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useUser } from "@/hooks/useUser";
import { OrderItem } from "./OrderItem";

interface Props {
  orderId: string;
  orderNumber: string;
  items: IOrderItem[];
  btnLabel?: string;
}

export const OrderItems = ({
  orderId,
  orderNumber,
  items,
  btnLabel,
}: Props) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { user } = useUser();

  return (
    <>
      <Drawer
        position="right"
        size="lg"
        opened={opened}
        onClose={close}
        title={<Title order={4}> ORDER: {orderNumber}</Title>}
      >
        <Title order={5} mb="sm">
          Items
        </Title>
        {items.map((item) => (
          <OrderItem
            key={item.id}
            item={item}
            user={user ?? null}
            orderId={orderId}
          />
        ))}
      </Drawer>

      <Button onClick={open} size="xs" variant="subtle" color="pink">
        {btnLabel || "View"}
      </Button>
    </>
  );
};
