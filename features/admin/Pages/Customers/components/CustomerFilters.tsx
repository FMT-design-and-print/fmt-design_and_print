/* eslint-disable @typescript-eslint/no-explicit-any */
import { Group, TextInput, Button, Menu, Select } from "@mantine/core";
import { IconFilter, IconSearch, IconDownload } from "@tabler/icons-react";
import { CSVLink } from "react-csv";
import { IUserDetails } from "@/types/user";

interface CustomerFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterBy: string | null;
  filterValue: string | null;
  onFilterByChange: (value: string | null) => void;
  onFilterValueChange: (value: string | null) => void;
  customers: IUserDetails[];
  csvData: any[];
}

export function CustomerFilters({
  searchTerm,
  onSearchChange,
  filterBy,
  filterValue,
  onFilterByChange,
  onFilterValueChange,
  customers,
  csvData,
}: CustomerFiltersProps) {
  return (
    <Group justify="space-between" mb="md">
      <TextInput
        placeholder="Search customers..."
        leftSection={<IconSearch size={16} />}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.currentTarget.value)}
        style={{ width: 300 }}
        size="xs"
      />

      <Group>
        <Menu>
          <Menu.Target>
            <Button
              leftSection={<IconFilter size={16} />}
              variant="light"
              size="xs"
              color="pink"
            >
              Filter
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Filter by</Menu.Label>
            <Menu.Item
              onClick={() => {
                onFilterByChange("gender");
                onFilterValueChange(null);
              }}
            >
              Gender
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                onFilterByChange("region");
                onFilterValueChange(null);
              }}
            >
              Region
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                onFilterByChange("country");
                onFilterValueChange(null);
              }}
            >
              Country
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>

        {filterBy && (
          <Select
            placeholder={`Select ${filterBy}`}
            value={filterValue}
            onChange={onFilterValueChange}
            data={
              Array.from(
                new Set(customers.map((c) => c[filterBy as keyof IUserDetails]))
              ).filter(Boolean) as string[]
            }
          />
        )}

        <CSVLink
          data={csvData}
          filename="customers.csv"
          style={{ textDecoration: "none" }}
        >
          <Button
            leftSection={<IconDownload size={16} />}
            variant="light"
            size="xs"
            color="pink"
          >
            Export
          </Button>
        </CSVLink>
      </Group>
    </Group>
  );
}
