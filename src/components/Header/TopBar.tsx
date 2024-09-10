import { Divider, Flex, Text } from "@mantine/core";
import Link from "next/link";
import React from "react";
import { MdCall, MdEmail } from "react-icons/md";

export const TopBar = () => {
  return (
    <Flex
      px="xl"
      py="xs"
      bg="gray.1"
      gap={{ base: "md", sm: "xl" }}
      direction={{ base: "column", sm: "row" }}
    >
      <Text size="sm" visibleFrom="sm">
        Customer Support
      </Text>
      <Divider
        hiddenFrom="sm"
        label={
          <Text size="sm" c="gray.9">
            Customer Support
          </Text>
        }
        labelPosition="center"
        my="sm"
      />
      <Flex
        gap={16}
        align="center"
        justify={{ base: "center", sm: "flex-start" }}
        wrap="wrap"
      >
        <Flex component={Link} href="tel:+233 537656594" align="center" gap={4}>
          <Text c="gray.6">
            <MdCall />
          </Text>
          <Text c="gray.6" size="sm">
            +233 537656594
          </Text>
        </Flex>
        <Flex
          component={Link}
          href="mailto:support@fmtdesignprint.com"
          align="center"
          gap={4}
        >
          <Text c="gray.6">
            <MdEmail />
          </Text>
          <Text c="gray.6" size="sm">
            support@fmtdesignprint.com
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
