import { SelectedProductOptions } from "@/types";
import { Avatar, Group } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";

interface Props {
  images: string[];
  setSelectedProductOptions: Dispatch<SetStateAction<SelectedProductOptions>>;
}

export const Gallery = ({ images, setSelectedProductOptions }: Props) => {
  return (
    <Group gap="xs" my="xs" justify="center">
      {images.map((image, i) => (
        <Avatar
          radius="xs"
          key={i}
          size="lg"
          src={image}
          variant="outline"
          onClick={() => {
            setSelectedProductOptions((prev) => ({ ...prev, image }));
          }}
          style={{ cursor: "pointer" }}
        />
      ))}
    </Group>
  );
};
