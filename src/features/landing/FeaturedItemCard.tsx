import { Card, Text, Group } from "@mantine/core";
import classes from "./Style.module.css";

export function FeaturedItemCard() {
  return (
    <Card p="lg" shadow="lg" className={classes.card} radius="md">
      <div
        className={classes.image}
        style={{
          backgroundImage: "url(/tshirt-mockup.png)",
        }}
      />
      <div className={classes.overlay} />
      <div className={classes.content}>
        <div>
          <Text size="lg" className={classes.title} fw={500}>
            Black T-Shirt Mockup
          </Text>

          <Group justify="space-between" gap="xs">
            <Text size="sm" c="pink.1">
              GHS 40
            </Text>
          </Group>
        </div>
      </div>
    </Card>
  );
}
