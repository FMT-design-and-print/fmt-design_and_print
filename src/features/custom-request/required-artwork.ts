import { ArtworkOption } from "@/types";
import { FileWithPath } from "@mantine/dropzone";

export const isArtworkRequired = (
  selectedArtworkOption?: ArtworkOption,
  artworkFiles?: FileWithPath[]
) => {
  return selectedArtworkOption === "own-artwork" && artworkFiles?.length === 0;
};
