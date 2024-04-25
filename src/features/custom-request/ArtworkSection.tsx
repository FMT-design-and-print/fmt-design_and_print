"use client";
import { Box, Text } from "@mantine/core";
import React from "react";
import { ArtworksDropzone } from "./ArtworksDropzone";
import { ArtworkOptions } from "./ArtworkOptions";
import { useCustomRequest } from ".";

export const ArtworkSection = () => {
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
          <ArtworksDropzone />
          <Text c="dimmed" size="sm" mt="sm">
            <b>NB:</b> If you are uploading many artworks files or files with
            huge sizes, please send them to us separately via Whatsapp here
          </Text>
        </>
      )}
    </Box>
  );
};
