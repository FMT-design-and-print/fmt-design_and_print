"use client";
import { ProductColor } from "@/types";
import { Avatar, Box, CheckIcon, Group, Text } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import classes from "./Style.module.css";
import { useCreateQueryString } from "@/hooks/useCreateQueryString";

interface Props {
  mainColor?: ProductColor;
  colors:
    | {
        id: string;
        image: string;
        color: ProductColor;
      }[]
    | null;
}
export const Colors = ({ mainColor, colors = [] }: Props) => {
  const searchParams = useSearchParams();
  const createQueryString = useCreateQueryString();
  const { push } = useRouter();
  const colorId = searchParams.get("colorId");

  const handleColorSelect = (colorId: string) => {
    if (colors != null && colors.length !== 0) {
      const newParams = createQueryString("colorId", colorId);
      push("?" + newParams);
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
              onClick={() => handleColorSelect(mainColor.id)}
            />
            {(!colorId || (colorId && colorId === mainColor.id)) && (
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
              onClick={() => handleColorSelect(color.color.id)}
            />
            {colorId === color.color.id && (
              <CheckIcon className={classes["check-icon"]} />
            )}
          </div>
        ))}
      </Group>
    </Box>
  );
};
