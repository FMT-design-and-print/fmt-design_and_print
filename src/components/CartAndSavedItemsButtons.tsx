import { ActionIcon, Flex, Indicator, rem } from "@mantine/core";
import React from "react";
import { HiOutlineHeart } from "react-icons/hi";
import { MdShoppingCart } from "react-icons/md";

export const CartAndSavedItemsButtons = () => {
  return (
    <Flex
      justify="flex-end"
      gap={{ base: "md", sm: "xl" }}
      miw={{ base: "fit-content", sm: "200px" }}
    >
      <Indicator label={12} color="red" size={14} disabled={false}>
        <ActionIcon
          size={36}
          variant="light"
          color="gray.200"
          aria-label="Saved items"
        >
          <HiOutlineHeart style={{ width: rem(24), height: rem(24) }} />
        </ActionIcon>
      </Indicator>

      <Indicator inline label={3} size={14} color="red">
        <ActionIcon
          size={36}
          variant="light"
          color="gray.200"
          aria-label="Saved items"
        >
          <MdShoppingCart style={{ width: rem(24), height: rem(24) }} />
        </ActionIcon>
      </Indicator>
    </Flex>
  );
};
