"use client";
import { useTagsFilters } from "@/store/filters";
import { Group, Badge, ActionIcon } from "@mantine/core";
import React from "react";
import { MdOutlineClose } from "react-icons/md";

export const SelectedTags = () => {
  const { tags, removeTag } = useTagsFilters((state) => state);

  return (
    <Group my="sm">
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
    </Group>
  );
};
