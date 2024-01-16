import { Button, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";
import { CiFilter } from "react-icons/ci";
import { TagsFilters } from ".";

export const FiltersDrawer = () => {
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
        <TagsFilters />
      </Drawer>

      <Button
        onClick={open}
        variant="light"
        color="gray"
        leftSection={<CiFilter />}
        hiddenFrom="md"
        w={{ base: "fit-content", sm: 200 }}
      >
        Filters
      </Button>
    </>
  );
};
