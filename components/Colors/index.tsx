import { ProductColor, SelectedProductOptions } from "@/types";
import { Avatar, Box, CheckIcon, Group, Text } from "@mantine/core";
import { Dispatch, SetStateAction, useEffect } from "react";
import classes from "./Style.module.css";

interface Props {
  mainImage: string;
  mainColor?: ProductColor;
  selectedColor?: ProductColor;
  setSelectedProductOptions: Dispatch<SetStateAction<SelectedProductOptions>>;
  colors:
    | {
        id: string;
        image: string;
        color: ProductColor;
      }[]
    | null;
}
export const Colors = ({
  mainImage,
  mainColor,
  selectedColor,
  colors = [],
  setSelectedProductOptions,
}: Props) => {
  const handleColorSelect = (color: ProductColor, image: string) => {
    setSelectedProductOptions((prevState) => ({
      ...prevState,
      color,
      image,
    }));
  };

  useEffect(() => {
    setSelectedProductOptions((prevState) => ({
      ...prevState,
      color: mainColor,
      image: mainImage,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box mb="sm" maw={700}>
      <Text fw="bold">Color</Text>
      <Text size="sm" c="dimmed">
        Please choose color below
      </Text>

      <Group gap="xs" my="xs">
        {mainColor && (
          <div className={classes["color-wrapper"]} title={mainColor.title}>
            <Avatar
              size="sm"
              src={mainColor.image}
              variant="outline"
              onClick={() => handleColorSelect(mainColor, mainImage)}
            />
            {selectedColor?.id === mainColor.id && (
              <CheckIcon className={classes["check-icon"]} />
            )}
          </div>
        )}
        {colors?.map((color) => (
          <div
            key={color.id}
            className={classes["color-wrapper"]}
            title={color.color.title}
          >
            <Avatar
              size="sm"
              src={color.color.image}
              variant="outline"
              onClick={() => handleColorSelect(color.color, color.image)}
            />
            {selectedColor?.id === color.color.id && (
              <CheckIcon className={classes["check-icon"]} />
            )}
          </div>
        ))}
      </Group>
    </Box>
  );
};
