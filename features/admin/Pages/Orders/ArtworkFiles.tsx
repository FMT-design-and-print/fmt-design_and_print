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
  Modal,
  ActionIcon,
  Tooltip,
  Loader,
  Badge,
} from "@mantine/core";
import { IconDownload, IconEye, IconTrash } from "@tabler/icons-react";
import { createClient } from "@/utils/supabase/client";
import { storageBucketName } from "@/constants";
import { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import {
  isStoragePath,
  getFileTypeInfo,
  isFileDeleted,
} from "@/utils/file-helpers";
import { FileIcon } from "@/components/FileIcons";

interface ArtworkFile {
  url: string;
  name: string;
  size: number;
  type: string;
  isDeleted?: boolean;
}

interface ArtworkFilesProps {
  artworkFiles?: ArtworkFile[];
  artworkFilesMap?: Record<string, ArtworkFile[]>;
  // orderId might be used in future implementations for batch operations or analytics
  orderId?: string;
  // Callback when a file is deleted, with details about the deleted file
  onFileDeleted?: (fileInfo: {
    filePath: string;
    fileName: string;
    fileType: string;
    isInMap: boolean;
    mapLabel?: string;
    index: number;
  }) => void;
}

export const ArtworkFiles = ({
  artworkFiles,
  artworkFilesMap,
  orderId,
  onFileDeleted,
}: ArtworkFilesProps) => {
  const [loadingFiles, setLoadingFiles] = useState<Record<string, boolean>>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFileType, setPreviewFileType] = useState<string>("");
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteConfirmFile, setDeleteConfirmFile] = useState<{
    path: string;
    name: string;
    index: number;
    label?: string;
  } | null>(null);
  const [deleteOpened, { open: openDeleteModal, close: closeDeleteModal }] =
    useDisclosure(false);
  const [localArtworkFiles, setLocalArtworkFiles] = useState<
    ArtworkFile[] | undefined
  >(artworkFiles);
  const [localArtworkFilesMap, setLocalArtworkFilesMap] = useState<
    Record<string, ArtworkFile[]> | undefined
  >(artworkFilesMap);

  // State for thumbnails
  const [thumbnails, setThumbnails] = useState<Record<string, string | null>>(
    {}
  );
  const [loadingThumbnails, setLoadingThumbnails] = useState<
    Record<string, boolean>
  >({});

  // Update local state when props change
  useEffect(() => {
    setLocalArtworkFiles(artworkFiles);
    setLocalArtworkFilesMap(artworkFilesMap);
  }, [artworkFiles, artworkFilesMap]);

  // Log the order ID for tracking purposes
  useEffect(() => {
    if (orderId) {
      console.log(`Viewing artwork files for order: ${orderId}`);
    }
  }, [orderId]);

  // Helper function to get a signed URL from Supabase
  const getSignedUrl = async (filePath: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.storage
        .from(storageBucketName)
        .createSignedUrl(filePath, 60);

      if (error) {
        notifications.show({
          title: "Error",
          message: `Could not generate download link: ${error.message}`,
          color: "red",
        });
        console.error("Error creating signed URL:", error.message);
        return null;
      }

      return data?.signedUrl;
    } catch (err) {
      console.error("Unexpected error:", err);
      return null;
    }
  };

  // Helper function to get thumbnail URL for a file
  const getThumbnailUrl = async (file: ArtworkFile): Promise<string | null> => {
    // If the file is deleted, return null
    if (isFileDeleted(file)) {
      return null;
    }

    // If it's a data URL, return it directly
    if (!isStoragePath(file.url)) {
      return file.url;
    }

    // If it's an image or SVG, get a signed URL
    const { isImage, isSVG } = getFileTypeInfo(file.type);
    if (isImage || isSVG) {
      return await getSignedUrl(file.url);
    }

    return null;
  };

  // Helper function to handle file download
  const handleDownload = async (filePath: string, filename: string) => {
    setLoadingFiles((prev) => ({ ...prev, [filePath]: true }));

    try {
      // If it's a storage path, get a signed URL
      if (isStoragePath(filePath)) {
        const signedUrl = await getSignedUrl(filePath);

        if (signedUrl) {
          const response = await fetch(signedUrl);
          const blob = await response.blob();
          saveAs(blob, filename);
        }
      } else {
        // If it's a data URL or full URL, download directly
        const a = document.createElement("a");
        a.href = filePath;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Download error:", error);
      notifications.show({
        title: "Download Failed",
        message: "There was an error downloading the file. Please try again.",
        color: "red",
      });
    } finally {
      setLoadingFiles((prev) => ({ ...prev, [filePath]: false }));
    }
  };

  // Helper function to preview file
  const handlePreview = async (filePath: string, fileType: string) => {
    setLoadingFiles((prev) => ({ ...prev, [filePath]: true }));

    try {
      // If it's a storage path, get a signed URL
      if (isStoragePath(filePath)) {
        const signedUrl = await getSignedUrl(filePath);

        if (signedUrl) {
          // Store both the URL and the file type for the preview
          setPreviewUrl(signedUrl);
          // Store the file type for proper preview rendering
          setPreviewFileType(fileType);
          open();
        }
      } else {
        // If it's a data URL or full URL, preview directly
        setPreviewUrl(filePath);
        setPreviewFileType(fileType);
        open();
      }
    } catch (error) {
      console.error("Preview error:", error);
      notifications.show({
        title: "Preview Failed",
        message: "There was an error previewing the file. Please try again.",
        color: "red",
      });
    } finally {
      setLoadingFiles((prev) => ({ ...prev, [filePath]: false }));
    }
  };

  // Helper function to delete file
  const handleDelete = async (
    filePath: string,
    index: number,
    label?: string
  ) => {
    setLoadingFiles((prev) => ({ ...prev, [filePath]: true }));

    try {
      // Only attempt to delete if it's a storage path
      if (isStoragePath(filePath)) {
        const supabase = createClient();

        // Delete the file using the original path
        const { error } = await supabase.storage
          .from(storageBucketName)
          .remove([filePath]);

        if (error) {
          notifications.show({
            title: "Warning",
            message: `Could not delete file from storage: ${error.message}. The file will be marked as deleted in the database.`,
            color: "orange",
          });
        }
      }

      // Mark the file as deleted in our local state
      let fileType = "";

      if (label && localArtworkFilesMap) {
        // Update the file in the map
        const updatedMap = { ...localArtworkFilesMap };
        if (updatedMap[label] && updatedMap[label][index]) {
          fileType = updatedMap[label][index].type;
          updatedMap[label][index] = {
            ...updatedMap[label][index],
            isDeleted: true,
          };
          setLocalArtworkFilesMap(updatedMap);
        }
      } else if (localArtworkFiles) {
        // Update the file in the flat list
        const updatedFiles = [...localArtworkFiles];
        if (updatedFiles[index]) {
          fileType = updatedFiles[index].type;
          updatedFiles[index] = {
            ...updatedFiles[index],
            isDeleted: true,
          };
          setLocalArtworkFiles(updatedFiles);
        }
      }

      notifications.show({
        title: "Success",
        message: "File marked as deleted",
        color: "green",
      });

      // Call the callback to notify the parent component about the deletion
      if (onFileDeleted) {
        onFileDeleted({
          filePath,
          fileName: deleteConfirmFile?.name || "",
          fileType,
          isInMap: !!label,
          mapLabel: label,
          index,
        });
      }
    } catch (error) {
      // Log error to console for debugging
      console.error(error);
      notifications.show({
        title: "Error",
        message: "An unexpected error occurred during file deletion",
        color: "red",
      });
    } finally {
      setLoadingFiles((prev) => ({ ...prev, [filePath]: false }));
      closeDeleteModal();
      setDeleteConfirmFile(null);
    }
  };

  // Function to confirm file deletion
  const confirmDelete = (
    filePath: string,
    fileName: string,
    index: number,
    label?: string
  ) => {
    setDeleteConfirmFile({ path: filePath, name: fileName, index, label });
    openDeleteModal();
  };

  // Load thumbnails for all files
  useEffect(() => {
    const loadThumbnails = async () => {
      // Process artworkFiles
      if (localArtworkFiles) {
        for (const file of localArtworkFiles) {
          if (
            !isFileDeleted(file) &&
            (getFileTypeInfo(file.type).isImage ||
              getFileTypeInfo(file.type).isSVG)
          ) {
            setLoadingThumbnails((prev) => ({ ...prev, [file.url]: true }));
            const url = await getThumbnailUrl(file);
            setThumbnails((prev) => ({ ...prev, [file.url]: url }));
            setLoadingThumbnails((prev) => ({ ...prev, [file.url]: false }));
          }
        }
      }

      // Process artworkFilesMap
      if (localArtworkFilesMap) {
        for (const files of Object.values(localArtworkFilesMap)) {
          for (const file of files) {
            if (
              !isFileDeleted(file) &&
              (getFileTypeInfo(file.type).isImage ||
                getFileTypeInfo(file.type).isSVG)
            ) {
              setLoadingThumbnails((prev) => ({ ...prev, [file.url]: true }));
              const url = await getThumbnailUrl(file);
              setThumbnails((prev) => ({ ...prev, [file.url]: url }));
              setLoadingThumbnails((prev) => ({ ...prev, [file.url]: false }));
            }
          }
        }
      }
    };

    loadThumbnails();
  }, [localArtworkFiles, localArtworkFilesMap]);

  // Render file thumbnail
  const renderFileThumbnail = (
    file: ArtworkFile,
    index: number,
    label?: string
  ) => {
    const { isImage, isSVG } = getFileTypeInfo(file.type);
    const canShowThumbnail = (isImage || isSVG) && !isFileDeleted(file);
    const thumbnailUrl = thumbnails[file.url];
    const isLoading = loadingThumbnails[file.url];

    if (isFileDeleted(file)) {
      return (
        <Box
          h={120}
          bg="gray.1"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <FileIcon fileType={file.type} size={48} />
          <Badge color="red">Deleted</Badge>
        </Box>
      );
    }

    if (canShowThumbnail) {
      return (
        <Box
          h={120}
          bg="gray.1"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {isLoading ? (
            <Loader size="md" />
          ) : thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={file.name}
              height={120}
              fit="contain"
              style={{ cursor: "pointer" }}
              onClick={() => handlePreview(file.url, file.type)}
            />
          ) : (
            <FileIcon fileType={file.type} size={48} />
          )}
          <Tooltip label="Delete file" position="left">
            <ActionIcon
              color="red"
              variant="subtle"
              size="sm"
              style={{
                position: "absolute",
                top: 5,
                right: 5,
              }}
              onClick={() => confirmDelete(file.url, file.name, index, label)}
              loading={loadingFiles[file.url]}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Tooltip>
        </Box>
      );
    }

    return (
      <Box
        h={120}
        bg="gray.1"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <FileIcon fileType={file.type} size={48} />
        <Tooltip label="Delete file" position="left">
          <ActionIcon
            color="red"
            variant="subtle"
            size="sm"
            style={{
              position: "absolute",
              top: 5,
              right: 5,
            }}
            onClick={() => confirmDelete(file.url, file.name, index, label)}
            loading={loadingFiles[file.url]}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Tooltip>
      </Box>
    );
  };

  // If we have a map of files, display them grouped by label
  if (localArtworkFilesMap && Object.keys(localArtworkFilesMap).length > 0) {
    return (
      <Box>
        <Title order={5} mb="md">
          Artwork Files
        </Title>
        {Object.entries(localArtworkFilesMap).map(([label, files]) => (
          <Box key={label} mb="lg">
            <Text fw="bold" mb="xs">
              {label}
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
              {files.map((file, index) => (
                <Paper key={index} p="md" withBorder>
                  <Box mb="sm" pos="relative">
                    {renderFileThumbnail(file, index, label)}
                  </Box>
                  <Text size="sm" lineClamp={1} mb="xs" title={file.name}>
                    {file.name}
                  </Text>
                  <Text size="xs" c="dimmed" mb="sm">
                    {file.name.split(".").pop() || file.type}
                  </Text>
                  <Stack gap="xs">
                    <Button
                      size="xs"
                      variant="light"
                      leftSection={
                        loadingFiles[file.url] ? (
                          <Loader size="xs" />
                        ) : (
                          <IconEye size={14} />
                        )
                      }
                      onClick={() => handlePreview(file.url, file.type)}
                      disabled={loadingFiles[file.url] || isFileDeleted(file)}
                    >
                      Preview
                    </Button>
                    <Button
                      size="xs"
                      variant="light"
                      leftSection={
                        loadingFiles[file.url] ? (
                          <Loader size="xs" />
                        ) : (
                          <IconDownload size={14} />
                        )
                      }
                      onClick={() => handleDownload(file.url, file.name)}
                      disabled={loadingFiles[file.url] || isFileDeleted(file)}
                    >
                      Download
                    </Button>
                  </Stack>
                </Paper>
              ))}
            </SimpleGrid>
          </Box>
        ))}

        {/* Preview Modal */}
        <Modal opened={opened} onClose={close} size="xl" title="File Preview">
          {previewUrl && (
            <Box>
              {previewFileType === "application/pdf" ||
              previewUrl.toLowerCase().endsWith(".pdf") ? (
                <iframe
                  src={previewUrl}
                  width="100%"
                  height="500px"
                  style={{ border: "none" }}
                  title="PDF Preview"
                />
              ) : getFileTypeInfo(previewFileType).isImage ||
                getFileTypeInfo(previewFileType).isSVG ? (
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fit="contain"
                  height={500}
                />
              ) : (
                <Box
                  h={300}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <FileIcon fileType={previewFileType} size={64} />
                  <Text>This file type cannot be previewed directly.</Text>
                  <Button onClick={() => window.open(previewUrl, "_blank")}>
                    Open in New Tab
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          opened={deleteOpened}
          onClose={closeDeleteModal}
          title="Confirm Deletion"
          centered
        >
          <Text mb="md">
            Are you sure you want to delete the file &quot;
            {deleteConfirmFile?.name}&quot;? This action cannot be undone.
          </Text>
          <Group justify="flex-end">
            <Button variant="outline" onClick={closeDeleteModal}>
              Cancel
            </Button>
            <Button
              color="red"
              onClick={() =>
                deleteConfirmFile &&
                handleDelete(
                  deleteConfirmFile.path,
                  deleteConfirmFile.index,
                  deleteConfirmFile.label
                )
              }
              loading={
                deleteConfirmFile ? loadingFiles[deleteConfirmFile.path] : false
              }
            >
              Delete
            </Button>
          </Group>
        </Modal>
      </Box>
    );
  }

  // If we only have a flat list of files
  if (localArtworkFiles && localArtworkFiles.length > 0) {
    return (
      <Box>
        <Title order={5} mb="md">
          Artwork Files
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
          {localArtworkFiles.map((file, index) => (
            <Paper key={index} p="md" withBorder>
              <Box mb="sm" pos="relative">
                {renderFileThumbnail(file, index)}
              </Box>
              <Text size="sm" lineClamp={1} mb="xs" title={file.name}>
                {file.name}
              </Text>
              <Text size="xs" c="dimmed" mb="sm">
                {file.name.split(".").pop() || file.type}
              </Text>
              <Group grow>
                <Button
                  size="xs"
                  variant="light"
                  leftSection={
                    loadingFiles[file.url] ? (
                      <Loader size="xs" />
                    ) : (
                      <IconEye size={14} />
                    )
                  }
                  onClick={() => handlePreview(file.url, file.type)}
                  disabled={loadingFiles[file.url] || isFileDeleted(file)}
                >
                  Preview
                </Button>
                <Button
                  size="xs"
                  variant="light"
                  leftSection={
                    loadingFiles[file.url] ? (
                      <Loader size="xs" />
                    ) : (
                      <IconDownload size={14} />
                    )
                  }
                  onClick={() => handleDownload(file.url, file.name)}
                  disabled={loadingFiles[file.url] || isFileDeleted(file)}
                >
                  Download
                </Button>
              </Group>
            </Paper>
          ))}
        </SimpleGrid>

        {/* Preview Modal */}
        <Modal opened={opened} onClose={close} size="xl" title="File Preview">
          {previewUrl && (
            <Box>
              {previewFileType === "application/pdf" ||
              previewUrl.toLowerCase().endsWith(".pdf") ? (
                <iframe
                  src={previewUrl}
                  width="100%"
                  height="500px"
                  style={{ border: "none" }}
                  title="PDF Preview"
                />
              ) : getFileTypeInfo(previewFileType).isImage ||
                getFileTypeInfo(previewFileType).isSVG ? (
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fit="contain"
                  height={500}
                />
              ) : (
                <Box
                  h={300}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <FileIcon fileType={previewFileType} size={64} />
                  <Text>This file type cannot be previewed directly.</Text>
                  <Button onClick={() => window.open(previewUrl, "_blank")}>
                    Open in New Tab
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          opened={deleteOpened}
          onClose={closeDeleteModal}
          title="Confirm Deletion"
          centered
        >
          <Text mb="md">
            Are you sure you want to delete the file &quot;
            {deleteConfirmFile?.name}&quot;? This action cannot be undone.
          </Text>
          <Group justify="flex-end">
            <Button variant="outline" onClick={closeDeleteModal}>
              Cancel
            </Button>
            <Button
              color="red"
              onClick={() =>
                deleteConfirmFile &&
                handleDelete(
                  deleteConfirmFile.path,
                  deleteConfirmFile.index,
                  deleteConfirmFile.label
                )
              }
              loading={
                deleteConfirmFile ? loadingFiles[deleteConfirmFile.path] : false
              }
            >
              Delete
            </Button>
          </Group>
        </Modal>
      </Box>
    );
  }

  return null;
};
