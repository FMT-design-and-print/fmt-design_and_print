import { Table, Group, Text } from "@mantine/core";
import {
  IconChevronUp,
  IconChevronDown,
  IconSelector,
} from "@tabler/icons-react";

interface SortableHeaderProps {
  label: string;
  field: string;
  currentSort?: { id: string; desc: boolean };
  onSort: (field: string) => void;
}

export function SortableHeader({
  label,
  field,
  currentSort,
  onSort,
}: SortableHeaderProps) {
  const isActive = currentSort?.id === field;

  return (
    <Table.Th onClick={() => onSort(field)} style={{ cursor: "pointer" }}>
      <Group gap={2} wrap="nowrap">
        <Text size="sm" fw={500}>
          {label}
        </Text>
        {isActive ? (
          currentSort.desc ? (
            <IconChevronDown size={14} stroke={1.5} />
          ) : (
            <IconChevronUp size={14} stroke={1.5} />
          )
        ) : (
          <IconSelector size={14} stroke={1.5} style={{ opacity: 0.5 }} />
        )}
      </Group>
    </Table.Th>
  );
}
