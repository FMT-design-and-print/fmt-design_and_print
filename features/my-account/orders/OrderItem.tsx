import { CopyIcon } from "@/components/CopyIcon";
import { IOrderItem } from "@/types/order";
import { Avatar, Card, Group, Text } from "@mantine/core";

interface Props {
  item: IOrderItem;
}

export const OrderItem = ({ item }: Props) => {
  return (
    <Card withBorder my="sm">
      <Group gap="sm" wrap="nowrap">
        <Avatar size="lg" src={item.image} radius="xs" />

        <div>
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
                GHS {item.price * item.quantity}
              </Text>
            </Group>
          </Group>
        </div>
      </Group>
    </Card>
  );
};
