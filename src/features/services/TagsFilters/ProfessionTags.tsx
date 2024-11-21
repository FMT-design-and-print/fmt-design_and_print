import { useTagsFilters } from "@/store/filters";
import { ITag } from "@/types";
import { Box, Title, ScrollArea, Checkbox, Input } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";

interface Props {
  professionTags: ITag[];
}

export const ProfessionTags = ({ professionTags }: Props) => {
  const [professionTagsSearchTerm, setProfessionTagsSearchTerm] = useState("");
  const [filteredProfessionTags, setFilteredProfessionTags] = useState<ITag[]>(
    []
  );
  const { tags, addTag, removeTag } = useTagsFilters((state) => state);

  useEffect(() => {
    if (professionTags.length > 0) {
      setFilteredProfessionTags(
        professionTags.filter((tag) =>
          tag.name
            .toLowerCase()
            .includes(professionTagsSearchTerm.toLowerCase())
        )
      );
    }
  }, [professionTags, professionTagsSearchTerm]);

  return (
    <Box bg="gray.1" p="xs" my="sm">
      <Title order={4} tt="uppercase" mb={4}>
        Occupation and Profession
      </Title>
      <Input
        value={professionTagsSearchTerm}
        onChange={(e) => setProfessionTagsSearchTerm(e.currentTarget.value)}
        placeholder="Search occupation and professsion..."
        size="xs"
        leftSection={<BsSearch size="11px" />}
      />
      <ScrollArea h={300} p="xs">
        {filteredProfessionTags.map((tag) => (
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
