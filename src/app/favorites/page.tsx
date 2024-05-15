import { Favorites } from "@/features/favorites";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Favorites | FMT Design and Print",
};

const FavoritesPage = () => {
  return (
    <>
      <Favorites />
    </>
  );
};

export default FavoritesPage;
