"use client";
import { Box, Grid, Text, Title } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { Dispatch, SetStateAction } from "react";
import { ArtworksDropzone } from "./ArtworksDropzone";
import { SelectedProductOptions } from "@/types";

interface MultipleArtworksDropzoneProps {
  product: {
    numberOfSides?: number;
    numberOfArtworks?: number;
    enableArtworkLabels?: boolean;
    artworkLabels?: string[];
    allowMultipleArtworksForEachSide?: boolean;
  };
  artworkFilesMap?: Record<string, FileWithPath[]>;
  setSelectedProductOptions?: Dispatch<SetStateAction<SelectedProductOptions>>;
  errors?: {
    artworkFiles?: string;
  };
}

export const MultipleArtworksDropzone = ({
  product,
  artworkFilesMap = {},
  setSelectedProductOptions,
  errors,
}: MultipleArtworksDropzoneProps) => {
  const {
    numberOfSides = 1,
    numberOfArtworks = 1,
    enableArtworkLabels = false,
    artworkLabels = [],
    allowMultipleArtworksForEachSide = false,
  } = product;

  // Determine how many dropzones to show
  // If numberOfArtworks is -1 (unspecified), use numberOfSides
  const dropzoneCount = numberOfArtworks > 0 ? numberOfArtworks : numberOfSides;

  // Generate labels for each dropzone
  const getDropzoneLabels = (): string[] => {
    if (enableArtworkLabels && artworkLabels.length > 0) {
      return artworkLabels.slice(0, dropzoneCount);
    }

    // Default labels if no custom labels provided
    return Array.from({ length: dropzoneCount }, (_, i) => `Artwork ${i + 1}`);
  };

  const labels = getDropzoneLabels();

  // Handle file changes for a specific dropzone
  const handleFilesChange = (label: string, newFiles: FileWithPath[]) => {
    setSelectedProductOptions?.((prev) => {
      // Create a new map with the updated files for this label
      const updatedMap = {
        ...(prev.artworkFilesMap || {}),
        [label]: newFiles,
      };

      // Also update the flat artworkFiles array for backward compatibility
      const allFiles = Object.values(updatedMap).flat();

      return {
        ...prev,
        artworkFilesMap: updatedMap,
        artworkFiles: allFiles,
      };
    });
  };

  // Get files for a specific label
  const getFilesForLabel = (label: string): FileWithPath[] => {
    return artworkFilesMap[label] || [];
  };

  return (
    <Box mb="xl">
      <Title order={4} mb="xs">
        Upload Your Artwork
      </Title>

      <Grid>
        {labels.map((label) => (
          <Grid.Col key={label} span={{ base: 12 }}>
            <Box mb="md">
              <Text fw="bold" mb="xs">
                {label}
              </Text>
              <ArtworksDropzone
                files={getFilesForLabel(label)}
                onFilesChange={(files) => handleFilesChange(label, files)}
                maxFiles={allowMultipleArtworksForEachSide ? 5 : 1}
                maxSize={10 * 1024 ** 2}
                dropzoneText={`Drag ${label} here or click to select ${allowMultipleArtworksForEachSide ? "files" : "file"}`}
                description={`Upload artwork for ${label}. ${allowMultipleArtworksForEachSide ? "You can upload up to 5 files. " : ""}File${allowMultipleArtworksForEachSide ? "s" : ""} should not exceed 10MB.`}
              />
            </Box>
          </Grid.Col>
        ))}
      </Grid>

      {errors?.artworkFiles && (
        <Box mt="xs">
          <Text c="red" size="sm">
            {errors.artworkFiles}
          </Text>
        </Box>
      )}
    </Box>
  );
};
