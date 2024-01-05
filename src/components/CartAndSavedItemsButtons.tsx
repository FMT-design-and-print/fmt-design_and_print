import { ActionIcon, Flex, Indicator, rem } from "@mantine/core";
import Link from "next/link";
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
      <Indicator label={0} color="red" size={14} disabled={false}>
        <ActionIcon
          component={Link}
          href="/favorites"
          size={36}
          variant="light"
          color="white"
          aria-label="Favorites"
        >
          <HiOutlineHeart style={{ width: rem(24), height: rem(24) }} />
        </ActionIcon>
      </Indicator>

      <Indicator inline label={0} size={14} color="red">
        <ActionIcon
          component={Link}
          href="/cart"
          size={36}
          variant="light"
          color="white"
          aria-label="Cart"
        >
          <MdShoppingCart style={{ width: rem(24), height: rem(24) }} />
        </ActionIcon>
      </Indicator>
    </Flex>
  );
};
