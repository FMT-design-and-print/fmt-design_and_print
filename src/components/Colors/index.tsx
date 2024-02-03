import { ProductColor, SelectedProductOptions } from "@/types";
import { Avatar, Box, CheckIcon, Group, Text } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";
import classes from "./Style.module.css";

interface Props {
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
  mainColor,
  selectedColor,
  colors = [],
  setSelectedProductOptions,
}: Props) => {
  const handleColorSelect = (color: ProductColor) => {
    const colorId = color.id;

    if (colors != null && colors.length !== 0) {
      setSelectedProductOptions((prevState) => ({
        ...prevState,
        color,
        image: colors.find((color) => color.color.id === colorId)?.image || "",
      }));
    }
  };

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
              onClick={() => handleColorSelect(mainColor)}
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
              onClick={() => handleColorSelect(color.color)}
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