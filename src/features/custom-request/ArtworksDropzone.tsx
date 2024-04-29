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
import { useCustomRequest } from ".";
import { ErrorsRenderer } from "./ErrorsRenderer";
import { ReceivedFilesRenderer } from "./ReceivedFilesRenderer";
import { RejectedFilesMessages } from "./RejectedFilesMessages";
import classes from "./Styles.module.css";

export const ArtworksDropzone = (props: Partial<DropzoneProps>) => {
  const context = useCustomRequest();
  const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const isMax = context?.artworkFiles.length === 5;
  const handleOnDrop = (files: FileWithPath[]) => {
    if (
      context?.artworkFiles &&
      context?.artworkFiles.length + files.length > 5
    ) {
      setErrors(["You can only upload up to 5 files"]);
      return;
    }

    const filteredFiles = filterDuplicateFiles(
      files,
      context?.artworkFiles || []
    );

    context?.setArtworkFiles((prevState: FileWithPath[]) => [
      ...prevState,
      ...filteredFiles,
    ]);
  };

  const handleOnReject = (files: FileRejection[]) => {
    setRejectedFiles(files);
  };

  function filterDuplicateFiles(
    newFiles: FileWithPath[],
    existingFiles: FileWithPath[]
  ) {
    const existingFileNames = existingFiles.map((file) => file.name);

    const filteredFiles = newFiles.filter((newFile) => {
      return !existingFileNames.includes(newFile.name);
    });

    return filteredFiles;
  }

  return (
    <Box>
      <Dropzone
        disabled={isMax}
        className={isMax ? classes.disabled : ""}
        onDrop={(files) => handleOnDrop(files)}
        onReject={(files) => handleOnReject(files)}
        onDropAny={() => {
          setErrors([]);
          setRejectedFiles([]);
        }}
        maxFiles={5 - (context?.artworkFiles.length || 0)}
        maxSize={10 * 1024 ** 2}
        accept={[
          MIME_TYPES.png,
          MIME_TYPES.svg,
          MIME_TYPES.pdf,
          "application/postscript",
        ]}
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
                color: "var(--mantine-color-blue-6)",
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
            <Text size="xl" inline>
              Drag files here or click to select files
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              You can upload a maximum of 5 artworks, each file should not
              exceed 10mb. Accepted formats: .eps, .svg, .ai, .pdf, .png and
              sometimes(.jpg, .jpeg)
            </Text>
          </div>
        </Group>
      </Dropzone>

      {context?.artworkFiles && context?.artworkFiles.length > 0 && (
        <ReceivedFilesRenderer />
      )}

      {rejectedFiles.length > 0 && (
        <RejectedFilesMessages
          rejectedFiles={rejectedFiles}
          handleClear={() => setRejectedFiles([])}
        />
      )}

      {errors.length > 0 && (
        <ErrorsRenderer errors={errors} showTitle={false} />
      )}
    </Box>
  );
};
