import {
  Stack,
  Text,
  Group,
  ActionIcon,
  Badge,
  Box,
  Modal,
  Button,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { IMessage } from "@/types";
import classes from "./MessageList.module.css";
import { useState } from "react";
import { isToday } from "date-fns";

interface MessageListProps {
  messages: IMessage[];
  selectedMessage: IMessage | null;
  onMessageSelect: (message: IMessage) => void;
  onDeleteMessage: (messageId: string) => void;
  loading: boolean;
}

function formatMessageDate(dateString: string) {
  const date = new Date(dateString);

  if (isToday(date)) {
    return date
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .toUpperCase();
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function MessageList({
  messages,
  selectedMessage,
  onMessageSelect,
  onDeleteMessage,
  loading,
}: MessageListProps) {
  const [messageToDelete, setMessageToDelete] = useState<IMessage | null>(null);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const handleDeleteClick = (e: React.MouseEvent, message: IMessage) => {
    e.stopPropagation();
    setMessageToDelete(message);
  };

  const handleConfirmDelete = () => {
    if (messageToDelete) {
      onDeleteMessage(messageToDelete.id);
      setMessageToDelete(null);
    }
  };

  return (
    <>
      <Box className={classes.container}>
        <Stack gap="xs">
          {messages.length === 0 ? (
            <Text c="dimmed" ta="center" py="xl">
              No messages found
            </Text>
          ) : (
            messages.map((message) => (
              <Box
                key={message.id}
                className={`${classes.messageItem} ${
                  selectedMessage?.id === message.id ? classes.selected : ""
                } ${message.status === "unread" ? classes.unread : ""}`}
                onClick={() => onMessageSelect(message)}
              >
                <Group justify="space-between" wrap="nowrap">
                  <Box className={classes.messageContent}>
                    <Group gap="xs" wrap="nowrap">
                      <Text
                        size="sm"
                        fw={message.status === "unread" ? 700 : 400}
                        truncate
                        className={classes.subject}
                      >
                        {message.subject}
                      </Text>
                      {message.status === "unread" && (
                        <Badge size="xs" color="pink" variant="light">
                          Unread
                        </Badge>
                      )}
                    </Group>
                    <Text
                      size="xs"
                      c={message.status === "unread" ? "dark" : "dimmed"}
                      truncate
                      className={classes.preview}
                    >
                      {message.content}
                    </Text>
                  </Box>
                  <Group
                    gap={8}
                    wrap="nowrap"
                    align="center"
                    className={classes.actions}
                  >
                    <Text size="xs" c="dimmed" className={classes.date}>
                      {formatMessageDate(
                        new Date(message.created_at).toISOString()
                      )}
                    </Text>
                    <ActionIcon
                      color="red"
                      variant="light"
                      size="sm"
                      className={classes.deleteButton}
                      onClick={(e) => handleDeleteClick(e, message)}
                    >
                      <IconTrash size="1rem" />
                    </ActionIcon>
                  </Group>
                </Group>
              </Box>
            ))
          )}
        </Stack>
      </Box>

      <Modal
        opened={!!messageToDelete}
        onClose={() => setMessageToDelete(null)}
        title="Delete Message"
        size="sm"
      >
        <Stack>
          <Text size="sm">
            Are you sure you want to delete this message?
            {messageToDelete && (
              <Text component="span" fw={500} mt="xs">
                {messageToDelete.subject}
              </Text>
            )}
          </Text>
          <Group justify="flex-end" mt="md">
            <Button
              variant="light"
              color="gray"
              onClick={() => setMessageToDelete(null)}
            >
              Cancel
            </Button>
            <Button color="red" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
