"use client";
import { useTagsFilters } from "@/store/filters";
import { ActionIcon, Badge, Flex, Group } from "@mantine/core";
import { IconExternalLink, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const SelectedTags = () => {
  const pathname = usePathname();
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
            <Group gap={0}>
              <ActionIcon
                px="1px"
                variant="subtle"
                color="pink"
                aria-label="Search tag in new tab"
                title="Search tag in new tab"
                component={Link}
                href={`${pathname}/search/${tag.name}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconExternalLink size="0.8rem" />
              </ActionIcon>
              <ActionIcon
                px="1px"
                color="pink"
                aria-label="Remove tag"
                onClick={() => removeTag(tag.id)}
              >
                <IconX size="0.8rem" />
              </ActionIcon>
            </Group>
          }
        >
          {tag.name}
        </Badge>
      ))}
    </Flex>
  );
};
