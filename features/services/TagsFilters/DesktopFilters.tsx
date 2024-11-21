import { useTagsFilters } from "@/store/filters";
import { ActionIcon, Card, Group, Text } from "@mantine/core";
import { IconArrowBarLeft } from "@tabler/icons-react";
import { CiFilter } from "react-icons/ci";
import { TagsFilters } from ".";

export const DesktopFilters = () => {
  const { setIsExpanded } = useTagsFilters();

  return (
    <>
      <Card withBorder>
        <Group justify="space-between" mb="md">
          <Group gap="xs">
            <CiFilter />
            <Text size="sm">Filters</Text>
          </Group>

          <ActionIcon
            variant="transparent"
            color="gray"
            onClick={() => setIsExpanded(false)}
          >
            <IconArrowBarLeft />
          </ActionIcon>
        </Group>

        <TagsFilters />
      </Card>
    </>
  );
};
