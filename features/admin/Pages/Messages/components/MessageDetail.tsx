import {
  Stack,
  Text,
  Paper,
  Group,
  Badge,
  JsonInput,
  Button,
  Collapse,
} from "@mantine/core";
import { IMessage } from "@/types";
import { getFormattedDurationFromNow } from "@/functions/durations";
import { useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";

interface MessageDetailProps {
  message: IMessage;
}

export function MessageDetail({ message }: MessageDetailProps) {
  const messageDate = new Date(message.created_at);
  const formattedDate = messageDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  const [isMetadataOpen, setIsMetadataOpen] = useState(false);

  return (
    <Stack gap="md">
      <Group justify="space-between" wrap="nowrap">
        <Text size="xl" fw={500}>
          {message.subject}
        </Text>
        <Badge
          size="sm"
          variant="light"
          color={message.status === "unread" ? "pink" : "gray"}
        >
          {message.status}
        </Badge>
      </Group>

      <Group justify="space-between">
        <Text size="sm" c="dimmed">
          From: {message.source || "System"}
        </Text>
        <Text size="xs" c="dimmed">
          {formattedDate} ({getFormattedDurationFromNow(messageDate)})
        </Text>
      </Group>

      <Paper withBorder p="md">
        <Text>{message.content}</Text>
      </Paper>

      {Object.keys(message.metadata || {}).length > 0 && (
        <Stack gap="xs">
          <Button
            variant="subtle"
            onClick={() => setIsMetadataOpen((prev) => !prev)}
            size="xs"
            leftSection={<IconChevronDown size={12} />}
            color="gray"
          >
            {isMetadataOpen
              ? "Hide Additional Information"
              : "Show Additional Information"}
          </Button>
          <Collapse in={isMetadataOpen}>
            <JsonInput
              value={JSON.stringify(message.metadata, null, 2)}
              readOnly
              autosize
              minRows={4}
              styles={{
                input: {
                  fontSize: "0.8rem",
                  overflowY: "auto",
                },
              }}
            />
          </Collapse>
        </Stack>
      )}
    </Stack>
  );
}
