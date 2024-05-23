import { Favorites } from "@/features/favorites";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Favorites | FMT Design and Print",
};

const FavoritesPage = async () => {
  await redirectAdminUser();

  return (
    <>
      <Favorites />
    </>
  );
};

export default FavoritesPage;
