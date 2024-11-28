import { ActionIcon, Group, Stack } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { ReactNode, useEffect, useState, memo } from "react";
import isEqual from "lodash/isEqual";

type Props = {
  children: ReactNode;
  initialValue: unknown;
  currentValue: unknown;
  onSave: () => void;
  onDiscard: () => void;
  style?: React.CSSProperties;
};

export const EditableItem = memo(function EditableItem({
  children,
  initialValue,
  currentValue,
  onSave,
  onDiscard,
  style,
}: Props) {
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const changed = !isEqual(initialValue, currentValue);
    if (hasChanges !== changed) {
      setHasChanges(changed);
    }
  }, [initialValue, currentValue, hasChanges]);

  return (
    <Stack gap="xs">
      <Group style={style}>{children}</Group>
      <Group
        gap="xs"
        justify="flex-end"
        style={{
          height: 28, // Height of ActionIcon
          opacity: hasChanges ? 1 : 0,
          transition: "opacity 0.2s ease",
          pointerEvents: hasChanges ? "auto" : "none",
        }}
      >
        <ActionIcon
          color="green"
          variant="light"
          onClick={onSave}
          title="Save changes"
        >
          <IconCheck size={18} />
        </ActionIcon>
        <ActionIcon
          color="red"
          variant="light"
          onClick={onDiscard}
          title="Discard changes"
        >
          <IconX size={18} />
        </ActionIcon>
      </Group>
    </Stack>
  );
});
