import { Center, Pagination } from "@mantine/core";
import { usePagination } from "@mantine/hooks";
import React from "react";

interface Props {
  itemsPerPage?: number;
  itemsLength: number;
  onPageChange: (start: number, end: number) => void;
}
export const PaginationRenderer = ({
  itemsLength,
  itemsPerPage = 20,
  onPageChange,
}: Props) => {
  const total = Math.ceil(itemsLength / itemsPerPage);

  const { active, setPage } = usePagination({
    total,
    initialPage: 1,
    onChange(page) {
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      onPageChange(start, end);
    },
  });

  return (
    <Center my="xl">
      <Pagination
        color="pink"
        value={active}
        onChange={setPage}
        total={total}
      />
    </Center>
  );
};
