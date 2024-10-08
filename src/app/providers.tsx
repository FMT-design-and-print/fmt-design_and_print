"use client";
import { MantineProvider } from "@mantine/core";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NavigationProgress } from "@mantine/nprogress";

const queryClient = new QueryClient();

interface Props {
  children: ReactNode;
}
export const Providers = ({ children }: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <MantineProvider defaultColorScheme="light">
        <NavigationProgress />
        {children}
      </MantineProvider>
    </QueryClientProvider>
  );
};
