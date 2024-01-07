import { Card, Text, Group } from "@mantine/core";
import classes from "./Style.module.css";
import { FeaturedItem } from "@/types";
import Link from "next/link";

interface Props {
  item: FeaturedItem;
}
export function FeaturedItemCard({ item }: Props) {
  return (
    <Card
      component={Link}
      href={`/services/print/${item.slug}`}
      p="lg"
      shadow="lg"
      className={classes.card}
      radius="md"
    >
      <div
        className={classes.image}
        style={{
          backgroundImage: `url(${item.image})`,
        }}
      />
      <div className={classes.overlay} />
      <div className={classes.content}>
        <div>
          <Text size="lg" className={classes.title} fw={500} lineClamp={1}>
            {item.title}
          </Text>

          <Group justify="space-between" gap="xs">
            <Text size="sm" c="pink.1">
              GHS {item.price}
            </Text>
          </Group>
        </div>
      </div>
    </Card>
  );
}
