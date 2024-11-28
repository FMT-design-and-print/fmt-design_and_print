"use client";
import { MantineProvider } from "@mantine/core";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NavigationProgress } from "@mantine/nprogress";
import "@mantine/carousel/styles.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/nprogress/styles.css";
import "@mantine/tiptap/styles.css";
import "@mantine/notifications/styles.css";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

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
