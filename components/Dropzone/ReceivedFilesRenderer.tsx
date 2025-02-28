import { bytesToMB } from "@/functions";
import {
  Group,
  Stack,
  Text,
  Image,
  Box,
  rem,
  Paper,
  ActionIcon,
  Modal,
  UnstyledButton,
} from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import {
  IconFileTypePdf,
  IconFileVector,
  IconFileDescription,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";

export interface SerializedFile {
  url: string;
  name: string;
  size: number;
  type: string;
}

interface ReceivedFilesRendererProps {
  files: (FileWithPath | SerializedFile)[];
  onRemove?: (file: FileWithPath | SerializedFile) => void;
  title?: string;
  renderFile?: (file: FileWithPath | SerializedFile) => React.ReactNode;
  requireOneFile?: boolean;
}

export const ReceivedFilesRenderer = ({
  files,
  onRemove,
  title = "Received Files",
  renderFile,
  requireOneFile = false,
}: ReceivedFilesRendererProps) => {
  const [previewFile, setPreviewFile] = useState<
    FileWithPath | SerializedFile | null
  >(null);

  const isSerializedFile = (
    file: FileWithPath | SerializedFile
  ): file is SerializedFile => {
    return "url" in file;
  };

  const getFileUrl = (file: FileWithPath | SerializedFile) => {
    return isSerializedFile(file) ? file.url : URL.createObjectURL(file);
  };

  const defaultRenderFile = (file: FileWithPath | SerializedFile) => {
    const fileType = isSerializedFile(file) ? file.type : file.type;
    const isImage = fileType.startsWith("image/") && !fileType.includes("svg");
    const isPDF = fileType === "application/pdf";
    const isSVG = fileType === "image/svg+xml";
    const isAI = fileType === "application/illustrator";
    const isEPS = fileType === "application/postscript";
    const isVector = isSVG || isAI || isEPS;

    const getFileIcon = () => {
      if (isImage || isSVG) {
        return (
          <UnstyledButton
            onClick={(e) => {
              e.stopPropagation();
              setPreviewFile(file);
            }}
            style={{
              cursor: "pointer",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ":hover": {
                opacity: 0.8,
              },
            }}
          >
            <Image
              src={getFileUrl(file)}
              alt={isSerializedFile(file) ? file.name : file.name}
              fit="cover"
              w={rem(40)}
              h={rem(40)}
            />
          </UnstyledButton>
        );
      }
      if (isPDF) {
        return (
          <UnstyledButton
            onClick={(e) => {
              e.stopPropagation();
              setPreviewFile(file);
            }}
            style={{
              cursor: "pointer",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ":hover": {
                opacity: 0.8,
              },
            }}
          >
            <IconFileTypePdf size={rem(24)} color="#e94444" />
          </UnstyledButton>
        );
      }
      if (isVector) return <IconFileVector size={rem(24)} color="#ffb020" />;
      return <IconFileDescription size={rem(24)} color="#228be6" />;
    };

    return (
      <Paper
        key={isSerializedFile(file) ? file.name : file.name}
        shadow="xs"
        p="xs"
        withBorder
        className="w-full lg:w-[250px]"
      >
        <Group justify="space-between" wrap="nowrap">
          <Group gap="sm" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
            <Box
              style={{
                width: rem(40),
                height: rem(40),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isImage || isSVG ? "transparent" : "#f8f9fa",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              {getFileIcon()}
            </Box>
            <Box style={{ minWidth: 0 }}>
              <Text
                size="sm"
                lineClamp={1}
                style={{ wordBreak: "break-all" }}
                title={isSerializedFile(file) ? file.name : file.name}
              >
                {isSerializedFile(file) ? file.name : file.name}
              </Text>
              <Text size="xs" c="dimmed">
                {bytesToMB(isSerializedFile(file) ? file.size : file.size)}
              </Text>
            </Box>
          </Group>
          {onRemove && (!requireOneFile || files.length > 1) && (
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={() => onRemove(file)}
              ml="xs"
            >
              <IconX size={rem(16)} />
            </ActionIcon>
          )}
        </Group>
      </Paper>
    );
  };

  const renderPreview = () => {
    if (!previewFile) return null;

    const fileType = isSerializedFile(previewFile)
      ? previewFile.type
      : previewFile.type;
    const isPDF = fileType === "application/pdf";

    if (isPDF) {
      return (
        <Box style={{ width: "100%", height: "80vh" }}>
          <iframe
            src={getFileUrl(previewFile) + "#toolbar=0"}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              background: "white",
            }}
            title={
              isSerializedFile(previewFile)
                ? previewFile.name
                : previewFile.name
            }
          />
        </Box>
      );
    }

    return (
      <Box style={{ background: "white", padding: "20px" }}>
        <Image
          src={getFileUrl(previewFile)}
          alt={
            isSerializedFile(previewFile) ? previewFile.name : previewFile.name
          }
          fit="contain"
          style={{ maxWidth: "100%", maxHeight: "80vh" }}
        />
      </Box>
    );
  };

  return (
    <Stack>
      <Text c="dimmed" mt="md" size="sm">
        {title}
      </Text>
      <Group gap="xs" align="flex-start">
        {files.map((file) => renderFile?.(file) ?? defaultRenderFile(file))}
      </Group>

      <Modal
        opened={!!previewFile}
        onClose={() => setPreviewFile(null)}
        size="xl"
        padding="xs"
        title={previewFile?.name}
      >
        {renderPreview()}
      </Modal>
    </Stack>
  );
};
