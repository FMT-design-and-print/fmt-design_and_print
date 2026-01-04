import { Select, Stack, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useSearchParams } from "next/navigation";
import { useUrlSearchParams } from "@/hooks/useUpdateURLSearchParams";
import { IconCalendar } from "@tabler/icons-react";

export const SortAndDateFilters = () => {
  const searchParams = useSearchParams();
  const updateSearchParams = useUrlSearchParams();

  const sortBy = searchParams.get("sort") || "date";
  const sortDir = searchParams.get("dir") || "desc";
  
  // Date range
  const startDate = searchParams.get("from") ? new Date(searchParams.get("from")!) : null;
  const endDate = searchParams.get("to") ? new Date(searchParams.get("to")!) : null;

  const handleSortChange = (value: string | null) => {
    if (!value) return;
    const [field, direction] = value.split("_");
    updateSearchParams({ sort: field, dir: direction });
  };

  const handleDateChange = (value: [Date | null, Date | null]) => {
    const [start, end] = value;
    updateSearchParams({
      from: start ? start.toISOString() : null,
      to: end ? end.toISOString() : null,
    });
  };

  return (
    <Stack gap="xs" mb="md">
      <Box>
        <Text size="sm" fw={500} mb={4}>Sort By</Text>
        <Select
          value={`${sortBy}_${sortDir}`}
          onChange={handleSortChange}
          data={[
            { value: "date_desc", label: "Date: Newest First" },
            { value: "date_asc", label: "Date: Oldest First" },
            { value: "name_asc", label: "Name: A - Z" },
            { value: "name_desc", label: "Name: Z - A" },
            { value: "price_asc", label: "Price: Low to High" },
            { value: "price_desc", label: "Price: High to Low" },
          ]}
          allowDeselect={false}
        />
      </Box>

      <Box>
        <Text size="sm" fw={500} mb={4}>Date Range</Text>
        <DatePickerInput
          type="range"
          placeholder="Pick dates range"
          value={[startDate, endDate]}
          onChange={handleDateChange}
          leftSection={<IconCalendar size={16} />}
          clearable
        />
      </Box>
    </Stack>
  );
};

import { Box } from "@mantine/core";
