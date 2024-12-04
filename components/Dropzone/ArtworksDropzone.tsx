"use client";
import { Box, Group, Text, rem } from "@mantine/core";
import {
  Dropzone,
  DropzoneProps,
  FileRejection,
  FileWithPath,
  MIME_TYPES,
} from "@mantine/dropzone";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { ErrorsRenderer } from "../ErrorsRenderer";
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
}

export const ArtworksDropzone = ({
  files,
  onFilesChange,
  maxFiles = 5,
  maxSize = 10 * 1024 ** 2,
  acceptedFileTypes = [
    MIME_TYPES.png,
    MIME_TYPES.svg,
    MIME_TYPES.pdf,
    "application/postscript",
  ],
  renderFiles,
  renderRejected,
  description,
  dropzoneText = "Drag files here or click to select files",
  ...props
}: ArtworksDropzoneProps) => {
  const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

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
          mih={220}
          style={{ pointerEvents: "none" }}
        >
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
            <Text size="xl" inline c="gray.8">
              {dropzoneText}
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              {description ||
                `You can upload a maximum of ${maxFiles} files, each file should not exceed ${maxSize / 1024 / 1024}MB. Accepted file types: eps, pdf, png, svg`}
            </Text>
          </div>
        </Group>
      </Dropzone>

      {files.length > 0 && renderFiles?.()}

      {rejectedFiles.length > 0 &&
        renderRejected?.(rejectedFiles, () => setRejectedFiles([]))}

      {errors.length > 0 && (
        <ErrorsRenderer errors={errors} showTitle={false} />
      )}
    </Box>
  );
};
