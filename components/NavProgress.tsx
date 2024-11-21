"use client";
import { Group, Skeleton } from "@mantine/core";
import { nprogress, NavigationProgress } from "@mantine/nprogress";
import React, { useEffect } from "react";

export const NavProgress = () => {
  useEffect(() => {
    nprogress.start();

    return () => {
      nprogress.complete();
      nprogress.cleanup();
    };
  }, []);
  return (
    <>
      <NavigationProgress />
      <Group my="xl">
        <Skeleton height={500} width={300} />
        <Skeleton height={500} style={{ flex: 1 }} radius="sm" />
      </Group>
    </>
  );
};
