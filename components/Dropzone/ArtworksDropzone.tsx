"use client";
import { Box, Group, Text, rem, Modal, Image } from "@mantine/core";
import {
  Dropzone,
  DropzoneProps,
  FileRejection,
  FileWithPath,
} from "@mantine/dropzone";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { ErrorsRenderer } from "../ErrorsRenderer";
import { ReceivedFilesRenderer, SerializedFile } from "./ReceivedFilesRenderer";
import { RejectedFilesMessages } from "./RejectedFilesMessages";
import classes from "./Styles.module.css";

interface ArtworksDropzoneProps extends Partial<DropzoneProps> {
  files: FileWithPath[];
  onFilesChange?: (files: FileWithPath[]) => void;
  maxFiles?: number;
  maxSize?: number;
  acceptedFileTypes?: string[];
  renderFiles?: () => React.ReactNode;
  renderRejected?: (
    rejectedFiles: FileRejection[],
    onClear: () => void
  ) => React.ReactNode;
  description?: string;
  dropzoneText?: string;
  showPreview?: boolean;
  previewHeight?: string | number;
}

const DEFAULT_ACCEPTED_TYPES = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/svg+xml": [".svg"],
  "application/pdf": [".pdf"],
  "application/postscript": [".eps"],
  "application/illustrator": [".ai"],
};

export const ArtworksDropzone = ({
  files,
  onFilesChange,
  maxFiles = 5,
  maxSize = 10 * 1024 ** 2,
  acceptedFileTypes = Object.keys(DEFAULT_ACCEPTED_TYPES),
  renderFiles,
  renderRejected,
  description,
  dropzoneText = "Drag files here or click to select files",
  showPreview = true,
  previewHeight = "80vh",
  ...props
}: ArtworksDropzoneProps) => {
  const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [previewFile, setPreviewFile] = useState<FileWithPath | null>(null);

  const isMax = files.length === maxFiles;

  const handleOnDrop = (newFiles: FileWithPath[]) => {
    if (files.length + newFiles.length > maxFiles) {
      setErrors([`You can only upload up to ${maxFiles} files`]);
      return;
    }

    const filteredFiles = filterDuplicateFiles(newFiles, files);
    onFilesChange?.([...files, ...filteredFiles]);
  };

  const handleOnReject = (files: FileRejection[]) => {
    setRejectedFiles(files);
  };

  function filterDuplicateFiles(
    newFiles: FileWithPath[],
    existingFiles: FileWithPath[]
  ) {
    const existingFileNames = existingFiles.map((file) => file.name);
    return newFiles.filter(
      (newFile) => !existingFileNames.includes(newFile.name)
    );
  }

  const handleRemoveFile = (fileToRemove: FileWithPath | SerializedFile) => {
    onFilesChange?.(
      files.filter((f) => {
        if ("url" in fileToRemove) {
          return "url" in f ? f.url !== fileToRemove.url : true;
        }
        return f !== fileToRemove;
      })
    );
  };

  const renderPreview = () => {
    if (!previewFile) return null;

    const isPDF = previewFile.type === "application/pdf";
    if (isPDF) {
      return (
        <Box style={{ width: "100%", height: previewHeight }}>
          <iframe
            src={URL.createObjectURL(previewFile) + "#toolbar=0"}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              background: "white",
            }}
            title={previewFile.name}
          />
        </Box>
      );
    }

    return (
      <Box style={{ background: "white", padding: "20px" }}>
        <Image
          src={URL.createObjectURL(previewFile)}
          alt={previewFile.name}
          fit="contain"
          style={{ maxWidth: "100%", maxHeight: previewHeight }}
        />
      </Box>
    );
  };

  return (
    <Box>
      <Dropzone
        disabled={isMax}
        className={isMax ? classes.disabled : ""}
        onDrop={handleOnDrop}
        onReject={handleOnReject}
        onDropAny={() => {
          setErrors([]);
          setRejectedFiles([]);
        }}
        maxFiles={maxFiles - files.length}
        maxSize={maxSize}
        accept={acceptedFileTypes}
        {...props}
      >
        <Group
          justify="center"
          gap="xl"
          py="md"
          style={{ pointerEvents: "none" }}
        >
          {isMax ? (
            <>
              <IconX
                style={{
                  width: rem(52),
                  height: rem(52),
                }}
                stroke={1.5}
                color="var(--mantine-color-red-6)"
              />
              <div>
                <Text
                  className="text-md lg:text-xl"
                  inline
                  c="dimmed"
                  ta={{ base: "center", md: "left" }}
                >
                  Maximum files reached
                </Text>
                <Text
                  c="dimmed"
                  inline
                  mt={7}
                  display="block"
                  ta={{ base: "center", md: "left" }}
                  className="text-xs lg:text-sm"
                >
                  Please remove some files before uploading more
                </Text>
              </div>
            </>
          ) : (
            <>
              <Dropzone.Accept>
                <IconUpload
                  style={{
                    width: rem(52),
                    height: rem(52),
                    color: "var(--mantine-color-pink-6)",
                  }}
                  stroke={1.5}
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX
                  style={{
                    width: rem(52),
                    height: rem(52),
                    color: "var(--mantine-color-red-6)",
                  }}
                  stroke={1.5}
                />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconPhoto
                  style={{
                    width: rem(52),
                    height: rem(52),
                    color: "var(--mantine-color-dimmed)",
                  }}
                  stroke={1.5}
                />
              </Dropzone.Idle>

              <div>
                <Text
                  className="text-md lg:text-xl"
                  inline
                  c="gray.8"
                  ta={{ base: "center", md: "left" }}
                >
                  {dropzoneText}
                </Text>
                <Text
                  size="sm"
                  c="dimmed"
                  inline
                  mt={7}
                  display="block"
                  ta={{ base: "center", md: "left" }}
                  className="text-xs lg:text-sm"
                >
                  {description ||
                    `You can upload a maximum of ${maxFiles} files, each file should not exceed ${
                      maxSize / 1024 / 1024
                    }MB`}
                </Text>
                <Text
                  size="xs"
                  c="dimmed"
                  inline
                  mt={5}
                  display="block"
                  ta={{ base: "center", md: "left" }}
                  className="text-xs lg:text-sm"
                >
                  Supported formats: PNG, JPG, SVG, PDF, EPS, AI
                </Text>
              </div>
            </>
          )}
        </Group>
      </Dropzone>

      {files.length > 0 &&
        (renderFiles?.() ?? (
          <ReceivedFilesRenderer
            files={files}
            onRemove={handleRemoveFile}
            title={`Uploaded Files (${files.length}/${maxFiles})`}
          />
        ))}

      {rejectedFiles.length > 0 &&
        (renderRejected?.(rejectedFiles, () => setRejectedFiles([])) ?? (
          <RejectedFilesMessages
            rejectedFiles={rejectedFiles}
            handleClear={() => setRejectedFiles([])}
          />
        ))}

      {errors.length > 0 && (
        <ErrorsRenderer errors={errors} showTitle={false} />
      )}

      {showPreview && (
        <Modal
          opened={!!previewFile}
          onClose={() => setPreviewFile(null)}
          size="xl"
          padding="xs"
          title={previewFile?.name}
        >
          {renderPreview()}
        </Modal>
      )}
    </Box>
  );
};
