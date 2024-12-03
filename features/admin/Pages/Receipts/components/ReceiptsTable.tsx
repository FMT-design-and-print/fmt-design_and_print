import { useState, useEffect } from "react";
import {
  Table,
  Text,
  ScrollArea,
  UnstyledButton,
  Group,
  Center,
  TextInput,
  ActionIcon,
  Menu,
  Box,
} from "@mantine/core";
import {
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconSelector,
  IconDots,
  IconPencil,
  IconPrinter,
  IconTrash,
} from "@tabler/icons-react";
import { Receipt } from "@/types/receipts";
import {
  formatCurrency,
  formatDate,
} from "../../SalesAndExpensesDashboard/utils/formatters";
import classes from "./ReceiptsTable.module.css";

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort: () => void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={16} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

type SortableKey = keyof Pick<
  Receipt,
  "receiptNumber" | "customerName" | "date" | "totalAmount" | "paymentStatus"
>;

interface ReceiptsTableProps {
  data: Receipt[];
  loading: boolean;
  onEdit: (receipt: Receipt) => void;
  onPrint: (receipt: Receipt) => void;
  onDelete: (id: string) => void;
}

export function ReceiptsTable({
  data,
  loading,
  onEdit,
  onPrint,
  onDelete,
}: ReceiptsTableProps) {
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<SortableKey | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  useEffect(() => {
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const filterData = (data: Receipt[], search: string) => {
    const query = search.toLowerCase().trim();
    return data.filter(
      (item) =>
        item.customerName.toLowerCase().includes(query) ||
        item.receiptNumber.toLowerCase().includes(query)
    );
  };

  const sortData = (
    data: Receipt[],
    payload: { sortBy: SortableKey | null; reversed: boolean; search: string }
  ) => {
    const { sortBy } = payload;

    if (!sortBy) {
      return filterData(data, payload.search);
    }

    return filterData(
      [...data].sort((a, b) => {
        if (payload.reversed) {
          return String(b[sortBy]).localeCompare(String(a[sortBy]));
        }
        return String(a[sortBy]).localeCompare(String(b[sortBy]));
      }),
      payload.search
    );
  };

  const setSorting = (field: SortableKey) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search: value })
    );
  };

  const rows = sortedData.map((row) => (
    <Table.Tr key={row.id}>
      <Table.Td>{row.receiptNumber}</Table.Td>
      <Table.Td>{row.customerName}</Table.Td>
      <Table.Td>{formatDate(row.date)}</Table.Td>
      <Table.Td>{formatCurrency(row.totalAmount)}</Table.Td>
      <Table.Td>
        <Text size="sm" c={row.paymentStatus === "paid" ? "green" : "red"}>
          {row.paymentStatus.toUpperCase()}
        </Text>
      </Table.Td>
      <Table.Td>
        <Menu position="bottom-end" shadow="sm">
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray">
              <IconDots size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconPencil size={16} />}
              onClick={() => onEdit(row)}
            >
              Edit
            </Menu.Item>
            <Menu.Item
              leftSection={<IconPrinter size={16} />}
              onClick={() => onPrint(row)}
            >
              Print
            </Menu.Item>
            <Menu.Item
              leftSection={<IconTrash size={16} />}
              color="red"
              onClick={() => onDelete(row.id)}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea>
      <TextInput
        placeholder="Search by receipt number or customer name"
        mb="md"
        leftSection={<IconSearch size={16} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Box className={classes.tableContainer}>
        <Table horizontalSpacing="md" verticalSpacing="xs" miw={700}>
          <Table.Thead>
            <Table.Tr>
              <Th
                sorted={sortBy === "receiptNumber"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("receiptNumber")}
              >
                Receipt No.
              </Th>
              <Th
                sorted={sortBy === "customerName"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("customerName")}
              >
                Customer
              </Th>
              <Th
                sorted={sortBy === "date"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("date")}
              >
                Date
              </Th>
              <Th
                sorted={sortBy === "totalAmount"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("totalAmount")}
              >
                Amount
              </Th>
              <Th
                sorted={sortBy === "paymentStatus"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("paymentStatus")}
              >
                Status
              </Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {loading ? (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Text fw={500} ta="center">
                    Loading...
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Text fw={500} ta="center">
                    Nothing found
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Box>
    </ScrollArea>
  );
}
