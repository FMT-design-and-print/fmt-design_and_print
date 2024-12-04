import { bytesToMB } from "@/functions";
import { Group, Pill, Stack, Text } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";

interface ReceivedFilesRendererProps {
  files: FileWithPath[];
  onRemove?: (file: FileWithPath) => void;
  title?: string;
  renderFile?: (file: FileWithPath) => React.ReactNode;
}

export const ReceivedFilesRenderer = ({
  files,
  onRemove,
  title = "Received Files",
  renderFile,
}: ReceivedFilesRendererProps) => {
  const defaultRenderFile = (file: FileWithPath) => (
    <Pill
      key={file.name}
      withRemoveButton={!!onRemove}
      onRemove={onRemove ? () => onRemove(file) : undefined}
    >
      {file.name}{" "}
      <Text component="span" fw="bold" size="xs">
        ({bytesToMB(file.size)})
      </Text>
    </Pill>
  );

  return (
    <Stack>
      <Text c="dimmed" mt="md" size="sm">
        {title}
      </Text>
      <Group>
        <Pill.Group>
          {files.map((file) => renderFile?.(file) ?? defaultRenderFile(file))}
        </Pill.Group>
      </Group>
    </Stack>
  );
};
