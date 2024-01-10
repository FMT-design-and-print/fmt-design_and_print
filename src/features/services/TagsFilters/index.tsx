"use client";
import { useTags } from "@/hooks/useTags";
import { Card } from "@mantine/core";
import { ProductTags } from "./ProductTags";
import { ProfessionTags } from "./ProfessionTags";

export const TagsFilters = () => {
  const { tags } = useTags();

  return (
    <Card withBorder>
      <ProductTags productTags={tags?.productTags || []} />
      <ProfessionTags professionTags={tags?.professionTags || []} />
    </Card>
  );
};
