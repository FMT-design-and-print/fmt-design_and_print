import { SelectedProductOptions } from "@/types";
import { Box, Center, Group, Paper, Text } from "@mantine/core";
import { Dispatch, SetStateAction, useEffect } from "react";
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

  useEffect(() => {
    if (sizes?.length === 1) {
      handleSizeSelect(sizes[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sizes?.length]);

  if (sizes != null && sizes.length !== 0) {
    return (
      <Box mb="sm">
        <Text fw="bold">Size</Text>
        <Text size="sm" c="dimmed">
          Please choose size below
        </Text>
        <Group gap="xs" my="xs">
          {sizes.map((size, i) => (
            <Paper
              onClick={() => handleSizeSelect(size)}
              key={size + i}
              px={10}
              withBorder
              style={{
                borderWidth: selectedSize === size ? "2px" : "1px",
                borderColor:
                  selectedSize === size
                    ? "#f76b92"
                    : "var(--mantine-color-gray-4)",
              }}
              className={classes["size-card"]}
            >
              <Center w="100%" h="100%">
                <Text size="sm">{size}</Text>
              </Center>
            </Paper>
          ))}
        </Group>
      </Box>
    );
  }

  return null;
};
