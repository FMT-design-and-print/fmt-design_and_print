import { useState, useEffect } from "react";
import {
  Paper,
  ScrollArea,
  Text,
  Group,
  Avatar,
  Tooltip,
  ActionIcon,
  Table,
  Center,
  UnstyledButton,
  Pagination,
  Box,
} from "@mantine/core";
import {
  IconEdit,
  IconChevronDown,
  IconChevronUp,
  IconSelector,
} from "@tabler/icons-react";
import { IUserDetails } from "@/types/user";
import { CopyIcon } from "@/components/CopyIcon";
import classes from "./CustomerTable.module.css";

interface CustomerTableProps {
  customers: IUserDetails[];
  totalRecords: number;
  page: number;
  onPageChange: (page: number) => void;
  onEditCustomer: (customer: IUserDetails) => void;
}

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
        <Group justify="space-between" wrap="nowrap">
          <Box style={{ overflow: "hidden" }}>
            <Text fw={500} fz="sm" truncate>
              {children}
            </Text>
          </Box>
          <Center className={classes.icon}>
            <Icon size={16} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function filterData(data: IUserDetails[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    Object.keys(item).some((key) =>
      item[key as keyof IUserDetails]?.toString().toLowerCase().includes(query)
    )
  );
}

function sortData(
  data: IUserDetails[],
  payload: {
    sortBy: keyof IUserDetails | null;
    reversed: boolean;
    search?: string;
  }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search || "");
  }

  return filterData(
    [...data].sort((a, b) => {
      if (!a[sortBy] || !b[sortBy]) return 0;

      if (payload.reversed) {
        return b[sortBy].toString().localeCompare(a[sortBy].toString());
      }
      return a[sortBy].toString().localeCompare(b[sortBy].toString());
    }),
    payload.search || ""
  );
}

export function CustomerTable({
  customers,
  totalRecords,
  page,
  onPageChange,
  onEditCustomer,
}: CustomerTableProps) {
  const [sortedData, setSortedData] = useState(customers);
  const [sortBy, setSortBy] = useState<keyof IUserDetails | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [currentPage, setCurrentPage] = useState(page);

  useEffect(() => {
    setSortedData(customers);
  }, [customers]);

  const PAGE_SIZE = 10;

  // Calculate pagination
  const totalPages = Math.ceil(totalRecords / PAGE_SIZE);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    onPageChange(newPage);
  };

  const setSorting = (field: keyof IUserDetails) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(customers, { sortBy: field, reversed, search: "" }));
  };

  const rows = paginatedData.map((customer) => (
    <Table.Tr key={customer.email}>
      <Table.Td>
        <Avatar
          src={customer.profileImage}
          radius="xl"
          size="md"
          alt={`${customer.firstName} ${customer.lastName}`}
        />
      </Table.Td>
      <Table.Td>
        <Group gap="xs" wrap="nowrap">
          <Tooltip label={customer.email}>
            <Text size="sm" truncate>
              {customer.email}
            </Text>
          </Tooltip>
          {customer.email && <CopyIcon value={customer.email} />}
        </Group>
      </Table.Td>
      <Table.Td>
        <Tooltip label={customer.firstName}>
          <Text size="sm" truncate>
            {customer.firstName}
          </Text>
        </Tooltip>
      </Table.Td>
      <Table.Td>
        <Tooltip label={customer.lastName}>
          <Text size="sm" truncate>
            {customer.lastName}
          </Text>
        </Tooltip>
      </Table.Td>
      <Table.Td>
        <Group gap="xs" wrap="nowrap">
          <Tooltip label={customer.phone}>
            <Text size="sm" truncate>
              {customer.phone}
            </Text>
          </Tooltip>
          {customer.phone && <CopyIcon value={customer.phone} />}
        </Group>
      </Table.Td>
      <Table.Td>
        <Tooltip label={customer.country}>
          <Text size="sm" truncate>
            {customer.country}
          </Text>
        </Tooltip>
      </Table.Td>
      <Table.Td>
        <Tooltip label={customer.region}>
          <Text size="sm" truncate>
            {customer.region}
          </Text>
        </Tooltip>
      </Table.Td>
      <Table.Td>
        <Text size="sm" tt="capitalize">
          {customer.gender}
        </Text>
      </Table.Td>
      <Table.Td>
        <ActionIcon
          color="pink"
          size="sm"
          variant="light"
          onClick={() => onEditCustomer(customer)}
        >
          <IconEdit size="0.8rem" />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Paper radius="md" withBorder>
      <ScrollArea>
        <Table
          horizontalSpacing="md"
          verticalSpacing="xs"
          miw={700}
          stickyHeader
          highlightOnHover
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={80}>
                <Text fw={500} fz="sm">
                  Avatar
                </Text>
              </Table.Th>
              <Th
                sorted={sortBy === "email"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("email")}
              >
                Email
              </Th>
              <Th
                sorted={sortBy === "firstName"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("firstName")}
              >
                First Name
              </Th>
              <Th
                sorted={sortBy === "lastName"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("lastName")}
              >
                Last Name
              </Th>
              <Th
                sorted={sortBy === "phone"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("phone")}
              >
                Phone
              </Th>
              <Th
                sorted={sortBy === "country"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("country")}
              >
                Country
              </Th>
              <Th
                sorted={sortBy === "region"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("region")}
              >
                Region
              </Th>
              <Th
                sorted={sortBy === "gender"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("gender")}
              >
                Gender
              </Th>
              <Table.Th w={80}>
                <Text fw={500} fz="sm">
                  Actions
                </Text>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={9}>
                  <Text fw={500} ta="center">
                    Nothing found
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
      {totalPages > 1 && (
        <Group justify="center" mt="md">
          <Pagination
            value={currentPage}
            onChange={handlePageChange}
            total={totalPages}
          />
        </Group>
      )}
    </Paper>
  );
}
