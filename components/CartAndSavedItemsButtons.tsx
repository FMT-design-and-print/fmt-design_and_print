"use client";
import { useCart } from "@/store/cart";
import { useFavorites } from "@/store/favorites";
import { ActionIcon, Flex, Indicator, rem } from "@mantine/core";
import Link from "next/link";
import React from "react";
import { HiOutlineHeart } from "react-icons/hi";
import { MdShoppingCart } from "react-icons/md";

const CartAndSavedItemsButtons = () => {
  const cartItems = useCart((state) => state.items);
  const favoriteItems = useFavorites((state) => state.items);

  return (
    <Flex
      justify="flex-end"
      gap={{ base: "xs", sm: "md" }}
      miw={{ base: "fit-content", sm: "120px" }}
    >
      <Indicator
        label={favoriteItems.length}
        color="red"
        size={14}
        disabled={!favoriteItems.length}
      >
        <ActionIcon
          component={Link}
          href="/favorites"
          size={32}
          variant="light"
          color="white"
          aria-label="Favorites"
        >
          <HiOutlineHeart style={{ width: rem(24), height: rem(24) }} />
        </ActionIcon>
      </Indicator>

      <Indicator
        inline
        label={cartItems.length}
        size={14}
        color="red"
        disabled={!cartItems.length}
      >
        <ActionIcon
          component={Link}
          href="/cart"
          size={32}
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

export default CartAndSavedItemsButtons;
