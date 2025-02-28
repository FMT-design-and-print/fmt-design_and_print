import { useTags } from "@/hooks/useTags";
import { ProductTags } from "./ProductTags";
import { ProfessionTags } from "./ProfessionTags";
import { ITag } from "@/types";

interface Props {
  availableTags: string[];
}

// Extended tag interface to include possible Sanity field names
interface ExtendedTag extends ITag {
  productTagName?: string;
  professionTagName?: string;
}

export const TagsFilters = ({ availableTags = [] }: Props) => {
  const { tags } = useTags();

  // Filter tags to only show those that are available in the current products
  const filteredProductTags =
    tags?.productTags?.filter((tag) => {
      const extendedTag = tag as ExtendedTag;
      const tagName = extendedTag.productTagName || tag.name;
      return availableTags.includes(tagName);
    }) || [];

  const filteredProfessionTags =
    tags?.professionTags?.filter((tag) => {
      const extendedTag = tag as ExtendedTag;
      const tagName = extendedTag.professionTagName || tag.name;
      return availableTags.includes(tagName);
    }) || [];

  // Find extra tags that aren't in either product or profession tags
  const allKnownTags = new Set([
    ...filteredProductTags.map(
      (tag) => (tag as ExtendedTag).productTagName || tag.name
    ),
    ...filteredProfessionTags.map(
      (tag) => (tag as ExtendedTag).professionTagName || tag.name
    ),
  ]);

  // Create ITag objects for extra tags
  const extraTags: ITag[] = availableTags
    .filter((tag) => !allKnownTags.has(tag))
    .map((tag) => ({
      id: tag,
      name: tag,
    }));

  // Add extra tags to product tags section
  const allProductTags = [...filteredProductTags, ...extraTags];

  return (
    <>
      <ProductTags productTags={allProductTags} />
      <ProfessionTags professionTags={filteredProfessionTags} />
    </>
  );
};
