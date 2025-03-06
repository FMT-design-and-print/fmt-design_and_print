import { storageBucketName } from "@/constants";
import { createClient } from "@/utils/supabase/client";
import {
  Box,
  Button,
  Group,
  Image,
  Paper,
  SimpleGrid,
  Text,
  Title,
  Modal,
  ActionIcon,
  Tooltip,
  Loader,
  Badge,
} from "@mantine/core";
import {
  IconDownload,
  IconEye,
  IconTrash,
  IconPhoto,
  IconFileDescription,
  IconFileTypePdf,
  IconFileVector,
} from "@tabler/icons-react";
import { saveAs } from "file-saver";
import { useState, useEffect } from "react";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import {
  isStoragePath,
  getFileTypeInfo,
  getFileTypeCategory,
} from "@/utils/file-helpers";

// Define interfaces for file objects
interface ArtworkFile {
  url: string;
  name: string;
  size?: number;
  type?: string;
  isDeleted?: boolean;
}

interface FileDownloaderProps {
  fileNames: string[] | ArtworkFile[];
  onFilesUpdated?: (updatedFiles: (string | ArtworkFile)[]) => void;
}

export const FileDownloader: React.FC<FileDownloaderProps> = ({
  fileNames,
  onFilesUpdated,
}) => {
  // Convert string array to ArtworkFile array for consistent handling
  const [files, setFiles] = useState<ArtworkFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState<Record<string, boolean>>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFileType, setPreviewFileType] = useState<string>("");
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteConfirmFile, setDeleteConfirmFile] = useState<{
    file: ArtworkFile;
    index: number;
  } | null>(null);
  const [deleteOpened, { open: openDeleteModal, close: closeDeleteModal }] =
    useDisclosure(false);
  const [thumbnails, setThumbnails] = useState<Record<string, string | null>>(
    {}
  );
  const [loadingThumbnails, setLoadingThumbnails] = useState<
    Record<string, boolean>
  >({});

  // Convert string array to ArtworkFile array on component mount
  useEffect(() => {
    const convertToArtworkFiles = async () => {
      if (!fileNames.length) return;

      // Check if fileNames is already an array of ArtworkFile objects
      if (typeof fileNames[0] !== "string") {
        setFiles(fileNames as ArtworkFile[]);
        return;
      }

      // Convert string array to ArtworkFile array
      const artworkFiles = (fileNames as string[]).map((fileName) => {
        // Check if the file is marked as deleted with #deleted suffix
        const isDeleted = fileName.includes("#deleted");
        // Remove the #deleted suffix for processing
        const cleanFileName = isDeleted
          ? fileName.replace("#deleted", "")
          : fileName;

        const name = cleanFileName.split("/").pop() || cleanFileName;
        const extension = name.split(".").pop()?.toLowerCase() || "";
        const type = getFileTypeFromExtension(extension);

        return {
          url: cleanFileName, // Store the clean URL without the #deleted suffix
          name,
          type,
          size: 0, // Size is unknown for files stored as strings
          isDeleted, // Set the deleted flag based on the #deleted suffix
        };
      });

      setFiles(artworkFiles);
    };

    convertToArtworkFiles();
  }, [fileNames]);

  // Load thumbnails for all files
  useEffect(() => {
    const loadThumbnails = async () => {
      for (const file of files) {
        if (!file.isDeleted && isImageOrSvg(file)) {
          setLoadingThumbnails((prev) => ({ ...prev, [file.url]: true }));
          const url = await getSignedUrl(file.url);
          setThumbnails((prev) => ({ ...prev, [file.url]: url }));
          setLoadingThumbnails((prev) => ({ ...prev, [file.url]: false }));
        }
      }
    };

    loadThumbnails();
  }, [files]);

  // Helper function to determine if a file is an image or SVG
  const isImageOrSvg = (file: ArtworkFile) => {
    if (!file.type) return false;
    const { isImage, isSVG } = getFileTypeInfo(file.type);
    return isImage || isSVG;
  };

  // Helper function to get file type from extension
  const getFileTypeFromExtension = (extension: string): string => {
    const extensionToType: Record<string, string> = {
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      svg: "image/svg+xml",
      pdf: "application/pdf",
      eps: "application/postscript",
      ai: "application/illustrator",
    };

    return extensionToType[extension] || "application/octet-stream";
  };

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
        return null;
      }

      return data?.signedUrl;
    } catch {
      return null;
    }
  };

  // Helper function to handle file download
  const handleDownload = async (file: ArtworkFile) => {
    setLoadingFiles((prev) => ({ ...prev, [file.url]: true }));

    try {
      const signedUrl = await getSignedUrl(file.url);

      if (signedUrl) {
        const response = await fetch(signedUrl);
        const blob = await response.blob();
        saveAs(blob, file.name);

        notifications.show({
          title: "Success",
          message: `File ${file.name} downloaded successfully`,
          color: "green",
        });
      }
    } catch {
      notifications.show({
        title: "Download Failed",
        message: "There was an error downloading the file. Please try again.",
        color: "red",
      });
    } finally {
      setLoadingFiles((prev) => ({ ...prev, [file.url]: false }));
    }
  };

  // Helper function to preview file
  const handlePreview = async (file: ArtworkFile) => {
    setLoadingFiles((prev) => ({ ...prev, [file.url]: true }));

    try {
      const signedUrl = await getSignedUrl(file.url);

      if (signedUrl) {
        setPreviewUrl(signedUrl);
        setPreviewFileType(file.type || "");
        open();
      }
    } catch {
      notifications.show({
        title: "Preview Failed",
        message: "There was an error previewing the file. Please try again.",
        color: "red",
      });
    } finally {
      setLoadingFiles((prev) => ({ ...prev, [file.url]: false }));
    }
  };

  // Helper function to delete file
  const handleDelete = async (file: ArtworkFile, index: number) => {
    setLoadingFiles((prev) => ({ ...prev, [file.url]: true }));

    try {
      // Only attempt to delete if it's a storage path
      if (isStoragePath(file.url)) {
        const supabase = createClient();

        // Delete the file using the original path
        const { error } = await supabase.storage
          .from(storageBucketName)
          .remove([file.url]);

        if (error) {
          notifications.show({
            title: "Warning",
            message: `Could not delete file from storage: ${error.message}. The file will be marked as deleted in the database.`,
            color: "orange",
          });
        }
      }

      // Mark the file as deleted in our local state
      const updatedFiles = [...files];
      updatedFiles[index] = {
        ...updatedFiles[index],
        isDeleted: true,
      };
      setFiles(updatedFiles);

      // Call the callback to update the parent component
      if (onFilesUpdated) {
        // If the original data was an array of strings, we need to maintain backward compatibility
        if (typeof fileNames[0] === "string") {
          // Convert back to array of strings, but mark deleted files with #deleted suffix
          const updatedFileNames = updatedFiles.map((file) =>
            file.isDeleted ? `${file.url}#deleted` : file.url
          );
          onFilesUpdated(updatedFileNames);
        } else {
          // If it was already an array of objects, just pass the updated array
          onFilesUpdated(updatedFiles);
        }
      }

      notifications.show({
        title: "Success",
        message: "File marked as deleted",
        color: "green",
      });
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Error",
        message: "An unexpected error occurred during file deletion",
        color: "red",
      });
    } finally {
      setLoadingFiles((prev) => ({ ...prev, [file.url]: false }));
      closeDeleteModal();
      setDeleteConfirmFile(null);
    }
  };

  // Function to confirm file deletion
  const confirmDelete = (file: ArtworkFile, index: number) => {
    setDeleteConfirmFile({ file, index });
    openDeleteModal();
  };

  // Render file icon based on type
  const FileIcon = ({
    fileType,
    size = 48,
  }: {
    fileType: string;
    size?: number;
  }) => {
    const fileCategory = getFileTypeCategory(fileType);

    switch (fileCategory) {
      case "pdf":
        return <IconFileTypePdf size={size} color="#e94444" />;
      case "vector":
        return <IconFileVector size={size} color="#ffb020" />;
      case "image":
        return <IconPhoto size={size} color="#37b24d" />;
      default:
        return <IconFileDescription size={size} color="#228be6" />;
    }
  };

  // Render file thumbnail
  const renderFileThumbnail = (file: ArtworkFile, index: number) => {
    if (file.isDeleted) {
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
            position: "relative",
            opacity: 0.7,
          }}
        >
          <FileIcon fileType={file.type || "application/octet-stream"} />
          <Badge color="red" size="md" variant="filled">
            Deleted
          </Badge>
        </Box>
      );
    }

    const isImage = file.type && isImageOrSvg(file);
    const thumbnailUrl = thumbnails[file.url];
    const isLoading = loadingThumbnails[file.url];

    if (isImage) {
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
              onClick={() => handlePreview(file)}
            />
          ) : (
            <FileIcon fileType={file.type || "application/octet-stream"} />
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
              onClick={() => confirmDelete(file, index)}
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
        <FileIcon fileType={file.type || "application/octet-stream"} />
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
            onClick={() => confirmDelete(file, index)}
            loading={loadingFiles[file.url]}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Tooltip>
      </Box>
    );
  };

  if (!files.length) {
    return null;
  }

  return (
    <Box>
      <Title order={5} mb="md">
        Artwork Files
      </Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
        {files.map((file, index) => (
          <Paper key={index} p="md" withBorder>
            <Box mb="sm" pos="relative">
              {renderFileThumbnail(file, index)}
            </Box>
            <Text size="sm" lineClamp={1} mb="xs" title={file.name}>
              {file.name}
              {file.isDeleted && (
                <Badge ml="xs" color="red" size="xs" variant="filled">
                  Deleted
                </Badge>
              )}
            </Text>
            {file.size !== undefined && (
              <Text size="xs" c="dimmed" mb="sm">
                {file.name.split(".").pop() || file.type}
              </Text>
            )}
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
                onClick={() => handlePreview(file)}
                disabled={loadingFiles[file.url] || file.isDeleted}
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
                onClick={() => handleDownload(file)}
                disabled={loadingFiles[file.url] || file.isDeleted}
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
          {deleteConfirmFile?.file.name}&quot;? This action cannot be undone.
        </Text>
        <Group justify="flex-end">
          <Button variant="outline" onClick={closeDeleteModal}>
            Cancel
          </Button>
          <Button
            color="red"
            onClick={() =>
              deleteConfirmFile &&
              handleDelete(deleteConfirmFile.file, deleteConfirmFile.index)
            }
            loading={
              deleteConfirmFile
                ? loadingFiles[deleteConfirmFile.file.url]
                : false
            }
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </Box>
  );
};
