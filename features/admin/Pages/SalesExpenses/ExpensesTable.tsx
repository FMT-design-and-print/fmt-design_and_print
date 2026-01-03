import { Expenses } from "@/types/sales-expenses";
import {
  Avatar,
  Group,
  Table,
  Text,
  ActionIcon,
  Drawer,
  Stack,
  Button,
  Tooltip,
  TextInput,
  Box,
  Pagination,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEye, IconEdit, IconSearch } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { CURRENCY_SYMBOL } from "../../PriceCalculator/constants";
import ExpensesForm from "./ExpensesForm";
import ExpenseDetails from "./ExpenseDetails";
import { IAdminUser } from "@/types/admin";
import { formatDate } from "./utils";
import { useExpensesSearch } from "./hooks/useSearch";
import { Filters, initialFilters, useFilters } from "./hooks/useFilters";
import { TableFilters } from "./components/TableFilters";
import { ExportButton } from "./components/ExportButton";

interface ExpensesTableProps {
  expenses: Expenses[];
  onEdit: (data: Expenses) => Promise<void>;
  isLoading?: boolean;
  adminUser: IAdminUser | null;
}

export default function ExpensesTable({
  expenses,
  onEdit,
  isLoading,
  adminUser,
}: ExpensesTableProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedExpense, setSelectedExpense] = useState<Expenses | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const { filteredExpenses } = useExpensesSearch(expenses, search);
  const filteredAndSortedExpenses = useFilters(
    expenses,
    filters,
    filteredExpenses
  );

  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setActivePage(1);
  }, [search, filters]);

  const totalPages = Math.ceil(filteredAndSortedExpenses.length / itemsPerPage);
  const paginatedExpenses = filteredAndSortedExpenses.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );

  const handleViewDetails = (expense: Expenses) => {
    setSelectedExpense(expense);
    setIsEditMode(false);
    open();
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  const handleUpdate = async (updatedData: Expenses) => {
    await onEdit(updatedData);
    setIsEditMode(false);
    close();
  };

  return (
    <Stack gap="md">
      <TableFilters
        filters={filters}
        onFiltersChange={setFilters}
        data={expenses}
      />

      <Group justify="space-between" align="flex-start">
        <TextInput
          placeholder="Search by description or expense type..."
          leftSection={<IconSearch size="1rem" />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          style={{ flex: 1 }}
        />
        <Box w="160px">
          <ExportButton data={filteredAndSortedExpenses} filename="expenses" />
        </Box>
      </Group>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: "200px" }}>Created By</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th style={{ width: "120px" }}>Amount</Table.Th>
            <Table.Th style={{ width: "120px" }}>Created At</Table.Th>
            <Table.Th style={{ width: "70px" }}>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {isLoading ? (
            <Table.Tr>
              <Table.Td colSpan={4}>
                <Text ta="center">Loading expenses...</Text>
              </Table.Td>
            </Table.Tr>
          ) : filteredAndSortedExpenses.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={4}>
                <Text ta="center">No expenses found</Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            paginatedExpenses.map((expense) => (
              <Table.Tr key={expense.id}>
                <Table.Td>
                  <Group gap="sm" wrap="nowrap">
                    <Avatar size="sm" src={expense.createdBy.image} />
                    <Tooltip label={expense.createdBy.name}>
                      <Text size="sm" lineClamp={1} style={{ flex: 1 }}>
                        {expense.createdBy.name}
                      </Text>
                    </Tooltip>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" lineClamp={1}>
                    {expense.description}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">
                    {CURRENCY_SYMBOL} {expense.amount.toLocaleString()}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{formatDate(expense.created_at)}</Text>
                </Table.Td>
                <Table.Td>
                  <ActionIcon
                    variant="subtle"
                    color="pink"
                    onClick={() => handleViewDetails(expense)}
                  >
                    <IconEye size="1.1rem" />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>

      {totalPages > 1 && (
        <Group justify="center" mt="md">
          <Pagination
            total={totalPages}
            value={activePage}
            onChange={setActivePage}
            color="pink"
          />
        </Group>
      )}

      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        size="xl"
        title={isEditMode ? "Edit Expense" : "Expense Details"}
      >
        {selectedExpense && (
          <>
            {isEditMode ? (
              <ExpensesForm
                onSubmit={handleUpdate}
                loading={isLoading || false}
                adminUser={adminUser}
                initialData={selectedExpense}
                onCancel={handleCancelEdit}
              />
            ) : (
              <Stack>
                <ExpenseDetails expense={selectedExpense} />
                <Button
                  leftSection={<IconEdit size="1.1rem" />}
                  onClick={handleEdit}
                  color="pink"
                >
                  Edit
                </Button>
              </Stack>
            )}
          </>
        )}
      </Drawer>
    </Stack>
  );
}
