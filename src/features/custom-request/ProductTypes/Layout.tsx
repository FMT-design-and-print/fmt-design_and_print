import { LoadingOverlay, Stack } from "@mantine/core";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  isLoading: boolean;
  loadingMessage?: string;
}
export const Layout = ({ children, isLoading, loadingMessage }: Props) => {
  return (
    <Stack gap={16} py="lg" pos="relative">
      <LoadingOverlay
        visible={isLoading}
        overlayProps={{ radius: "sm", blur: 2, children: loadingMessage }}
        loaderProps={{ color: "pink", type: "dots" }}
      />

      {children}
    </Stack>
  );
};
