import {
  Box,
  Button,
  Group,
  Image,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconDownload, IconEye, IconPhoto } from "@tabler/icons-react";

interface ArtworkFile {
  url: string;
  name: string;
  size: number;
  type: string;
}

interface ArtworkFilesProps {
  artworkFiles?: ArtworkFile[];
  artworkFilesMap?: Record<string, ArtworkFile[]>;
}

export const ArtworkFiles = ({
  artworkFiles,
  artworkFilesMap,
}: ArtworkFilesProps) => {
  // Helper function to format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Helper function to handle file download
  const handleDownload = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Helper function to open file in new tab
  const handlePreview = (url: string) => {
    window.open(url, "_blank");
  };

  // If we have a map of files, display them grouped by label
  if (artworkFilesMap && Object.keys(artworkFilesMap).length > 0) {
    return (
      <Box>
        <Title order={5} mb="md">
          Artwork Files
        </Title>
        {Object.entries(artworkFilesMap).map(([label, files]) => (
          <Box key={label} mb="lg">
            <Text fw="bold" mb="xs">
              {label}
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
              {files.map((file, index) => (
                <Paper key={index} p="md" withBorder>
                  <Box mb="sm">
                    {file.type.startsWith("image/") ? (
                      <Image
                        src={file.url}
                        alt={file.name}
                        height={120}
                        fit="contain"
                      />
                    ) : (
                      <Box
                        h={120}
                        bg="gray.1"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <IconPhoto size={48} color="gray" />
                      </Box>
                    )}
                  </Box>
                  <Text size="sm" lineClamp={1} mb="xs" title={file.name}>
                    {file.name}
                  </Text>
                  <Text size="xs" c="dimmed" mb="sm">
                    {formatFileSize(file.size)}
                  </Text>
                  <Stack gap="xs">
                    <Button
                      size="xs"
                      variant="light"
                      leftSection={<IconEye size={14} />}
                      onClick={() => handlePreview(file.url)}
                    >
                      Preview
                    </Button>
                    <Button
                      size="xs"
                      variant="light"
                      leftSection={<IconDownload size={14} />}
                      onClick={() => handleDownload(file.url, file.name)}
                    >
                      Download
                    </Button>
                  </Stack>
                </Paper>
              ))}
            </SimpleGrid>
          </Box>
        ))}
      </Box>
    );
  }

  // If we only have a flat list of files
  if (artworkFiles && artworkFiles.length > 0) {
    return (
      <Box>
        <Title order={5} mb="md">
          Artwork Files
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
          {artworkFiles.map((file, index) => (
            <Paper key={index} p="md" withBorder>
              <Box mb="sm">
                {file.type.startsWith("image/") ? (
                  <Image
                    src={file.url}
                    alt={file.name}
                    height={120}
                    fit="contain"
                  />
                ) : (
                  <Box
                    h={120}
                    bg="gray.1"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconPhoto size={48} color="gray" />
                  </Box>
                )}
              </Box>
              <Text size="sm" lineClamp={1} mb="xs" title={file.name}>
                {file.name}
              </Text>
              <Text size="xs" c="dimmed" mb="sm">
                {formatFileSize(file.size)}
              </Text>
              <Group grow>
                <Button
                  size="xs"
                  variant="light"
                  leftSection={<IconEye size={14} />}
                  onClick={() => handlePreview(file.url)}
                >
                  Preview
                </Button>
                <Button
                  size="xs"
                  variant="light"
                  leftSection={<IconDownload size={14} />}
                  onClick={() => handleDownload(file.url, file.name)}
                >
                  Download
                </Button>
              </Group>
            </Paper>
          ))}
        </SimpleGrid>
      </Box>
    );
  }

  return null;
};
