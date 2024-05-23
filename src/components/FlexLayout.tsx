import { Group, Stack } from "@mantine/core";
import React, { ReactNode } from "react";

export const FlexLayout = ({
  children,
  grow = false,
}: {
  children: ReactNode;
  grow?: boolean;
}) => {
  return (
    <>
      <Group visibleFrom="sm" grow={grow}>
        {children}
      </Group>
      <Stack hiddenFrom="sm">{children}</Stack>
    </>
  );
};
