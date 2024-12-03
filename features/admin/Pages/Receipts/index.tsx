import { useState } from "react";
import { Box, Button, Group, Paper, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { ReceiptsTable } from "./components/ReceiptsTable";
import { PrintModal } from "./components/PrintModal";
import { Receipt } from "@/types/receipts";
import { CreateEditReceipt } from "./components/CreateEditReceipt";
import { useReceipts } from "./hooks/useReceipts";

type Screen = "list" | "create" | "edit";

export function ReceiptsPage() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("list");
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [printReceipt, setPrintReceipt] = useState<Receipt | null>(null);

  const { receipts, isLoading, deleteReceipt } = useReceipts();

  const handleEdit = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setCurrentScreen("edit");
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this receipt?")) {
      deleteReceipt.mutate(id);
    }
  };

  const handlePrint = (receipt: Receipt) => {
    setPrintReceipt(receipt);
  };

  const handleBack = () => {
    setCurrentScreen("list");
    setSelectedReceipt(null);
  };

  if (currentScreen === "create" || currentScreen === "edit") {
    return (
      <CreateEditReceipt
        receipt={selectedReceipt}
        onBack={handleBack}
        onSubmit={handleBack}
      />
    );
  }

  return (
    <Box p="md">
      <Paper shadow="xs" p="md">
        <Group justify="space-between" mb="md">
          <Text size="xl" fw={500}>
            Receipts
          </Text>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setCurrentScreen("create")}
            color="pink"
            size="xs"
          >
            New Receipt
          </Button>
        </Group>

        <ReceiptsTable
          data={receipts}
          loading={isLoading}
          onEdit={handleEdit}
          onPrint={handlePrint}
          onDelete={handleDelete}
        />
      </Paper>

      {printReceipt && (
        <PrintModal
          receipt={printReceipt}
          opened={true}
          onClose={() => setPrintReceipt(null)}
        />
      )}
    </Box>
  );
}
