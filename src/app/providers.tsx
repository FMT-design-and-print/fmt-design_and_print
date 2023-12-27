"use client";
import { MantineProvider } from "@mantine/core";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
export const Providers = ({ children }: Props) => {
  return <MantineProvider>{children}</MantineProvider>;
};
