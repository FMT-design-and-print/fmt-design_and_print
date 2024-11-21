"use client";
import { Box, Button, Title } from "@mantine/core";
import { EmptyFavorites } from "./EmptyFavorites";
import { useFavorites } from "@/store/favorites";
import { IFavoriteItem } from "@/types";
import { useEffect, useState } from "react";
import { FavoriteCard } from "./FavoriteCard";

export const Favorites = () => {
  const [favoriteItems, setsFavoriteItems] = useState<IFavoriteItem[]>([]);
  const { items, clearFavorites } = useFavorites();

  useEffect(() => {
    // re-set favorite items as local state to avoid hydration error because of the if check
    setsFavoriteItems(items);
  }, [items]);

  if (favoriteItems.length === 0) {
    return <EmptyFavorites />;
  }

  return (
    <Box w={{ base: "95%", md: "80%" }} mx="auto">
      <Title order={2} mt="xl" mb="sm">
        Favorites ({favoriteItems.length})
      </Title>

      {favoriteItems.map((item) => (
        <FavoriteCard key={item.id} item={item} />
      ))}

      <Button variant="light" color="gray" onClick={clearFavorites}>
        Clear all
      </Button>
    </Box>
  );
};
