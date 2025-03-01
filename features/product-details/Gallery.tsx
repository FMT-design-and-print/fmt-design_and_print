import { SelectedProductOptions } from "@/types";
import { Group, Box } from "@mantine/core";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

interface Props {
  images: string[];
  setSelectedProductOptions: Dispatch<SetStateAction<SelectedProductOptions>>;
}

export const Gallery = ({ images, setSelectedProductOptions }: Props) => {
  return (
    <Group gap="xs" my="xs" justify="center">
      {images.map((image, i) => (
        <Box
          key={i}
          style={{
            position: "relative",
            width: 64,
            height: 64,
            cursor: "pointer",
            border: "1px solid var(--mantine-color-gray-3)",
            borderRadius: "var(--mantine-radius-xs)",
            overflow: "hidden",
          }}
          onClick={() => {
            setSelectedProductOptions((prev) => ({ ...prev, image }));
          }}
        >
          <Image
            src={image}
            alt={`Product view ${i + 1}`}
            fill
            sizes="64px"
            style={{
              objectFit: "contain",
            }}
          />
        </Box>
      ))}
    </Group>
  );
};
