"use client";
import { CopyIcon } from "@/components/CopyIcon";
import { IOrderItem } from "@/types/order";
import { Avatar, Card, Group, Text, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { RatingModal } from "@/features/ratings/RatingModal";
import { IUserDetails } from "@/types/user";
import { CURRENCY_SYMBOL } from "@/features/admin/PriceCalculator/constants";

interface Props {
  item: IOrderItem;
  user: IUserDetails | null;
  orderId: string;
}

export const OrderItem = ({ item, user, orderId }: Props) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Card withBorder my="sm">
        <Group gap="sm" wrap="nowrap">
          <Avatar size="lg" src={item.image} radius="xs" />

          <div style={{ flex: 1 }}>
            {item.productNumber && (
              <Group gap={2} fz="xs" c="dimmed">
                #{item.productNumber}
                <CopyIcon value={item.productNumber || ""} />
              </Group>
            )}
            <Text fz="sm" fw={500} lineClamp={2} mb="xs">
              {item.title}
            </Text>
            <Group>
              <Group gap="5px">
                <Text fz="xs" c="dimmed">
                  Color:
                </Text>
                <Avatar src={item.color?.image} size="xs" />
              </Group>
              {item.size && (
                <Group>
                  <Text fz="xs" c="dimmed">
                    Size:
                  </Text>
                  <Text fz="xs" fw={500}>
                    {item.size}
                  </Text>
                </Group>
              )}

              <Group>
                <Text fz="xs" c="dimmed">
                  Quantity:
                </Text>
                <Text fz="xs" fw={500}>
                  {item.quantity}
                </Text>
              </Group>

              <Group>
                <Text fz="xs" c="dimmed">
                  Price:
                </Text>
                <Text fz="xs" fw={500}>
                  {CURRENCY_SYMBOL} {item.price * item.quantity}
                </Text>
              </Group>
            </Group>
          </div>

          <Button variant="light" color="pink" size="xs" onClick={open}>
            Rate Product
          </Button>
        </Group>
      </Card>

      <RatingModal
        productId={item.id}
        user={user}
        opened={opened}
        onClose={close}
        orderId={orderId}
      />
    </>
  );
};
