import { Box, Card, Center, Group, Text } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import classes from "./Style.module.css";
import { useCreateQueryString } from "@/hooks/useCreateQueryString";

interface Props {
  sizes?: string[] | null;
}
export const Sizes = ({ sizes }: Props) => {
  const searchParams = useSearchParams();
  const createQueryString = useCreateQueryString();
  const { push } = useRouter();
  const selectedSize = searchParams.get("size");

  const handleSizeSelect = (size: string) => {
    const newParams = createQueryString("size", size);
    push("?" + newParams);
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
