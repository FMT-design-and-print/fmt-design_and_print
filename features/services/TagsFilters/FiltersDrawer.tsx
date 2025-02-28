"use client";
import { Button, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";
import { CiFilter } from "react-icons/ci";
import { TagsFilters } from ".";

interface Props {
  availableTags: string[];
}

export const FiltersDrawer = ({ availableTags }: Props) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer
        offset={8}
        radius="md"
        opened={opened}
        onClose={close}
        title="Filters"
        position="right"
      >
        <TagsFilters availableTags={availableTags} />
      </Drawer>

      <Button
        onClick={open}
        variant="light"
        color="gray"
        leftSection={<CiFilter />}
        hiddenFrom="md"
        w={{ base: "100px", md: "120px" }}
      >
        Filters
      </Button>
    </>
  );
};
