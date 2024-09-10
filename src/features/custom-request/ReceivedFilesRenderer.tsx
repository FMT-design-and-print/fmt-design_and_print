import React from "react";
import { useCustomRequest } from ".";
import { bytesToMB } from "@/functions";
import { Group, Pill, Stack, Text } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";

export const ReceivedFilesRenderer = () => {
  const context = useCustomRequest();

  const handleRemoveFile = (file: FileWithPath) => {
    context?.setArtworkFiles((prevState) =>
      prevState.filter((f) => f.name !== file.name)
    );
  };

  return (
    <>
      <Stack>
        <Text c="dimmed" mt="md" size="sm">
          Received Files
        </Text>
        <Group>
          <Pill.Group>
            {context?.artworkFiles.map((file, index) => (
              <Pill
                key={file.name + index}
                withRemoveButton
                onRemove={() => handleRemoveFile(file)}
              >
                {file.name}{" "}
                <Text component="span" fw="bold" size="xs">
                  ({bytesToMB(file.size)})
                </Text>
              </Pill>
            ))}
          </Pill.Group>
        </Group>
      </Stack>
    </>
  );
};
