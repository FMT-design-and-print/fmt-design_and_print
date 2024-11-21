import { useFavorites } from "@/store/favorites";
import { IFavoriteItem } from "@/types";
import { ActionIcon, Avatar, Button, Card, Group, Text } from "@mantine/core";
import { IconHeartFilled, IconHeartX } from "@tabler/icons-react";
import Link from "next/link";

interface Props {
  item: IFavoriteItem;
}

export const FavoriteCard = ({ item }: Props) => {
  const { removeItem } = useFavorites();

  return (
    <Card key={item.id} withBorder my="sm">
      <Group gap="sm" wrap="nowrap">
        <Link href={`/services/print/${item.id}`}>
          <Avatar size="100px" src={item.image} radius="xs" />
        </Link>

        <div style={{ flex: 1 }}>
          <Text
            component={Link}
            href={`/services/print/${item.id}`}
            fz="md"
            fw={500}
            lineClamp={2}
            mb="xs"
          >
            {item.title}
          </Text>
          <Group justify="space-between">
            <Text fz="lg" fw={600}>
              GHS {item.price}
            </Text>

            <Group>
              <Button
                onClick={() => removeItem(item.id)}
                variant="outline"
                color="gray"
                size="compact-sm"
                leftSection={<IconHeartX size="1rem" />}
                visibleFrom="sm"
              >
                <Text size="xs" component="span">
                  Remove
                </Text>
              </Button>

              <ActionIcon
                onClick={() => removeItem(item.id)}
                hiddenFrom="sm"
                color="pink"
                variant="transparent"
              >
                <IconHeartFilled />
              </ActionIcon>

              <Button
                component={Link}
                href={`/services/print/${item.id}`}
                className="btn"
                size="compact-sm"
              >
                <Text size="xs" component="span">
                  Buy Now
                </Text>
              </Button>
            </Group>
          </Group>
        </div>
      </Group>
    </Card>
  );
};
