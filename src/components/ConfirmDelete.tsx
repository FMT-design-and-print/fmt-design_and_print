import { Popover } from "@mantine/core";
import { ReactNode } from "react";

interface Props {
  trigger: ReactNode;
  children: ReactNode;
  opened?: boolean;
  onChange?: (opened: boolean) => void;
}

export function ConfirmDelete({ trigger, children, opened, onChange }: Props) {
  return (
    <Popover
      width={200}
      position="bottom"
      withArrow
      shadow="md"
      opened={opened}
      onChange={onChange}
    >
      <Popover.Target>{trigger}</Popover.Target>
      <Popover.Dropdown>{children}</Popover.Dropdown>
    </Popover>
  );
}
