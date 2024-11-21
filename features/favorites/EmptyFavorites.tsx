import { PrimaryButton } from "@/components/PrimaryButton";
import { Avatar, Box, Center, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";

export const EmptyFavorites = () => {
  const sm = useMediaQuery("(max-width: 56.25em)");

  return (
    <Center
      bg="gray.2"
      w={{ base: "95%", md: "70%", lg: "60%" }}
      mx="auto"
      py={{ base: "sm", sm: "xl" }}
      mt="xl"
    >
      <Box py={{ base: "sm", md: "xl" }}>
        <Avatar
          src="./favorite_11034969.png"
          size={sm ? "200px" : "300px"}
          mx="auto"
          radius="0"
        />
        <Text fw="bold" size="lg" ta="center" c="dimmed">
          No Items added to favorites
        </Text>
        <Center my="sm">
          <Link href="/services">
            <PrimaryButton type="button">Continue Shopping</PrimaryButton>
          </Link>
        </Center>
      </Box>
    </Center>
  );
};
