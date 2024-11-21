import { useTagsFilters } from "@/store/filters";
import { Button } from "@mantine/core";
import React from "react";
import { CiFilter } from "react-icons/ci";

export const DesktopFiltersBtn = () => {
  const { isExpanded, setIsExpanded } = useTagsFilters();

  return (
    <>
      {!isExpanded && (
        <Button
          onClick={() => setIsExpanded(true)}
          leftSection={<CiFilter />}
          variant="light"
          color="gray"
          visibleFrom="md"
        >
          Filters
        </Button>
      )}
    </>
  );
};
