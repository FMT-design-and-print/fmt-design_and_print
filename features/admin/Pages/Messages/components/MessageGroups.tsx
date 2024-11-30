import { Tabs } from "@mantine/core";
import { IconInbox, IconSend } from "@tabler/icons-react";

interface MessageGroupsProps {
  activeGroup: string;
  onGroupChange: (group: string) => void;
  unreadCount: number;
}

// Define message groups - easy to extend in the future
export const MESSAGE_GROUPS = {
  inbox: {
    value: "inbox",
    label: "Inbox",
    icon: IconInbox,
  },
  sent: {
    value: "sent",
    label: "Sent",
    icon: IconSend,
  },
} as const;

export function MessageGroups({
  activeGroup,
  onGroupChange,
  unreadCount,
}: MessageGroupsProps) {
  return (
    <Tabs
      value={activeGroup}
      onChange={(value) => onGroupChange(value as string)}
    >
      <Tabs.List>
        {Object.values(MESSAGE_GROUPS).map((group) => (
          <Tabs.Tab
            key={group.value}
            value={group.value}
            leftSection={<group.icon size="0.9rem" />}
            rightSection={
              group.value === "inbox" && unreadCount > 0 ? (
                <span className="bg-pink-100 text-pink-600 text-xs px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              ) : null
            }
          >
            {group.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  );
}
