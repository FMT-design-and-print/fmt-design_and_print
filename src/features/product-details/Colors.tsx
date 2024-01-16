"use client";
import { ProductColor } from "@/types";
import { Avatar, CheckIcon, Group } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import classes from "./Style.module.css";

interface Props {
  mainColor?: ProductColor;
  colors: {
    id: string;
    image: string;
    color: ProductColor;
  }[];
}
export const Colors = ({ mainColor, colors }: Props) => {
  const searchParams = useSearchParams();
  const { push } = useRouter();
  const colorId = searchParams.get("colorId");

  const handleColorClick = (colorId: string) => {
    if (colors.length !== 0) {
      push(`?colorId=${colorId}`);
    }
  };

  return (
    <Group gap="xs" my="xs">
      {mainColor && (
        <div className={classes["color-wrapper"]} title={mainColor.title}>
          <Avatar
            size="sm"
            src={mainColor.image}
            variant="outline"
            onClick={() => handleColorClick(mainColor.id)}
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
            onClick={() => handleColorClick(color.color.id)}
          />
          {colorId === color.color.id && (
            <CheckIcon className={classes["check-icon"]} />
          )}
        </div>
      ))}
    </Group>
  );
};
