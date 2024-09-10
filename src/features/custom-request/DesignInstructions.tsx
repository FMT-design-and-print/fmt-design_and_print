"use client";
import { TextEditor } from "@/components/TextEditor";
import { Box, Text } from "@mantine/core";

import { ReactNode } from "react";
import { useCustomRequest } from ".";

interface Props {
  label?: string;
  topLevelNotice?: ReactNode;
  hideDescription?: boolean;
}

export const DesignInstructions = ({
  label,
  topLevelNotice,
  hideDescription = false,
}: Props) => {
  const context = useCustomRequest();

  return (
    <>
      <Text fw="bold" my="lg">
        {label || "Design Instructions"}
      </Text>
      {topLevelNotice && <Box mb="md">{topLevelNotice}</Box>}
      {!hideDescription && (
        <Text size="sm" mb="sm" c="dimmed">
          Please note that additional charges may apply based on the extra
          customization options you provide below.
        </Text>
      )}

      <TextEditor editor={context?.editor} />
    </>
  );
};
