"use client";
import { Grid } from "@mantine/core";
import dynamic from "next/dynamic";
import { SearchWithButton } from "../Search/SearchWithButton";

const CartAndSavedItemsButtons = dynamic(
  () => import("../CartAndSavedItemsButtons"),
  {
    ssr: false,
  }
);

export const SearchSection = () => {
  return (
    <Grid align="flex-end" gutter="sm">
      <Grid.Col span="auto">
        <SearchWithButton />
      </Grid.Col>
      <Grid.Col span="content" visibleFrom="sm">
        <CartAndSavedItemsButtons />
      </Grid.Col>
    </Grid>
  );
};
