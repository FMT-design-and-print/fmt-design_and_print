import { useCurrentAdminUser } from "@/hooks/admin/useCurrentAdminUser";
import { useProductTypes } from "@/hooks/useProductTypes";
import { Expenses, ISales } from "@/types/sales-expenses";
import { createClient } from "@/utils/supabase/client";
import { Box, Button, Modal, Paper, Stack, Tabs } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ExpensesForm from "./ExpensesForm";
import SalesForm from "./SalesForm";
import SalesTable from "./SalesTable";
import { useSales, SALES_QUERY_KEY } from "@/hooks/admin/useSales";
import { useQueryClient } from "@tanstack/react-query";
import { useExpenses, EXPENSES_QUERY_KEY } from "@/hooks/admin/useExpenses";
import ExpensesTable from "./ExpensesTable";

export default function SalesExpensesPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [activeTab, setActiveTab] = useState<string>("sales");
  const [loading, setLoading] = useState(false);
  const { productTypes } = useProductTypes();
  const {
    adminUser,
    loading: loadingAdmin,
    error: adminError,
  } = useCurrentAdminUser();
  const { sales, loading: loadingSales } = useSales();
  const { expenses, loading: loadingExpenses } = useExpenses();
  const queryClient = useQueryClient();

  const supabase = createClient();

  useEffect(() => {
    if (adminError) {
      toast.error("Failed to load admin user details");
    }
  }, [adminError]);

  const handleSubmit = async (data: ISales | Expenses) => {
    if (!adminUser) {
      toast.error("Admin user details not available");
      return;
    }

    setLoading(true);

    try {
      const table = activeTab === "sales" ? "sales" : "expenses";
      const { error } = await supabase.from(table).insert([data]);

      if (error) throw error;

      toast.success(
        `${activeTab === "sales" ? "Sale" : "Expense"} recorded successfully`
      );
      // Invalidate and refetch data based on active tab
      await queryClient.invalidateQueries({
        queryKey: activeTab === "sales" ? SALES_QUERY_KEY : EXPENSES_QUERY_KEY,
      });
      close();
    } catch (error) {
      toast.error("Failed to record data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (updatedData: ISales | Expenses) => {
    try {
      const table = activeTab === "sales" ? "sales" : "expenses";
      const { error } = await supabase
        .from(table)
        .update(updatedData)
        .eq("id", updatedData.id);

      if (error) throw error;

      toast.success(
        `${activeTab === "sales" ? "Sale" : "Expense"} updated successfully`
      );

      // Invalidate and refetch data
      await queryClient.invalidateQueries({
        queryKey: activeTab === "sales" ? SALES_QUERY_KEY : EXPENSES_QUERY_KEY,
      });
    } catch (error) {
      toast.error(
        `Failed to update ${activeTab === "sales" ? "sale" : "expense"}`
      );
      console.error(error);
    }
  };

  return (
    <Box p="md">
      <Paper withBorder p="md">
        <Stack gap="md">
          <Tabs
            value={activeTab}
            onChange={(value) => setActiveTab(value as string)}
          >
            <Tabs.List>
              <Tabs.Tab value="sales">Sales</Tabs.Tab>
              <Tabs.Tab value="expenses">Expenses</Tabs.Tab>
            </Tabs.List>
          </Tabs>

          <Button
            leftSection={<IconPlus size="1rem" />}
            color="pink"
            onClick={open}
            loading={loadingAdmin}
            disabled={!adminUser}
          >
            Add {activeTab === "sales" ? "Sale" : "Expense"}
          </Button>

          <Modal
            opened={opened}
            onClose={close}
            title={`Add ${activeTab === "sales" ? "Sale" : "Expense"}`}
            size="lg"
          >
            {activeTab === "sales" ? (
              <SalesForm
                productTypes={productTypes || []}
                onSubmit={handleSubmit}
                loading={loading}
                adminUser={adminUser || null}
              />
            ) : (
              <ExpensesForm
                onSubmit={handleSubmit}
                loading={loading}
                adminUser={adminUser || null}
              />
            )}
          </Modal>

          {activeTab === "sales" ? (
            <SalesTable
              sales={sales || []}
              onEdit={handleEdit}
              isLoading={loadingSales}
              productTypes={productTypes || []}
              adminUser={adminUser || null}
            />
          ) : (
            <ExpensesTable
              expenses={expenses || []}
              onEdit={handleEdit}
              isLoading={loadingExpenses}
              adminUser={adminUser || null}
            />
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
