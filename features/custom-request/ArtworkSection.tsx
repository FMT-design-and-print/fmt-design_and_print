"use client";
import { ArtworksDropzone } from "@/components/Dropzone/ArtworksDropzone";
import { artworkText, whatsappNumber } from "@/constants";
import { Box, Button, Text } from "@mantine/core";
import { DropzoneProps } from "@mantine/dropzone";
import { useCustomRequest } from ".";
import { ArtworkOptions } from "./ArtworkOptions";

interface Props {
  artworkProps?: Partial<DropzoneProps>;
}

export const ArtworkSection = ({ artworkProps }: Props) => {
  const context = useCustomRequest();

  const openWhatsapp = () => {
    // Remove any non-numeric characters from the phone number
    const cleanPhoneNumber = whatsappNumber.replace(/\D/g, "");
    const encodedMessage = encodeURIComponent(artworkText);
    const whatsappUrl = `https://wa.me/${cleanPhoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

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
            maxSize={10 * 1024 ** 2}
            {...artworkProps}
          />
          <Text c="dimmed" size="sm" mt="sm">
            <b>NB:</b> If you are uploading many artworks files or files with
            huge sizes, please send them to us separately via{" "}
            <Button
              variant="transparent"
              onClick={openWhatsapp}
              c="pink"
              px={0}
            >
              Whatsapp
            </Button>
          </Text>
        </>
      )}
    </Box>
  );
};
