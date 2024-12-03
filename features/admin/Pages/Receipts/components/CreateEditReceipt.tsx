import { Box, Button, Group, Title } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import ReceiptForm from "../ReceiptForm";
import { Receipt } from "@/types/receipts";

interface CreateEditReceiptProps {
  receipt?: Receipt | null;
  onBack: () => void;
  onSubmit: () => void;
}

export function CreateEditReceipt({
  receipt,
  onBack,
  onSubmit,
}: CreateEditReceiptProps) {
  return (
    <Box>
      <Group mb="xl">
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          onClick={onBack}
          color="pink"
        >
          Back to Receipts
        </Button>
        <Title order={2}>{receipt ? "Edit Receipt" : "New Receipt"}</Title>
      </Group>

      <ReceiptForm
        receipt={receipt}
        onSubmit={async () => {
          await onSubmit();
        }}
        onCancel={onBack}
      />
    </Box>
  );
}
