import { Center, Loader, LoadingOverlay, Stack, Text } from "@mantine/core";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  isLoading: boolean;
  loadingMessage?: string;
}
export const Layout = ({
  children,
  isLoading,
  loadingMessage = "Loading...",
}: Props) => {
  return (
    <Stack gap={16} py="lg" pos="relative">
      <LoadingOverlay
        visible={isLoading}
        overlayProps={{ radius: "sm", blur: 2 }}
        loaderProps={{
          children: (
            <Center>
              <Stack align="center">
                <Loader color="pink" type="dots" />
                <Text>{loadingMessage}</Text>
              </Stack>
            </Center>
          ),
        }}
      />

      {children}
    </Stack>
  );
};
