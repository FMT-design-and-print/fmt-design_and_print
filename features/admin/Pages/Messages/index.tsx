import { IMessage } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { ActionIcon, Box, Group, Paper, Stack, TextInput } from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconArrowLeft, IconSearch } from "@tabler/icons-react";
import { isWithinInterval } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { ComposeMessageModal } from "./components/ComposeMessageModal";
import { MessageDetail } from "./components/MessageDetail";
import { MessageFilters } from "./components/MessageFilters";
import { MessageHeader } from "./components/MessageHeader";
import { MessageList } from "./components/MessageList";
import { MessageGroups } from "./components/MessageGroups";

export default function MessagesPage() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<IMessage | null>(null);
  const [, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [activeGroup, setActiveGroup] = useState<string>("inbox");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const supabase = createClient();

  const fetchMessages = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const messagesWithGroup = data.map((message) => ({
        ...message,
        group: message.group || "inbox",
      }));

      setMessages(messagesWithGroup);
      setUnreadCount(
        messagesWithGroup.filter((m) => m.status === "unread").length
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchMessages();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("messages-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setMessages((prev) => [payload.new as IMessage, ...prev]);
            if ((payload.new as IMessage).status === "unread") {
              setUnreadCount((prev) => prev + 1);
            }
          } else if (payload.eventType === "UPDATE") {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === (payload.new as IMessage).id
                  ? (payload.new as IMessage)
                  : msg
              )
            );
            if (
              (payload.old as IMessage).status !==
              (payload.new as IMessage).status
            ) {
              setUnreadCount((prev) =>
                (payload.new as IMessage).status === "unread"
                  ? prev + 1
                  : prev - 1
              );
            }
          } else if (payload.eventType === "DELETE") {
            setMessages((prev) =>
              prev.filter((msg) => msg.id !== (payload.old as IMessage).id)
            );
            if ((payload.old as IMessage).status === "unread") {
              setUnreadCount((prev) => prev - 1);
            }
            if (selectedMessage?.id === (payload.old as IMessage).id) {
              setSelectedMessage(null);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchMessages, selectedMessage]);

  const handleMessageSelect = async (message: IMessage) => {
    setSelectedMessage(message);
    if (message.status === "unread") {
      try {
        const { error } = await supabase
          .from("messages")
          .update({ status: "read" })
          .eq("id", message.id);

        if (error) throw error;

        // Update local state immediately
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === message.id ? { ...msg, status: "read" } : msg
          )
        );
        setUnreadCount((prev) => prev - 1);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Failed to mark message as read");
      }
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from("messages")
        .delete()
        .eq("id", messageId);

      if (error) throw error;

      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
      toast.success("Message deleted successfully");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const handleDateFilterChange = (
    range: [Date | null, Date | null],
    preset: string | null
  ) => {
    setDateRange(range);
    setSelectedPreset(preset);
  };

  const filteredMessages = useMemo(() => {
    let result = [...messages];

    // Apply group filter
    result = result.filter((message) => message.group === activeGroup);

    // Apply search filter
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      result = result.filter(
        (message) =>
          message.subject.toLowerCase().includes(searchLower) ||
          message.content.toLowerCase().includes(searchLower) ||
          message.source?.toLowerCase().includes(searchLower)
      );
    }

    // Apply date filter
    if (dateRange[0] && dateRange[1]) {
      result = result.filter((message) => {
        const messageDate = new Date(message.created_at);
        return isWithinInterval(messageDate, {
          start: dateRange[0]!,
          end: dateRange[1]!,
        });
      });
    }

    return result;
  }, [messages, debouncedSearch, dateRange, activeGroup]);

  const inboxUnreadCount = useMemo(() => {
    return messages.filter((m) => m.status === "unread" && m.group === "inbox")
      .length;
  }, [messages]);

  return (
    <Box>
      {selectedMessage ? (
        <Paper withBorder p="md">
          <Stack>
            <Group>
              <ActionIcon
                variant="subtle"
                onClick={() => setSelectedMessage(null)}
                title="Back to messages"
                color="pink"
              >
                <IconArrowLeft size="1.2rem" />
              </ActionIcon>
            </Group>
            <MessageDetail message={selectedMessage} />
          </Stack>
        </Paper>
      ) : (
        <Paper withBorder p="md">
          <Stack gap="md">
            <MessageHeader
              unreadCount={inboxUnreadCount}
              onComposeClick={open}
            />

            <MessageGroups
              activeGroup={activeGroup}
              onGroupChange={setActiveGroup}
              unreadCount={inboxUnreadCount}
            />

            <Group grow>
              <MessageFilters
                onDateRangeChange={handleDateFilterChange}
                dateRange={dateRange}
                selectedPreset={selectedPreset}
              />

              <TextInput
                placeholder="Search messages..."
                leftSection={<IconSearch size={16} />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Group>

            <MessageList
              messages={filteredMessages}
              selectedMessage={selectedMessage}
              onMessageSelect={handleMessageSelect}
              onDeleteMessage={handleDeleteMessage}
              loading={loading}
            />
          </Stack>
        </Paper>
      )}

      <ComposeMessageModal
        opened={opened}
        onClose={close}
        onSuccess={() => {
          close();
          fetchMessages();
        }}
      />
    </Box>
  );
}
