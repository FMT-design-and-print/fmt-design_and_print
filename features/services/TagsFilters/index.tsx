import { useTags } from "@/hooks/useTags";
import { ProductTags } from "./ProductTags";
import { ProfessionTags } from "./ProfessionTags";

export const TagsFilters = () => {
  const { tags } = useTags();

  return (
    <>
      <ProductTags productTags={tags?.productTags || []} />
      <ProfessionTags professionTags={tags?.professionTags || []} />
    </>
  );
};
