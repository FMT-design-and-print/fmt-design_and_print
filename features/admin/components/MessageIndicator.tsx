import { useEffect, useState } from "react";
import { Indicator, ActionIcon, Tooltip } from "@mantine/core";
import { IconMail } from "@tabler/icons-react";
import { createClient } from "@/utils/supabase/client";
import { IMessage } from "@/types";
import { useAdminStore } from "@/store/admin";

export function MessageIndicator() {
  const { setSelectedNavValue } = useAdminStore((state) => state);
  const [unreadCount, setUnreadCount] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    // Initial fetch of unread count
    const fetchUnreadCount = async () => {
      const { count } = await supabase
        .from("messages")
        .select("*", { count: "exact" })
        .eq("status", "unread");

      setUnreadCount(count || 0);
    };

    fetchUnreadCount();

    // Subscribe to new messages
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          if (
            payload.eventType === "INSERT" &&
            payload.new.status === "unread"
          ) {
            setUnreadCount((prev) => prev + 1);
          } else if (
            payload.eventType === "UPDATE" &&
            (payload.old as IMessage).status !==
              (payload.new as IMessage).status
          ) {
            setUnreadCount((prev) =>
              (payload.new as IMessage).status === "unread"
                ? prev + 1
                : prev - 1
            );
          } else if (
            payload.eventType === "DELETE" &&
            (payload.old as IMessage).status === "unread"
          ) {
            setUnreadCount((prev) => Math.max(0, prev - 1));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <Tooltip label={`${unreadCount} unread messages`}>
      <Indicator
        inline
        label={unreadCount > 0 ? unreadCount : undefined}
        size={16}
        disabled={unreadCount === 0}
        color="red"
        withBorder
        onClick={() => setSelectedNavValue("messages")}
      >
        <ActionIcon variant="light" color="pink">
          <IconMail size="1.2rem" />
        </ActionIcon>
      </Indicator>
    </Tooltip>
  );
}
