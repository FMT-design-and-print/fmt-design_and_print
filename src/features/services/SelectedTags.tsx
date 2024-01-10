"use client";
import { useTagsFilters } from "@/store/filters";
import { ActionIcon, Badge, Flex } from "@mantine/core";
import { MdOutlineClose } from "react-icons/md";

export const SelectedTags = () => {
  const { tags, removeTag } = useTagsFilters((state) => state);

  return (
    <Flex
      gap="sm"
      wrap="wrap"
      align="center"
      my="sm"
      justify={{ base: "center", sm: "flex-start" }}
    >
      {tags.map((tag) => (
        <Badge
          pr="0"
          variant="outline"
          color="pink"
          radius="sm"
          key={tag.id}
          rightSection={
            <ActionIcon
              color="pink"
              aria-label="Remove tag"
              onClick={() => removeTag(tag.id)}
            >
              <MdOutlineClose />
            </ActionIcon>
          }
        >
          {tag.name}
        </Badge>
      ))}
    </Flex>
  );
};
