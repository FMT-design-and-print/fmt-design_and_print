import { SelectedProductOptions } from "@/types";
import { Box, Card, Center, Group, Text } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";
import classes from "./Style.module.css";

interface Props {
  sizes?: string[] | null;
  selectedSize: string;
  setSelectedProductOptions: Dispatch<SetStateAction<SelectedProductOptions>>;
}
export const Sizes = ({
  sizes,
  selectedSize,
  setSelectedProductOptions,
}: Props) => {
  const handleSizeSelect = (size: string) => {
    setSelectedProductOptions((prevState) => ({ ...prevState, size }));
  };

  if (sizes != null && sizes.length !== 0) {
    return (
      <Box mb="sm">
        <Text fw="bold">Size</Text>
        <Text size="sm" c="dimmed">
          Please choose size below
        </Text>
        <Group gap="xs" my="xs">
          {sizes.map((size, i) => (
            <Card
              onClick={() => handleSizeSelect(size)}
              key={size + i}
              p={0}
              withBorder
              style={{
                borderColor:
                  selectedSize === size
                    ? "pink"
                    : "var(--mantine-color-gray-4)",
              }}
              className={classes["size-card"]}
            >
              <Center w="100%" h="100%">
                <Text size="sm">{size}</Text>
              </Center>
            </Card>
          ))}
        </Group>
      </Box>
    );
  }

  return null;
};
