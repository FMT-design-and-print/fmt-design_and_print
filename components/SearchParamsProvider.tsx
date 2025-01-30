"use client";

import { Suspense } from "react";
import { LoadingOverlay } from "@mantine/core";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const SearchParamsProvider = ({ children, fallback }: Props) => {
  return (
    <Suspense fallback={fallback || <LoadingOverlay visible />}>
      {children}
    </Suspense>
  );
};
