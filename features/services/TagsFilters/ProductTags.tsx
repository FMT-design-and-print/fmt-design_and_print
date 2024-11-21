import { useTagsFilters } from "@/store/filters";
import { ITag } from "@/types";
import { Box, Title, ScrollArea, Checkbox, Input } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";

interface Props {
  productTags: ITag[];
}
export const ProductTags = ({ productTags }: Props) => {
  const [productTagsSearchTerm, setProductsTagsSearchTerm] = useState("");
  const [filteredProductsTags, setFilteredProductsTags] =
    useState<ITag[]>(productTags);
  const { tags, addTag, removeTag } = useTagsFilters((state) => state);

  useEffect(() => {
    if (productTags.length > 0) {
      setFilteredProductsTags(
        productTags.filter((tag) =>
          tag.name.toLowerCase().includes(productTagsSearchTerm.toLowerCase())
        )
      );
    }
  }, [productTags, productTagsSearchTerm]);

  return (
    <Box bg="gray.1" p="xs">
      <Title order={4} tt="uppercase" mb={4}>
        Topic
      </Title>
      <Input
        value={productTagsSearchTerm}
        onChange={(e) => setProductsTagsSearchTerm(e.currentTarget.value)}
        placeholder="Search topic..."
        size="xs"
        leftSection={<BsSearch size="11px" />}
      />
      <ScrollArea h={300} p="xs">
        {filteredProductsTags.map((tag) => (
          <Checkbox
            color="pink"
            key={tag.id}
            my="xs"
            label={tag.name}
            checked={tags.some((item) => item.id === tag.id)}
            onChange={(e) => {
              if (e.currentTarget.checked) {
                addTag(tag);
              } else {
                removeTag(tag.id);
              }
            }}
          />
        ))}
      </ScrollArea>
    </Box>
  );
};
