import { bytesToMB } from "@/functions";
import { Button, Card, Group, Text } from "@mantine/core";
import { FileRejection } from "@mantine/dropzone";
import React from "react";

interface Props {
  rejectedFiles: FileRejection[];
  handleClear: () => void;
}

export const RejectedFilesMessages = ({
  rejectedFiles,
  handleClear,
}: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatFileError = (error: any) => {
    switch (error.code) {
      case "file-too-large":
        return `File is too large. Max file size is 10MB`;
      case "too-many-files":
        return `You can only upload up to 5 files`;
      default:
        return error.message;
    }
  };

  return (
    <>
      <Group>
        <Text c="dimmed" my="sm" size="sm">
          Rejected Files
        </Text>
        <Button size="xs" variant="subtle" color="gray" onClick={handleClear}>
          Clear
        </Button>
      </Group>

      {rejectedFiles.map((rejectedFile, i) => (
        <Card key={rejectedFile.file.name + i} withBorder mb="xs">
          <Text size="sm" c="red" mb="xs">
            {rejectedFile.file.name}{" "}
            <Text component="span" fw="bolder">
              {" "}
              ({bytesToMB(rejectedFile.file.size)})
            </Text>
          </Text>
          {rejectedFile.errors.map((error, index) => (
            <Text ml="md" c="dimmed" size="xs" key={error.code + index}>
              {formatFileError(error)}
            </Text>
          ))}
        </Card>
      ))}
    </>
  );
};
