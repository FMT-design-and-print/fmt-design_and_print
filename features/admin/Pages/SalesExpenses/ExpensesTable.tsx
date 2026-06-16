import { Expenses } from "@/types/sales-expenses";
import {
  Avatar,
  Group,
  Table,
  Text,
  ActionIcon,
  Drawer,
  Button,
  Tooltip,
  TextInput,
  Box,
  Pagination,
  Badge,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEye, IconEdit, IconSearch, IconTrash } from "@tabler/icons-react";
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
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { toast } from "react-toastify";
import { createClient } from "@/utils/supabase/client";
import { open } from "fs";

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
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const { filteredExpenses } = useExpensesSearch(expenses, search);
  const filteredAndSortedExpenses = useFilters(
    expenses,
    filters,
    filteredExpenses
  );
  const supabase = createClient();

  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;
  
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expenses | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    open();
  };

  const handleEditClick = (expense: Expenses) => {
    onEdit(expense as any);
  };

  const handleDeleteClick = (expense: Expenses) => {
    setExpenseToDelete(expense);
    setDeleteModalOpened(true);
  };

  const confirmDelete = async () => {
    if (!expenseToDelete) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("expenses")
        .update({ 
          isDeleted: true,
          updatedBy: {
            userId: adminUser?.id,
            name: adminUser?.firstName + " " + adminUser?.lastName,
            email: adminUser?.email || "",
            role: adminUser?.role || "",
            image: adminUser?.avatar || "",
          }
        })
        .eq("id", expenseToDelete.id);
      
      if (error) throw error;
      toast.success("Expense deleted successfully");
      setDeleteModalOpened(false);
      setExpenseToDelete(null);
    } catch (err) {
      toast.error("Failed to delete expense");
    } finally {
      setIsDeleting(false);
    }
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
            <Table.Th>Type / Desc</Table.Th>
            <Table.Th style={{ width: "120px" }}>Amount</Table.Th>
            <Table.Th style={{ width: "120px" }}>Bad Debt</Table.Th>
            <Table.Th style={{ width: "120px" }}>Date</Table.Th>
            <Table.Th style={{ width: "120px" }}>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {isLoading ? (
            <Table.Tr>
              <Table.Td colSpan={6}>
                <Text ta="center">Loading expenses...</Text>
              </Table.Td>
            </Table.Tr>
          ) : filteredAndSortedExpenses.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={6}>
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
                  <Text size="sm" fw={500}>{expense.type}</Text>
                  <Text size="xs" c="dimmed" lineClamp={1}>
                    {expense.description}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" fw={600} c="red">
                    {CURRENCY_SYMBOL} {expense.amount.toLocaleString()}
                  </Text>
                </Table.Td>
                <Table.Td>
                  {expense.isBadDebt ? (
                    <Badge color="red" variant="light">Yes</Badge>
                  ) : (
                    <Text size="sm" c="dimmed">-</Text>
                  )}
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{formatDate(expense.created_at)}</Text>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs" wrap="nowrap">
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      onClick={() => handleViewDetails(expense)}
                      title="View Details"
                    >
                      <IconEye size="1.1rem" />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      onClick={() => handleEditClick(expense)}
                      title="Edit Expense"
                    >
                      <IconEdit size="1.1rem" />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => handleDeleteClick(expense)}
                      title="Delete Expense"
                    >
                      <IconTrash size="1.1rem" />
                    </ActionIcon>
                  </Group>
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

      <ConfirmationModal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        onConfirm={confirmDelete}
        title="Delete Expense"
        loading={isDeleting}
        confirmLabel="Delete"
        confirmColor="red"
      >
        Are you sure you want to delete this expense? This action can be reversed by an administrator.
      </ConfirmationModal>

      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        size="xl"
        title="Expense Details"
      >
        {selectedExpense && (
          <Stack>
            <ExpenseDetails expense={selectedExpense} />
          </Stack>
        )}
      </Drawer>
    </Stack>
  );
}
