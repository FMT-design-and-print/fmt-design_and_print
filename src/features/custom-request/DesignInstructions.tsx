"use client";
import { TextEditor } from "@/components/TextEditor";
import { Box, Text } from "@mantine/core";

import { ReactNode } from "react";

interface Props {
  topLevelNotice?: ReactNode;
}

export const DesignInstructions = ({ topLevelNotice }: Props) => {
  return (
    <>
      <Text fw="bold" my="lg">
        Design Instruction
      </Text>
      {topLevelNotice && <Box mb="md">{topLevelNotice}</Box>}
      <Text size="sm" mb="sm" c="dimmed">
        Please note that additional charges may apply based on the customization
        options you provide below. You can use example in the editor as a guide.
      </Text>

      <TextEditor />
    </>
  );
};
