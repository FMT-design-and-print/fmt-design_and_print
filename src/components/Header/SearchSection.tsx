"use client";
import { Grid } from "@mantine/core";
import { CartAndSavedItemsButtons } from "../CartAndSavedItemsButtons";
import { SearchWithButton } from "../Search/SearchWithButton";

export const SearchSection = () => {
  return (
    <Grid align="flex-end" gutter={{ base: "md", sm: "xl" }} pt="md">
      <Grid.Col span="auto">
        <SearchWithButton />
      </Grid.Col>
      <Grid.Col span="content" visibleFrom="sm">
        <CartAndSavedItemsButtons />
      </Grid.Col>
    </Grid>
  );
};
