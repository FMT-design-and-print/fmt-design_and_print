import { Avatar, Group } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

interface Props {
  images: string[];
  setSelectedImage: Dispatch<SetStateAction<string | undefined>>;
}

export const Gallery = ({ images, setSelectedImage }: Props) => {
  const searchParams = useSearchParams();
  const { push } = useRouter();
  const colorId = searchParams.get("colorId");

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
            setSelectedImage(image);
            if (colorId) {
              push(`?colorId=`);
            }
          }}
          style={{ cursor: "pointer" }}
        />
      ))}
    </Group>
  );
};
