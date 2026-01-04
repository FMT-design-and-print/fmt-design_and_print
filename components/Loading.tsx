"use client";

import { Flex, Text } from "@mantine/core";
import Image from "next/image";
import React from "react";

export const Loading = () => {
  return (
    <Flex
      mih="calc(100vh - 160px)"
      justify="center"
      align="center"
      direction="column"
    >
      <Image
        src="/loading-cart.gif"
        alt="loading cart"
        width={200}
        height={200}
        unoptimized
      />
      <Text c="dimmed">Loading...</Text>
    </Flex>
  );
};
