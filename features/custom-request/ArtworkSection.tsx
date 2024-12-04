"use client";
import { Box, Text } from "@mantine/core";
import React from "react";
import { ArtworksDropzone } from "@/components/Dropzone/ArtworksDropzone";
import { ArtworkOptions } from "./ArtworkOptions";
import { useCustomRequest } from ".";
import Link from "next/link";
import { artworkText, whatsappUrl } from "@/constants";
import { DropzoneProps } from "@mantine/dropzone";
import { ReceivedFilesRenderer } from "@/components/Dropzone/ReceivedFilesRenderer";
import { RejectedFilesMessages } from "@/components/Dropzone/RejectedFilesMessages";

interface Props {
  artworkProps?: Partial<DropzoneProps>;
}

export const ArtworkSection = ({ artworkProps }: Props) => {
  const context = useCustomRequest();
  return (
    <Box my="md">
      <Text mb="xs">Artworks</Text>
      <ArtworkOptions />

      {context?.selectedArtworkOption === "own-artwork" && (
        <>
          <Text c="dimmed" size="sm">
            Please upload high quality artworks below
          </Text>

          <ArtworksDropzone
            files={context.artworkFiles}
            onFilesChange={context.setArtworkFiles}
            maxFiles={5}
            renderFiles={() => (
              <ReceivedFilesRenderer
                files={context.artworkFiles}
                onRemove={(file) =>
                  context.setArtworkFiles((prev) =>
                    prev.filter((f) => f.name !== file.name)
                  )
                }
              />
            )}
            renderRejected={(rejectedFiles, onClear) => (
              <RejectedFilesMessages
                rejectedFiles={rejectedFiles}
                handleClear={onClear}
              />
            )}
            {...artworkProps}
          />
          <Text c="dimmed" size="sm" mt="sm">
            <b>NB:</b> If you are uploading many artworks files or files with
            huge sizes, please send them to us separately via{" "}
            <Text
              component={Link}
              href={`${whatsappUrl}?text=${artworkText}`}
              target="_blank"
              c="pink"
            >
              Whatsapp
            </Text>
          </Text>
        </>
      )}
    </Box>
  );
};
