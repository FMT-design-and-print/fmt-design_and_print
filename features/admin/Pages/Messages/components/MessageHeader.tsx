import { Group, Text, Badge, Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

interface MessageHeaderProps {
  unreadCount: number;
  onComposeClick: () => void;
}

export function MessageHeader({
  unreadCount,
  onComposeClick,
}: MessageHeaderProps) {
  return (
    <Group justify="space-between">
      <Group>
        <Text fw={500}>Messages</Text>
        <Badge size="xs" variant="light" color="pink">
          {unreadCount} unread
        </Badge>
      </Group>
      <Button
        leftSection={<IconPlus size="1rem" />}
        size="xs"
        onClick={onComposeClick}
        color="pink"
      >
        Compose
      </Button>
    </Group>
  );
}
