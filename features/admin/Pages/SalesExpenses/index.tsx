import { useCurrentAdminUser } from "@/hooks/admin/useCurrentAdminUser";
import { useExpenses } from "@/hooks/admin/useExpenses";
import { useSales } from "@/hooks/admin/useSales";
import { useProductTypes } from "@/hooks/useProductTypes";
import { Expenses, ISales } from "@/types/sales-expenses";
import { createClient } from "@/utils/supabase/client";
import { Box, Button, Paper, Stack, Tabs, Group, Title } from "@mantine/core";
import { IconPlus, IconArrowLeft } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ExpensesForm from "./ExpensesForm";
import ExpensesTable from "./ExpensesTable";
import SalesForm from "./SalesForm";
import SalesTable from "./SalesTable";

type ViewState = "list" | "create-sale" | "edit-sale" | "create-expense" | "edit-expense";

export default function SalesExpensesPage() {
  const [activeTab, setActiveTab] = useState<string>("sales");
  const [viewState, setViewState] = useState<ViewState>("list");
  const [editingItem, setEditingItem] = useState<ISales | Expenses | null>(null);
  const [loading, setLoading] = useState(false);
  const { productTypes } = useProductTypes();
  const {
    adminUser,
    loading: loadingAdmin,
    error: adminError,
  } = useCurrentAdminUser();
  const { data: sales, isLoading: loadingSales } = useSales();
  const { data: expenses, isLoading: loadingExpenses } = useExpenses();

  const supabase = createClient();

  useEffect(() => {
    if (adminError) {
      toast.error("Failed to load admin user details");
    }
  }, [adminError]);

  const handleSubmit = async (data: Partial<ISales> | Partial<Expenses>): Promise<void> => {
    if (!adminUser) {
      toast.error("Admin user details not available");
      return;
    }

    setLoading(true);

    try {
      const table = viewState.includes("sale") ? "sales" : "expenses";
      
      if (editingItem) {
        const { error } = await supabase
          .from(table)
          .update(data)
          .eq("id", editingItem.id);

        if (error) throw error;
        toast.success(`${table === "sales" ? "Sale" : "Expense"} updated successfully`);
      } else {
        const { error } = await supabase.from(table).insert([data]);
        if (error) throw error;
        toast.success(`${table === "sales" ? "Sale" : "Expense"} recorded successfully`);
      }

      setViewState("list");
      setEditingItem(null);
    } catch (error) {
      toast.error("Failed to record data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = async (item: ISales | Expenses, type: "sales" | "expenses"): Promise<void> => {
    setEditingItem(item);
    setViewState(type === "sales" ? "edit-sale" : "edit-expense");
  };

  const renderHeader = () => {
    if (viewState !== "list") {
      return (
        <Group justify="space-between" mb="md">
          <Button 
            variant="subtle" 
            color="gray" 
            leftSection={<IconArrowLeft size="1rem" />}
            onClick={() => {
              setViewState("list");
              setEditingItem(null);
            }}
          >
            Back to List
          </Button>
          <Title order={3}>
            {viewState === "create-sale" && "Create New Sale"}
            {viewState === "edit-sale" && "Edit Sale"}
            {viewState === "create-expense" && "Record New Expense"}
            {viewState === "edit-expense" && "Edit Expense"}
          </Title>
        </Group>
      );
    }

    return (
      <Group justify="space-between" mb="md">
        <Tabs
          value={activeTab}
          onChange={(value) => setActiveTab(value as string)}
          variant="pills"
          radius="md"
          color="pink"
        >
          <Tabs.List>
            <Tabs.Tab value="sales">Sales</Tabs.Tab>
            <Tabs.Tab value="expenses">Expenses</Tabs.Tab>
          </Tabs.List>
        </Tabs>

        <Group>
          <Button
            leftSection={<IconPlus size="1rem" />}
            color="pink"
            onClick={() => setViewState(activeTab === "sales" ? "create-sale" : "create-expense")}
            loading={loadingAdmin}
          >
            Add {activeTab === "sales" ? "Sale" : "Expense"}
          </Button>
        </Group>
      </Group>
    );
  };

  return (
    <Box p="md">
      <Paper withBorder p="md">
        <Stack gap="md">
          {renderHeader()}

          {viewState === "list" && activeTab === "sales" && (
            <SalesTable
              sales={sales || []}
              onEdit={(item) => handleEditClick(item, "sales")}
              isLoading={loadingSales}
              productTypes={productTypes || []}
              adminUser={adminUser || null}
            />
          )}

          {viewState === "list" && activeTab === "expenses" && (
            <ExpensesTable
              expenses={expenses || []}
              onEdit={(item) => handleEditClick(item, "expenses")}
              isLoading={loadingExpenses}
              adminUser={adminUser || null}
            />
          )}

          {(viewState === "create-sale" || viewState === "edit-sale") && (
            <SalesForm
              productTypes={productTypes || []}
              onSubmit={handleSubmit}
              loading={loading}
              adminUser={adminUser || null}
              initialData={(editingItem as ISales) || undefined}
              onCancel={() => {
                setViewState("list");
                setEditingItem(null);
              }}
            />
          )}

          {(viewState === "create-expense" || viewState === "edit-expense") && (
            <ExpensesForm
              onSubmit={handleSubmit}
              loading={loading}
              adminUser={adminUser || null}
              initialData={(editingItem as Expenses) || undefined}
              onCancel={() => {
                setViewState("list");
                setEditingItem(null);
              }}
            />
          )}

        </Stack>
      </Paper>
    </Box>
  );
}
